import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import { createLeadDelivery } from './lead-delivery.mjs';
import { createLeadIntake } from './lead-intake.mjs';
import { createVisitTracking } from './visit-tracking.mjs';
import { createAdminAuth } from './admin-auth.mjs';
import { registerAdminRoutes } from './admin-routes.mjs';
import { registerArticleRoutes } from './article-routes.mjs';
import { registerFrontendServing } from './frontend-serving.mjs';
import { registerHttpMiddleware, registerHttpErrorHandler } from './http-middleware.mjs';

dotenv.config({ path: process.env.SERVER_ENV_FILE || '.env.server' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const clientDir = path.resolve(projectRoot, process.env.CLIENT_DIR || 'dist/client');

const app = express();
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const BACKUP_ENABLED = String(process.env.LEADS_BACKUP_ENABLED ?? 'true').toLowerCase() === 'true';
const LEADS_FILE = path.resolve(projectRoot, process.env.LEADS_FILE || 'data/leads.jsonl');
const VISITS_FILE = path.resolve(projectRoot, process.env.VISITS_FILE || 'data/visits.jsonl');

registerHttpMiddleware({
  app,
  isProduction: IS_PRODUCTION,
  env: process.env,
});

const leadDelivery = createLeadDelivery({
  backupEnabled: BACKUP_ENABLED,
  leadsFile: LEADS_FILE,
  env: process.env,
});

const leadIntake = createLeadIntake({
  leadDelivery,
  env: process.env,
});

const visitTracking = createVisitTracking({
  visitsFile: VISITS_FILE,
  env: process.env,
});

const adminAuth = createAdminAuth({
  password: process.env.ADMIN_PASSWORD || '',
  isProduction: IS_PRODUCTION,
});

registerAdminRoutes({
  app,
  adminAuth,
  projectRoot,
  leadsFile: LEADS_FILE,
});

registerArticleRoutes({
  app,
  adminAuth,
  clientDir,
});

app.get('/api/geo', (_req, res) => {
  const baseDomain = String(process.env.BASE_DOMAIN || 'pasport-bezopasnosty.ru')
    .trim()
    .toLowerCase();

  return res.json({
    ok: true,
    kind: 'federal',
    reason: 'federal-only',

    detected: {
      country: null,
      city: null,
      subdivision: null,
    },

    location: {
      slug: 'russia',
      name: 'Россия',
      type: 'country',
    },

    targetOrigin: `https://${baseDomain}`,
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'passport-security-leads',
    environment: NODE_ENV,
    transports: leadDelivery.getTransportStatus(),
  });
});

app.post('/api/visits', visitTracking.handleVisit);

app.post('/api/leads', leadIntake.rateLimit, leadIntake.handleLead);

registerFrontendServing({
  app,
  clientDir,
  isProduction: IS_PRODUCTION,
});

registerHttpErrorHandler({
  app,
});

app.listen(PORT, HOST, () => {
  console.log(`Passport Security server: http://${HOST}:${PORT}`);
  console.log(`Lead backup: ${BACKUP_ENABLED ? LEADS_FILE : 'disabled'}`);
});
