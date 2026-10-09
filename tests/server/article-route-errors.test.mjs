import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test, { after } from 'node:test';

function createRouteRegistry() {
  const routes = [];
  const app = {};

  for (const method of ['get', 'post', 'put', 'delete']) {
    app[method] = (routePath, ...handlers) => {
      routes.push({
        method: method.toUpperCase(),
        path: routePath,
        handlers,
      });

      return app;
    };
  }

  return {
    app,
    routes,
  };
}

function findRoute(routes, method, routePath) {
  const route = routes.find(
    candidate =>
      candidate.method === method && JSON.stringify(candidate.path) === JSON.stringify(routePath),
  );

  assert.ok(route, `Expected route ${method} ${JSON.stringify(routePath)} to exist`);

  return route;
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    headersSent: false,

    status(code) {
      this.statusCode = code;

      return this;
    },

    json(body) {
      this.body = body;
      this.headersSent = true;

      return this;
    },

    type() {
      return this;
    },

    send(body) {
      this.body = body;
      this.headersSent = true;

      return this;
    },

    redirect(code, location) {
      if (location === undefined) {
        location = code;
        code = 302;
      }

      this.statusCode = code;
      this.body = location;
      this.headersSent = true;

      return this;
    },
  };
}

async function withMutedConsole(method, action) {
  const original = console[method];

  console[method] = () => {};

  try {
    return await action();
  } finally {
    console[method] = original;
  }
}

async function invokeRouteHandler(handler, request) {
  const response = createResponse();

  let forwardedError;
  let rejectedError;

  try {
    await handler(request, response, error => {
      forwardedError = error;
    });
  } catch (error) {
    rejectedError = error;
  }

  return {
    forwardedError,
    rejectedError,
    response,
  };
}

const originalCwd = process.cwd();

const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'passport-article-route-errors-'));

after(async () => {
  process.chdir(originalCwd);

  await rm(temporaryRoot, {
    recursive: true,
    force: true,
  });
});

/*
 * Хранилище статей намеренно повреждено.
 *
 * Маршруты должны передавать внутреннюю ошибку
 * в Express next(), а не возвращать наружу
 * необработанный rejected Promise.
 */
await mkdir(path.join(temporaryRoot, 'data'), {
  recursive: true,
});

await writeFile(
  path.join(temporaryRoot, 'data', 'articles.json'),
  '{ invalid article storage',
  'utf8',
);

/*
 * public намеренно создаётся как обычный файл.
 *
 * Это заставляет fs.mkdir(public/uploads/articles)
 * завершиться ошибкой до запуска formidable.
 */
await writeFile(path.join(temporaryRoot, 'public'), 'not-a-directory', 'utf8');

process.chdir(temporaryRoot);

const articleRoutesUrl = new URL('../../server/http/article-routes.mjs', import.meta.url);

articleRoutesUrl.searchParams.set('article-route-errors-test', String(Date.now()));

const { registerArticleRoutes } = await import(articleRoutesUrl.href);

const { app, routes } = createRouteRegistry();

const adminAuth = {
  requireAdmin() {},
};

registerArticleRoutes({
  app,
  adminAuth,
  clientDir: path.join(temporaryRoot, 'client'),
});

test('public article route converts storage error into controlled 500 response', async () => {
  const route = findRoute(routes, 'GET', '/api/articles');
  const handler = route.handlers.at(-1);
  const response = createResponse();

  await withMutedConsole('error', async () => {
    await handler(
      {
        params: {},
        body: {},
      },
      response,
      error => {
        assert.fail(`Public article route unexpectedly forwarded error: ${error?.message}`);
      },
    );
  });

  assert.equal(response.statusCode, 500);

  assert.deepEqual(response.body, {
    ok: false,
    error: 'ARTICLES_READ_FAILED',
  });
});

const adminErrorCases = [
  {
    method: 'GET',
    routePath: '/api/admin/articles',
    request: {
      params: {},
      body: {},
    },
  },
  {
    method: 'POST',
    routePath: '/api/admin/articles',
    request: {
      params: {},
      body: {
        title: 'Test article',
        status: 'draft',
      },
    },
  },
  {
    method: 'GET',
    routePath: '/api/admin/articles/:id',
    request: {
      params: {
        id: 'article-id',
      },
      body: {},
    },
  },
  {
    method: 'PUT',
    routePath: '/api/admin/articles/:id',
    request: {
      params: {
        id: 'article-id',
      },
      body: {
        title: 'Updated article',
      },
    },
  },
  {
    method: 'DELETE',
    routePath: '/api/admin/articles/:id',
    request: {
      params: {
        id: 'article-id',
      },
      body: {},
    },
  },
  {
    method: 'POST',
    routePath: '/api/admin/upload/article-image',
    request: {
      params: {},
      body: {},
    },
  },
];

for (const { method, routePath, request } of adminErrorCases) {
  test(`${method} ${routePath} forwards internal async errors to next()`, async () => {
    const route = findRoute(routes, method, routePath);
    const handler = route.handlers.at(-1);

    const { forwardedError, rejectedError, response } = await invokeRouteHandler(handler, request);

    assert.equal(
      rejectedError,
      undefined,
      `${method} ${routePath} returned a rejected promise instead of forwarding it to next()`,
    );

    assert.ok(
      forwardedError instanceof Error,
      `${method} ${routePath} did not forward the internal error to next()`,
    );

    assert.equal(
      response.headersSent,
      false,
      `${method} ${routePath} sent a response before forwarding the internal error`,
    );
  });
}
