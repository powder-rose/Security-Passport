import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const formFieldsFile = path.join(
  repoRoot,
  'src',
  'admin',
  'features',
  'articles',
  'components',
  'ArticleFormFields.jsx',
);

const editorToolbarFile = path.join(
  repoRoot,
  'src',
  'admin',
  'features',
  'articles',
  'components',
  'ArticleEditorToolbar.jsx',
);

const articleRoutesFile = path.join(repoRoot, 'server', 'http', 'article-routes.mjs');

const supportedAccept = 'image/jpeg,image/png,image/webp';

test('main article image picker advertises only supported image formats', async () => {
  const source = await fs.readFile(formFieldsFile, 'utf8');

  assert.match(source, new RegExp(`accept=["']${supportedAccept}["']`));

  assert.doesNotMatch(
    source,
    /image\/\*/,
    'main article image picker must not advertise unsupported image formats',
  );
});

test('article editor image picker advertises only supported image formats', async () => {
  const source = await fs.readFile(editorToolbarFile, 'utf8');

  assert.match(source, new RegExp(`accept=["']${supportedAccept}["']`));

  assert.doesNotMatch(
    source,
    /accept=["']image\/\*["']/,
    'editor image picker must not advertise unsupported image formats',
  );
});

test('invalid image diagnostics log safe metadata without logging the original filename', async () => {
  const source = await fs.readFile(articleRoutesFile, 'utf8');

  assert.match(source, /mimetype:\s*typeof file\.mimetype === 'string'/);

  assert.match(source, /size:\s*Number\.isFinite\(file\.size\)/);

  assert.match(source, /extension:\s*imageExtension \|\| null/);

  assert.match(source, /path\.extname\(file\.originalFilename \|\| ''\)/);

  assert.doesNotMatch(
    source,
    /originalFilename:\s*file\.originalFilename/,
    'raw original filenames must not be written to logs',
  );
});
