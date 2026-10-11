import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import express from 'express';

import { registerFrontendServing } from '../../server/http/frontend-serving.mjs';

async function createFrontendFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-admin-deep-links-'));

  const clientDir = path.join(root, 'client');

  await fs.mkdir(clientDir, {
    recursive: true,
  });

  await fs.writeFile(
    path.join(clientDir, 'admin.html'),
    [
      '<!doctype html>',
      '<html>',
      '<body>',
      '<div id="admin-root">ADMIN SHELL</div>',
      '</body>',
      '</html>',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(clientDir, 'index.html'),
    [
      '<!doctype html>',
      '<html>',
      '<body>',
      '<div id="root">PUBLIC HOME</div>',
      '</body>',
      '</html>',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(clientDir, '404.html'),
    [
      '<!doctype html>',
      '<html>',
      '<body>',
      '<main>PUBLIC 404</main>',
      '</body>',
      '</html>',
      '',
    ].join('\n'),
    'utf8',
  );

  const app = express();

  registerFrontendServing({
    app,
    clientDir,
    isProduction: false,
  });

  const server = await new Promise((resolve, reject) => {
    const listeningServer = app.listen(0, '127.0.0.1', () => {
      resolve(listeningServer);
    });

    listeningServer.once('error', reject);
  });

  const address = server.address();

  assert.ok(address && typeof address === 'object');

  return {
    root,

    server,

    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error);

        return;
      }

      resolve();
    });
  });
}

async function request(baseUrl, pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect: 'manual',
  });

  return {
    status: response.status,

    body: await response.text(),

    contentType: response.headers.get('content-type') || '',
  };
}

test('admin deep links serve the admin shell while unrelated missing routes remain real 404s', async () => {
  const fixture = await createFrontendFixture();

  try {
    const adminRoot = await request(fixture.baseUrl, '/admin/');

    assert.equal(adminRoot.status, 200);

    assert.match(adminRoot.body, /ADMIN SHELL/);

    const publicMissing = await request(fixture.baseUrl, '/definitely-not-a-real-page/');

    assert.equal(publicMissing.status, 404);

    assert.match(publicMissing.body, /PUBLIC 404/);

    const deepLinks = [
      '/admin/articles',
      '/admin/articles/new',
      '/admin/articles/edit/example-id',
      '/admin/regulations',
      '/admin/leads',
      '/admin/statistics',
      '/admin/documentation',
    ];

    const results = [];

    for (const pathname of deepLinks) {
      const result = await request(fixture.baseUrl, pathname);

      results.push({
        pathname,

        status: result.status,

        adminShell: result.body.includes('ADMIN SHELL'),

        contentType: result.contentType,
      });
    }

    assert.deepEqual(
      results,
      deepLinks.map(pathname => ({
        pathname,

        status: 200,

        adminShell: true,

        contentType: 'text/html; charset=utf-8',
      })),
    );
  } finally {
    await closeServer(fixture.server);

    await fs.rm(fixture.root, {
      recursive: true,

      force: true,
    });
  }
});
