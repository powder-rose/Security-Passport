import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const prerenderFile = path.join(repoRoot, 'scripts', 'prerender.mjs');

const publishBlogFile = path.join(repoRoot, 'scripts', 'publish-blog.sh');

async function createIsolatedPrerenderFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-prerender-manifest-'));

  const scriptsDir = path.join(root, 'scripts');
  const dataDir = path.join(root, 'src', 'data');
  const runtimeDir = path.join(root, 'runtime');
  const clientDir = path.join(root, 'isolated-client');
  const manifestDir = path.join(clientDir, '.vite');
  const templateDir = path.join(root, 'isolated-template');

  await Promise.all([
    fs.mkdir(scriptsDir, {
      recursive: true,
    }),
    fs.mkdir(dataDir, {
      recursive: true,
    }),
    fs.mkdir(runtimeDir, {
      recursive: true,
    }),
    fs.mkdir(manifestDir, {
      recursive: true,
    }),
  ]);

  const copiedPrerender = path.join(scriptsDir, 'prerender.mjs');

  const serverEntry = path.join(runtimeDir, 'entry-server.mjs');

  await fs.copyFile(prerenderFile, copiedPrerender);

  await fs.writeFile(
    path.join(root, 'package.json'),
    `${JSON.stringify(
      {
        type: 'module',
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await fs.writeFile(
    path.join(dataDir, 'objectTypes.js'),
    'export const objectTypes = [];\n',
    'utf8',
  );

  await fs.writeFile(
    path.join(dataDir, 'servicePages.js'),
    'export const servicePages = [];\n',
    'utf8',
  );

  await fs.writeFile(
    serverEntry,
    `
const emptyTag = {
  toString() {
    return '';
  },
};

export function render() {
  return {
    html: '<main>fixture</main>',
    helmet: {
      title: emptyTag,
      meta: emptyTag,
      link: emptyTag,
      script: emptyTag,
    },
  };
}
`.trimStart(),
    'utf8',
  );

  await fs.writeFile(
    path.join(clientDir, 'index.html'),
    [
      '<!doctype html>',
      '<html>',
      '<head>',
      '<title>Fixture</title>',
      '</head>',
      '<body>',
      '<div id="root"></div>',
      '</body>',
      '</html>',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(manifestDir, 'manifest.json'),
    `${JSON.stringify(
      {
        'src/pages/LegalPage/LegalPage.jsx': {
          css: ['assets/legal-fixture.css'],
        },
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  return {
    root,
    copiedPrerender,
    serverEntry,
    clientDir,
    templateDir,
  };
}

test('isolated blog publication passes its temporary client directory to prerender', async () => {
  const [prerenderSource, publishBlogSource] = await Promise.all([
    fs.readFile(prerenderFile, 'utf8'),
    fs.readFile(publishBlogFile, 'utf8'),
  ]);

  assert.match(publishBlogSource, /PRERENDER_CLIENT_DIR="\$\{TMP_CLIENT\}"/);

  assert.match(prerenderSource, /const clientDir = resolveEnvPath\(\s*'PRERENDER_CLIENT_DIR',/s);
});

test('isolated prerender reads the Vite manifest from PRERENDER_CLIENT_DIR', async () => {
  const fixture = await createIsolatedPrerenderFixture();

  try {
    const projectDistManifest = path.join(fixture.root, 'dist', 'client', '.vite', 'manifest.json');

    await assert.rejects(fs.access(projectDistManifest), error => {
      assert.equal(error?.code, 'ENOENT');

      return true;
    });

    const result = await execFileAsync(process.execPath, [fixture.copiedPrerender], {
      cwd: fixture.root,
      env: {
        ...process.env,
        PRERENDER_CLIENT_DIR: fixture.clientDir,
        PRERENDER_SERVER_ENTRY: fixture.serverEntry,
        PRERENDER_TEMPLATE_DIR: fixture.templateDir,
      },
      windowsHide: true,
    });

    assert.match(result.stdout, /Prerender complete:/);

    await fs.access(path.join(fixture.clientDir, 'oferta', 'index.html'));

    await fs.access(path.join(fixture.clientDir, 'personal-data', 'index.html'));

    await fs.access(path.join(fixture.clientDir, 'privacy', 'index.html'));
  } finally {
    await fs.rm(fixture.root, {
      recursive: true,
      force: true,
    });
  }
});
