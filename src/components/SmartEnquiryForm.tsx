import { useEffect, useState } from 'react';
import { AlertCircle, Check, ChevronLeft, ChevronRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { buildWhatsAppUrl, siteConfig } from '../config/siteConfig';
import type { EnquirySubmissionResponse } from '../types/studio';

interface SmartEnquiryFormProps {
  mode: 'live' | 'demo';
  initialService?: string;
  initialBudget?: string;
  initialPackageName?: string;
  onSuccessRecord?: (record: {
    leadId: string;
    customerName: string;
    propertyType: string;
    propertyLocation: string;
    propertyStatus: string;
    requirements: string[];
    estimatedBudget: string;
    persistedToGoogleSheets: boolean;
  }) => void;
}

const initialStepLabels = [
  '01. Your Contact & Property',
  '02. Interior Scope & Budget',
  '03. Preferred Consultation Request',
];

export function SmartEnquiryForm({
  mode,
  initialService,
  initialBudget,
  initialPackageName,
  onSuccessRecord,
}: SmartEnquiryFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EnquirySubmissionResponse | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');

  const [requirements, setRequirements] = useState<string[]>(
    initialService ? [initialService] : []
  );
  const [selectedPackage, setSelectedPackage] = useState(initialPackageName || '');
  const [estimatedBudget, setEstimatedBudget] = useState(initialBudget || '');
  const [expectedStartDate, setExpectedStartDate] = useState('Within 30 Days');

  const [preferredConsultDate, setPreferredConsultDate] = useState('');
  const [preferredConsultTime, setPreferredConsultTime] = useState('');
  const [consultationMode, setConsultationMode] = useState(
    siteConfig.enquiryOptions.consultationModes[0]
  );
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (initialService) {
      setRequirements((prev) => (prev.includes(initialService) ? prev : [...prev, initialService]));
    }
    if (initialBudget) {
      setEstimatedBudget(initialBudget);
    }
    if (initialPackageName) {
      setSelectedPackage(initialPackageName);
    }
  }, [initialService, initialBudget, initialPackageName]);

  const todayIso = new Date().toISOString().split('T')[0];

  const toggleRequirement = (item: string) => {
    setRequirements((prev) =>
      prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]
    );
    if (fieldErrors.requirements) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.requirements;
        return next;
      });
    }
  };

  const validateStep = (targetStep: 1 | 2 | 3): boolean => {
    const errors: Record<string, string> = {};

    if (targetStep === 1) {
      if (customerName.trim().length < 2) {
        errors.customerName = 'Please enter your full name.';
      }
      const digits = mobileNumber.replace(/\D/g, '');
      const tenDigits = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
      if (!/^[6-9]\d{9}$/.test(tenDigits)) {
        errors.mobileNumber = 'Enter a valid 10-digit Indian mobile number.';
      }
      // Email is optional; validate only when entered
      if (email.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
        errors.email = 'Enter a valid email address or leave this field blank.';
      }
      if (!propertyType) errors.propertyType = 'Select your property type.';
      if (propertyLocation.trim().length < 3) {
        errors.propertyLocation = 'Enter your locality or society name.';
      }
      if (!propertyStatus) errors.propertyStatus = 'Select current property status.';
    }

    if (targetStep === 2) {
      if (requirements.length === 0) {
        errors.requirements = 'Select at least one interior requirement.';
      }
      if (!estimatedBudget) errors.estimatedBudget = 'Select an illustrative budget segment.';
      if (!expectedStartDate) errors.expectedStartDate = 'Select expected project start timeline.';
    }

    if (targetStep === 3) {
      if (!preferredConsultDate) {
        errors.preferredConsultDate = 'Choose a preferred consultation date.';
      }
      if (!preferredConsultTime) {
        errors.preferredConsultTime = 'Choose a preferred time window.';
      }
      if (!contactConsent) {
        errors.contactConsent = 'Please confirm contact consent to submit.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setServerError(null);
    if (validateStep(step)) {
      setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
    }
  };

  const handleBack = () => {
    setServerError(null);
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setServerError(null);

    if (!validateStep(3)) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          mobileNumber,
          email: email.trim(),
          propertyType,
          propertyLocation,
          propertyStatus,
          requirements,
          selectedPackage,
          estimatedBudget,
          expectedStartDate,
          preferredConsultDate,
          preferredConsultTime,
          consultationMode,
          additionalRequirements,
          contactConsent,
          mode,
          honeypot,
        }),
      });

      const data = (await response.json()) as EnquirySubmissionResponse;
      if (!response.ok || !data.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setServerError(data.error || 'Unable to process consultation request.');
        return;
      }

      setResult(data);
      if (onSuccessRecord && data.leadId) {
        onSuccessRecord({
          leadId: data.leadId,
          customerName,
          propertyType,
          propertyLocation,
          propertyStatus,
          requirements,
          estimatedBudget,
          persistedToGoogleSheets: data.persistedToGoogleSheets,
        });
      }
    } catch {
      setServerError('Network interruption while submitting. Please verify your connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setStep(1);
    setServerError(null);
    setFieldErrors({});
    setCustomerName('');
    setMobileNumber('');
    setEmail('');
    setPropertyType('');
    setPropertyLocation('');
    setPropertyStatus('');
    setRequirements([]);
    setSelectedPackage('');
    setEstimatedBudget('');
    setPreferredConsultDate('');
    setPreferredConsultTime('');
    setAdditionalRequirements('');
    setContactConsent(false);
  };

  if (result) {
    const isSaved = result.persistedToGoogleSheets;
    const hasWhatsApp = Boolean(siteConfig.business.whatsappNumber);

    return (
      <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-8 md:p-12 space-y-6">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center border ${
              isSaved
                ? 'border-[#626B55] bg-[#626B55] text-[#F8F5EF]'
                : 'border-[#B69A68] bg-[#F0EEE8] text-[#725B2F]'
            }`}
          >
            {isSaved ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
              {isSaved
                ? mode === 'demo'
                  ? 'Saved to Demonstration Google Sheet'
                  : 'Consultation Request Received'
                : 'Local Validation Complete · Google Sheets Not Connected'}
            </p>
            <h3 className="mt-1 font-serif text-2xl md:text-3xl text-[#252824]">
              {isSaved
                ? 'Consultation Request Logged (Pending Confirmation)'
                : 'Request Validated in Preview Mode'}
            </h3>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[#454843]">{result.message}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#D8C8B4] bg-[#F8F5EF] p-5 text-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
              Reference Lead ID
            </p>
            <p className="mt-1 font-mono text-base font-medium text-[#252824] tabular-nums">
              {result.leadId}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
              Storage Verification
            </p>
            <p className="mt-1 font-medium text-[#252824]">
              {result.persistedToGoogleSheets
                ? 'Confirmed Saved in Google Sheets'
                : 'Not Saved to Google Sheets (Preview Mode)'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
              Property &amp; Scope
            </p>
            <p className="mt-1 text-[#252824]">
              {propertyType} · {propertyLocation}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
              Requested Consultation Slot (Not Confirmed Yet)
            </p>
            <p className="mt-1 text-[#252824] tabular-nums">
              {preferredConsultDate} · {preferredConsultTime}
            </p>
          </div>
        </div>

        {!result.persistedToGoogleSheets && (
          <div className="border border-[#B69A68] bg-[#FEF9EC] p-4 text-xs leading-relaxed text-[#58431A]">
            <strong>Honest Integration Status:</strong>{' '}
            <code className="font-mono">
              {mode === 'demo' ? 'APPS_SCRIPT_DEMO_WEBHOOK_URL' : 'APPS_SCRIPT_WEBHOOK_URL'}
            </code>{' '}
            is not configured yet, so this request was validated locally without writing to Google Sheets.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {mode === 'live' && hasWhatsApp ? (
            <a
              href={buildWhatsAppUrl({
                leadId: result.leadId,
                service: requirements.join(', '),
                packageName: selectedPackage,
                budget: estimatedBudget,
                location: propertyLocation,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#252824] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#B69A68]" />
              Chat on WhatsApp
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 border border-[#D8C8B4] bg-[#F0EEE8] px-5 py-3 text-xs text-[#454843]">
              {mode === 'demo'
                ? 'Customer email & WhatsApp outreach disabled in Demonstration Mode'
                : 'Configure VITE_WHATSAPP_NUMBER to enable Chat on WhatsApp'}
            </span>
          )}

          <button
            type="button"
            onClick={resetForm}
            className="border border-[#252824] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="border border-[#D8C8B4] bg-[#FCF9F3] p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#D8C8B4] pb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
            {mode === 'demo' ? 'Demonstration Test Submission' : 'Free Design Consultation Request'}
          </p>
          <h3 className="mt-1 font-serif text-2xl text-[#252824]">
            {initialStepLabels[step - 1]}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {([1, 2, 3] as const).map((idx) => (
            <div
              key={idx}
              className={`h-1.5 w-10 transition-colors ${
                idx <= step ? 'bg-[#252824]' : 'bg-[#D8C8B4]'
              }`}
              aria-hidden="true"
            />
          ))}
          <span className="ml-2 font-mono text-xs tabular-nums text-[#454843]">
            Step {step}/3
          </span>
        </div>
      </div>

      {(selectedPackage || initialService || initialBudget) && (
        <div className="mb-6 border border-[#B69A68]/50 bg-[#F6F3ED] px-4 py-3 text-xs text-[#252824]">
          <span className="font-semibold uppercase tracking-[0.08em] text-[#725B2F]">Preselected: </span>
          {[selectedPackage, initialService, initialBudget].filter(Boolean).join(' · ')}
        </div>
      )}

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url_trap">Leave empty</label>
        <input
          id="website_url_trap"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {serverError && (
        <div className="mb-6 flex items-start gap-3 border border-[#ba1a1a] bg-[#ffdad6]/40 p-4 text-sm text-[#93000a]">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="enq-name" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Full Name *
            </label>
            <input
              id="enq-name"
              type="text"
              required
              placeholder="e.g., Siddharth Mehta"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] placeholder:text-[#252824]/40 focus:border-[#B69A68] focus:outline-none"
            />
            {fieldErrors.customerName && (
              <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.customerName}</p>
            )}
          </div>

          <div>
            <label htmlFor="enq-mobile" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Mobile Number (India) *
            </label>
            <input
              id="enq-mobile"
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] placeholder:text-[#252824]/40 focus:border-[#B69A68] focus:outline-none tabular-nums"
            />
            {fieldErrors.mobileNumber && (
              <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="enq-email" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Email Address (Optional)
            </label>
            <input
              id="enq-email"
              type="email"
              placeholder="name@example.com (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] placeholder:text-[#252824]/40 focus:border-[#B69A68] focus:outline-none"
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="enq-type" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Property Type *
            </label>
            <select
              id="enq-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="mt-2 w-full border border-[#252824]/25 bg-[#FCF9F3] px-4 py-3 text-sm text-[#252824] focus:border-[#B69A68] focus:outline-none"
            >
              <option value="">Select property type</option>
              {siteConfig.enquiryOptions.propertyTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
            {fieldErrors.propertyType && (
              <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.propertyType}</p>
            )}
          </div>

          <div>
            <label htmlFor="enq-location" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Property Location or Society *
            </label>
            <input
              id="enq-location"
              type="text"
              required
              placeholder="e.g., Greater Noida West / Sector 150 Noida"
              value={propertyLocation}
              onChange={(e) => setPropertyLocation(e.target.value)}
              className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] placeholder:text-[#252824]/40 focus:border-[#B69A68] focus:outline-none"
            />
            {fieldErrors.propertyLocation && (
              <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.propertyLocation}</p>
            )}
          </div>

          <div>
            <label htmlFor="enq-status" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Property Status *
            </label>
            <select
              id="enq-status"
              value={propertyStatus}
              onChange={(e) => setPropertyStatus(e.target.value)}
              className="mt-2 w-full border border-[#252824]/25 bg-[#FCF9F3] px-4 py-3 text-sm text-[#252824] focus:border-[#B69A68] focus:outline-none"
            >
              <option value="">Select current status</option>
              {siteConfig.enquiryOptions.propertyStatuses.map((ps) => (
                <option key={ps} value={ps}>
                  {ps}
                </option>
              ))}
            </select>
            {fieldErrors.propertyStatus && (
              <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.propertyStatus}</p>
            )}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-7">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Interior Requirements * (Select all that apply)
            </span>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {siteConfig.enquiryOptions.requirementsList.map((item) => {
                const checked = requirements.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleRequirement(item)}
                    className={`flex items-center gap-3 border px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                      checked
                        ? 'border-[#252824] bg-[#252824] text-[#F8F5EF]'
                        : 'border-[#252824]/20 bg-transparent text-[#252824] hover:border-[#B69A68]'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                        checked ? 'border-[#B69A68] bg-[#B69A68]' : 'border-[#252824]/50'
                      }`}
                    >
                      {checked && <Check className="h-3 w-3 text-[#252824]" />}
                    </span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
            {fieldErrors.requirements && (
              <p className="mt-2 text-xs text-[#ba1a1a]">{fieldErrors.requirements}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
                Illustrative Budget Segment *
              </span>
              <div className="mt-3 space-y-2">
                {siteConfig.enquiryOptions.budgetBands.map((band) => {
                  const selected = estimatedBudget === band;
                  return (
                    <button
                      key={band}
                      type="button"
                      onClick={() => setEstimatedBudget(band)}
                      className={`w-full flex items-center justify-between gap-2 border px-4 py-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#626B55] bg-[#626B55] text-[#F8F5EF]'
                          : 'border-[#252824]/20 text-[#252824] hover:border-[#B69A68]'
                      }`}
                    >
                      <span>{band}</span>
                      <span className={`h-2.5 w-2.5 shrink-0 border ${selected ? 'bg-[#F8F5EF] border-[#F8F5EF]' : 'border-[#252824]/40'}`} />
                    </button>
                  );
                })}
              </div>
              {fieldErrors.estimatedBudget && (
                <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.estimatedBudget}</p>
              )}
            </div>

            <div>
              <label htmlFor="enq-start" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
                Expected Project Timeline *
              </label>
              <select
                id="enq-start"
                value={expectedStartDate}
                onChange={(e) => setExpectedStartDate(e.target.value)}
                className="mt-3 w-full border border-[#252824]/25 bg-[#FCF9F3] px-4 py-3 text-sm text-[#252824] focus:border-[#B69A68] focus:outline-none"
              >
                <option value="Immediately (Within 15 Days)">Immediately (Within 15 Days)</option>
                <option value="Within 30 Days">Within 30 Days</option>
                <option value="1 – 3 Months">1 – 3 Months</option>
                <option value="3 – 6 Months">3 – 6 Months (Upcoming Possession)</option>
              </select>
              {fieldErrors.expectedStartDate && (
                <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.expectedStartDate}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="border border-[#D8C8B4] bg-[#F6F3ED] p-4 text-xs text-[#454843]">
            Note: Your selected date and time represent a <strong>consultation request</strong>. Our design team will contact you to confirm availability.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="enq-date" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
                Preferred Consultation Date (Request) *
              </label>
              <input
                id="enq-date"
                type="date"
                min={todayIso}
                value={preferredConsultDate}
                onChange={(e) => setPreferredConsultDate(e.target.value)}
                className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] focus:border-[#B69A68] focus:outline-none tabular-nums"
              />
              {fieldErrors.preferredConsultDate && (
                <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.preferredConsultDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="enq-time" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
                Preferred Time Window (Request) *
              </label>
              <select
                id="enq-time"
                value={preferredConsultTime}
                onChange={(e) => setPreferredConsultTime(e.target.value)}
                className="mt-2 w-full border border-[#252824]/25 bg-[#FCF9F3] px-4 py-3 text-sm text-[#252824] focus:border-[#B69A68] focus:outline-none"
              >
                <option value="">Select time window</option>
                {siteConfig.enquiryOptions.consultationSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {fieldErrors.preferredConsultTime && (
                <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.preferredConsultTime}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="enq-mode" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Preferred Consultation Format
            </label>
            <select
              id="enq-mode"
              value={consultationMode}
              onChange={(e) => setConsultationMode(e.target.value)}
              className="mt-2 w-full border border-[#252824]/25 bg-[#FCF9F3] px-4 py-3 text-sm text-[#252824] focus:border-[#B69A68] focus:outline-none"
            >
              {siteConfig.enquiryOptions.consultationModes.map((cm) => (
                <option key={cm} value={cm}>
                  {cm}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="enq-notes" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
              Additional Requirements (Optional)
            </label>
            <textarea
              id="enq-notes"
              rows={3}
              placeholder="Share carpet area, room priorities, material preferences, or any questions..."
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] placeholder:text-[#252824]/40 focus:border-[#B69A68] focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={contactConsent}
                onChange={(e) => setContactConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#252824] rounded-none"
              />
              <span className="text-xs leading-relaxed text-[#454843]">
                I consent to {siteConfig.business.name} contacting me via phone, WhatsApp, or email (if provided) regarding this consultation request.
              </span>
            </label>
            {fieldErrors.contactConsent && (
              <p className="mt-1.5 text-xs text-[#ba1a1a]">{fieldErrors.contactConsent}</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#D8C8B4] pt-6">
        <div className="flex items-center gap-2 text-xs text-[#454843]">
          <ShieldCheck className="h-4 w-4 text-[#626B55]" />
          <span>Protected against spam &amp; duplicate submissions</span>
        </div>

        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 border border-[#252824] px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:bg-[#D8C8B4]/40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-[#252824] px-7 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-[#252824] px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {submitting ? 'Submitting Request...' : 'Submit Consultation Request'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
