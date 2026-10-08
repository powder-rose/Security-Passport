import process from 'node:process';

import express from 'express';

function parseTrustProxy(value) {
  if (value === undefined || value === '') {
    return 1;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
}

function isLocalDevOrigin(origin, isProduction) {
  if (isProduction) {
    return false;
  }

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

export function registerHttpMiddleware({ app, isProduction, env = process.env }) {
  const bodyLimit = env.LEAD_BODY_LIMIT || '1mb';

  const allowedOrigins = new Set(
    String(env.LEAD_ALLOWED_ORIGINS || '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean),
  );

  app.set('trust proxy', parseTrustProxy(env.TRUST_PROXY));

  app.disable('x-powered-by');

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    next();
  });

  app.use((req, res, next) => {
    const origin = req.get('origin');

    if (!origin) {
      return next();
    }

    const allowed =
      isSameOrigin(origin, req) ||
      allowedOrigins.has(origin) ||
      isLocalDevOrigin(origin, isProduction);

    if (!allowed) {
      return res.status(403).json({
        ok: false,
        error: 'ORIGIN_NOT_ALLOWED',
      });
    }

    res.setHeader('Access-Control-Allow-Origin', origin);

    res.setHeader('Vary', 'Origin');

    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    return next();
  });

  app.use(
    '/api',
    express.json({
      limit: bodyLimit,
      type: 'application/json',
    }),
  );
}

export function registerHttpErrorHandler({ app }) {
  app.use((error, _req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    console.error('[server]', error);

    if (error?.type === 'entity.too.large') {
      return res.status(413).json({
        ok: false,
        error: 'PAYLOAD_TOO_LARGE',
      });
    }

    if (error?.type === 'entity.parse.failed') {
      return res.status(400).json({
        ok: false,
        error: 'INVALID_JSON',
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  });
}
