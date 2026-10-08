import { spawn } from 'node:child_process';

import { fileURLToPath } from 'node:url';

import path from 'node:path';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const PUBLISH_SCRIPT = path.join(PROJECT_ROOT, 'scripts', 'publish-blog.sh');

let running = false;

let pending = false;

let lastState = {
  status: 'idle',

  reason: null,

  startedAt: null,

  finishedAt: null,

  error: null,
};

function runPublication(reason) {
  return new Promise((resolve, reject) => {
    const child = spawn('bash', [PUBLISH_SCRIPT, reason], {
      cwd: PROJECT_ROOT,

      stdio: 'inherit',

      env: process.env,
    });

    child.once('error', reject);

    child.once('close', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`publish-blog.sh exited with code ${code ?? signal}`));
    });
  });
}

async function publishOnce(reason) {
  const startedAt = new Date().toISOString();

  lastState = {
    status: 'running',

    reason,

    startedAt,

    finishedAt: null,

    error: null,
  };

  console.log(`[blog-publication] started: ${reason}`);

  await runPublication(reason);

  lastState = {
    status: 'success',

    reason,

    startedAt,

    finishedAt: new Date().toISOString(),

    error: null,
  };

  console.log('[blog-publication] completed');
}

async function processQueue() {
  if (running) {
    return;
  }

  running = true;

  try {
    while (pending) {
      pending = false;

      const reason = lastState.reason || 'article-change';

      try {
        await publishOnce(reason);
      } catch (error) {
        console.error('[blog-publication] failed:', error);

        lastState = {
          ...lastState,

          status: 'error',

          finishedAt: new Date().toISOString(),

          error: error instanceof Error ? error.message : String(error),
        };
      }
    }
  } finally {
    running = false;
  }
}

export function queueBlogPublication(reason = 'article-change') {
  pending = true;

  lastState = {
    ...lastState,
    reason,
  };

  void processQueue();

  return {
    queued: true,

    running,
  };
}

export function getBlogPublicationStatus() {
  return {
    ...lastState,

    running,
    pending,
  };
}
