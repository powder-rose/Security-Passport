import crypto from 'node:crypto';

const COOKIE_NAME = 'passport_admin_session';

const SESSION_TTL_MS =
  12 * 60 * 60 * 1000;

const LOGIN_WINDOW_MS =
  15 * 60 * 1000;

const LOGIN_MAX_ATTEMPTS = 8;

const loginAttempts = new Map();


function safeEqual(first, second) {
  const a = Buffer.from(String(first || ''));
  const b = Buffer.from(String(second || ''));

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}


function parseCookies(header = '') {
  const result = {};

  for (const part of String(header).split(';')) {
    const index = part.indexOf('=');

    if (index === -1) continue;

    const key =
      part.slice(0, index).trim();

    const value =
      part.slice(index + 1).trim();

    if (!key) continue;

    try {
      result[key] =
        decodeURIComponent(value);
    } catch {
      result[key] = value;
    }
  }

  return result;
}


function encode(value) {
  return Buffer
    .from(JSON.stringify(value))
    .toString('base64url');
}


function decode(value) {
  try {
    return JSON.parse(
      Buffer
        .from(value, 'base64url')
        .toString('utf8'),
    );
  } catch {
    return null;
  }
}


function sign(value, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64url');
}


function passwordFingerprint(password) {
  return crypto
    .createHash('sha256')
    .update(String(password || ''))
    .digest('hex')
    .slice(0, 24);
}


function createToken({
  password,
  secret,
}) {
  const now = Date.now();

  const payload = encode({
    v: 1,
    iat: now,
    exp: now + SESSION_TTL_MS,
    auth: passwordFingerprint(password),
  });

  const signature =
    sign(payload, secret);

  return `${payload}.${signature}`;
}


function verifyToken({
  token,
  password,
  secret,
}) {
  if (
    !token ||
    !password ||
    !secret
  ) {
    return false;
  }

  const parts =
    String(token).split('.');

  if (parts.length !== 2) {
    return false;
  }

  const [
    payload,
    suppliedSignature,
  ] = parts;

  const expectedSignature =
    sign(payload, secret);

  if (
    !safeEqual(
      suppliedSignature,
      expectedSignature,
    )
  ) {
    return false;
  }

  const data = decode(payload);

  if (
    !data ||
    data.v !== 1 ||
    !Number.isFinite(data.exp) ||
    data.exp <= Date.now()
  ) {
    return false;
  }

  if (
    data.auth !==
    passwordFingerprint(password)
  ) {
    return false;
  }

  return true;
}


function cleanupLoginAttempts() {
  const now = Date.now();

  for (
    const [ip, bucket]
    of loginAttempts
  ) {
    if (
      now - bucket.startedAt >
      LOGIN_WINDOW_MS
    ) {
      loginAttempts.delete(ip);
    }
  }
}


setInterval(
  cleanupLoginAttempts,
  5 * 60 * 1000,
).unref();


function checkLoginLimit(req) {
  cleanupLoginAttempts();

  const now = Date.now();

  const ip =
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown';

  const bucket =
    loginAttempts.get(ip);

  if (
    !bucket ||
    now - bucket.startedAt >
      LOGIN_WINDOW_MS
  ) {
    loginAttempts.set(ip, {
      startedAt: now,
      count: 1,
    });

    return true;
  }

  bucket.count += 1;

  return (
    bucket.count <=
    LOGIN_MAX_ATTEMPTS
  );
}


function resetLoginLimit(req) {
  const ip =
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown';

  loginAttempts.delete(ip);
}


function createCookie(
  token,
  isProduction,
) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${Math.floor(
      SESSION_TTL_MS / 1000
    )}`,
  ];

  if (isProduction) {
    parts.push('Secure');
  }

  return parts.join('; ');
}


function clearCookie(isProduction) {
  const parts = [
    `${COOKIE_NAME}=`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    'Max-Age=0',
  ];

  if (isProduction) {
    parts.push('Secure');
  }

  return parts.join('; ');
}


export function createAdminAuth({
  password,
  secret =
    process.env.ADMIN_SESSION_SECRET || '',
  isProduction,
}) {

  function requireAdmin(
    req,
    res,
    next,
  ) {
    const cookies =
      parseCookies(
        req.get('cookie') || '',
      );

    const token =
      cookies[COOKIE_NAME];

    const valid =
      verifyToken({
        token,
        password,
        secret,
      });

    if (!valid) {
      res.setHeader(
        'Set-Cookie',
        clearCookie(isProduction),
      );

      return res.status(401).json({
        ok: false,
        error:
          'ADMIN_AUTH_REQUIRED',
      });
    }

    return next();
  }


  function login(req, res) {
    if (!password || !secret) {
      return res.status(503).json({
        ok: false,
        error:
          'ADMIN_NOT_CONFIGURED',
      });
    }

    if (!checkLoginLimit(req)) {
      return res.status(429).json({
        ok: false,
        error:
          'TOO_MANY_LOGIN_ATTEMPTS',
      });
    }

    const submitted =
      typeof req.body?.password ===
      'string'
        ? req.body.password.slice(
            0,
            300,
          )
        : '';

    if (
      !safeEqual(
        submitted,
        password,
      )
    ) {
      return res.status(401).json({
        ok: false,
        error:
          'INVALID_ADMIN_PASSWORD',
      });
    }

    resetLoginLimit(req);

    const token =
      createToken({
        password,
        secret,
      });

    res.setHeader(
      'Set-Cookie',
      createCookie(
        token,
        isProduction,
      ),
    );

    return res.json({
      ok: true,
    });
  }


  function logout(req, res) {
    res.setHeader(
      'Set-Cookie',
      clearCookie(isProduction),
    );

    return res.json({
      ok: true,
    });
  }


  function session(req, res) {
    return res.json({
      ok: true,
      authenticated: true,
    });
  }


  return {
    login,
    logout,
    session,
    requireAdmin,
  };
}
