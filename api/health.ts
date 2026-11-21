import { getIntegrationHealth } from '../server/leadService.js';

interface VercelReq {
  method?: string;
}

interface VercelRes {
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

export default function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed. Use GET.' });
  }

  return res.status(200).json(getIntegrationHealth());
}
