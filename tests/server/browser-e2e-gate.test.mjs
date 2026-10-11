import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function read(relative) {
  return fs.readFile(path.join(projectRoot, relative), 'utf8');
}

async function exists(relative) {
  try {
    await fs.access(path.join(projectRoot, relative));

    return true;
  } catch {
    return false;
  }
}

test('package exposes Playwright browser smoke commands', async () => {
  const pkg = JSON.parse(await read('package.json'));

  assert.ok(
    pkg.devDependencies?.['@playwright/test'],
    '@playwright/test must be an explicit devDependency.',
  );

  assert.match(
    String(pkg.scripts?.['test:e2e'] || ''),
    /build:artifacts/,
    'Local E2E command must build production artifacts first.',
  );

  assert.match(
    String(pkg.scripts?.['test:e2e'] || ''),
    /playwright/,
    'Local E2E command must execute Playwright.',
  );

  assert.match(
    String(pkg.scripts?.['test:e2e:run'] || ''),
    /playwright\s+test/,
    'CI must have a run-only Playwright command after the normal build.',
  );
});

test('Playwright config owns isolated production-server browser execution', async () => {
  assert.equal(await exists('playwright.config.js'), true, 'playwright.config.js is missing.');

  assert.equal(
    await exists('scripts/e2e-server.mjs'),
    true,
    'Isolated E2E server runner is missing.',
  );

  if (!(await exists('playwright.config.js'))) {
    return;
  }

  const config = await read('playwright.config.js');

  assert.match(config, /testDir:\s*['"]\.\/tests\/e2e['"]/);

  assert.match(config, /webServer:/, 'Playwright must start the real local application server.');

  assert.match(config, /chromium/, 'P1 smoke coverage must run in Chromium.');

  assert.match(config, /workers:\s*1/, 'Browser smoke must run sequentially for deterministic CI.');
});

test('critical browser smoke specification exists', async () => {
  const spec = 'tests/e2e/smoke.spec.js';

  assert.equal(await exists(spec), true, `${spec} is missing.`);

  if (!(await exists(spec))) {
    return;
  }

  const source = await read(spec);

  assert.match(source, /\/admin\/articles/, 'Admin direct deep link must have browser coverage.');

  assert.match(
    source,
    /\/admin\/articles\/new/,
    'Lazy-loaded article creation route must have browser coverage.',
  );

  assert.match(
    source,
    /api\/admin\/articles/,
    'Article-list failure UI must be tested at browser level.',
  );

  assert.match(source, /\/blog\//, 'Public blog must have browser smoke coverage.');
});

test('Quality Gate installs Chromium and runs browser smoke tests', async () => {
  const workflow = await read('.github/workflows/quality.yml');

  assert.match(
    workflow,
    /playwright install --with-deps chromium/,
    'CI must install the Playwright Chromium runtime.',
  );

  assert.match(
    workflow,
    /npm run test:e2e:run/,
    'CI must execute browser smoke after building artifacts.',
  );
});
