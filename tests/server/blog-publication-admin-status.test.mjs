import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const publicationModule = path.join(projectRoot, 'server', 'articles', 'blog-publication.mjs');

async function readProjectFile(relative) {
  return fs.readFile(path.join(projectRoot, relative), 'utf8');
}

async function createTemporaryProject({ state, delayMs = 0 } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-blog-retry-'));

  const dataDirectory = path.join(root, 'data');

  const scriptsDirectory = path.join(root, 'scripts');

  const stateFile = path.join(dataDirectory, 'blog-publication.json');

  const runLog = path.join(dataDirectory, 'retry-runs.log');

  const runnerFile = path.join(scriptsDirectory, 'retry-runner.mjs');

  await fs.mkdir(dataDirectory, {
    recursive: true,
  });

  await fs.mkdir(scriptsDirectory, {
    recursive: true,
  });

  if (state) {
    await fs.writeFile(stateFile, JSON.stringify(state, null, 2) + '\n', 'utf8');
  }

  await fs.writeFile(
    runnerFile,
    [
      "import fs from 'node:fs/promises';",
      "import path from 'node:path';",
      '',
      "const reason = process.argv[2] || 'unknown';",
      '',
      "const log = path.join(process.cwd(), 'data', 'retry-runs.log');",
      '',
      "await fs.appendFile(log, `${reason}\\n`, 'utf8');",
      '',
      delayMs > 0 ? `await new Promise(resolve => setTimeout(resolve, ${Number(delayMs)}));` : '',
      '',
    ]
      .filter(Boolean)
      .join('\n'),
    'utf8',
  );

  return {
    root,
    stateFile,
    runLog,
    runnerFile,
  };
}

async function withPublicationEnvironment(temporary, callback) {
  const keys = ['PASSPORT_PROJECT_ROOT', 'BLOG_PUBLICATION_EXECUTABLE', 'BLOG_PUBLISH_SCRIPT'];

  const previous = new Map(keys.map(key => [key, process.env[key]]));

  process.env.PASSPORT_PROJECT_ROOT = temporary.root;

  process.env.BLOG_PUBLICATION_EXECUTABLE = process.execPath;

  process.env.BLOG_PUBLISH_SCRIPT = temporary.runnerFile;

  try {
    return await callback();
  } finally {
    for (const key of keys) {
      const value = previous.get(key);

      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

async function readState(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function waitForState(file, predicate, { timeoutMs = 4000, intervalMs = 25 } = {}) {
  const deadline = Date.now() + timeoutMs;

  let last = null;

  while (Date.now() < deadline) {
    last = await readState(file);

    if (predicate(last)) {
      return last;
    }

    await new Promise(resolve => {
      setTimeout(resolve, intervalMs);
    });
  }

  throw new Error(`Timed out waiting for publication state: ${JSON.stringify(last)}`);
}

function moduleUrl(label) {
  return (
    pathToFileURL(publicationModule).href +
    `?blog-publication-admin=${label}-${Date.now()}-${Math.random()}`
  );
}

function failedState() {
  return {
    version: 1,

    status: 'error',

    reason: 'article-updated',

    startedAt: '2026-10-11T10:00:00.000Z',

    finishedAt: '2026-10-11T10:01:00.000Z',

    error: 'synthetic publication failure',

    pending: false,
  };
}

test(
  'failed blog publication can be retried explicitly',
  {
    concurrency: false,
  },
  async () => {
    const temporary = await createTemporaryProject({
      state: failedState(),
    });

    try {
      await withPublicationEnvironment(temporary, async () => {
        const publication = await import(moduleUrl('retry'));

        assert.equal(
          typeof publication.retryBlogPublication,
          'function',
          'Backend must expose an explicit retry operation',
        );

        const queued = await publication.retryBlogPublication();

        assert.ok(['queued', 'running'].includes(queued.status));

        assert.equal(queued.error, null);

        const completed = await waitForState(
          temporary.stateFile,
          state => state.status === 'success',
        );

        assert.equal(
          completed.reason,
          'article-updated',
          'Retry must preserve the failed publication reason',
        );

        const runs = await fs.readFile(temporary.runLog, 'utf8');

        assert.equal(runs.trim(), 'article-updated');
      });
    } finally {
      await fs.rm(temporary.root, {
        recursive: true,
        force: true,
      });
    }
  },
);

test(
  'retry cannot create a duplicate publication while one is running',
  {
    concurrency: false,
  },
  async () => {
    const temporary = await createTemporaryProject({
      state: failedState(),
      delayMs: 350,
    });

    try {
      await withPublicationEnvironment(temporary, async () => {
        const publication = await import(moduleUrl('busy'));

        assert.equal(typeof publication.retryBlogPublication, 'function');

        await publication.retryBlogPublication();

        await waitForState(temporary.stateFile, state => state.status === 'running');

        await assert.rejects(
          publication.retryBlogPublication(),
          error => error?.code === 'BLOG_PUBLICATION_BUSY',
        );

        await waitForState(temporary.stateFile, state => state.status === 'success');

        const runs = (await fs.readFile(temporary.runLog, 'utf8'))
          .trim()
          .split(/\r?\n/)
          .filter(Boolean);

        assert.deepEqual(
          runs,
          ['article-updated'],
          'Retry button must not enqueue a duplicate publication',
        );
      });
    } finally {
      await fs.rm(temporary.root, {
        recursive: true,
        force: true,
      });
    }
  },
);

test(
  'terminal non-error publication state is not retryable',
  {
    concurrency: false,
  },
  async () => {
    const temporary = await createTemporaryProject({
      state: {
        version: 1,

        status: 'success',

        reason: 'article-created',

        startedAt: '2026-10-11T10:00:00.000Z',

        finishedAt: '2026-10-11T10:01:00.000Z',

        error: null,

        pending: false,
      },
    });

    try {
      await withPublicationEnvironment(temporary, async () => {
        const publication = await import(moduleUrl('not-retryable'));

        assert.equal(typeof publication.retryBlogPublication, 'function');

        await assert.rejects(
          publication.retryBlogPublication(),
          error => error?.code === 'BLOG_PUBLICATION_NOT_RETRYABLE',
        );

        await assert.rejects(
          fs.readFile(temporary.runLog, 'utf8'),
          error => error?.code === 'ENOENT',
        );
      });
    } finally {
      await fs.rm(temporary.root, {
        recursive: true,
        force: true,
      });
    }
  },
);

test('admin API exposes blog publication status and retry operations', async () => {
  const routes = await readProjectFile('server/http/article-routes.mjs');

  const adminApi = await readProjectFile('src/admin/api/adminApi.js');

  assert.match(
    routes,
    /app\.post\(\s*['"]\/api\/admin\/blog-publication['"]/s,
    'Backend must expose the retry endpoint next to the existing status endpoint',
  );

  assert.match(routes, /retryBlogPublication/);

  assert.match(routes, /BLOG_PUBLICATION_BUSY/);

  assert.match(routes, /BLOG_PUBLICATION_NOT_RETRYABLE/);

  assert.match(adminApi, /export function getBlogPublication\(/);

  assert.match(adminApi, /export function retryBlogPublication\(/);
});

test('articles publication UI follows the existing hook and component architecture', async () => {
  const hook = await readProjectFile('src/admin/pages/ArticlesPage/hooks/useBlogPublication.js');

  const component = await readProjectFile(
    'src/admin/pages/ArticlesPage/components/BlogPublicationStatus.jsx',
  );

  const css = await readProjectFile(
    'src/admin/pages/ArticlesPage/components/BlogPublicationStatus.css',
  );

  assert.match(hook, /getBlogPublication/);

  assert.match(hook, /retryBlogPublication/);

  assert.match(
    hook,
    /new Set\(\[['"]queued['"], ['"]running['"]\]\)/,
    'Polling must be limited to active publication states',
  );

  assert.match(hook, /setInterval/);

  assert.match(component, /Публикация выполняется/);

  assert.match(component, /Публикация завершена/);

  assert.match(component, /Ошибка публикации/);

  assert.match(component, /Повторить/);

  assert.doesNotMatch(css, /!important/, 'Publication component styles must not use !important');
});

test('ArticlesPage delegates publication lifecycle to the hook and status component', async () => {
  const source = await readProjectFile('src/admin/pages/ArticlesPage/ArticlesPage.jsx');

  assert.match(source, /useBlogPublication/);

  assert.match(source, /BlogPublicationStatus/);

  assert.doesNotMatch(source, /setInterval/, 'ArticlesPage must not own polling timers');

  assert.match(
    source,
    /setPublication/,
    'Article mutations on the list page must surface their queued publication state',
  );
});
