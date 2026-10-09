import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import { createLeadDelivery } from './leads/lead-delivery.mjs';
import { createLeadIntake } from './leads/lead-intake.mjs';
import { createVisitTracking } from './analytics/visit-tracking.mjs';
import { createAdminAuth } from './auth/admin-auth.mjs';
import { registerAdminRoutes } from './http/admin-routes.mjs';
import { registerArticleRoutes } from './http/article-routes.mjs';
import { registerPublicApiRoutes } from './http/public-api-routes.mjs';
import { registerFrontendServing } from './http/frontend-serving.mjs';
import { registerHttpMiddleware, registerHttpErrorHandler } from './http/http-middleware.mjs';
import { recoverRegulationSyncTransactions } from './regulations/regulation-sync-workspace.mjs';

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

const regulationRecovery = await recoverRegulationSyncTransactions();

if (regulationRecovery.recoveredTransactions > 0) {
  console.warn('[regulations] recovered transactions:', regulationRecovery);
}

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

registerPublicApiRoutes({
  app,
  environment: NODE_ENV,
  leadDelivery,
  leadIntake,
  visitTracking,
  env: process.env,
});

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
