import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const require = createRequire(import.meta.url);

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const productionProject = '/var/www/pasport-bezopasnosty.ru/app/passport-security-base';

const productionSiteRoot = '/var/www/pasport-bezopasnosty.ru';

async function readProjectFile(relative) {
  return fs.readFile(path.join(projectRoot, relative), 'utf8');
}

test('release helper defines immutable backend generation primitives', async () => {
  const source = await readProjectFile('scripts/lib/release-generation.sh');

  assert.match(source, /create_backend_runtime_snapshot\s*\(\)/);

  assert.match(source, /validate_backend_runtime\s*\(\)/);

  assert.match(source, /switch_generation_links\s*\(\)/);
});

test('federal deploy creates and activates a backend generation', async () => {
  const source = await readProjectFile('scripts/deploy-federal.sh');

  assert.match(source, /BACKEND_CURRENT=.*backend-current/);

  assert.match(source, /create_backend_runtime_snapshot/);

  assert.match(source, /validate_backend_runtime/);

  assert.match(source, /switch_generation_links/);

  assert.match(source, /pm2\s+(?:restart|startOrReload)/);

  assert.doesNotMatch(
    source,
    /ln -s[\s\S]{0,200}"\$\{PROJECT\}\/node_modules"[\s\S]{0,200}"\$\{BUILD_RUNTIME\}\/node_modules"/,
    'Full releases must not reuse mutable project node_modules through a symlink',
  );
});

test('federal rollback restores matching frontend and backend generations', async () => {
  const source = await readProjectFile('scripts/rollback-federal.sh');

  assert.match(source, /RUNTIMES=/);

  assert.match(source, /BACKEND_CURRENT=.*backend-current/);

  assert.match(source, /TARGET_RUNTIME/);

  assert.match(source, /ORIGINAL_RUNTIME/);

  assert.match(source, /validate_backend_runtime/);

  assert.match(source, /switch_generation_links/);

  assert.match(source, /pm2\s+(?:restart|startOrReload)/);
});

test('blog releases preserve the backend generation mapping', async () => {
  const source = await readProjectFile('scripts/publish-blog.sh');

  assert.match(source, /BACKEND_CURRENT=.*backend-current/);

  assert.match(source, /switch_generation_links/);

  assert.doesNotMatch(
    source,
    /ln -s[\s\S]{0,200}"\$\{PROJECT_NODE_MODULES\}"[\s\S]{0,200}"\$\{RUNTIME_NODE_MODULES\}"/,
    'Blog publication must not recreate a mutable node_modules symlink',
  );
});

test('PM2 executes backend-current while keeping the canonical workspace', () => {
  const config = require('../../deploy/pm2/ecosystem.config.cjs');

  const app = config.apps.find(item => item.name === 'passport-api');

  assert.ok(app);

  assert.equal(app.cwd, productionProject);

  assert.equal(app.script, `${productionSiteRoot}/backend-current/app/server/index.mjs`);

  assert.equal(app.env?.PASSPORT_PROJECT_ROOT, productionProject);

  assert.equal(app.env?.CLIENT_DIR, `${productionSiteRoot}/current`);
});

test(
  'release helper snapshots backend dependencies independently and switches both links',
  {
    skip: process.platform === 'win32',
  },
  async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-full-stack-release-'));

    const workspace = path.join(root, 'workspace');

    const runtime = path.join(root, 'runtime');

    const release = path.join(root, 'release');

    const current = path.join(root, 'current');

    const backendCurrent = path.join(root, 'backend-current');

    const helper = path.join(projectRoot, 'scripts', 'lib', 'release-generation.sh');

    try {
      await fs.mkdir(path.join(workspace, 'server', 'shared'), {
        recursive: true,
      });

      await fs.mkdir(path.join(workspace, 'shared', 'contracts'), {
        recursive: true,
      });

      await fs.mkdir(path.join(workspace, 'node_modules', 'sentinel-package'), {
        recursive: true,
      });

      await fs.mkdir(release, {
        recursive: true,
      });

      await fs.writeFile(
        path.join(workspace, 'server', 'index.mjs'),
        'export const runtime = true;\n',
        'utf8',
      );

      await fs.writeFile(
        path.join(workspace, 'server', 'shared', 'project-root.mjs'),
        'export const projectRoot = true;\n',
        'utf8',
      );

      await fs.writeFile(
        path.join(workspace, 'shared', 'contracts', 'lead.js'),
        'export const lead = true;\n',
        'utf8',
      );

      await fs.writeFile(
        path.join(workspace, 'package.json'),
        JSON.stringify(
          {
            type: 'module',
          },
          null,
          2,
        ) + '\n',
        'utf8',
      );

      await fs.writeFile(
        path.join(workspace, 'package-lock.json'),
        JSON.stringify(
          {
            lockfileVersion: 3,
          },
          null,
          2,
        ) + '\n',
        'utf8',
      );

      const dependencyFile = path.join(workspace, 'node_modules', 'sentinel-package', 'value.txt');

      await fs.writeFile(dependencyFile, 'generation-one\n', 'utf8');

      const command = `
        set -Eeuo pipefail
        source "$HELPER"

        create_backend_runtime_snapshot \
          "$WORKSPACE" \
          "$RUNTIME"

        validate_backend_runtime \
          "$RUNTIME"

        switch_generation_links \
          "$CURRENT" \
          "$BACKEND_CURRENT" \
          "$RELEASE" \
          "$RUNTIME"
      `;

      await execFileAsync('bash', ['-c', command], {
        env: {
          ...process.env,
          HELPER: helper,
          WORKSPACE: workspace,
          RUNTIME: runtime,
          RELEASE: release,
          CURRENT: current,
          BACKEND_CURRENT: backendCurrent,
        },
      });

      assert.equal(
        await fs.readFile(path.join(runtime, 'app', 'server', 'index.mjs'), 'utf8'),
        'export const runtime = true;\n',
      );

      assert.equal(
        await fs.readFile(path.join(runtime, 'app', 'shared', 'contracts', 'lead.js'), 'utf8'),
        'export const lead = true;\n',
      );

      const runtimeDependency = path.join(runtime, 'node_modules', 'sentinel-package', 'value.txt');

      const runtimeNodeModulesStat = await fs.lstat(path.join(runtime, 'node_modules'));

      assert.equal(
        runtimeNodeModulesStat.isSymbolicLink(),
        false,
        'Generation node_modules must be an independent directory',
      );

      assert.equal(await fs.readFile(runtimeDependency, 'utf8'), 'generation-one\n');

      await fs.writeFile(dependencyFile, 'workspace-mutated\n', 'utf8');

      assert.equal(
        await fs.readFile(runtimeDependency, 'utf8'),
        'generation-one\n',
        'Existing generation dependencies must not change with the workspace',
      );

      assert.equal(await fs.realpath(current), await fs.realpath(release));

      assert.equal(await fs.realpath(backendCurrent), await fs.realpath(runtime));
    } finally {
      await fs.rm(root, {
        recursive: true,
        force: true,
      });
    }
  },
);

test('backend recovery paths never mask PM2 restart failures', async () => {
  const deploy = await readProjectFile('scripts/deploy-federal.sh');

  const rollback = await readProjectFile('scripts/rollback-federal.sh');

  const maskedPm2Failure = /pm2\s+startOrReload[\s\S]{0,240}?--update-env[\s\S]{0,80}?\|\|\s+true/;

  assert.doesNotMatch(
    deploy,
    maskedPm2Failure,
    'Deploy recovery must fail if the previous backend cannot be restarted',
  );

  assert.doesNotMatch(
    rollback,
    maskedPm2Failure,
    'Rollback recovery must not hide a failed backend restart',
  );
});
