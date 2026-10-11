import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const serverEntry = path.join(repositoryRoot, 'server', 'index.mjs');

const ADMIN_PASSWORD = 'bootstrap-contract-password';

const ADMIN_SECRET = 'bootstrap-contract-session-secret';

function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

async function reservePort() {
  const server = net.createServer();

  await new Promise((resolve, reject) => {
    server.once('error', reject);

    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();

  assert.ok(address && typeof address === 'object');

  const port = address.port;

  await new Promise((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  return port;
}

function envPath(value) {
  return String(value).replaceAll('\\', '/');
}

function quoteEnv(value) {
  return `"${String(value).replaceAll('\\', '/').replaceAll('"', '\\"')}"`;
}

async function writeJsonLines(file, rows) {
  await fs.mkdir(path.dirname(file), {
    recursive: true,
  });

  await fs.writeFile(file, rows.map(row => JSON.stringify(row)).join('\n') + '\n', 'utf8');
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function waitForHealth(baseUrl, child, getLogs) {
  const deadline = Date.now() + 8000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited before becoming healthy.\n${getLogs()}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);

      if (response.ok) {
        const body = await response.json();

        if (body?.ok === true) {
          return;
        }
      }
    } catch {
      // Server is still starting.
    }

    await delay(50);
  }

  throw new Error(`Timed out waiting for server health.\n${getLogs()}`);
}

async function waitForPublication(file, predicate) {
  const deadline = Date.now() + 5000;

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

    await delay(25);
  }

  throw new Error(`Timed out waiting for publication state: ${JSON.stringify(lastState)}`);
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  const exited = new Promise(resolve => {
    child.once('exit', resolve);
  });

  child.kill('SIGTERM');

  await Promise.race([
    exited,

    delay(4000).then(() => {
      if (child.exitCode === null) {
        child.kill();
      }
    }),
  ]);
}

let temporaryRoot;
let bootstrapRoot;
let configuredRoot;
let configuredLeads;
let configuredRegistry;
let publicationState;
let publicationProbe;
let serverProcess;
let baseUrl;
let adminCookie;
let serverLogs = '';

before(async () => {
  temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-env-bootstrap-'));

  bootstrapRoot = path.join(temporaryRoot, 'bootstrap-cwd');

  configuredRoot = path.join(temporaryRoot, 'configured-workspace');

  const clientDir = path.join(temporaryRoot, 'client');

  configuredLeads = path.join(configuredRoot, 'runtime', 'configured-leads.jsonl');

  const configuredVisits = path.join(configuredRoot, 'runtime', 'configured-visits.jsonl');

  configuredRegistry = path.join(configuredRoot, 'runtime', 'configured-regulations.json');

  publicationState = path.join(configuredRoot, 'data', 'blog-publication.json');

  publicationProbe = path.join(configuredRoot, 'publication-probe.log');

  const publicationRunner = path.join(configuredRoot, 'scripts', 'publication-probe.mjs');

  await Promise.all([
    fs.mkdir(path.join(bootstrapRoot, 'data'), {
      recursive: true,
    }),

    fs.mkdir(path.join(configuredRoot, 'data'), {
      recursive: true,
    }),

    fs.mkdir(path.dirname(configuredLeads), {
      recursive: true,
    }),

    fs.mkdir(path.dirname(publicationRunner), {
      recursive: true,
    }),

    fs.mkdir(clientDir, {
      recursive: true,
    }),
  ]);

  const timestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

  await writeJsonLines(path.join(bootstrapRoot, 'data', 'leads.jsonl'), [
    {
      id: 'bootstrap-default-lead',

      receivedAt: timestamp,

      source: 'form',

      data: {
        name: 'Bootstrap default lead',
      },
    },
  ]);

  await fs.writeFile(path.join(bootstrapRoot, 'data', 'visits.jsonl'), '', 'utf8');

  await fs.writeFile(
    path.join(bootstrapRoot, 'data', 'regulations.json'),
    `${JSON.stringify(
      {
        items: [
          {
            number: 'bootstrap-registry',
          },
        ],
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await writeJsonLines(configuredLeads, [
    {
      id: 'configured-lead-a',

      receivedAt: timestamp,

      source: 'form',

      data: {
        name: 'Configured lead A',
      },
    },

    {
      id: 'configured-lead-b',

      receivedAt: timestamp,

      source: 'form',

      data: {
        name: 'Configured lead B',
      },
    },
  ]);

  await fs.writeFile(configuredVisits, '', 'utf8');

  await fs.writeFile(
    configuredRegistry,
    `${JSON.stringify(
      {
        items: [
          {
            number: 'configured-registry',
          },
        ],
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await fs.writeFile(
    publicationState,
    `${JSON.stringify(
      {
        version: 1,

        status: 'error',

        reason: 'bootstrap-env-probe',

        startedAt: '2026-10-11T00:00:00.000Z',

        finishedAt: '2026-10-11T00:01:00.000Z',

        error: 'synthetic bootstrap probe',

        pending: false,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await fs.writeFile(
    publicationRunner,
    [
      "import fs from 'node:fs/promises';",
      "import path from 'node:path';",
      '',
      "const reason = process.argv[2] || 'unknown';",
      '',
      'await fs.writeFile(',
      "  path.join(process.cwd(), 'publication-probe.log'),",
      '  `${reason}\\n`,',
      "  'utf8',",
      ');',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(clientDir, 'admin.html'),
    '<!doctype html><html><body>admin</body></html>\n',
    'utf8',
  );

  await fs.writeFile(
    path.join(clientDir, '404.html'),
    '<!doctype html><html><body>404</body></html>\n',
    'utf8',
  );

  const port = await reservePort();

  baseUrl = `http://127.0.0.1:${port}`;

  const envFile = path.join(temporaryRoot, 'selected-server.env');

  await fs.writeFile(
    envFile,
    [
      'NODE_ENV=development',

      'HOST=127.0.0.1',

      `PORT=${port}`,

      `PASSPORT_PROJECT_ROOT=${quoteEnv(configuredRoot)}`,

      `CLIENT_DIR=${quoteEnv(clientDir)}`,

      `LEADS_FILE=${quoteEnv(configuredLeads)}`,

      `VISITS_FILE=${quoteEnv(configuredVisits)}`,

      `REGULATION_REGISTRY_FILE=${quoteEnv(configuredRegistry)}`,

      `ADMIN_PASSWORD=${ADMIN_PASSWORD}`,

      `ADMIN_SESSION_SECRET=${ADMIN_SECRET}`,

      `BLOG_PUBLICATION_EXECUTABLE=${quoteEnv(process.execPath)}`,

      `BLOG_PUBLISH_SCRIPT=${quoteEnv(publicationRunner)}`,

      'LEADS_BACKUP_ENABLED=true',

      'BASE_DOMAIN=pasport-bezopasnosty.ru',

      '',
    ].join('\n'),
    'utf8',
  );

  const childEnv = {
    ...process.env,

    SERVER_ENV_FILE: envPath(envFile),
  };

  for (const key of [
    'NODE_ENV',
    'HOST',
    'PORT',
    'PASSPORT_PROJECT_ROOT',
    'CLIENT_DIR',
    'LEADS_FILE',
    'VISITS_FILE',
    'REGULATION_REGISTRY_FILE',
    'ADMIN_PASSWORD',
    'ADMIN_SESSION_SECRET',
    'BLOG_PUBLICATION_EXECUTABLE',
    'BLOG_PUBLISH_SCRIPT',
    'LEADS_BACKUP_ENABLED',
    'BASE_DOMAIN',
  ]) {
    delete childEnv[key];
  }

  childEnv.SERVER_ENV_FILE = envPath(envFile);

  serverProcess = spawn(process.execPath, [serverEntry], {
    cwd: bootstrapRoot,

    env: childEnv,

    stdio: ['ignore', 'pipe', 'pipe'],

    windowsHide: true,
  });

  serverProcess.stdout.on('data', chunk => {
    serverLogs += String(chunk);
  });

  serverProcess.stderr.on('data', chunk => {
    serverLogs += String(chunk);
  });

  await waitForHealth(baseUrl, serverProcess, () => serverLogs);

  const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      password: ADMIN_PASSWORD,
    }),
  });

  const loginBody = await loginResponse.json();

  assert.equal(loginResponse.status, 200, JSON.stringify(loginBody));

  assert.equal(loginBody?.ok, true);

  const setCookie = loginResponse.headers.get('set-cookie');

  assert.equal(typeof setCookie, 'string');

  adminCookie = setCookie.split(';', 1)[0];
});

after(async () => {
  await stopChild(serverProcess);

  if (temporaryRoot) {
    await fs.rm(temporaryRoot, {
      recursive: true,

      force: true,
    });
  }
});

async function adminRequest(pathname, options = {}) {
  const headers = new Headers(options.headers || {});

  headers.set('Cookie', adminCookie);

  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers,
  });

  const body = await response.json();

  return {
    response,
    body,
  };
}

test('admin lead listing uses LEADS_FILE loaded from SERVER_ENV_FILE before backend modules initialize', async () => {
  const { response, body } = await adminRequest('/api/admin/leads?limit=10');

  assert.equal(response.status, 200);

  assert.deepEqual(body.leads.map(lead => lead.name).sort(), [
    'Configured lead A',
    'Configured lead B',
  ]);
});

test('statistics uses the configured LEADS_FILE instead of a pre-dotenv default path', async () => {
  const { response, body } = await adminRequest('/api/admin/statistics');

  assert.equal(response.status, 200);

  assert.equal(body.periods?.['7days']?.totals?.leads, 2);
});

test('regulation admin uses REGULATION_REGISTRY_FILE loaded from SERVER_ENV_FILE', async () => {
  const { response, body } = await adminRequest('/api/admin/regulations');

  assert.equal(response.status, 200);

  assert.equal(body.regulations?.[0]?.number, 'configured-registry');
});

test('blog publication bootstrap uses configured project root and publication runner', async () => {
  const { response, body } = await adminRequest('/api/admin/blog-publication', {
    method: 'POST',
  });

  assert.equal(response.status, 202, JSON.stringify(body));

  assert.equal(body?.ok, true);

  const completed = await waitForPublication(
    publicationState,
    state => state.status === 'success' && state.pending === false,
  );

  assert.equal(completed.reason, 'bootstrap-env-probe');

  const probe = await fs.readFile(publicationProbe, 'utf8');

  assert.equal(probe.trim(), 'bootstrap-env-probe');
});
