import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { resolveProjectRoot } from '../shared/project-root.mjs';

const PROJECT_ROOT = resolveProjectRoot();

const PUBLISH_SCRIPT = path.resolve(
  PROJECT_ROOT,
  process.env.BLOG_PUBLISH_SCRIPT || 'scripts/publish-blog.sh',
);

const PUBLISH_EXECUTABLE = process.env.BLOG_PUBLICATION_EXECUTABLE || 'bash';

const STATE_FILE = path.join(PROJECT_ROOT, 'data', 'blog-publication.json');

const VALID_STATUSES = new Set(['idle', 'queued', 'running', 'success', 'error']);

function createPublicationStateError(code, message) {
  const error = new Error(message);

  error.code = code;

  return error;
}

function createIdleState() {
  return {
    version: 1,
    status: 'idle',
    reason: null,
    startedAt: null,
    finishedAt: null,
    error: null,
    pending: false,
  };
}

function normalizeState(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    value.version !== 1 ||
    !VALID_STATUSES.has(value.status)
  ) {
    throw new Error('INVALID_BLOG_PUBLICATION_STATE');
  }

  return {
    version: 1,

    status: value.status,

    reason: typeof value.reason === 'string' && value.reason.trim() ? value.reason.trim() : null,

    startedAt: typeof value.startedAt === 'string' ? value.startedAt : null,

    finishedAt: typeof value.finishedAt === 'string' ? value.finishedAt : null,

    error: typeof value.error === 'string' && value.error ? value.error : null,

    pending: Boolean(value.pending),
  };
}

async function readDurableState() {
  try {
    const source = await fs.readFile(STATE_FILE, 'utf8');

    return normalizeState(JSON.parse(source));
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return createIdleState();
    }

    throw error;
  }
}

async function persistState(value) {
  const next = normalizeState(value);

  await fs.mkdir(path.dirname(STATE_FILE), {
    recursive: true,
  });

  const temporary = `${STATE_FILE}.${process.pid}.${Date.now()}.tmp`;

  try {
    await fs.writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    });

    try {
      /*

       * POSIX rename replaces the destination atomically.

       * Production runs on Linux, so this remains the

       * durable production path.

       *

       * Windows may reject rename over an existing file.

       * The fallback exists only for local Windows

       * development and regression tests.

       */

      await fs.rename(
        temporary,

        STATE_FILE,
      );
    } catch (error) {
      const windowsReplaceError =
        process.platform === 'win32' && ['EPERM', 'EEXIST'].includes(error?.code);

      if (!windowsReplaceError) {
        throw error;
      }

      await fs.rm(
        STATE_FILE,

        {
          force: true,
        },
      );

      await fs.rename(
        temporary,

        STATE_FILE,
      );
    }
  } catch (error) {
    await fs.rm(temporary, {
      force: true,
    });

    throw error;
  }

  return next;
}

function runPublication(reason) {
  return new Promise((resolve, reject) => {
    const child = spawn(PUBLISH_EXECUTABLE, [PUBLISH_SCRIPT, reason], {
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

let state = await readDurableState();

let stateWrites = Promise.resolve();

let running = false;

function updateState(mutator) {
  const operation = stateWrites.then(async () => {
    const next = normalizeState(
      mutator({
        ...state,
      }),
    );

    state = await persistState(next);

    return {
      ...state,
    };
  });

  stateWrites = operation.catch(() => {});

  return operation;
}

async function processQueue() {
  if (running) {
    return;
  }

  running = true;

  try {
    while (true) {
      await stateWrites;

      if (!state.pending) {
        break;
      }

      let activeReason = state.reason || 'article-change';

      const startedAt = new Date().toISOString();

      const runningState = await updateState(current => {
        activeReason = current.reason || activeReason;

        return {
          ...current,

          status: 'running',

          reason: activeReason,

          startedAt,

          finishedAt: null,

          error: null,

          pending: false,
        };
      });

      activeReason = runningState.reason || activeReason;

      console.log(`[blog-publication] started: ${activeReason}`);

      try {
        await runPublication(activeReason);
      } catch (error) {
        console.error('[blog-publication] failed:', error);

        const message = error instanceof Error ? error.message : String(error);

        const failedState = await updateState(current => {
          if (current.pending) {
            return {
              ...current,

              status: 'queued',

              startedAt: null,

              finishedAt: new Date().toISOString(),

              error: null,
            };
          }

          return {
            ...current,

            status: 'error',

            reason: activeReason,

            finishedAt: new Date().toISOString(),

            error: message,

            pending: false,
          };
        });

        if (!failedState.pending) {
          break;
        }

        continue;
      }

      const completedState = await updateState(current => {
        if (current.pending) {
          return {
            ...current,

            status: 'queued',

            startedAt: null,

            finishedAt: new Date().toISOString(),

            error: null,
          };
        }

        return {
          ...current,

          status: 'success',

          reason: activeReason,

          finishedAt: new Date().toISOString(),

          error: null,

          pending: false,
        };
      });

      console.log('[blog-publication] completed');

      if (!completedState.pending) {
        break;
      }
    }
  } finally {
    running = false;
  }
}

function startQueueProcessing() {
  void processQueue().catch(error => {
    console.error('[blog-publication] queue processing failed:', error);
  });
}

async function recoverInterruptedPublication() {
  if (state.status !== 'queued' && state.status !== 'running' && !state.pending) {
    return false;
  }

  await updateState(current => ({
    ...current,

    status: 'queued',

    reason: current.reason || 'recovered-publication',

    startedAt: null,

    finishedAt: null,

    error: null,

    pending: true,
  }));

  return true;
}

export async function queueBlogPublication(reason = 'article-change') {
  const normalizedReason = String(reason || 'article-change').trim() || 'article-change';

  /*
   * Durability boundary:
   *
   * API callers await this write before acknowledging
   * that publication has been queued.
   */
  const queuedState = await updateState(current => ({
    ...current,

    status: running ? current.status : 'queued',

    reason: normalizedReason,

    finishedAt: null,

    error: null,

    pending: true,
  }));

  startQueueProcessing();

  return {
    ...queuedState,

    queued: true,
    running,
  };
}

export async function retryBlogPublication() {
  const queuedState = await updateState(current => {
    if (running || current.pending || current.status === 'queued' || current.status === 'running') {
      throw createPublicationStateError('BLOG_PUBLICATION_BUSY', 'Публикация уже выполняется');
    }

    if (current.status !== 'error') {
      throw createPublicationStateError(
        'BLOG_PUBLICATION_NOT_RETRYABLE',
        'Повторная публикация доступна только после ошибки',
      );
    }

    return {
      ...current,

      status: 'queued',

      reason: current.reason || 'manual-retry',

      startedAt: null,

      finishedAt: null,

      error: null,

      pending: true,
    };
  });

  startQueueProcessing();

  return {
    ...queuedState,

    running,
  };
}

export function getBlogPublicationStatus() {
  return {
    ...state,

    running,

    pending: state.pending,
  };
}

if (await recoverInterruptedPublication()) {
  startQueueProcessing();
}
