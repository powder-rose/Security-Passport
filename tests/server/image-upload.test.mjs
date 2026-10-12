import assert from 'node:assert/strict';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import express from 'express';
import sharp from 'sharp';

import { ARTICLE_IMAGE_MAX_SIZE } from '../../shared/contracts/article-image.js';

test(
  'article image HTTP upload accepts WebP and rejects oversized files',
  { timeout: 30000 },
  async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-image-http-'));
    const previousRoot = process.env.PASSPORT_PROJECT_ROOT;

    process.env.PASSPORT_PROJECT_ROOT = root;

    let server;
    const sockets = new Set();

    try {
      const { registerArticleRoutes } = await import('../../server/http/article-routes.mjs');

      const app = express();

      registerArticleRoutes({
        app,
        adminAuth: {
          requireAdmin(_req, _res, next) {
            next();
          },
        },
        clientDir: path.join(root, 'client'),
        uploadsDir: path.join(root, 'uploads'),
      });

      app.use((error, _req, res, _next) => {
        res.status(500).json({
          ok: false,
          error: error.message,
        });
      });

      server = app.listen(0, '127.0.0.1');

      server.on('connection', socket => {
        sockets.add(socket);
        socket.once('close', () => sockets.delete(socket));
      });

      await once(server, 'listening');

      const url = `http://127.0.0.1:${server.address().port}/api/admin/upload/article-image`;

      async function upload(buffer, filename) {
        const form = new FormData();

        form.append('image', new Blob([buffer], { type: 'image/webp' }), filename);

        const response = await fetch(url, {
          method: 'POST',
          body: form,
          signal: AbortSignal.timeout(15000),
        });

        return {
          status: response.status,
          body: await response.json(),
        };
      }

      const image = await sharp({
        create: {
          width: 32,
          height: 32,
          channels: 3,
          background: '#ffffff',
        },
      })
        .webp()
        .toBuffer();

      const valid = await upload(image, 'valid.webp');

      assert.equal(valid.status, 200);
      assert.equal(valid.body.ok, true);
      assert.match(valid.body.url, /^\/uploads\/articles\/[\da-f-]+\.webp$/);

      const uploadedPath = path.join(root, 'uploads', 'articles', path.basename(valid.body.url));

      const savedImage = await fs.readFile(uploadedPath);
      const metadata = await sharp(savedImage).metadata();

      assert.equal(metadata.format, 'webp');
      assert.equal(metadata.width, 32);
      assert.equal(metadata.height, 32);

      const oversized = await upload(Buffer.alloc(ARTICLE_IMAGE_MAX_SIZE + 1), 'oversized.webp');

      assert.equal(oversized.status, 413);
      assert.deepEqual(oversized.body, {
        ok: false,
        error: 'IMAGE_TOO_LARGE',
      });
    } finally {
      try {
        if (server) {
          const closed = new Promise((resolve, reject) => {
            server.close(error => {
              if (error) reject(error);
              else resolve();
            });
          });

          server.closeAllConnections();

          for (const socket of sockets) {
            socket.destroy();
          }

          await closed;
        }
      } finally {
        if (previousRoot === undefined) {
          delete process.env.PASSPORT_PROJECT_ROOT;
        } else {
          process.env.PASSPORT_PROJECT_ROOT = previousRoot;
        }

        await fs.rm(root, {
          recursive: true,
          force: true,
          maxRetries: 10,
          retryDelay: 200,
        });
      }
    }
  },
);
