import crypto from 'node:crypto';

export interface EnquiryInput {
  customerName?: unknown;
  mobileNumber?: unknown;
  email?: unknown;
  propertyType?: unknown;
  propertyLocation?: unknown;
  propertyStatus?: unknown;
  requirements?: unknown;
  selectedPackage?: unknown;
  estimatedBudget?: unknown;
  expectedStartDate?: unknown;
  preferredConsultDate?: unknown;
  preferredConsultTime?: unknown;
  consultationMode?: unknown;
  additionalRequirements?: unknown;
  contactConsent?: unknown;
  mode?: unknown;
  honeypot?: unknown;
}

export interface QueryInput {
  customerName?: unknown;
  contactDetails?: unknown;
  queryCategory?: unknown;
  question?: unknown;
  contactConsent?: unknown;
  mode?: unknown;
  honeypot?: unknown;
}

export interface ApiResult {
  status: number;
  body: Record<string, unknown>;
}

const rateLimitMap = new Map<string, number[]>();
const duplicateGuardMap = new Map<string, { id: string; timestamp: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const DUPLICATE_WINDOW_MS = 5 * 60_000;

function cleanText(val: unknown, maxLength = 500): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Protects Google Sheets from CSV / Formula Injection (=, +, -, @, tab, CR).
 */
export function sanitizeForSpreadsheet(val: string): string {
  const cleaned = val.trim();
  if (!cleaned) return '';
  if (/^[=+\-@\t\r]/.test(cleaned)) {
    return `'${cleaned}`;
  }
  return cleaned;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function normalizeIndianMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

function isValidIndianMobile(raw: string): boolean {
  const normalized = normalizeIndianMobile(raw);
  return /^[6-9]\d{9}$/.test(normalized);
}

function generateId(prefix: string): string {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const randomCode = crypto.randomInt(1000, 9999);
  return `${prefix}-${yy}${mm}-${randomCode}`;
}

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(clientIp) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitMap.set(clientIp, timestamps);
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(clientIp, timestamps);
  return true;
}

function checkDuplicate(fingerprintSeed: string): { duplicate: boolean; existingId?: string } {
  const now = Date.now();
  if (duplicateGuardMap.size > 500) {
    for (const [k, v] of duplicateGuardMap.entries()) {
      if (now - v.timestamp > DUPLICATE_WINDOW_MS) {
        duplicateGuardMap.delete(k);
      }
    }
  }
  const hash = crypto.createHash('sha256').update(fingerprintSeed).digest('hex');
  const existing = duplicateGuardMap.get(hash);
  if (existing && now - existing.timestamp < DUPLICATE_WINDOW_MS) {
    return { duplicate: true, existingId: existing.id };
  }
  return { duplicate: false };
}

function recordSubmissionHash(fingerprintSeed: string, id: string): void {
  const hash = crypto.createHash('sha256').update(fingerprintSeed).digest('hex');
  duplicateGuardMap.set(hash, { id, timestamp: Date.now() });
}

function estimateValueFromBudgetBand(budgetBand: string): number {
  const lower = budgetBand.toLowerCase();
  if (lower.includes('25 lakh+')) return 2800000;
  if (lower.includes('12–25') || lower.includes('12-25')) return 1750000;
  if (lower.includes('6–12') || lower.includes('6-12')) return 900000;
  if (lower.includes('3–6') || lower.includes('3-6')) return 450000;
  return 300000;
}

async function forwardToAppsScript(
  webhookUrl: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; emailStatus?: string; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        secret: process.env.APPS_SCRIPT_SECRET || '',
      }),
      redirect: 'follow',
      signal: controller.signal,
    });

    const text = await response.text();
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(text) as Record<string, unknown>;
    } catch {
      parsed = null;
    }

    if (!response.ok || !parsed || parsed.ok !== true || parsed.saved !== true) {
      return {
        ok: false,
        error:
          (parsed?.error as string) ||
          `Apps Script returned unexpected response (HTTP ${response.status}).`,
      };
    }

    return {
      ok: true,
      emailStatus: typeof parsed.emailStatus === 'string' ? parsed.emailStatus : 'triggered',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error connecting to Google Apps Script.';
    return { ok: false, error: message };
  } finally {
    clearTimeout(timeout);
  }
}

export function getIntegrationHealth() {
  const liveConfigured = Boolean(process.env.APPS_SCRIPT_WEBHOOK_URL?.trim());
  const demoConfigured = Boolean(process.env.APPS_SCRIPT_DEMO_WEBHOOK_URL?.trim());
  const secretConfigured = Boolean(process.env.APPS_SCRIPT_SECRET?.trim());

  return {
    ok: true,
    liveSheetsConnected: liveConfigured,
    demoSheetsConnected: demoConfigured,
    secretConfigured,
    timestamp: new Date().toISOString(),
  };
}

export async function handleEnquirySubmission(
  input: EnquiryInput,
  clientIp = 'unknown'
): Promise<ApiResult> {
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      body: {
        ok: false,
        error: 'Too many requests from your connection. Please wait a minute before trying again.',
      },
    };
  }

  if (cleanText(input.honeypot, 100).length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'Automated submission rejected.',
      },
    };
  }

  const mode: 'live' | 'demo' = input.mode === 'demo' ? 'demo' : 'live';

  const customerName = cleanText(input.customerName, 120);
  const mobileNumberRaw = cleanText(input.mobileNumber, 25);
  const email = cleanText(input.email, 160).toLowerCase();
  const propertyType = cleanText(input.propertyType, 80);
  const propertyLocation = cleanText(input.propertyLocation, 180);
  const propertyStatus = cleanText(input.propertyStatus, 100);
  const selectedPackage = cleanText(input.selectedPackage, 100);
  const estimatedBudget = cleanText(input.estimatedBudget, 100);
  const expectedStartDate = cleanText(input.expectedStartDate, 60);
  const preferredConsultDate = cleanText(input.preferredConsultDate, 40);
  const preferredConsultTime = cleanText(input.preferredConsultTime, 60);
  const consultationMode =
    cleanText(input.consultationMode, 100) || 'Studio Design Call / Video Meeting';
  const additionalRequirements = cleanText(input.additionalRequirements, 1200);
  const contactConsent = input.contactConsent === true;

  const requirements = Array.isArray(input.requirements)
    ? input.requirements
        .map((r) => cleanText(r, 100))
        .filter(Boolean)
        .slice(0, 12)
    : [];

  const fieldErrors: Record<string, string> = {};
  if (customerName.length < 2) fieldErrors.customerName = 'Please enter your full name.';
  if (!isValidIndianMobile(mobileNumberRaw)) {
    fieldErrors.mobileNumber = 'Please enter a valid 10-digit Indian mobile number.';
  }
  // Email is optional for consultation enquiries; validate format only if provided
  if (email.length > 0 && !isValidEmail(email)) {
    fieldErrors.email = 'Please enter a valid email address or leave it blank.';
  }
  if (!propertyType) fieldErrors.propertyType = 'Please select your property type.';
  if (propertyLocation.length < 3) {
    fieldErrors.propertyLocation = 'Please enter your locality or society name.';
  }
  if (!propertyStatus) fieldErrors.propertyStatus = 'Please select current property status.';
  if (requirements.length === 0) {
    fieldErrors.requirements = 'Please select at least one interior requirement.';
  }
  if (!estimatedBudget) fieldErrors.estimatedBudget = 'Please select an estimated budget segment.';
  if (!expectedStartDate) fieldErrors.expectedStartDate = 'Please select expected project timeline.';
  if (!preferredConsultDate) {
    fieldErrors.preferredConsultDate = 'Please select a preferred consultation date.';
  }
  if (!preferredConsultTime) {
    fieldErrors.preferredConsultTime = 'Please select a preferred time window.';
  }
  if (!contactConsent) {
    fieldErrors.contactConsent = 'Please confirm contact consent so our team may reach you.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'Please review the highlighted fields before submitting.',
        fieldErrors,
      },
    };
  }

  const normalizedMobile = normalizeIndianMobile(mobileNumberRaw);
  const fingerprint = `ENQ|${mode}|${normalizedMobile}|${propertyLocation.toLowerCase()}|${[...requirements].sort().join(',')}`;
  const dup = checkDuplicate(fingerprint);
  if (dup.duplicate) {
    return {
      status: 409,
      body: {
        ok: false,
        error: `A consultation request with these details was already submitted (Reference: ${dup.existingId}). Please wait a few minutes before submitting another request.`,
      },
    };
  }

  const leadId = generateId(mode === 'demo' ? 'DEMO-LD' : 'AAR-LD');
  const submittedAt = new Date().toISOString();
  const formattedMobile = `+91 ${normalizedMobile}`;
  const combinedNotes = [
    selectedPackage ? `Selected Package: ${selectedPackage}` : '',
    additionalRequirements,
  ]
    .filter(Boolean)
    .join(' | ');

  const sanitizedRecord = {
    action: 'create_lead',
    mode,
    leadId,
    submittedAt,
    customerName: sanitizeForSpreadsheet(customerName),
    mobileNumber: sanitizeForSpreadsheet(formattedMobile),
    email: email ? sanitizeForSpreadsheet(email) : 'Not provided',
    propertyType: sanitizeForSpreadsheet(propertyType),
    propertyLocation: sanitizeForSpreadsheet(propertyLocation),
    propertyStatus: sanitizeForSpreadsheet(propertyStatus),
    requirements: sanitizeForSpreadsheet(requirements.join(', ')),
    estimatedBudget: sanitizeForSpreadsheet(estimatedBudget),
    estimatedValueInr: estimateValueFromBudgetBand(estimatedBudget),
    expectedStartDate: sanitizeForSpreadsheet(expectedStartDate),
    preferredConsultDate: sanitizeForSpreadsheet(preferredConsultDate),
    preferredConsultTime: sanitizeForSpreadsheet(preferredConsultTime),
    consultationMode: sanitizeForSpreadsheet(consultationMode),
    additionalRequirements: sanitizeForSpreadsheet(combinedNotes),
    contactConsent: 'Yes',
    disableOutreach: mode === 'demo',
  };

  const targetWebhook =
    mode === 'demo'
      ? process.env.APPS_SCRIPT_DEMO_WEBHOOK_URL?.trim()
      : process.env.APPS_SCRIPT_WEBHOOK_URL?.trim();

  if (!targetWebhook) {
    recordSubmissionHash(fingerprint, leadId);
    return {
      status: 200,
      body: {
        ok: true,
        leadId,
        storageStatus: 'unconfigured_preview',
        persistedToGoogleSheets: false,
        emailAutomationStatus: mode === 'demo' ? 'disabled_in_demo' : 'not_configured',
        submittedAt,
        message:
          mode === 'demo'
            ? 'Consultation request validated in Demonstration Mode (local preview). Google Sheets is not connected yet—configure APPS_SCRIPT_DEMO_WEBHOOK_URL to save test records to your Demo Google Sheet.'
            : 'Consultation request validated in Preview Mode only—Google Sheets is not connected yet. Configure APPS_SCRIPT_WEBHOOK_URL on the server to persist enquiries.',
      },
    };
  }

  const relayResult = await forwardToAppsScript(targetWebhook, sanitizedRecord);
  if (!relayResult.ok) {
    return {
      status: 502,
      body: {
        ok: false,
        error: `Google Sheets did not confirm saving your consultation request (${relayResult.error}). Your form data has been preserved so you can retry.`,
      },
    };
  }

  recordSubmissionHash(fingerprint, leadId);

  return {
    status: 201,
    body: {
      ok: true,
      leadId,
      storageStatus: mode === 'demo' ? 'google_sheets_demo' : 'google_sheets_live',
      persistedToGoogleSheets: true,
      emailAutomationStatus:
        mode === 'demo'
          ? 'disabled_in_demo'
          : relayResult.emailStatus === 'triggered'
            ? 'triggered'
            : 'skipped',
      submittedAt,
      message:
        mode === 'demo'
          ? `Test consultation request saved to your Demonstration Google Sheet under Reference ${leadId}. Preferred date/time is recorded as a request only; external customer outreach remains disabled.`
          : `Consultation request received and saved under Reference ${leadId}. Your preferred date and time have been logged as a request—our team will contact you to confirm the appointment.`,
    },
  };
}

export async function handleQuerySubmission(
  input: QueryInput,
  clientIp = 'unknown'
): Promise<ApiResult> {
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      body: {
        ok: false,
        error: 'Too many requests from your connection. Please wait a minute before trying again.',
      },
    };
  }

  if (cleanText(input.honeypot, 100).length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'Automated submission rejected.',
      },
    };
  }

  const mode: 'live' | 'demo' = input.mode === 'demo' ? 'demo' : 'live';
  const customerName = cleanText(input.customerName, 120);
  const contactDetails = cleanText(input.contactDetails, 160);
  const queryCategory = cleanText(input.queryCategory, 100);
  const question = cleanText(input.question, 1500);
  const contactConsent = input.contactConsent === true;

  const fieldErrors: Record<string, string> = {};
  if (customerName.length < 2) fieldErrors.customerName = 'Please enter your name.';
  const validContact = isValidEmail(contactDetails) || isValidIndianMobile(contactDetails);
  if (!validContact) {
    fieldErrors.contactDetails = 'Please enter a valid 10-digit mobile number or email address.';
  }
  if (!queryCategory) fieldErrors.queryCategory = 'Please select a query category.';
  if (question.length < 10) {
    fieldErrors.question = 'Please enter your question (minimum 10 characters).';
  }
  if (!contactConsent) {
    fieldErrors.contactConsent = 'Please confirm contact consent for our response.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'Please review the highlighted fields before submitting your question.',
        fieldErrors,
      },
    };
  }

  const fingerprint = `QRY|${mode}|${contactDetails.toLowerCase()}|${question.slice(0, 80).toLowerCase()}`;
  const dup = checkDuplicate(fingerprint);
  if (dup.duplicate) {
    return {
      status: 409,
      body: {
        ok: false,
        error: `This question was already submitted recently (Reference: ${dup.existingId}).`,
      },
    };
  }

  const queryId = generateId(mode === 'demo' ? 'DEMO-QR' : 'AAR-QR');
  const submittedAt = new Date().toISOString();

  const sanitizedRecord = {
    action: 'create_query',
    mode,
    queryId,
    submittedAt,
    customerName: sanitizeForSpreadsheet(customerName),
    contactDetails: sanitizeForSpreadsheet(contactDetails),
    queryCategory: sanitizeForSpreadsheet(queryCategory),
    question: sanitizeForSpreadsheet(question),
    contactConsent: 'Yes',
    disableOutreach: mode === 'demo',
  };

  const targetWebhook =
    mode === 'demo'
      ? process.env.APPS_SCRIPT_DEMO_WEBHOOK_URL?.trim()
      : process.env.APPS_SCRIPT_WEBHOOK_URL?.trim();

  if (!targetWebhook) {
    recordSubmissionHash(fingerprint, queryId);
    return {
      status: 200,
      body: {
        ok: true,
        queryId,
        storageStatus: 'unconfigured_preview',
        persistedToGoogleSheets: false,
        emailAutomationStatus: mode === 'demo' ? 'disabled_in_demo' : 'not_configured',
        submittedAt,
        message:
          mode === 'demo'
            ? 'Question validated in Demonstration Mode (local preview). Connect APPS_SCRIPT_DEMO_WEBHOOK_URL to store queries in your Demo Google Sheet.'
            : 'Question validated in Preview Mode only—Google Sheets is not connected yet. Configure APPS_SCRIPT_WEBHOOK_URL on the server to persist queries.',
      },
    };
  }

  const relayResult = await forwardToAppsScript(targetWebhook, sanitizedRecord);
  if (!relayResult.ok) {
    return {
      status: 502,
      body: {
        ok: false,
        error: `Google Sheets did not confirm saving your question (${relayResult.error}). Please try again.`,
      },
    };
  }

  recordSubmissionHash(fingerprint, queryId);

  return {
    status: 201,
    body: {
      ok: true,
      queryId,
      storageStatus: mode === 'demo' ? 'google_sheets_demo' : 'google_sheets_live',
      persistedToGoogleSheets: true,
      emailAutomationStatus:
        mode === 'demo'
          ? 'disabled_in_demo'
          : relayResult.emailStatus === 'triggered'
            ? 'triggered'
            : 'skipped',
      submittedAt,
      message:
        mode === 'demo'
          ? `Test query saved to your Demonstration Google Sheet under Reference ${queryId}.`
          : `Your question has been logged under Reference ${queryId}. Our team will reply shortly.`,
    },
  };
}
