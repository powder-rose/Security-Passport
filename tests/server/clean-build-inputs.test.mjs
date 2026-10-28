import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createRuntimeArticleResolver } from '../../scripts/lib/runtime-article-links.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('runtime uploads are not a file or symlink source build input', async () => {
  const uploadsPath = path.join(repoRoot, 'public', 'uploads');

  let stat;

  try {
    stat = await fs.lstat(uploadsPath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return;
    }

    throw error;
  }

  assert.equal(
    stat.isDirectory(),
    true,
    'public/uploads may exist only as an ignored local runtime directory.',
  );

  assert.equal(
    stat.isSymbolicLink(),
    false,
    'public/uploads must not be an environment-specific symlink.',
  );
});

test('quality gate builds the checkout without rewriting public/uploads', async () => {
  const workflow = await fs.readFile(
    path.join(repoRoot, '.github', 'workflows', 'quality.yml'),
    'utf8',
  );

  assert.doesNotMatch(
    workflow,
    /Prepare CI runtime directories/,
    'Quality Gate must not require a runtime-directory repair step before building.',
  );

  assert.doesNotMatch(
    workflow,
    /\b(?:rm|mkdir)\b[^\n]*public\/uploads/,
    'Quality Gate must not mutate public/uploads to make a clean checkout buildable.',
  );
});

test('backend upload storage is explicit and production uses persistent shared storage', async () => {
  const [entrypoint, articleRoutes, pm2Config, envExample] = await Promise.all([
    fs.readFile(path.join(repoRoot, 'server', 'index.mjs'), 'utf8'),

    fs.readFile(path.join(repoRoot, 'server', 'http', 'article-routes.mjs'), 'utf8'),

    fs.readFile(path.join(repoRoot, 'deploy', 'pm2', 'ecosystem.config.cjs'), 'utf8'),

    fs.readFile(path.join(repoRoot, '.env.example'), 'utf8'),
  ]);

  assert.match(
    entrypoint,
    /process\.env\.UPLOADS_DIR \|\| 'public\/uploads'/,
    'Backend bootstrap must resolve local upload storage explicitly.',
  );

  assert.match(
    entrypoint,
    /registerArticleRoutes\(\{[\s\S]*?uploadsDir,[\s\S]*?\}\);/,
    'Article routes must receive the resolved uploads directory.',
  );

  assert.match(
    articleRoutes,
    /path\.resolve\(uploadsDir, 'articles'\)/,
    'Article image storage must derive from the injected uploads directory.',
  );

  assert.doesNotMatch(
    articleRoutes,
    /path\.resolve\('public\/uploads\/articles'\)/,
    'Article routes must not hardcode runtime storage inside the source tree.',
  );

  assert.match(
    pm2Config,
    /UPLOADS_DIR:\s*'\/var\/www\/pasport-bezopasnosty\.ru\/shared\/uploads'/,
    'Production must write uploads directly to persistent shared storage.',
  );

  assert.match(
    envExample,
    /^UPLOADS_DIR=public\/uploads$/m,
    'The local upload-storage default must be documented.',
  );
});

const articleOrigin = 'https://pasport-bezopasnosty.ru';
const articlePath = '/blog/pasport-bezopasnosti-rynka/';
const articleUrl = `${articleOrigin}${articlePath}`;
const articleHtml = `<!doctype html><html><head>
<link rel="canonical" href="${articleUrl}">
<meta name="robots" content="index,follow">
</head><body><main class="article-view">
<article><h1>Article fixture</h1>
<div class="article-view__content"><h2 id="details">Details</h2><p>Fixture content.</p></div>
</article></main></body></html>`;

function publicArticleResponse({
  html = articleHtml,
  status = 200,
  url = articleUrl,
  headers,
} = {}) {
  const response = new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...headers },
  });
  Object.defineProperty(response, 'url', { value: url });
  return response;
}

async function articleWorkspace(t, data) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-article-qa-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  if (data !== undefined) {
    await fs.mkdir(path.join(directory, 'data'));
    await fs.writeFile(path.join(directory, 'data', 'articles.json'), data);
  }
  return directory;
}

test('runtime article QA verifies and caches public content for a checkout without article data', async t => {
  const projectRoot = await articleWorkspace(t);
  const calls = [];
  const resolve = createRuntimeArticleResolver({
    projectRoot,
    origin: articleOrigin,
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return publicArticleResponse();
    },
  });
  const [first, second] = await Promise.all([resolve(articlePath), resolve(articlePath)]);
  assert.equal(first, second);
  assert.equal(first.url, articleUrl);
  assert.deepEqual([...first.ids], ['details']);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, articleUrl);
  assert.equal(calls[0].options.redirect, 'error');
  assert.ok(calls[0].options.signal instanceof AbortSignal);
  assert.deepEqual(await fs.readdir(projectRoot), [], 'Verification must not create article data');
});

test('runtime article QA supports an empty dataset without rewriting it', async t => {
  const projectRoot = await articleWorkspace(t, '[]\n');
  const resolve = createRuntimeArticleResolver({
    projectRoot,
    origin: articleOrigin,
    fetchImpl: async () => publicArticleResponse(),
  });
  assert.equal((await resolve(articlePath)).url, articleUrl);
  assert.equal(await fs.readFile(path.join(projectRoot, 'data', 'articles.json'), 'utf8'), '[]\n');
});

test('runtime article QA never replaces missing local output when published articles are present', async t => {
  const projectRoot = await articleWorkspace(
    t,
    JSON.stringify([{ slug: 'another-published-article', status: 'published' }]),
  );
  const resolve = createRuntimeArticleResolver({
    projectRoot,
    origin: articleOrigin,
    fetchImpl: () => assert.fail('Populated runtime data must be validated locally'),
  });
  assert.equal(await resolve(articlePath), null);
});

test('runtime article QA rejects broken runtime data instead of falling back to the public site', async t => {
  for (const data of ['{invalid', '{}']) {
    const projectRoot = await articleWorkspace(t, data);
    const resolve = createRuntimeArticleResolver({
      projectRoot,
      origin: articleOrigin,
      fetchImpl: () => assert.fail('Invalid local data must not trigger an HTTP fallback'),
    });
    await assert.rejects(resolve(articlePath));
  }
});

test('runtime article QA does not accept missing service pages, indexes, assets or external origins', async t => {
  const projectRoot = await articleWorkspace(t);
  const resolve = createRuntimeArticleResolver({
    projectRoot,
    origin: articleOrigin,
    fetchImpl: () => assert.fail('Only canonical public article routes may be requested'),
  });
  for (const pathname of [
    '/missing-service/',
    '/blog/',
    '/blog/draft/file/',
    '/blog/../',
    '/blog/sample/?secret=value',
    '/images/missing.webp',
    'https://example.com/blog/sample/',
  ]) {
    assert.equal(await resolve(pathname), null);
  }
  for (const origin of ['http://pasport-bezopasnosty.ru', 'https://example.com']) {
    const external = createRuntimeArticleResolver({
      projectRoot,
      origin,
      fetchImpl: () => assert.fail('No cross-origin request is permitted'),
    });
    assert.equal(await external(articlePath), null);
  }
});

const invalidArticleCases = [
  ['HTTP 404', { status: 404 }],
  ['HTTP 500', { status: 500 }],
  ['redirected URL', { url: `${articleOrigin}/` }],
  ['JSON response', { headers: { 'Content-Type': 'application/json' } }],
  ['HTTP noindex', { headers: { 'X-Robots-Tag': 'noindex' } }],
  ['wrong canonical', { html: articleHtml.replace(articleUrl, `${articleOrigin}/`) }],
  ['missing canonical', { html: articleHtml.replace(/<link[^>]*>/, '') }],
  ['homepage response', { html: articleHtml.replace('class="article-view"', 'class="home"') }],
  ['missing content', { html: articleHtml.replace('article-view__content', 'placeholder') }],
  ['empty H1', { html: articleHtml.replace('Article fixture', '') }],
  ['HTML noindex', { html: articleHtml.replace('index,follow', 'noindex,follow') }],
];

for (const [name, options] of invalidArticleCases) {
  test(`runtime article QA rejects ${name}`, async t => {
    const projectRoot = await articleWorkspace(t);
    const resolve = createRuntimeArticleResolver({
      projectRoot,
      origin: articleOrigin,
      fetchImpl: async () => publicArticleResponse(options),
    });
    await assert.rejects(resolve(articlePath));
  });
}

test('runtime article QA treats network failure as an error and caches it', async t => {
  const projectRoot = await articleWorkspace(t);
  let requests = 0;
  const resolve = createRuntimeArticleResolver({
    projectRoot,
    origin: articleOrigin,
    fetchImpl: async () => {
      requests += 1;
      throw new Error('network unavailable');
    },
  });
  await assert.rejects(resolve(articlePath), /network unavailable/);
  await assert.rejects(resolve(articlePath), /network unavailable/);
  assert.equal(requests, 1);
});
