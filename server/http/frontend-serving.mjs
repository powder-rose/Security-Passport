import fs from 'node:fs/promises';
import path from 'node:path';

import express from 'express';

export function registerFrontendServing({ app, clientDir, isProduction }) {
  app.get('/admin/', async (_req, res) => {
    try {
      const html = await fs.readFile(path.join(clientDir, 'admin.html'), 'utf8');

      return res.send(html);
    } catch (error) {
      console.error('[admin] react admin load failed:', error);

      return res.status(500).send('Admin unavailable');
    }
  });

  app.use(
    express.static(clientDir, {
      index: false,
      maxAge: isProduction ? '1h' : 0,

      setHeaders(res, filePath) {
        if (!isProduction) {
          res.setHeader('Cache-Control', 'no-cache');

          return;
        }

        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      },
    }),
  );

  app.get('*', async (req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) {
      return next();
    }

    try {
      let decodedPath;

      try {
        decodedPath = decodeURIComponent(req.path);
      } catch {
        return res.status(400).type('text').send('Bad Request');
      }

      const normalizedPath = decodedPath.replace(/^\/+|\/+$/g, '');

      const resolvedClientDir = path.resolve(clientDir);

      const candidates = [];

      if (!normalizedPath) {
        candidates.push(path.join(resolvedClientDir, 'index.html'));
      } else {
        candidates.push(path.join(resolvedClientDir, normalizedPath, 'index.html'));

        if (!path.extname(normalizedPath)) {
          candidates.push(path.join(resolvedClientDir, `${normalizedPath}.html`));
        }
      }

      for (const candidate of candidates) {
        const resolvedCandidate = path.resolve(candidate);

        const insideClientDir =
          resolvedCandidate === resolvedClientDir ||
          resolvedCandidate.startsWith(`${resolvedClientDir}${path.sep}`);

        if (!insideClientDir) {
          continue;
        }

        try {
          const html = await fs.readFile(resolvedCandidate, 'utf8');

          return res.status(200).type('html').send(html);
        } catch (error) {
          if (error?.code !== 'ENOENT') {
            throw error;
          }
        }
      }

      const notFoundPath = path.join(resolvedClientDir, '404.html');

      try {
        const notFoundHtml = await fs.readFile(notFoundPath, 'utf8');

        return res.status(404).type('html').send(notFoundHtml);
      } catch (error) {
        if (error?.code !== 'ENOENT') {
          throw error;
        }
      }

      return res.status(404).type('text').send('404 Not Found');
    } catch (error) {
      if (error?.code === 'ENOENT') {
        return res
          .status(503)
          .type('text')
          .send('Frontend build not found. Run npm run build first.');
      }

      return next(error);
    }
  });
}
