import { handleEnquirySubmission, type EnquiryInput } from '../server/leadService.js';

interface VercelReq {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelRes {
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed. Use POST.' });
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : (forwardedFor || 'unknown').split(',')[0].trim();

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}) as EnquiryInput;
  const result = await handleEnquirySubmission(body, clientIp);

  return res.status(result.status).json(result.body);
}
