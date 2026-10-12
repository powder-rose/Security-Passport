import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { ARTICLE_IMAGE_MAX_SIZE } from '../../shared/contracts/article-image.js';
import { getArticleImageValidationError } from '../../src/admin/features/articles/utils/articleImage.js';

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

test('article image limits use the shared five-mebibyte contract', async () => {
  assert.equal(ARTICLE_IMAGE_MAX_SIZE, 5 * 1024 * 1024);

  assert.equal(
    getArticleImageValidationError({
      type: 'image/webp',
      size: ARTICLE_IMAGE_MAX_SIZE,
    }),
    '',
  );

  assert.equal(
    getArticleImageValidationError({
      type: 'image/webp',
      size: ARTICLE_IMAGE_MAX_SIZE + 1,
    }),
    'Размер изображения не должен превышать 5 МБ',
  );

  const [routeSource, hookSource] = await Promise.all([
    fs.readFile(articleRoutesFile, 'utf8'),
    fs.readFile(articleImageHookFile, 'utf8'),
  ]);

  assert.match(routeSource, /const sourceImage = await fs\.readFile\(sourcePath\)/);
  assert.match(routeSource, /sharp\(sourceImage\)\.metadata\(\)/);
  assert.match(routeSource, /const result = await sharp\(sourceImage\)/);
  assert.doesNotMatch(routeSource, /sharp\(sourcePath\)/);

  assert.match(routeSource, /maxFileSize:\s*ARTICLE_IMAGE_MAX_SIZE/);
  assert.match(routeSource, /maxTotalFileSize:\s*ARTICLE_IMAGE_MAX_SIZE/);
  assert.match(routeSource, /formidableErrors\.biggerThanMaxFileSize/);
  assert.match(routeSource, /formidableErrors\.biggerThanTotalMaxFileSize/);

  assert.match(
    routeSource,
    /res\.status\(413\)\.json\(\{\s*ok:\s*false,\s*error:\s*'IMAGE_TOO_LARGE'/,
  );

  assert.match(hookSource, /result\?\.error === 'IMAGE_TOO_LARGE'/);
  assert.match(hookSource, /error\?\.status === 413/);
});
