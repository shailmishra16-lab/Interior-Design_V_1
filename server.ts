import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getIntegrationHealth,
  handleEnquirySubmission,
  handleQuerySubmission,
} from './server/leadService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.set('trust proxy', true);
  app.use(express.json({ limit: '100kb' }));

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Health endpoint (non-secret status)
  app.get('/api/health', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(getIntegrationHealth());
  });

  // Multi-step Customer Enquiry endpoint
  app.post('/api/enquiry', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const ip = req.ip || 'unknown';
    const result = await handleEnquirySubmission(req.body || {}, ip);
    res.status(result.status).json(result.body);
  });

  // Ask a Question (Customer Query) endpoint
  app.post('/api/query', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const ip = req.ip || 'unknown';
    const result = await handleQuerySubmission(req.body || {}, ip);
    res.status(result.status).json(result.body);
  });

  // Dynamic XML Sitemap
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const routes = [
      '/',
      '/services',
      '/portfolio',
      '/packages',
      '/about',
      '/contact',
      '/book-consultation',
      '/ask-question',
    ];
    const lastMod = new Date().toISOString().split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    res.type('application/xml').send(xml);
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Aaranya Interiors server listening on http://0.0.0.0:${port}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
