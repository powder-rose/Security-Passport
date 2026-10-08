import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import { resolveSiteFromHost } from './site-region.mjs';
import { isBotUserAgent } from './bot-detection.mjs';
import { getStatistics } from './statistics.mjs';
import { getAdminLeadsPage } from './admin-leads.mjs';
import { deleteLeadFromFile } from './lead-storage.mjs';
import { createLeadDelivery } from './lead-delivery.mjs';
import { createAdminAuth } from './admin-auth.mjs';
import { quizContactSchema } from '../src/lib/validation/leadValidation.js';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  updatePublishedArticlesYear,
} from './admin-articles.mjs';

import { queueBlogPublication, getBlogPublicationStatus } from './blog-publication.mjs';

import { listRegulations, saveRegulationBundle } from './admin-regulations.mjs';
import { queueRegulationPublication, getRegulationPublication } from './regulation-publisher.mjs';
import formidable from 'formidable';
import sharp from 'sharp';

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
const RATE_WINDOW_MS = Number(process.env.LEAD_RATE_WINDOW_MS || 10 * 60 * 1000);
const RATE_MAX = Number(process.env.LEAD_RATE_MAX || 8);
const DEDUPE_TTL_MS = Number(process.env.LEAD_DEDUPE_TTL_MS || 24 * 60 * 60 * 1000);
const BACKUP_ENABLED = String(process.env.LEADS_BACKUP_ENABLED ?? 'true').toLowerCase() === 'true';
const LEADS_FILE = path.resolve(projectRoot, process.env.LEADS_FILE || 'data/leads.jsonl');
const VISITS_FILE = path.resolve(projectRoot, process.env.VISITS_FILE || 'data/visits.jsonl');
const VISIT_DEDUPE_TTL_MS = Number(process.env.VISIT_DEDUPE_TTL_MS || 30 * 60 * 1000);
const VISIT_RATE_WINDOW_MS = Number(process.env.VISIT_RATE_WINDOW_MS || 10 * 60 * 1000);
const VISIT_RATE_MAX = Number(process.env.VISIT_RATE_MAX || 30);

const allowedOrigins = new Set(
  String(process.env.LEAD_ALLOWED_ORIGINS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean),
);

const rateBuckets = new Map();
const requestIds = new Map();
const visitIds = new Map();
const visitRateBuckets = new Map();

function pruneMaps(now = Date.now()) {
  for (const [key, bucket] of rateBuckets) {
    if (now - bucket.startedAt > RATE_WINDOW_MS) rateBuckets.delete(key);
  }
  for (const [requestId, timestamp] of requestIds) {
    if (now - timestamp > DEDUPE_TTL_MS) requestIds.delete(requestId);
  }

  for (const [visitId, timestamp] of visitIds) {
    if (now - timestamp > VISIT_DEDUPE_TTL_MS) visitIds.delete(visitId);
  }

  for (const [ip, bucket] of visitRateBuckets) {
    if (now - bucket.startedAt > VISIT_RATE_WINDOW_MS) {
      visitRateBuckets.delete(ip);
    }
  }
}

setInterval(pruneMaps, Math.min(RATE_WINDOW_MS, VISIT_RATE_WINDOW_MS, 5 * 60 * 1000)).unref();

function getClientIp(req) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

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

function rateLimit(req, res, next) {
  const now = Date.now();
  const ip = getClientIp(req);
  const bucket = rateBuckets.get(ip);

  if (!bucket || now - bucket.startedAt > RATE_WINDOW_MS) {
    rateBuckets.set(ip, { startedAt: now, count: 1 });
    return next();
  }

  bucket.count += 1;
  if (bucket.count > RATE_MAX) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((RATE_WINDOW_MS - (now - bucket.startedAt)) / 1000),
    );
    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({ ok: false, error: 'TOO_MANY_REQUESTS' });
  }

  next();
}

function acquireVisitRateSlot(req, now = Date.now()) {
  const key = getClientIp(req);
  const bucket = visitRateBuckets.get(key);

  if (!bucket || now - bucket.startedAt > VISIT_RATE_WINDOW_MS) {
    visitRateBuckets.set(key, {
      startedAt: now,
      count: 1,
    });

    return key;
  }

  if (bucket.count >= VISIT_RATE_MAX) {
    return null;
  }

  bucket.count += 1;

  return key;
}

function releaseVisitRateSlot(key) {
  if (!key) {
    return;
  }

  const bucket = visitRateBuckets.get(key);

  if (!bucket) {
    return;
  }

  bucket.count -= 1;

  if (bucket.count <= 0) {
    visitRateBuckets.delete(key);
  }
}

function cleanString(value, maxLength = 2000) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function cleanValue(value, depth = 0) {
  if (depth > 5) return null;
  if (typeof value === 'string') return cleanString(value, 4000);
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) return value;
  if (Array.isArray(value)) return value.slice(0, 40).map(item => cleanValue(item, depth + 1));
  if (typeof value === 'object' && value) {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 60)
        .map(([key, item]) => [cleanString(key, 80), cleanValue(item, depth + 1)]),
    );
  }
  return null;
}

function normalizeLead(body, req) {
  const source = cleanString(body?.source, 120);
  const requestId = cleanString(body?.requestId, 160);
  const data = cleanValue(body?.data || {});
  const attribution = cleanValue(body?.attribution || {});

  return {
    id: crypto.randomUUID(),
    requestId,
    source,
    submittedAt: cleanString(body?.submittedAt, 80) || new Date().toISOString(),
    receivedAt: new Date().toISOString(),
    page: cleanString(body?.page, 1200),
    referrer: cleanString(body?.referrer, 1200),
    site: resolveSiteFromHost(req.get('x-forwarded-host') || req.get('host') || ''),
    attribution,
    data,
    meta: {
      ip: getClientIp(req),
      userAgent: cleanString(req.get('user-agent'), 600),
    },
  };
}

function validateLead(lead) {
  const allowedSources = new Set(['passport-security-final-cta', 'passport-security-quiz']);
  if (!allowedSources.has(lead.source)) return 'INVALID_SOURCE';
  if (!lead.requestId || lead.requestId.length < 8) return 'INVALID_REQUEST_ID';
  if (!lead.data || typeof lead.data !== 'object') return 'INVALID_DATA';

  if (lead.source === 'passport-security-final-cta') {
    if (cleanString(lead.data.website, 200)) return 'SPAM_DETECTED';
    if (!cleanString(lead.data.name, 160)) return 'NAME_REQUIRED';
    if (!cleanString(lead.data.phone, 120)) return 'PHONE_REQUIRED';
    if (lead.data.consent !== true) return 'CONSENT_REQUIRED';
  }

  if (lead.source === 'passport-security-quiz') {
    const contact = lead.data?.answers?.contact;
    if (!contact || typeof contact !== 'object') return 'CONTACT_REQUIRED';
    if (!cleanString(contact.name, 160)) return 'NAME_REQUIRED';
    if (!cleanString(contact.phone, 120)) return 'PHONE_REQUIRED';
    if (!cleanString(contact.email, 320)) return 'EMAIL_REQUIRED';
    if (contact.consent !== true) return 'CONSENT_REQUIRED';
    if (!quizContactSchema.isValidSync(contact)) return 'INVALID_CONTACT';
  }

  return '';
}

const leadDelivery = createLeadDelivery({
  backupEnabled: BACKUP_ENABLED,
  leadsFile: LEADS_FILE,
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
app.get(['/blog/:slug', '/blog/:slug/'], async (req, res) => {
  try {
    const articles = await getArticles();

    const requestedSlug = req.params.slug;

    /*
     * Если prerender текущей статьи уже существует,
     * отдаём его напрямую с HTTP 200.
     *
     * Это важно, потому что express.static с index:false
     * сам не отдаёт /blog/:slug/index.html для directory URL.
     */
    const articleStaticRoot = path.resolve(clientDir, 'blog');

    const articleStaticPath = path.resolve(articleStaticRoot, requestedSlug, 'index.html');

    const insideArticleStaticRoot = articleStaticPath.startsWith(`${articleStaticRoot}${path.sep}`);

    if (insideArticleStaticRoot) {
      try {
        const articleHtml = await fs.readFile(articleStaticPath, 'utf8');

        return res.status(200).type('html').send(articleHtml);
      } catch (error) {
        if (error?.code !== 'ENOENT') {
          throw error;
        }
      }
    }

    const target = articles.find(
      article =>
        article.status === 'published' &&
        Array.isArray(article.legacySlugs) &&
        article.legacySlugs.includes(requestedSlug),
    );

    if (target) {
      return res.redirect(301, `/blog/${encodeURIComponent(target.slug)}/`);
    }

    /*
     * Если это актуальный slug, но его статика
     * почему-то ещё не появилась, не отдаём
     * случайно главную страницу.
     */
    const current = articles.find(
      article => article.status === 'published' && article.slug === requestedSlug,
    );

    if (current) {
      return res.status(503).type('text/plain').send('Article page is being published.');
    }

    return res.status(404).type('text/plain').send('Article not found');
  } catch (error) {
    console.error('[articles] legacy redirect failed:', error);

    return res.status(500).type('text/plain').send('Article redirect failed');
  }
});

/*
 * ----------------------------------------------------------
 * Public articles API
 * ----------------------------------------------------------
 */

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticles();

    const published = articles
      .filter(article => article.status === 'published')
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0),
      )
      .map(article => ({
        id: article.id,

        title: article.title,

        slug: article.slug,

        image: article.image || '',

        imageAlt: article.imageAlt || '',

        seoDescription: article.seoDescription || '',

        category: article.category || '',

        createdAt: article.createdAt,

        updatedAt: article.updatedAt,

        publishedAt: article.publishedAt,
      }));

    res.json({
      ok: true,
      articles: published,
    });
  } catch (error) {
    console.error('[articles] public list failed:', error);

    res.status(500).json({
      ok: false,
      error: 'ARTICLES_READ_FAILED',
    });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const articles = await getArticles();

    const article = articles.find(
      item => item.status === 'published' && item.slug === req.params.slug,
    );

    if (!article) {
      return res.status(404).json({
        ok: false,
        error: 'ARTICLE_NOT_FOUND',
      });
    }

    res.json({
      ok: true,
      article,
    });
  } catch (error) {
    console.error('[articles] public article failed:', error);

    res.status(500).json({
      ok: false,
      error: 'ARTICLE_READ_FAILED',
    });
  }
});

app.get('/api/admin/blog-publication', adminAuth.requireAdmin, (req, res) => {
  res.json({
    ok: true,

    publication: getBlogPublicationStatus(),
  });
});

app.post('/api/admin/articles/update-year', adminAuth.requireAdmin, async (req, res) => {
  try {
    const currentYear = new Date().getUTCFullYear();

    const result = await updatePublishedArticlesYear(currentYear);

    queueBlogPublication('articles-year-updated');

    res.json({
      ok: true,

      ...result,

      publication: {
        queued: true,
      },
    });
  } catch (error) {
    console.error('[admin] articles year update failed:', error);

    res.status(500).json({
      ok: false,

      error: 'ARTICLE_YEAR_UPDATE_FAILED',
    });
  }
});

app.get('/api/admin/articles', adminAuth.requireAdmin, async (req, res) => {
  const articles = await getArticles();

  res.json({
    ok: true,
    articles,
  });
});

app.post('/api/admin/articles', adminAuth.requireAdmin, async (req, res) => {
  try {
    const article = await createArticle(req.body);

    queueBlogPublication('article-created');

    res.json({
      ok: true,
      article,

      publication: {
        queued: true,
      },
    });
  } catch (error) {
    if (error?.code === 'ARTICLE_SEO_REQUIRED') {
      return res.status(400).json({
        ok: false,

        error: 'ARTICLE_SEO_REQUIRED',
      });
    }

    throw error;
  }
});

app.get('/api/admin/articles/:id', adminAuth.requireAdmin, async (req, res) => {
  const article = await getArticleById(req.params.id);

  if (!article) {
    return res.status(404).json({
      ok: false,
      error: 'ARTICLE_NOT_FOUND',
    });
  }

  res.json({
    ok: true,
    article,
  });
});

app.put('/api/admin/articles/:id', adminAuth.requireAdmin, async (req, res) => {
  try {
    const article = await updateArticle(req.params.id, req.body);

    if (!article) {
      return res.status(404).json({
        ok: false,
        error: 'ARTICLE_NOT_FOUND',
      });
    }

    queueBlogPublication('article-updated');

    res.json({
      ok: true,
      article,

      publication: {
        queued: true,
      },
    });
  } catch (error) {
    if (error?.code === 'ARTICLE_SEO_REQUIRED') {
      return res.status(400).json({
        ok: false,

        error: 'ARTICLE_SEO_REQUIRED',
      });
    }

    throw error;
  }
});

app.delete('/api/admin/articles/:id', adminAuth.requireAdmin, async (req, res) => {
  await deleteArticle(req.params.id);

  queueBlogPublication('article-deleted');

  res.json({
    ok: true,

    publication: {
      queued: true,
    },
  });
});

app.post('/api/admin/upload/article-image', adminAuth.requireAdmin, async (req, res) => {
  const uploadDir = path.resolve('public/uploads/articles');

  await fs.mkdir(uploadDir, {
    recursive: true,
  });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 20 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('[article-image] upload failed:', err?.message || err);

      return res.status(400).json({
        ok: false,
        error: 'UPLOAD_ERROR',
      });
    }

    const file = files.image?.[0];

    if (!file) {
      return res.status(400).json({
        ok: false,
        error: 'FILE_REQUIRED',
      });
    }

    const sourcePath = file.filepath;

    const optimizedName = `${crypto.randomUUID()}.webp`;

    const optimizedPath = path.join(uploadDir, optimizedName);

    try {
      const metadata = await sharp(sourcePath).metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error('INVALID_IMAGE');
      }

      const sourceStat = await fs.stat(sourcePath);

      const result = await sharp(sourcePath)
        .rotate()
        .resize({
          width: 1920,
          height: 1920,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 82,
          effort: 4,
          smartSubsample: true,
        })
        .toFile(optimizedPath);

      await fs.rm(sourcePath, {
        force: true,
      });

      console.info('[article-image] optimized', {
        beforeBytes: sourceStat.size,

        afterBytes: result.size,

        width: result.width,

        height: result.height,
      });

      return res.json({
        ok: true,

        url: `/uploads/articles/${optimizedName}`,

        width: result.width,

        height: result.height,
      });
    } catch (error) {
      await fs.rm(sourcePath, {
        force: true,
      });

      await fs.rm(optimizedPath, {
        force: true,
      });

      console.error('[article-image] optimization failed:', error?.message || error);

      return res.status(400).json({
        ok: false,
        error: 'INVALID_IMAGE',
      });
    }
  });
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

app.post('/api/visits', async (req, res) => {
  pruneMaps();

  const userAgent = cleanString(req.get('user-agent'), 600);

  if (isBotUserAgent(userAgent)) {
    return res.status(200).json({
      ok: true,
      ignored: true,
      reason: 'BOT_VISIT',
    });
  }

  const sessionId = cleanString(req.body?.sessionId, 160);

  if (!sessionId || sessionId.length < 8) {
    return res.status(400).json({
      ok: false,
      error: 'INVALID_VISIT_ID',
    });
  }

  if (visitIds.has(sessionId)) {
    return res.status(200).json({
      ok: true,
      duplicate: true,
    });
  }

  const visitRateKey = acquireVisitRateSlot(req);

  if (!visitRateKey) {
    return res.status(200).json({
      ok: true,
      ignored: true,
      reason: 'VISIT_RATE_LIMITED',
    });
  }

  const visit = {
    id: crypto.randomUUID(),
    sessionId,
    receivedAt: new Date().toISOString(),
    site: resolveSiteFromHost(req.get('x-forwarded-host') || req.get('host') || ''),
    path: cleanString(req.body?.path, 1200),
    referrer: cleanString(req.body?.referrer, 1200),
    attribution: cleanValue(req.body?.attribution || {}),
    meta: {
      userAgent,
    },
  };

  try {
    await fs.mkdir(path.dirname(VISITS_FILE), { recursive: true });

    await fs.appendFile(VISITS_FILE, `${JSON.stringify(visit)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    });

    visitIds.set(sessionId, Date.now());

    return res.status(201).json({
      ok: true,
      id: visit.id,
    });
  } catch (error) {
    releaseVisitRateSlot(visitRateKey);

    console.error('[visit] write failed:', error?.message || error);

    return res.status(500).json({
      ok: false,
      error: 'VISIT_WRITE_FAILED',
    });
  }
});

app.post('/api/leads', rateLimit, async (req, res) => {
  pruneMaps();
  const lead = normalizeLead(req.body, req);
  const validationError = validateLead(lead);

  if (validationError) {
    return res.status(validationError === 'SPAM_DETECTED' ? 202 : 400).json({
      ok: validationError === 'SPAM_DETECTED',
      error: validationError === 'SPAM_DETECTED' ? undefined : validationError,
    });
  }

  if (requestIds.has(lead.requestId)) {
    return res.status(200).json({ ok: true, duplicate: true, requestId: lead.requestId });
  }
  requestIds.set(lead.requestId, Date.now());

  try {
    const delivery = await leadDelivery.deliverLead(lead);
    if (!delivery.ok) {
      requestIds.delete(lead.requestId);
      return res.status(503).json({ ok: false, error: 'NO_DELIVERY_CHANNEL_AVAILABLE' });
    }

    console.info(`[lead] accepted ${lead.id} (${lead.source})`);
    return res.status(201).json({ ok: true, id: lead.id, requestId: lead.requestId });
  } catch (error) {
    requestIds.delete(lead.requestId);
    console.error('[lead] unexpected delivery error:', error);
    return res.status(500).json({ ok: false, error: 'LEAD_DELIVERY_FAILED' });
  }
});

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
