import assert from 'node:assert/strict';
import test from 'node:test';

import { createAdminAuth } from '../../server/auth/admin-auth.mjs';

import { createRequest, createResponse } from './http-test-utils.mjs';

const PASSWORD = 'correct-admin-password';
const SECRET = 'test-admin-session-secret';

function login({ ip, password = PASSWORD, isProduction = false } = {}) {
  const auth = createAdminAuth({
    password: PASSWORD,
    secret: SECRET,
    isProduction,
  });

  const request = createRequest({
    ip,
    body: {
      password,
    },
  });

  const response = createResponse();

  auth.login(request, response);

  return {
    auth,
    request,
    response,
  };
}

test('admin login creates a secure session cookie accepted by requireAdmin', () => {
  const { auth, response } = login({
    ip: '203.0.113.101',
    isProduction: true,
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    ok: true,
  });

  const setCookie = response.headers['Set-Cookie'];

  assert.equal(typeof setCookie, 'string');
  assert.match(setCookie, /^passport_admin_session=/);
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Strict/);
  assert.match(setCookie, /Path=\//);
  assert.match(setCookie, /Max-Age=\d+/);
  assert.match(setCookie, /Secure/);

  const cookie = setCookie.split(';', 1)[0];

  const protectedRequest = createRequest({
    ip: '203.0.113.101',
    headers: {
      cookie,
    },
  });

  const protectedResponse = createResponse();

  let nextCalled = false;

  auth.requireAdmin(protectedRequest, protectedResponse, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(protectedResponse.statusCode, 200);
  assert.equal(protectedResponse.body, null);
});

test('admin auth rejects a tampered session token and clears the cookie', () => {
  const { auth, response } = login({
    ip: '203.0.113.102',
  });

  const cookie = response.headers['Set-Cookie'].split(';', 1)[0];

  const separatorIndex = cookie.indexOf('=');
  const name = cookie.slice(0, separatorIndex);
  const token = cookie.slice(separatorIndex + 1);

  const lastCharacter = token.at(-1);
  const replacement = lastCharacter === 'a' ? 'b' : 'a';

  const tamperedCookie = `${name}=${token.slice(0, -1)}${replacement}`;

  const protectedRequest = createRequest({
    ip: '203.0.113.102',
    headers: {
      cookie: tamperedCookie,
    },
  });

  const protectedResponse = createResponse();

  let nextCalled = false;

  auth.requireAdmin(protectedRequest, protectedResponse, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(protectedResponse.statusCode, 401);

  assert.deepEqual(protectedResponse.body, {
    ok: false,
    error: 'ADMIN_AUTH_REQUIRED',
  });

  const clearCookie = protectedResponse.headers['Set-Cookie'];

  assert.match(clearCookie, /^passport_admin_session=/);
  assert.match(clearCookie, /Max-Age=0/);
});

test('admin login rate limiter blocks attempts after the configured threshold', () => {
  const auth = createAdminAuth({
    password: PASSWORD,
    secret: SECRET,
    isProduction: false,
  });

  const ip = '203.0.113.103';

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const response = createResponse();

    auth.login(
      createRequest({
        ip,
        body: {
          password: 'wrong-password',
        },
      }),
      response,
    );

    assert.equal(response.statusCode, 401);
    assert.equal(response.body?.error, 'INVALID_ADMIN_PASSWORD');
  }

  const blocked = createResponse();

  auth.login(
    createRequest({
      ip,
      body: {
        password: PASSWORD,
      },
    }),
    blocked,
  );

  assert.equal(blocked.statusCode, 429);

  assert.deepEqual(blocked.body, {
    ok: false,
    error: 'TOO_MANY_LOGIN_ATTEMPTS',
  });
});

test('successful admin login resets the failed-login bucket', () => {
  const auth = createAdminAuth({
    password: PASSWORD,
    secret: SECRET,
    isProduction: false,
  });

  const ip = '203.0.113.104';

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = createResponse();

    auth.login(
      createRequest({
        ip,
        body: {
          password: 'wrong-password',
        },
      }),
      response,
    );

    assert.equal(response.statusCode, 401);
  }

  const success = createResponse();

  auth.login(
    createRequest({
      ip,
      body: {
        password: PASSWORD,
      },
    }),
    success,
  );

  assert.equal(success.statusCode, 200);

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const response = createResponse();

    auth.login(
      createRequest({
        ip,
        body: {
          password: 'wrong-password',
        },
      }),
      response,
    );

    assert.equal(response.statusCode, 401);
  }

  const blocked = createResponse();

  auth.login(
    createRequest({
      ip,
      body: {
        password: PASSWORD,
      },
    }),
    blocked,
  );

  assert.equal(blocked.statusCode, 429);
});
