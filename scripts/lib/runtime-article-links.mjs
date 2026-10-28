import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const publicOrigin = 'https://pasport-bezopasnosty.ru';
const articlePathPattern = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([^\s=<>/]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(match => [
      match[1].toLowerCase(),
      match[3].replace(/&amp;/g, '&'),
    ]),
  );
}

function hasClass(tag, name) {
  return (attributes(tag).class || '').split(/\s+/).includes(name);
}

function validateArticle(html, url) {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0]));
  const canonicals = links.filter(link => link.rel === 'canonical');
  assert.equal(canonicals.length, 1, 'Expected one article canonical');
  assert.equal(canonicals[0].href, url, 'Public article canonical mismatch');

  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  assert.ok(main && hasClass(main[0].split('>')[0], 'article-view'), 'Response is not an article');
  assert.ok(
    [...main[1].matchAll(/<div\b[^>]*>/gi)].some(match =>
      hasClass(match[0], 'article-view__content'),
    ),
    'Public article content is missing',
  );
  const headings = [...main[1].matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  assert.equal(headings.length, 1, 'Expected one article H1');
  assert.ok(headings[0][1].replace(/<[^>]*>/g, '').trim(), 'Public article H1 is empty');

  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
  assert.ok(
    meta
      .filter(item => /^(robots|googlebot|yandex)$/i.test(item.name || ''))
      .every(item => !/\b(noindex|none)\b/i.test(item.content || '')),
    'Public article must not be noindex',
  );

  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]));
}

export function createRuntimeArticleResolver({
  projectRoot,
  origin,
  fetchImpl = globalThis.fetch,
}) {
  let publishedArticles;
  const requests = new Map();

  async function hasPublishedArticles() {
    if (!publishedArticles) {
      publishedArticles = readFile(path.join(projectRoot, 'data', 'articles.json'), 'utf8')
        .then(source => {
          const articles = JSON.parse(source);
          assert.ok(Array.isArray(articles), 'data/articles.json must contain an array');
          return articles.some(article => article?.status === 'published' && article?.slug);
        })
        .catch(error => {
          if (error?.code === 'ENOENT') return false;
          throw error;
        });
    }
    return publishedArticles;
  }

  async function requestArticle(url) {
    const response = await fetchImpl(url, {
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
      headers: { Accept: 'text/html', 'Cache-Control': 'no-cache' },
    });
    assert.equal(response.status, 200, `Public article returned HTTP ${response.status}`);
    assert.equal(response.url, url, 'Public article URL mismatch');
    assert.match(response.headers.get('content-type') || '', /^text\/html(?:;|$)/i);
    assert.ok(!/\b(noindex|none)\b/i.test(response.headers.get('x-robots-tag') || ''));
    const ids = validateArticle(await response.text(), url);
    return { url, ids };
  }

  return async pathname => {
    if (origin !== publicOrigin || !articlePathPattern.test(pathname)) return null;
    // A populated runtime dataset must have its own prerendered article files.
    if (await hasPublishedArticles()) return null;
    const url = `${publicOrigin}${pathname}`;
    if (!requests.has(url)) requests.set(url, requestArticle(url));
    return requests.get(url);
  };
}
