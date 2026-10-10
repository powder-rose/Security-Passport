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

const articleImageHookFile = path.join(
  repoRoot,
  'src',
  'admin',
  'features',
  'articles',
  'hooks',
  'useArticleImage.js',
);

const createArticlePageFile = path.join(
  repoRoot,
  'src',
  'admin',
  'pages',
  'ArticleEditPage',
  'CreateArticlePage.jsx',
);

const editArticlePageFile = path.join(
  repoRoot,
  'src',
  'admin',
  'pages',
  'ArticleEditPage',
  'ArticleEditPage.jsx',
);

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
test('article image selection always resets the file input for repeat selection', async () => {
  const [hookSource, createSource, editSource] = await Promise.all([
    fs.readFile(articleImageHookFile, 'utf8'),
    fs.readFile(createArticlePageFile, 'utf8'),
    fs.readFile(editArticlePageFile, 'utf8'),
  ]);

  assert.match(
    hookSource,
    /setCropImage\(nextCropImage\);\s*event\.target\.value = '';/,
    'valid image selection must reset the file input immediately after opening the cropper',
  );

  assert.doesNotMatch(hookSource, /resetInputAfterSelect/, 'input reset must not be optional');

  assert.doesNotMatch(
    createSource,
    /resetInputAfterSelect/,
    'create page must not disable repeat image selection',
  );

  assert.doesNotMatch(
    editSource,
    /resetInputAfterSelect/,
    'edit page must use the same image-selection behavior',
  );
});
