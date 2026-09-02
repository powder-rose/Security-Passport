import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.SERVER_ENV_FILE || '.env.server' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const clientDir = path.resolve(projectRoot, process.env.CLIENT_DIR || 'dist/client');

const app = express();
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const BODY_LIMIT = process.env.LEAD_BODY_LIMIT || '32kb';
const RATE_WINDOW_MS = Number(process.env.LEAD_RATE_WINDOW_MS || 10 * 60 * 1000);
const RATE_MAX = Number(process.env.LEAD_RATE_MAX || 8);
const DEDUPE_TTL_MS = Number(process.env.LEAD_DEDUPE_TTL_MS || 24 * 60 * 60 * 1000);
const BACKUP_ENABLED = String(process.env.LEADS_BACKUP_ENABLED ?? 'true').toLowerCase() === 'true';
const LEADS_FILE = path.resolve(projectRoot, process.env.LEADS_FILE || 'data/leads.jsonl');

const allowedOrigins = new Set(
  String(process.env.LEAD_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

const rateBuckets = new Map();
const requestIds = new Map();

function pruneMaps(now = Date.now()) {
  for (const [key, bucket] of rateBuckets) {
    if (now - bucket.startedAt > RATE_WINDOW_MS) rateBuckets.delete(key);
  }
  for (const [requestId, timestamp] of requestIds) {
    if (now - timestamp > DEDUPE_TTL_MS) requestIds.delete(requestId);
  }
}

setInterval(pruneMaps, Math.min(RATE_WINDOW_MS, 5 * 60 * 1000)).unref();

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

  const allowed = isSameOrigin(origin, req) || allowedOrigins.has(origin) || isLocalDevOrigin(origin);
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
    const retryAfterSeconds = Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - bucket.startedAt)) / 1000));
    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({ ok: false, error: 'TOO_MANY_REQUESTS' });
  }

  next();
}

function cleanString(value, maxLength = 2000) {
  if (typeof value !== 'string') return '';
  return value.replace(/\u0000/g, '').trim().slice(0, maxLength);
}

function cleanValue(value, depth = 0) {
  if (depth > 5) return null;
  if (typeof value === 'string') return cleanString(value, 4000);
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) return value;
  if (Array.isArray(value)) return value.slice(0, 40).map((item) => cleanValue(item, depth + 1));
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
    if (contact.consent !== true) return 'CONSENT_REQUIRED';
  }

  return '';
}

function flatten(value, prefix = '', lines = [], depth = 0) {
  if (depth > 5 || lines.length > 80) return lines;
  if (value === null || value === undefined || value === '') return lines;

  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}[${index + 1}]`, lines, depth + 1));
    return lines;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      flatten(item, nextPrefix, lines, depth + 1);
    });
    return lines;
  }

  lines.push(`${prefix}: ${String(value)}`);
  return lines;
}

function humanizeKey(key) {
  const labels = {
    name: 'Имя',
    phone: 'Телефон',
    email: 'Email',
    company: 'Организация',
    object: 'Объект / задача',
    consent: 'Согласие',
    objectType: 'Тип объекта',
    location: 'Регион / город',
    notification: 'Уведомление о включении в перечень',
    documentsStatus: 'Документы',
    objectMetrics: 'Площадь / количество людей',
    contact: 'Контакты',
    region: 'Регион',
    city: 'Город',
    area: 'Площадь, м²',
    people: 'Максимум людей',
    selected: 'Ответ',
    other: 'Уточнение',
  };
  return labels[key] || key;
}

function prettyLines(value, prefix = '', lines = [], depth = 0) {
  if (depth > 5 || lines.length > 80) return lines;
  if (value === null || value === undefined || value === '') return lines;

  if (Array.isArray(value)) {
    lines.push(`${prefix}: ${value.join(', ')}`);
    return lines;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      const label = humanizeKey(key);
      const nextPrefix = prefix ? `${prefix} → ${label}` : label;
      prettyLines(item, nextPrefix, lines, depth + 1);
    });
    return lines;
  }

  lines.push(`${prefix}: ${value === true ? 'да' : value === false ? 'нет' : String(value)}`);
  return lines;
}

function buildLeadText(lead) {
  const sourceTitle = lead.source === 'passport-security-quiz' ? 'Квиз «Паспорт безопасности»' : 'Форма «Обсудить объект»';
  const lines = [
    `Новая заявка — ${sourceTitle}`,
    `ID: ${lead.id}`,
    `Получена: ${lead.receivedAt}`,
    lead.page ? `Страница: ${lead.page}` : '',
    '',
    ...prettyLines(lead.data),
  ].filter(Boolean);

  const attributionLines = flatten(lead.attribution).filter((line) => !line.endsWith(': '));
  if (attributionLines.length) {
    lines.push('', 'Реклама / атрибуция:', ...attributionLines);
  }

  return lines.join('\n').slice(0, 12000);
}

async function saveBackup(lead) {
  if (!BACKUP_ENABLED) return { channel: 'backup', ok: false, skipped: true };
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.appendFile(LEADS_FILE, `${JSON.stringify(lead)}\n`, { encoding: 'utf8', mode: 0o600 });
  return { channel: 'backup', ok: true };
}

async function sendTelegram(text) {
  const token = cleanString(process.env.TELEGRAM_BOT_TOKEN, 300);
  const chatId = cleanString(process.env.TELEGRAM_CHAT_ID, 120);
  if (!token || !chatId) return { channel: 'telegram', ok: false, skipped: true };

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4000),
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`TELEGRAM_${response.status}`);
  }
  return { channel: 'telegram', ok: true };
}

function createMailTransport() {
  const host = cleanString(process.env.SMTP_HOST, 300);
  const user = cleanString(process.env.SMTP_USER, 300);
  const pass = process.env.SMTP_PASS || '';
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE ?? 'true').toLowerCase() === 'true',
    auth: { user, pass },
  });
}

const mailTransport = createMailTransport();

async function sendEmail(text, lead) {
  const to = cleanString(process.env.LEAD_EMAIL_TO, 500);
  const from = cleanString(process.env.LEAD_EMAIL_FROM, 500) || cleanString(process.env.SMTP_USER, 300);
  if (!mailTransport || !to || !from) return { channel: 'email', ok: false, skipped: true };

  await mailTransport.sendMail({
    from,
    to,
    subject: lead.source === 'passport-security-quiz'
      ? 'Новая заявка: квиз паспорта безопасности'
      : 'Новая заявка: паспорт безопасности',
    text,
  });

  return { channel: 'email', ok: true };
}

async function deliverLead(lead) {
  const text = buildLeadText(lead);
  const tasks = [saveBackup(lead), sendTelegram(text), sendEmail(text, lead)];
  const settled = await Promise.allSettled(tasks);

  const results = settled.map((result, index) => {
    const channel = ['backup', 'telegram', 'email'][index];
    if (result.status === 'fulfilled') return result.value;
    console.error(`[lead] ${channel} delivery failed:`, result.reason?.message || result.reason);
    return { channel, ok: false, error: true };
  });

  const configured = results.filter((result) => !result.skipped);
  const successful = configured.filter((result) => result.ok);
  const configuredNotifications = configured.filter((result) => ['telegram', 'email'].includes(result.channel));
  const successfulNotifications = configuredNotifications.filter((result) => result.ok);

  // If a notification channel is configured, do not hide a notification outage behind the local backup.
  // If no notification channel is configured, the protected JSONL backup is a valid acceptance channel.
  const ok = configuredNotifications.length > 0
    ? successfulNotifications.length > 0
    : successful.some((result) => result.channel === 'backup');

  return {
    ok,
    results,
  };
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'passport-security-leads',
    environment: NODE_ENV,
    transports: {
      backup: BACKUP_ENABLED,
      telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      email: Boolean(mailTransport && process.env.LEAD_EMAIL_TO),
    },
  });
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
    const delivery = await deliverLead(lead);
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

app.use(express.static(clientDir, {
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
}));

app.get('*', async (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  try {
    const html = await fs.readFile(path.join(clientDir, 'index.html'), 'utf8');
    res.type('html').send(html);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return res.status(503).type('text').send('Frontend build not found. Run npm run build first.');
    }
    next(error);
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
