import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('runtime uploads are not a file or symlink source build input', async () => {
  const uploadsPath = path.join(repoRoot, 'public', 'uploads');

  let stat;

  try {
    stat = await fs.lstat(uploadsPath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return;
    }

    throw error;
  }

  assert.equal(
    stat.isDirectory(),
    true,
    'public/uploads may exist only as an ignored local runtime directory.',
  );

  assert.equal(
    stat.isSymbolicLink(),
    false,
    'public/uploads must not be an environment-specific symlink.',
  );
});

test('quality gate builds the checkout without rewriting public/uploads', async () => {
  const workflow = await fs.readFile(
    path.join(repoRoot, '.github', 'workflows', 'quality.yml'),
    'utf8',
  );

  assert.doesNotMatch(
    workflow,
    /Prepare CI runtime directories/,
    'Quality Gate must not require a runtime-directory repair step before building.',
  );

  assert.doesNotMatch(
    workflow,
    /\b(?:rm|mkdir)\b[^\n]*public\/uploads/,
    'Quality Gate must not mutate public/uploads to make a clean checkout buildable.',
  );
});

test('backend upload storage is explicit and production uses persistent shared storage', async () => {
  const [entrypoint, articleRoutes, pm2Config, envExample] = await Promise.all([
    fs.readFile(path.join(repoRoot, 'server', 'index.mjs'), 'utf8'),

    fs.readFile(path.join(repoRoot, 'server', 'http', 'article-routes.mjs'), 'utf8'),

    fs.readFile(path.join(repoRoot, 'deploy', 'pm2', 'ecosystem.config.cjs'), 'utf8'),

    fs.readFile(path.join(repoRoot, '.env.example'), 'utf8'),
  ]);

  assert.match(
    entrypoint,
    /process\.env\.UPLOADS_DIR \|\| 'public\/uploads'/,
    'Backend bootstrap must resolve local upload storage explicitly.',
  );

  assert.match(
    entrypoint,
    /registerArticleRoutes\(\{[\s\S]*?uploadsDir,[\s\S]*?\}\);/,
    'Article routes must receive the resolved uploads directory.',
  );

  assert.match(
    articleRoutes,
    /path\.resolve\(uploadsDir, 'articles'\)/,
    'Article image storage must derive from the injected uploads directory.',
  );

  assert.doesNotMatch(
    articleRoutes,
    /path\.resolve\('public\/uploads\/articles'\)/,
    'Article routes must not hardcode runtime storage inside the source tree.',
  );

  assert.match(
    pm2Config,
    /UPLOADS_DIR:\s*'\/var\/www\/pasport-bezopasnosty\.ru\/shared\/uploads'/,
    'Production must write uploads directly to persistent shared storage.',
  );

  assert.match(
    envExample,
    /^UPLOADS_DIR=public\/uploads$/m,
    'The local upload-storage default must be documented.',
  );
});
