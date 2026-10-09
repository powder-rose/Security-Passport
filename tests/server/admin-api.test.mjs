import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ADMIN_AUTH_REQUIRED_EVENT,
  AdminApiError,
  getArticles,
  getSession,
  login,
} from '../../src/admin/api/adminApi.js';

function createJsonResponse(body, { status = 200 } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function withFetch(mockFetch, callback) {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = mockFetch;

  try {
    await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('admin API returns successful JSON responses', async () => {
  await withFetch(
    async () =>
      createJsonResponse({
        ok: true,
        articles: [],
      }),
    async () => {
      const result = await getArticles();

      assert.deepEqual(result, {
        ok: true,
        articles: [],
      });
    },
  );
});

test('admin API preserves expected login errors without auth-expiry event', async () => {
  const originalWindow = globalThis.window;

  const target = new EventTarget();

  globalThis.window = target;

  let authRequiredEvents = 0;

  target.addEventListener(ADMIN_AUTH_REQUIRED_EVENT, () => {
    authRequiredEvents += 1;
  });

  try {
    await withFetch(
      async () =>
        createJsonResponse(
          {
            ok: false,
            error: 'INVALID_ADMIN_PASSWORD',
          },
          {
            status: 401,
          },
        ),
      async () => {
        const result = await login('wrong-password');

        assert.equal(result.ok, false);
        assert.equal(result.error, 'INVALID_ADMIN_PASSWORD');
        assert.equal(authRequiredEvents, 0);
      },
    );
  } finally {
    globalThis.window = originalWindow;
  }
});

test('admin API emits centralized auth event for expired session', async () => {
  const originalWindow = globalThis.window;

  const target = new EventTarget();

  globalThis.window = target;

  let authRequiredEvents = 0;

  target.addEventListener(ADMIN_AUTH_REQUIRED_EVENT, () => {
    authRequiredEvents += 1;
  });

  try {
    await withFetch(
      async () =>
        createJsonResponse(
          {
            ok: false,
            error: 'ADMIN_AUTH_REQUIRED',
          },
          {
            status: 401,
          },
        ),
      async () => {
        const result = await getSession();

        assert.equal(result.ok, false);
        assert.equal(result.error, 'ADMIN_AUTH_REQUIRED');
        assert.equal(authRequiredEvents, 1);
      },
    );
  } finally {
    globalThis.window = originalWindow;
  }
});

test('admin API wraps network failures in AdminApiError', async () => {
  await withFetch(
    async () => {
      throw new TypeError('fetch failed');
    },
    async () => {
      await assert.rejects(getArticles(), error => {
        assert.equal(error instanceof AdminApiError, true);
        assert.equal(error.code, 'NETWORK_ERROR');
        assert.equal(error.status, 0);

        return true;
      });
    },
  );
});

test('admin API rejects malformed JSON with a typed error', async () => {
  await withFetch(
    async () =>
      new Response('<html>proxy error</html>', {
        status: 502,
        headers: {
          'Content-Type': 'text/html',
        },
      }),
    async () => {
      await assert.rejects(getArticles(), error => {
        assert.equal(error instanceof AdminApiError, true);
        assert.equal(error.code, 'INVALID_JSON_RESPONSE');
        assert.equal(error.status, 502);

        return true;
      });
    },
  );
});

test('admin API rejects empty responses with a typed error', async () => {
  await withFetch(
    async () =>
      new Response(null, {
        status: 502,
      }),
    async () => {
      await assert.rejects(getArticles(), error => {
        assert.equal(error instanceof AdminApiError, true);
        assert.equal(error.code, 'EMPTY_RESPONSE');
        assert.equal(error.status, 502);

        return true;
      });
    },
  );
});
