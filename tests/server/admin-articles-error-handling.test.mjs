import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const articlesPageFile = path.join(
  repoRoot,
  'src',
  'admin',
  'pages',
  'ArticlesPage',
  'ArticlesPage.jsx',
);

function sliceSection(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);

  assert.notEqual(start, -1, `Missing section start: ${startMarker}`);

  const end = source.indexOf(endMarker, start + startMarker.length);

  assert.notEqual(end, -1, `Missing section end: ${endMarker}`);

  return source.slice(start, end);
}

test('article list load exposes failures instead of rendering a false empty state', async () => {
  const source = await fs.readFile(articlesPageFile, 'utf8');

  const section = sliceSection(source, '  async function loadArticles() {', '  useEffect(() => {');

  assert.match(
    source,
    /const \[error,\s*setError\]\s*=\s*useState\(['"]['"]\)/,
    'ArticlesPage must own an explicit list error state.',
  );

  assert.match(section, /\btry\s*\{/, 'loadArticles must catch request failures.');

  assert.match(section, /\bcatch\b/, 'loadArticles must expose transport failures to the UI.');

  assert.match(section, /\bfinally\s*\{/, 'loadArticles must always release its loading state.');

  assert.match(
    section,
    /!result\?\.ok|result\?\.ok\s*===\s*false/,
    'loadArticles must reject structured ok:false API responses.',
  );

  assert.match(section, /setError\(/, 'loadArticles must store a visible error state.');

  assert.doesNotMatch(
    section,
    /setArticles\(result\.articles\s*\|\|\s*\[\]\)/,
    'API failure must not be silently converted to an empty article list.',
  );

  assert.match(
    source,
    /error[\s\S]*Не удалось загрузить статьи/,
    'ArticlesPage must render a user-visible article loading error.',
  );
});

test('failed article deletion never removes the article from local UI state', async () => {
  const source = await fs.readFile(articlesPageFile, 'utf8');

  const section = sliceSection(
    source,
    '  async function removeArticle(id) {',
    '  async function retryPublication() {',
  );

  assert.match(section, /\btry\s*\{/, 'removeArticle must handle request failures.');

  assert.match(section, /\bcatch\b/, 'removeArticle must expose transport failures.');

  assert.match(
    section,
    /!result\?\.ok|result\?\.ok\s*===\s*false/,
    'removeArticle must reject structured ok:false API responses.',
  );

  const resultCheckIndex = Math.max(
    section.indexOf('!result?.ok'),
    section.indexOf('result?.ok === false'),
  );

  const listMutationIndex = section.indexOf('setArticles(');

  assert.ok(resultCheckIndex >= 0, 'Deletion result validation is missing.');

  assert.ok(listMutationIndex >= 0, 'Successful deletion must update the local list.');

  assert.ok(
    resultCheckIndex < listMutationIndex,
    'Deletion must be validated before mutating the local article list.',
  );

  assert.match(
    section,
    /setError\(|alert\(/,
    'Deletion failure must be visible to the administrator.',
  );
});

test('category mutation keeps its existing guarded error-handling contract', async () => {
  const source = await fs.readFile(articlesPageFile, 'utf8');

  const section = sliceSection(
    source,
    '  async function changeArticleCategory(id, category) {',
    '  async function removeArticle(id) {',
  );

  assert.match(section, /\btry\s*\{/);
  assert.match(section, /\bcatch\b/);
  assert.match(section, /\bfinally\s*\{/);

  assert.match(section, /result\?\.ok\s*&&\s*result\.article/);
});
