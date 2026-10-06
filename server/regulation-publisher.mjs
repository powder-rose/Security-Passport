import { spawn } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = path.join(root, 'scripts/deploy-federal.sh');
const registry = path.join(root, 'data/regulations.json');
const publishedPage =
  '/var/www/pasport-bezopasnosty.ru/current/pasport-bezopasnosti-gostinicy/index.html';

const state = {
  phase: 'idle',
  startedAt: null,
  publishedAt: null,
  error: null,
};

let requested = 0;
let processed = 0;
let running = false;

function deploy() {
  return new Promise((resolve, reject) => {
    const child = spawn('bash', [script, 'regulation-publication'], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';

    function collect(chunk) {
      output = (output + String(chunk)).slice(-12000);
    }

    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    child.once('error', reject);
    child.once('close', (code, signal) => {
      if (code === 0) return resolve();
      reject(new Error(`Сборка завершилась с кодом ${code ?? signal}: ${output.slice(-1200)}`));
    });
  });
}

async function runQueue() {
  if (running) return;
  running = true;

  try {
    while (processed < requested) {
      const current = requested;
      state.phase = 'publishing';
      state.startedAt = new Date().toISOString();
      state.error = null;

      try {
        await deploy();
        processed = current;
        state.publishedAt = new Date().toISOString();
        state.phase = requested > current ? 'queued' : 'published';
      } catch (error) {
        processed = current;
        state.error = error.message;
        state.phase = requested > current ? 'queued' : 'failed';
        if (requested === current) break;
      }
    }
  } finally {
    running = false;
  }
}

export function queueRegulationPublication() {
  requested += 1;
  state.phase = 'queued';
  state.error = null;
  void runQueue();
  return { ...state };
}

export async function getRegulationPublication() {
  if (state.phase !== 'idle') return { ...state };

  const [source, page] = await Promise.all([stat(registry), stat(publishedPage)]);

  return {
    ...state,
    phase: source.mtimeMs > page.mtimeMs ? 'unpublished' : 'published',
  };
}
