import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { isBotUserAgent } from './bot-detection.mjs';
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

export function createVisitTracking({ visitsFile, env = process.env }) {
  const dedupeTtlMs = Number(env.VISIT_DEDUPE_TTL_MS || 30 * 60 * 1000);

  const rateWindowMs = Number(env.VISIT_RATE_WINDOW_MS || 10 * 60 * 1000);

  const rateMax = Number(env.VISIT_RATE_MAX || 30);

  const visitIds = new Map();
  const pendingVisitIds = new Set();
  const rateBuckets = new Map();

  function prune(now = Date.now()) {
    for (const [visitId, timestamp] of visitIds) {
      if (now - timestamp > dedupeTtlMs) {
        visitIds.delete(visitId);
      }
    }

    for (const [ip, bucket] of rateBuckets) {
      if (now - bucket.startedAt > rateWindowMs) {
        rateBuckets.delete(ip);
      }
    }
  }

  setInterval(prune, Math.min(rateWindowMs, 5 * 60 * 1000)).unref();

  function acquireRateSlot(req, now = Date.now()) {
    const key = getClientIp(req);

    const bucket = rateBuckets.get(key);

    if (!bucket || now - bucket.startedAt > rateWindowMs) {
      rateBuckets.set(key, {
        startedAt: now,
        count: 1,
      });

      return key;
    }

    if (bucket.count >= rateMax) {
      return null;
    }

    bucket.count += 1;

    return key;
  }

  function releaseRateSlot(key) {
    if (!key) {
      return;
    }

    const bucket = rateBuckets.get(key);

    if (!bucket) {
      return;
    }

    bucket.count -= 1;

    if (bucket.count <= 0) {
      rateBuckets.delete(key);
    }
  }

  async function handleVisit(req, res) {
    prune();

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

    if (visitIds.has(sessionId) || pendingVisitIds.has(sessionId)) {
      return res.status(200).json({
        ok: true,
        duplicate: true,
      });
    }

    const rateKey = acquireRateSlot(req);

    if (!rateKey) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'VISIT_RATE_LIMITED',
      });
    }

    pendingVisitIds.add(sessionId);

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
      await fs.mkdir(path.dirname(visitsFile), {
        recursive: true,
      });

      await fs.appendFile(visitsFile, `${JSON.stringify(visit)}\n`, {
        encoding: 'utf8',
        mode: 0o600,
      });

      visitIds.set(sessionId, Date.now());

      return res.status(201).json({
        ok: true,
        id: visit.id,
      });
    } catch (error) {
      releaseRateSlot(rateKey);

      console.error('[visit] write failed:', error?.message || error);

      return res.status(500).json({
        ok: false,
        error: 'VISIT_WRITE_FAILED',
      });
    } finally {
      pendingVisitIds.delete(sessionId);
    }
  }

  return {
    handleVisit,
  };
}
