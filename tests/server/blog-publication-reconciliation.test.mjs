import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test, { after, before } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const prerenderFile = path.join(repositoryRoot, 'scripts', 'prerender.mjs');

const articleRoutesFile = path.join(repositoryRoot, 'server', 'http', 'article-routes.mjs');

async function createPrerenderFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-blog-reconciliation-'));

  const scriptsDir = path.join(root, 'scripts');

  const sourceDataDir = path.join(root, 'src', 'data');

  const runtimeDir = path.join(root, 'runtime');

  const clientDir = path.join(root, 'client');

  const manifestDir = path.join(clientDir, '.vite');

  const templateDir = path.join(root, 'template');

  const articleDataDir = path.join(root, 'data');

  await Promise.all([
    fs.mkdir(scriptsDir, {
      recursive: true,
    }),

    fs.mkdir(sourceDataDir, {
      recursive: true,
    }),

    fs.mkdir(runtimeDir, {
      recursive: true,
    }),

    fs.mkdir(manifestDir, {
      recursive: true,
    }),

    fs.mkdir(articleDataDir, {
      recursive: true,
    }),
  ]);

  const copiedPrerender = path.join(scriptsDir, 'prerender.mjs');

  const serverEntry = path.join(runtimeDir, 'entry-server.mjs');

  await fs.copyFile(prerenderFile, copiedPrerender);

  await fs.writeFile(
    path.join(root, 'package.json'),
    `${JSON.stringify(
      {
        type: 'module',
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await fs.writeFile(
    path.join(sourceDataDir, 'objectTypes.js'),
    'export const objectTypes = [];\n',
    'utf8',
  );

  await fs.writeFile(
    path.join(sourceDataDir, 'servicePages.js'),
    'export const servicePages = [];\n',
    'utf8',
  );

  await fs.writeFile(path.join(articleDataDir, 'articles.json'), '[]\n', 'utf8');

  await fs.writeFile(
    serverEntry,
    `
function tag(value = '') {
  return {
    toString() {
      return value;
    },
  };
}

export function render({
  pathname = '/',
} = {}) {
  const canonical =
    pathname === '/'
      ? 'https://pasport-bezopasnosty.ru'
      : \`https://pasport-bezopasnosty.ru\${pathname}\`;

  return {
    html: \`<main>\${pathname}</main>\`,

    helmet: {
      title: tag(
        \`<title>\${pathname}</title>\`,
      ),

      meta: tag(
        '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
      ),

      link: tag(
        \`<link rel="canonical" href="\${canonical}">\`,
      ),

      script: tag(''),
    },
  };
}
`.trimStart(),
    'utf8',
  );

  await fs.writeFile(
    path.join(clientDir, 'index.html'),
    [
      '<!doctype html>',
      '<html>',
      '<head>',
      '<title>Fixture</title>',
      '</head>',
      '<body>',
      '<div id="root"></div>',
      '</body>',
      '</html>',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(manifestDir, 'manifest.json'),
    `${JSON.stringify(
      {
        'src/pages/LegalPage/LegalPage.jsx': {
          css: ['assets/legal-fixture.css'],
        },

        'src/pages/BlogPage/BlogPage.jsx': {
          css: ['assets/blog-fixture.css'],
        },
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  const staleArticle = path.join(clientDir, 'blog', 'stale-article', 'index.html');

  await fs.mkdir(path.dirname(staleArticle), {
    recursive: true,
  });

  await fs.writeFile(staleArticle, '<html>stale article</html>\n', 'utf8');

  return {
    root,
    copiedPrerender,
    serverEntry,
    clientDir,
    templateDir,
    staleArticle,
  };
}

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

  assert.ok(route, `Expected route ${method} ${JSON.stringify(routePath)}`);

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

    type() {
      return this;
    },

    send(body) {
      this.body = body;
      this.headersSent = true;

      return this;
    },

    json(body) {
      this.body = body;
      this.headersSent = true;

      return this;
    },

    redirect(code, location) {
      this.statusCode = code;
      this.body = location;
      this.headersSent = true;

      return this;
    },
  };
}

async function createArticleRouteFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-stale-article-route-'));

  const dataDir = path.join(root, 'data');

  const clientDir = path.join(root, 'client');

  await fs.mkdir(dataDir, {
    recursive: true,
  });

  const articles = [
    {
      id: 'draft-article',

      title: 'Draft article',

      slug: 'draft-slug',

      status: 'draft',

      legacySlugs: [],

      createdAt: '2026-10-11T00:00:00.000Z',
    },

    {
      id: 'published-article',

      title: 'Published article',

      slug: 'current-slug',

      status: 'published',

      legacySlugs: ['legacy-slug'],

      createdAt: '2026-10-11T00:00:00.000Z',

      publishedAt: '2026-10-11T00:00:00.000Z',
    },
  ];

  await fs.writeFile(
    path.join(dataDir, 'articles.json'),
    `${JSON.stringify(articles, null, 2)}\n`,
    'utf8',
  );

  const staticPages = new Map([
    ['draft-slug', '<html>stale draft page</html>'],

    ['legacy-slug', '<html>stale legacy page</html>'],

    ['current-slug', '<html>current published page</html>'],
  ]);

  for (const [slug, html] of staticPages) {
    const file = path.join(clientDir, 'blog', slug, 'index.html');

    await fs.mkdir(path.dirname(file), {
      recursive: true,
    });

    await fs.writeFile(file, `${html}\n`, 'utf8');
  }

  const previousCwd = process.cwd();

  const previousProjectRoot = process.env.PASSPORT_PROJECT_ROOT;

  try {
    process.chdir(root);

    process.env.PASSPORT_PROJECT_ROOT = root;

    const moduleUrl = pathToFileURL(articleRoutesFile);

    moduleUrl.searchParams.set('stale-blog-route-test', `${Date.now()}-${Math.random()}`);

    const { registerArticleRoutes } = await import(moduleUrl.href);

    const { app, routes } = createRouteRegistry();

    registerArticleRoutes({
      app,

      adminAuth: {
        requireAdmin() {},
      },

      clientDir,
    });

    const publicArticleRoute = findRoute(routes, 'GET', ['/blog/:slug', '/blog/:slug/']);

    return {
      root,

      handler: publicArticleRoute.handlers.at(-1),
    };
  } finally {
    process.chdir(previousCwd);

    if (previousProjectRoot === undefined) {
      delete process.env.PASSPORT_PROJECT_ROOT;
    } else {
      process.env.PASSPORT_PROJECT_ROOT = previousProjectRoot;
    }
  }
}

async function invokeArticleRoute(handler, slug) {
  const response = createResponse();

  let forwardedError;

  await handler(
    {
      params: {
        slug,
      },
    },

    response,

    error => {
      forwardedError = error;
    },
  );

  assert.equal(forwardedError, undefined);

  return response;
}

let articleRouteFixture;

before(async () => {
  articleRouteFixture = await createArticleRouteFixture();
});

after(async () => {
  if (articleRouteFixture?.root) {
    await fs.rm(articleRouteFixture.root, {
      recursive: true,
      force: true,
    });
  }
});

test('isolated blog prerender removes stale article directories before rebuilding blog output', async () => {
  const fixture = await createPrerenderFixture();

  try {
    const result = await execFileAsync(process.execPath, [fixture.copiedPrerender], {
      cwd: fixture.root,

      env: {
        ...process.env,

        PRERENDER_CLIENT_DIR: fixture.clientDir,

        PRERENDER_SERVER_ENTRY: fixture.serverEntry,

        PRERENDER_TEMPLATE_DIR: fixture.templateDir,
      },

      windowsHide: true,
    });

    assert.match(result.stdout, /Blog prerender: \/blog\//);

    await fs.access(path.join(fixture.clientDir, 'blog', 'index.html'));

    await assert.rejects(
      fs.access(fixture.staleArticle),
      error => error?.code === 'ENOENT',
      'A stale article page from the previous release must not survive prerender',
    );
  } finally {
    await fs.rm(fixture.root, {
      recursive: true,
      force: true,
    });
  }
});

test('unpublished article cannot be served from a stale static page', async () => {
  const response = await invokeArticleRoute(articleRouteFixture.handler, 'draft-slug');

  assert.equal(response.statusCode, 404);

  assert.equal(response.body, 'Article not found');
});

test('legacy slug redirects before any stale static page can be served', async () => {
  const response = await invokeArticleRoute(articleRouteFixture.handler, 'legacy-slug');

  assert.equal(response.statusCode, 301);

  assert.equal(response.body, '/blog/current-slug/');
});

test('current published slug still serves its generated static page', async () => {
  const response = await invokeArticleRoute(articleRouteFixture.handler, 'current-slug');

  assert.equal(response.statusCode, 200);

  assert.match(response.body, /current published page/);
});
