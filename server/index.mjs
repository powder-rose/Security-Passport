import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import { getStatistics } from './statistics.mjs';
import { getAdminLeadsPage } from './admin-leads.mjs';
import { deleteLeadFromFile } from './lead-storage.mjs';
import { createLeadDelivery } from './lead-delivery.mjs';
import { createLeadIntake } from './lead-intake.mjs';
import { createVisitTracking } from './visit-tracking.mjs';
import { createAdminAuth } from './admin-auth.mjs';
import { registerArticleRoutes } from './article-routes.mjs';
import { listRegulations, saveRegulationBundle } from './admin-regulations.mjs';
import { queueRegulationPublication, getRegulationPublication } from './regulation-publisher.mjs';

dotenv.config({ path: process.env.SERVER_ENV_FILE || '.env.server' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const clientDir = path.resolve(projectRoot, process.env.CLIENT_DIR || 'dist/client');

const app = express();
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const BODY_LIMIT = process.env.LEAD_BODY_LIMIT || '1mb';
const BACKUP_ENABLED = String(process.env.LEADS_BACKUP_ENABLED ?? 'true').toLowerCase() === 'true';
const LEADS_FILE = path.resolve(projectRoot, process.env.LEADS_FILE || 'data/leads.jsonl');
const VISITS_FILE = path.resolve(projectRoot, process.env.VISITS_FILE || 'data/visits.jsonl');

const allowedOrigins = new Set(
  String(process.env.LEAD_ALLOWED_ORIGINS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean),
);

function isLocalDevOrigin(origin) {
  if (IS_PRODUCTION) return false;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

function isSameOrigin(origin, req) {
  try {
    const parsed = new URL(origin);
    const forwardedHost = req.get('x-forwarded-host');
    const host = forwardedHost || req.get('host');
    return Boolean(host && parsed.host === host);
  } catch {
    return false;
  }
}

function parseTrustProxy(value) {
  if (value === undefined || value === '') return 1;
  if (/^\d+$/.test(value)) return Number(value);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

app.set('trust proxy', parseTrustProxy(process.env.TRUST_PROXY));
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.use((req, res, next) => {
  const origin = req.get('origin');
  if (!origin) return next();

  const allowed =
    isSameOrigin(origin, req) || allowedOrigins.has(origin) || isLocalDevOrigin(origin);
  if (!allowed) {
    return res.status(403).json({ ok: false, error: 'ORIGIN_NOT_ALLOWED' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/api', express.json({ limit: BODY_LIMIT, type: 'application/json' }));

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

app.post('/api/admin/login', adminAuth.login);

app.post('/api/admin/logout', adminAuth.logout);

app.get('/api/admin/session', adminAuth.requireAdmin, adminAuth.session);

app.get('/api/admin/documentation', adminAuth.requireAdmin, async (req, res) => {
  const documentationPath = path.resolve(projectRoot, 'README_DEV.md');

  try {
    const [markdown, stats] = await Promise.all([
      fs.readFile(documentationPath, 'utf8'),

      fs.stat(documentationPath),
    ]);

    res.set('Cache-Control', 'no-store');

    return res.json({
      ok: true,
      markdown,
      updatedAt: stats.mtime.toISOString(),
    });
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return res.status(404).json({
        ok: false,
        error: 'README_DEV_NOT_FOUND',
      });
    }

    console.error('[admin] documentation read failed:', error?.message || error);

    return res.status(500).json({
      ok: false,
      error: 'DOCUMENTATION_READ_FAILED',
    });
  }
});

app.get('/api/admin/leads', adminAuth.requireAdmin, async (req, res) => {
  try {
    const result = await getAdminLeadsPage({
      page: req.query.page,

      limit: req.query.limit,

      search: req.query.search,
    });

    return res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error('[admin] leads failed:', error?.message || error);

    return res.status(500).json({
      ok: false,
      error: 'ADMIN_LEADS_READ_FAILED',
    });
  }
});

app.delete('/api/admin/leads/:id', adminAuth.requireAdmin, async (req, res) => {
  try {
    const result = await deleteLeadFromFile(LEADS_FILE, req.params.id);

    if (!result.deleted && result.reason === 'INVALID_ID') {
      return res.status(400).json({
        ok: false,
        error: 'INVALID_LEAD_ID',
      });
    }

    if (!result.deleted) {
      return res.status(404).json({
        ok: false,
        error: 'LEAD_NOT_FOUND',
      });
    }

    return res.json({
      ok: true,
      deleted: true,
    });
  } catch (error) {
    console.error('[admin] lead delete failed:', error?.message || error);

    return res.status(500).json({
      ok: false,
      error: 'ADMIN_LEAD_DELETE_FAILED',
    });
  }
});

app.get('/api/admin/statistics', adminAuth.requireAdmin, async (req, res) => {
  try {
    const statistics = await getStatistics();

    return res.json({
      ok: true,
      ...statistics,
    });
  } catch (error) {
    console.error('[admin] statistics failed:', error?.message || error);

    return res.status(500).json({
      ok: false,
      error: 'STATISTICS_READ_FAILED',
    });
  }
});

app.get('/api/admin/regulations', adminAuth.requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, regulations: await listRegulations() });
  } catch (error) {
    console.error('[admin] regulations read failed:', error);
    res.status(500).json({ ok: false, error: 'REGULATIONS_READ_FAILED' });
  }
});

app.post('/api/admin/regulations/save', adminAuth.requireAdmin, async (req, res) => {
  try {
    const result = await saveRegulationBundle(req.body);

    if (!result) {
      return res.status(404).json({
        ok: false,
        message: 'Документ не найден',
      });
    }

    return res.status(result.created ? 201 : 200).json({
      ok: true,
      regulation: result.regulation,
      changedClaims: result.changedClaims,
      publication: result.publicationNeeded ? queueRegulationPublication() : null,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    }

    console.error('[admin] regulation bundle save failed:', error);

    return res.status(500).json({
      ok: false,
      message: 'Ошибка сохранения постановления',
    });
  }
});

app.get('/api/admin/regulations/publication', adminAuth.requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, publication: await getRegulationPublication() });
  } catch (error) {
    console.error('[admin] publication status failed:', error);
    res.status(500).json({ ok: false, message: 'Ошибка получения статуса публикации' });
  }
});

app.post('/api/admin/regulations/publication', adminAuth.requireAdmin, (req, res) => {
  res.status(202).json({ ok: true, publication: queueRegulationPublication() });
});

/*
 * ----------------------------------------------------------
 * Legacy blog article redirects
 * ----------------------------------------------------------
 *
 * Nginx отправляет сюда только отсутствующие
 * статические /blog/... страницы.
 *
 * Если slug есть в legacySlugs опубликованной статьи,
 * отдаём настоящий HTTP 301 на актуальный URL.
 */
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

app.get('/admin/', async (req, res) => {
  try {
    const html = await fs.readFile(path.join(clientDir, 'admin.html'), 'utf8');

    return res.send(html);
  } catch (error) {
    console.error('[admin] react admin load failed:', error);

    return res.status(500).send('Admin unavailable');
  }
});

app.use(
  express.static(clientDir, {
    index: false,
    maxAge: IS_PRODUCTION ? '1h' : 0,
    setHeaders(res, filePath) {
      if (!IS_PRODUCTION) {
        res.setHeader('Cache-Control', 'no-cache');
        return;
      }

      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  }),
);

app.get('*', async (req, res, next) => {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return next();
  }

  try {
    let decodedPath;

    try {
      decodedPath = decodeURIComponent(req.path);
    } catch {
      return res.status(400).type('text').send('Bad Request');
    }

    const normalizedPath = decodedPath.replace(/^\/+|\/+$/g, '');

    const resolvedClientDir = path.resolve(clientDir);

    const candidates = [];

    if (!normalizedPath) {
      candidates.push(path.join(resolvedClientDir, 'index.html'));
    } else {
      candidates.push(path.join(resolvedClientDir, normalizedPath, 'index.html'));

      if (!path.extname(normalizedPath)) {
        candidates.push(path.join(resolvedClientDir, `${normalizedPath}.html`));
      }
    }

    for (const candidate of candidates) {
      const resolvedCandidate = path.resolve(candidate);

      const insideClientDir =
        resolvedCandidate === resolvedClientDir ||
        resolvedCandidate.startsWith(`${resolvedClientDir}${path.sep}`);

      if (!insideClientDir) {
        continue;
      }

      try {
        const html = await fs.readFile(resolvedCandidate, 'utf8');

        return res.status(200).type('html').send(html);
      } catch (error) {
        if (error?.code !== 'ENOENT') {
          throw error;
        }
      }
    }

    const notFoundPath = path.join(resolvedClientDir, '404.html');

    try {
      const notFoundHtml = await fs.readFile(notFoundPath, 'utf8');

      return res.status(404).type('html').send(notFoundHtml);
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }

    return res.status(404).type('text').send('404 Not Found');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return res
        .status(503)
        .type('text')
        .send('Frontend build not found. Run npm run build first.');
    }

    return next(error);
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error('[server]', error);
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, error: 'PAYLOAD_TOO_LARGE' });
  }
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, error: 'INVALID_JSON' });
  }
  return res.status(500).json({ ok: false, error: 'INTERNAL_SERVER_ERROR' });
});

app.listen(PORT, HOST, () => {
  console.log(`Passport Security server: http://${HOST}:${PORT}`);
  console.log(`Lead backup: ${BACKUP_ENABLED ? LEADS_FILE : 'disabled'}`);
});
