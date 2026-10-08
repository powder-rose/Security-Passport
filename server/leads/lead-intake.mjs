import crypto from 'node:crypto';
import process from 'node:process';

import { quizContactSchema } from '../../src/lib/validation/leadValidation.js';
import { resolveSiteFromHost } from '../shared/site-region.mjs';

function cleanString(value, maxLength = 2000) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function cleanValue(value, depth = 0) {
  if (depth > 5) {
    return null;
  }

  if (typeof value === 'string') {
    return cleanString(value, 4000);
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.slice(0, 40).map(item => cleanValue(item, depth + 1));
  }

  if (typeof value === 'object' && value) {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 60)
        .map(([key, item]) => [cleanString(key, 80), cleanValue(item, depth + 1)]),
    );
  }

  return null;
}

function getClientIp(req) {
  return req.ip || req.socket.remoteAddress || 'unknown';
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

  if (!allowedSources.has(lead.source)) {
    return 'INVALID_SOURCE';
  }

  if (!lead.requestId || lead.requestId.length < 8) {
    return 'INVALID_REQUEST_ID';
  }

  if (!lead.data || typeof lead.data !== 'object') {
    return 'INVALID_DATA';
  }

  if (lead.source === 'passport-security-final-cta') {
    if (cleanString(lead.data.website, 200)) {
      return 'SPAM_DETECTED';
    }

    if (!cleanString(lead.data.name, 160)) {
      return 'NAME_REQUIRED';
    }

    if (!cleanString(lead.data.phone, 120)) {
      return 'PHONE_REQUIRED';
    }

    if (lead.data.consent !== true) {
      return 'CONSENT_REQUIRED';
    }
  }

  if (lead.source === 'passport-security-quiz') {
    const contact = lead.data?.answers?.contact;

    if (!contact || typeof contact !== 'object') {
      return 'CONTACT_REQUIRED';
    }

    if (!cleanString(contact.name, 160)) {
      return 'NAME_REQUIRED';
    }

    if (!cleanString(contact.phone, 120)) {
      return 'PHONE_REQUIRED';
    }

    if (!cleanString(contact.email, 320)) {
      return 'EMAIL_REQUIRED';
    }

    if (contact.consent !== true) {
      return 'CONSENT_REQUIRED';
    }

    if (!quizContactSchema.isValidSync(contact)) {
      return 'INVALID_CONTACT';
    }
  }

  return '';
}

export function createLeadIntake({ leadDelivery, env = process.env }) {
  const rateWindowMs = Number(env.LEAD_RATE_WINDOW_MS || 10 * 60 * 1000);

  const rateMax = Number(env.LEAD_RATE_MAX || 8);

  const dedupeTtlMs = Number(env.LEAD_DEDUPE_TTL_MS || 24 * 60 * 60 * 1000);

  const rateBuckets = new Map();
  const requestIds = new Map();

  function prune(now = Date.now()) {
    for (const [key, bucket] of rateBuckets) {
      if (now - bucket.startedAt > rateWindowMs) {
        rateBuckets.delete(key);
      }
    }

    for (const [requestId, timestamp] of requestIds) {
      if (now - timestamp > dedupeTtlMs) {
        requestIds.delete(requestId);
      }
    }
  }

  setInterval(prune, Math.min(rateWindowMs, 5 * 60 * 1000)).unref();

  function rateLimit(req, res, next) {
    const now = Date.now();
    const ip = getClientIp(req);
    const bucket = rateBuckets.get(ip);

    if (!bucket || now - bucket.startedAt > rateWindowMs) {
      rateBuckets.set(ip, {
        startedAt: now,
        count: 1,
      });

      return next();
    }

    bucket.count += 1;

    if (bucket.count > rateMax) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((rateWindowMs - (now - bucket.startedAt)) / 1000),
      );

      res.setHeader('Retry-After', String(retryAfterSeconds));

      return res.status(429).json({
        ok: false,
        error: 'TOO_MANY_REQUESTS',
      });
    }

    next();
  }

  async function handleLead(req, res) {
    prune();

    const lead = normalizeLead(req.body, req);

    const validationError = validateLead(lead);

    if (validationError) {
      return res.status(validationError === 'SPAM_DETECTED' ? 202 : 400).json({
        ok: validationError === 'SPAM_DETECTED',

        error: validationError === 'SPAM_DETECTED' ? undefined : validationError,
      });
    }

    if (requestIds.has(lead.requestId)) {
      return res.status(200).json({
        ok: true,
        duplicate: true,
        requestId: lead.requestId,
      });
    }

    requestIds.set(lead.requestId, Date.now());

    try {
      const delivery = await leadDelivery.deliverLead(lead);

      if (!delivery.ok) {
        requestIds.delete(lead.requestId);

        return res.status(503).json({
          ok: false,
          error: 'NO_DELIVERY_CHANNEL_AVAILABLE',
        });
      }

      console.info(`[lead] accepted ${lead.id} (${lead.source})`);

      return res.status(201).json({
        ok: true,
        id: lead.id,
        requestId: lead.requestId,
      });
    } catch (error) {
      requestIds.delete(lead.requestId);

      console.error('[lead] unexpected delivery error:', error);

      return res.status(500).json({
        ok: false,
        error: 'LEAD_DELIVERY_FAILED',
      });
    }
  }

  return {
    rateLimit,
    handleLead,
  };
}
