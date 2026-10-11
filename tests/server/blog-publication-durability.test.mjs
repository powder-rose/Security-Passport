import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const publicationModule = path.join(repositoryRoot, 'server', 'articles', 'blog-publication.mjs');

async function createTemporaryProject({ state = null } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-blog-publication-'));

  const dataDirectory = path.join(root, 'data');

  const scriptsDirectory = path.join(root, 'scripts');

  const stateFile = path.join(dataDirectory, 'blog-publication.json');

  const runLog = path.join(dataDirectory, 'blog-publication-runs.log');

  const runnerFile = path.join(scriptsDirectory, 'publish-blog-test.mjs');

  await fs.mkdir(dataDirectory, {
    recursive: true,
  });

  await fs.mkdir(scriptsDirectory, {
    recursive: true,
  });

  await fs.writeFile(
    runnerFile,
    [
      "import fs from 'node:fs/promises';",
      "import path from 'node:path';",
      '',
      "const reason = process.argv[2] || 'unknown';",
      '',
      "const log = path.join(process.cwd(), 'data', 'blog-publication-runs.log');",
      '',
      'await fs.mkdir(path.dirname(log), { recursive: true });',
      '',
      "await fs.appendFile(log, `${reason}\\n`, 'utf8');",
      '',
    ].join('\n'),
    'utf8',
  );

  if (state) {
    await fs.writeFile(stateFile, JSON.stringify(state, null, 2) + '\n', 'utf8');
  }

  return {
    root,
    stateFile,
    runLog,
    runnerFile,
  };
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function waitForState(file, predicate, { timeoutMs = 4000, intervalMs = 25 } = {}) {
  const deadline = Date.now() + timeoutMs;

  let lastState = null;

  while (Date.now() < deadline) {
    try {
      lastState = await readJson(file);

      if (predicate(lastState)) {
        return lastState;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }

    await new Promise(resolve => {
      setTimeout(resolve, intervalMs);
    });
  }

  throw new Error(`Timed out waiting for publication state: ${JSON.stringify(lastState)}`);
}

async function withTemporaryPublicationEnvironment(temporary, callback) {
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

function moduleUrl(label) {
  return (
    pathToFileURL(publicationModule).href +
    `?blog-publication-durability=${label}-${Date.now()}-${Math.random()}`
  );
}

test(
  'unfinished publication is recovered automatically after process restart',
  {
    concurrency: false,
  },
  async () => {
    const temporary = await createTemporaryProject({
      state: {
        version: 1,
        status: 'running',
        reason: 'interrupted-publication',
        startedAt: '2026-10-11T00:00:00.000Z',
        finishedAt: null,
        error: null,
        pending: false,
      },
    });

    try {
      await withTemporaryPublicationEnvironment(temporary, async () => {
        const publication = await import(moduleUrl('recovery'));

        const recovered = await waitForState(
          temporary.stateFile,
          state => state.status === 'success',
        );

        assert.equal(recovered.reason, 'interrupted-publication');

        assert.equal(publication.getBlogPublicationStatus().status, 'success');

        const runs = await fs.readFile(temporary.runLog, 'utf8');

        assert.match(runs, /interrupted-publication/);
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
  'queue intent is persisted before queueBlogPublication resolves',
  {
    concurrency: false,
  },
  async () => {
    const temporary = await createTemporaryProject();

    try {
      await withTemporaryPublicationEnvironment(temporary, async () => {
        const publication = await import(moduleUrl('queue'));

        const queued = await publication.queueBlogPublication('durable-queue-test');

        assert.equal(queued.queued, true);

        const durableState = await readJson(temporary.stateFile);

        assert.equal(durableState.reason, 'durable-queue-test');

        assert.ok(['queued', 'running', 'success'].includes(durableState.status));

        await waitForState(temporary.stateFile, state => state.status === 'success');
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
  'terminal publication status survives module reload',
  {
    concurrency: false,
  },
  async () => {
    const temporary = await createTemporaryProject({
      state: {
        version: 1,
        status: 'error',
        reason: 'failed-publication',
        startedAt: '2026-10-11T00:00:00.000Z',
        finishedAt: '2026-10-11T00:01:00.000Z',
        error: 'synthetic failure',
        pending: false,
      },
    });

    try {
      await withTemporaryPublicationEnvironment(temporary, async () => {
        const publication = await import(moduleUrl('terminal-state'));

        const status = publication.getBlogPublicationStatus();

        assert.equal(status.status, 'error');

        assert.equal(status.reason, 'failed-publication');

        assert.equal(status.error, 'synthetic failure');
      });
    } finally {
      await fs.rm(temporary.root, {
        recursive: true,
        force: true,
      });
    }
  },
);

test('article mutation APIs await durable publication intent before responding', async () => {
  const source = await fs.readFile(
    path.join(repositoryRoot, 'server', 'http', 'article-routes.mjs'),
    'utf8',
  );

  const awaitedCalls = source.match(/await\s+queueBlogPublication\(/g) || [];

  assert.equal(awaitedCalls.length, 3);
});

async function writeTestRunner(temporary, { delayReason = null, delayMs = 0, exitCode = 0 } = {}) {
  const lines = [
    "import fs from 'node:fs/promises';",
    "import path from 'node:path';",
    '',
    "const reason = process.argv[2] || 'unknown';",
    '',
    "const log = path.join(process.cwd(), 'data', 'blog-publication-runs.log');",
    '',
    'await fs.mkdir(path.dirname(log), { recursive: true });',
    '',
    "await fs.appendFile(log, `${reason}\\n`, 'utf8');",
  ];

  if (delayReason) {
    lines.push(
      '',
      `if (reason === ${JSON.stringify(delayReason)}) {`,
      `  await new Promise(resolve => setTimeout(resolve, ${Number(delayMs)}));`,
      '}',
    );
  }

  if (exitCode) {
    lines.push('', `process.exitCode = ${Number(exitCode)};`);
  }

  lines.push('');

  await fs.writeFile(temporary.runnerFile, lines.join('\n'), 'utf8');
}

test(
  'queue received while publication is running is processed by a second publication',
  {
    concurrency: false,
  },
  async () => {
    const temporary = await createTemporaryProject();

    await writeTestRunner(temporary, {
      delayReason: 'first-publication',
      delayMs: 300,
    });

    try {
      await withTemporaryPublicationEnvironment(temporary, async () => {
        const publication = await import(moduleUrl('second-queue'));

        await publication.queueBlogPublication('first-publication');

        await waitForState(
          temporary.stateFile,
          state => state.status === 'running' && state.reason === 'first-publication',
        );

        await publication.queueBlogPublication('second-publication');

        const queuedDuringRun = await readJson(temporary.stateFile);

        assert.equal(queuedDuringRun.reason, 'second-publication');

        assert.equal(queuedDuringRun.pending, true);

        const finalState = await waitForState(
          temporary.stateFile,
          state => state.status === 'success' && state.reason === 'second-publication',
          {
            timeoutMs: 6000,
          },
        );

        assert.equal(finalState.pending, false);

        const runs = (await fs.readFile(temporary.runLog, 'utf8'))
          .trim()
          .split(/\r?\n/)
          .filter(Boolean);

        assert.deepEqual(
          runs,
          ['first-publication', 'second-publication'],
          'A queue request received during an active publication must not be lost',
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
  'publisher failure is persisted durably and is not retried automatically after reload',
  {
    concurrency: false,
  },
  async () => {
    const temporary = await createTemporaryProject();

    await writeTestRunner(temporary, {
      exitCode: 23,
    });

    try {
      await withTemporaryPublicationEnvironment(temporary, async () => {
        const publication = await import(moduleUrl('publisher-failure'));

        await publication.queueBlogPublication('failing-publication');

        const failed = await waitForState(temporary.stateFile, state => state.status === 'error');

        assert.equal(failed.reason, 'failing-publication');

        assert.equal(failed.pending, false);

        assert.match(failed.error || '', /exited with code 23/);

        const reloaded = await import(moduleUrl('publisher-failure-reload'));

        const reloadedStatus = reloaded.getBlogPublicationStatus();

        assert.equal(reloadedStatus.status, 'error');

        assert.equal(reloadedStatus.reason, 'failing-publication');

        assert.match(reloadedStatus.error || '', /exited with code 23/);

        /*
         * A terminal error must remain terminal.
         * Only queued/running work is crash-recovered.
         */
        await new Promise(resolve => {
          setTimeout(resolve, 250);
        });

        const runs = (await fs.readFile(temporary.runLog, 'utf8'))
          .trim()
          .split(/\r?\n/)
          .filter(Boolean);

        assert.deepEqual(
          runs,
          ['failing-publication'],
          'Reload must not silently retry a terminal publication error',
        );

        const durableAfterReload = await readJson(temporary.stateFile);

        assert.equal(durableAfterReload.status, 'error');

        assert.equal(durableAfterReload.pending, false);
      });
    } finally {
      await fs.rm(temporary.root, {
        recursive: true,
        force: true,
      });
    }
  },
);
