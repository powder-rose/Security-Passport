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

  assert.match(source, /activate_pm2_generation/);

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

  assert.match(source, /activate_pm2_generation/);
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
  const helper = await readProjectFile('scripts/lib/release-generation.sh');

  const maskedPm2Failure = /pm2\s+(?:delete|start|startOrReload|save)[\s\S]{0,240}?\|\|\s+true/;

  assert.doesNotMatch(
    helper,
    maskedPm2Failure,
    'PM2 generation activation must propagate process-management failures',
  );
});

test('PM2 generation activation migrates legacy executable registrations', async () => {
  const source = await readProjectFile('scripts/lib/release-generation.sh');

  assert.match(source, /activate_pm2_generation\s*\(\)/);

  assert.match(source, /pm2_app_exec_path\s*\(\)/);

  assert.match(source, /pm2\s+delete/);

  assert.match(source, /pm2\s+start\s+/);

  assert.match(source, /pm2\s+startOrReload/);

  assert.match(source, /pm2\s+save/);
});

test('deploy and rollback use the shared PM2 generation activator', async () => {
  for (const relative of ['scripts/deploy-federal.sh', 'scripts/rollback-federal.sh']) {
    const source = await readProjectFile(relative);

    assert.match(source, /activate_pm2_generation/, `${relative} must use activate_pm2_generation`);

    assert.doesNotMatch(
      source,
      /pm2\s+startOrReload/,
      `${relative} must not bypass the shared PM2 generation activator`,
    );
  }
});

test(
  'PM2 generation activator chooses migrate or reload from the registered executable',
  {
    skip: process.platform === 'win32',
  },
  async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-pm2-generation-'));

    const bin = path.join(root, 'bin');
    const log = path.join(root, 'pm2.log');
    const state = path.join(root, 'pm2-state.txt');

    const helper = path.join(projectRoot, 'scripts', 'lib', 'release-generation.sh');

    const fakePm2 = path.join(bin, 'pm2');

    try {
      await fs.mkdir(bin, {
        recursive: true,
      });

      await fs.writeFile(
        fakePm2,
        `#!/usr/bin/env bash
set -Eeuo pipefail

printf '%s\\n' "$*" >> "$PM2_LOG"

case "\${1:-}" in
  jlist)
    if [ -s "$PM2_STATE" ]; then
      current_exec="$(cat "$PM2_STATE")"

      printf '[{"name":"passport-api","pm2_env":{"pm_exec_path":"%s"}}]\n' \
        "$current_exec"
    else
      printf '[]\n'
    fi
    ;;

  delete)
    : > "$PM2_STATE"
    ;;

  start|startOrReload)
    printf '%s' "$EXPECTED_EXEC" > "$PM2_STATE"
    ;;

  save)
    ;;

  *)
    exit 64
    ;;
esac
`,
        {
          encoding: 'utf8',
          mode: 0o755,
        },
      );

      const expectedExec = '/var/www/pasport-bezopasnosty.ru/backend-current/app/server/index.mjs';

      const config =
        '/var/www/pasport-bezopasnosty.ru/app/passport-security-base/deploy/pm2/ecosystem.config.cjs';

      const runActivator = async currentExec => {
        await fs.writeFile(log, '', 'utf8');

        await fs.writeFile(state, currentExec, 'utf8');

        const command = `
          set -Eeuo pipefail

          source "$HELPER"

          activate_pm2_generation \
            "$CONFIG" \
            passport-api \
            "$EXPECTED_EXEC"
        `;

        await execFileAsync('bash', ['-c', command], {
          env: {
            ...process.env,
            PATH: `${bin}:${process.env.PATH}`,
            HELPER: helper,
            CONFIG: config,
            EXPECTED_EXEC: expectedExec,
            PM2_LOG: log,
            PM2_STATE: state,
          },
        });

        return fs.readFile(log, 'utf8');
      };

      const legacyLog = await runActivator(
        '/var/www/pasport-bezopasnosty.ru/app/passport-security-base/server/index.mjs',
      );

      assert.match(legacyLog, /delete passport-api/);

      assert.match(legacyLog, /start .*ecosystem\.config\.cjs --only passport-api --update-env/);

      assert.doesNotMatch(legacyLog, /startOrReload/);

      assert.match(legacyLog, /save/);

      const generationLog = await runActivator(expectedExec);

      assert.doesNotMatch(generationLog, /delete passport-api/);

      assert.match(
        generationLog,
        /startOrReload .*ecosystem\.config\.cjs --only passport-api --update-env/,
      );

      assert.match(generationLog, /save/);

      const missingLog = await runActivator('');

      assert.doesNotMatch(missingLog, /delete passport-api/);

      assert.match(missingLog, /start .*ecosystem\.config\.cjs --only passport-api --update-env/);

      assert.match(missingLog, /save/);
    } finally {
      await fs.rm(root, {
        recursive: true,
        force: true,
      });
    }
  },
);

test('PM2 generation activation verifies the executable after process management', async () => {
  const source = await readProjectFile('scripts/lib/release-generation.sh');

  assert.match(source, /local activated_exec/);

  assert.match(source, /activated_exec="\$\([\s\S]*?pm2_app_exec_path\s+"\$\{app_name\}"/);

  assert.match(source, /\[ "\$\{activated_exec\}" != "\$\{expected_exec\}" \]/);

  assert.match(source, /PM2 executable[\s\S]*?EXPECTED:/);
});
