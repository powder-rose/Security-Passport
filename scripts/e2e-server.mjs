import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const runtimeRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-browser-e2e-'));

const dataDirectory = path.join(runtimeRoot, 'data');

const uploadsDirectory = path.join(runtimeRoot, 'uploads');

const registryFile = path.join(dataDirectory, 'regulations.json');

const articlesFile = path.join(dataDirectory, 'articles.json');

const environmentFile = path.join(runtimeRoot, '.env.e2e');

await fs.mkdir(dataDirectory, {
  recursive: true,
});

await fs.mkdir(uploadsDirectory, {
  recursive: true,
});

await fs.copyFile(path.join(projectRoot, 'data', 'regulations.json'), registryFile);

await fs.writeFile(articlesFile, '[]\n', 'utf8');

await fs.writeFile(environmentFile, '', 'utf8');

const port = String(process.env.E2E_PORT || '4177');

const child = spawn(process.execPath, [path.join(projectRoot, 'server', 'index.mjs')], {
  cwd: runtimeRoot,

  stdio: 'inherit',

  env: {
    ...process.env,

    NODE_ENV: 'test',

    HOST: '127.0.0.1',

    PORT: port,

    SERVER_ENV_FILE: environmentFile,

    PASSPORT_PROJECT_ROOT: runtimeRoot,

    CLIENT_DIR: path.join(projectRoot, 'dist', 'client'),

    REGULATION_REGISTRY_FILE: registryFile,

    LEADS_BACKUP_ENABLED: 'false',

    LEADS_FILE: path.join(dataDirectory, 'leads.jsonl'),

    VISITS_FILE: path.join(dataDirectory, 'visits.jsonl'),

    UPLOADS_DIR: uploadsDirectory,

    ADMIN_PASSWORD: 'e2e-admin-password',

    ADMIN_SESSION_SECRET: 'e2e-admin-session-secret-2026',
  },
});

let shuttingDown = false;

async function cleanup() {
  await fs.rm(runtimeRoot, {
    recursive: true,
    force: true,
  });
}

function forwardSignal(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (child.exitCode === null && child.signalCode === null) {
    child.kill(signal);
  }
}

process.once('SIGINT', () => {
  forwardSignal('SIGINT');
});

process.once('SIGTERM', () => {
  forwardSignal('SIGTERM');
});

child.once('error', async error => {
  console.error('[e2e-server] backend spawn failed:', error);

  await cleanup();

  process.exitCode = 1;
});

child.once('exit', async (code, signal) => {
  await cleanup();

  if (shuttingDown && (code === 0 || signal === 'SIGINT' || signal === 'SIGTERM')) {
    process.exitCode = 0;

    return;
  }

  process.exitCode = Number.isInteger(code) ? code : 1;
});
