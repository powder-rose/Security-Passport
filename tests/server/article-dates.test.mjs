import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

async function createTemporaryArticleStorage(articles = []) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-article-dates-test-'));

  const dataDirectory = path.join(directory, 'data');

  const articlesFile = path.join(dataDirectory, 'articles.json');

  await fs.mkdir(dataDirectory, {
    recursive: true,
  });

  await fs.writeFile(articlesFile, `${JSON.stringify(articles, null, 2)}\n`, 'utf8');

  return {
    directory,
    articlesFile,
  };
}

async function importArticleModuleForDirectory(directory) {
  const originalDirectory = process.cwd();

  process.chdir(directory);

  try {
    const moduleUrl = new URL('../../server/articles/admin-articles.mjs', import.meta.url);

    moduleUrl.searchParams.set('article-dates-test', crypto.randomUUID());

    return await import(moduleUrl.href);
  } finally {
    process.chdir(originalDirectory);
  }
}

async function runInStorage(storage, action) {
  const originalDirectory = process.cwd();

  process.chdir(storage.directory);

  try {
    const articleModule = await importArticleModuleForDirectory(storage.directory);

    return await action(articleModule);
  } finally {
    process.chdir(originalDirectory);
  }
}

function assertValidIsoDate(value) {
  assert.equal(typeof value, 'string');

  const time = Date.parse(value);

  assert.equal(Number.isNaN(time), false, `Expected valid ISO date, received ${value}`);

  return time;
}

function delay(ms = 10) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

test('draft articles keep publishedAt empty until first publication', async () => {
  const storage = await createTemporaryArticleStorage();

  try {
    const before = Date.now();

    const article = await runInStorage(storage, articleModule =>
      articleModule.createArticle({
        title: 'Черновик',
        status: 'draft',
      }),
    );

    const after = Date.now();

    const createdAt = assertValidIsoDate(article.createdAt);

    const updatedAt = assertValidIsoDate(article.updatedAt);

    assert.equal(article.publishedAt, null);

    assert.equal(article.createdAt, article.updatedAt);

    assert.ok(createdAt >= before && createdAt <= after);

    assert.equal(updatedAt, createdAt);
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('first publication sets publishedAt once and never in the future', async () => {
  const storage = await createTemporaryArticleStorage();

  try {
    const draft = await runInStorage(storage, articleModule =>
      articleModule.createArticle({
        title: 'Первая публикация',
        status: 'draft',
      }),
    );

    const beforePublish = Date.now();

    const published = await runInStorage(storage, articleModule =>
      articleModule.updateArticle(draft.id, {
        status: 'published',
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
      }),
    );

    const afterPublish = Date.now();

    const publishedAt = assertValidIsoDate(published.publishedAt);

    assert.ok(
      publishedAt >= beforePublish && publishedAt <= afterPublish,
      'publishedAt must describe the actual first publication moment',
    );

    assert.ok(publishedAt <= Date.now(), 'publishedAt must never be in the future');
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('normal article edits preserve publishedAt and advance updatedAt', async () => {
  const storage = await createTemporaryArticleStorage();

  try {
    const published = await runInStorage(storage, articleModule =>
      articleModule.createArticle({
        title: 'Опубликованная статья',
        status: 'published',
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
      }),
    );

    const originalPublishedAt = published.publishedAt;

    const originalUpdatedAt = published.updatedAt;

    await delay();

    const updated = await runInStorage(storage, articleModule =>
      articleModule.updateArticle(published.id, {
        title: 'Изменённый заголовок',
      }),
    );

    assert.equal(
      updated.publishedAt,
      originalPublishedAt,
      'Ordinary edits must not rewrite the first publication date',
    );

    assert.ok(
      Date.parse(updated.updatedAt) > Date.parse(originalUpdatedAt),
      'updatedAt must advance after a real edit',
    );
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('unpublish and republish preserve the first publishedAt', async () => {
  const storage = await createTemporaryArticleStorage();

  try {
    const article = await runInStorage(storage, articleModule =>
      articleModule.createArticle({
        title: 'Повторная публикация',
        status: 'published',
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
      }),
    );

    const firstPublishedAt = article.publishedAt;

    await delay();

    const draft = await runInStorage(storage, articleModule =>
      articleModule.updateArticle(article.id, {
        status: 'draft',
      }),
    );

    assert.equal(draft.publishedAt, firstPublishedAt);

    await delay();

    const republished = await runInStorage(storage, articleModule =>
      articleModule.updateArticle(article.id, {
        status: 'published',
      }),
    );

    assert.equal(
      republished.publishedAt,
      firstPublishedAt,
      'Republishing must not create a new publication date',
    );
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('client-supplied publishedAt cannot rewrite the first publication date', async () => {
  const storage = await createTemporaryArticleStorage();

  try {
    const article = await runInStorage(storage, articleModule =>
      articleModule.createArticle({
        title: 'Immutable publishedAt',
        status: 'published',
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
      }),
    );

    const firstPublishedAt = article.publishedAt;

    const updated = await runInStorage(storage, articleModule =>
      articleModule.updateArticle(article.id, {
        title: 'Попытка подмены',
        publishedAt: '2099-12-31T23:59:59.999Z',
      }),
    );

    assert.equal(
      updated.publishedAt,
      firstPublishedAt,
      'publishedAt must be server-owned and immutable after first publication',
    );

    assert.ok(Date.parse(updated.publishedAt) <= Date.now());
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('direct publication ignores client-supplied publishedAt and never stores a future date', async () => {
  const storage = await createTemporaryArticleStorage();

  try {
    const before = Date.now();

    const article = await runInStorage(storage, articleModule =>
      articleModule.createArticle({
        title: 'Прямая публикация',
        status: 'published',
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
        publishedAt: '2099-12-31T23:59:59.999Z',
      }),
    );

    const after = Date.now();

    const publishedAt = assertValidIsoDate(article.publishedAt);

    assert.ok(
      publishedAt >= before && publishedAt <= after,
      'Server must own the first publication timestamp',
    );

    assert.notEqual(article.publishedAt, '2099-12-31T23:59:59.999Z');

    assert.ok(
      publishedAt <= Date.now(),
      'Direct publication must never persist a future publishedAt',
    );

    const persisted = JSON.parse(await fs.readFile(storage.articlesFile, 'utf8'));

    assert.equal(persisted[0].publishedAt, article.publishedAt);
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});
test('legacy article-year mutation is removed from the storage module', async () => {
  const source = await fs.readFile(
    new URL('../../server/articles/admin-articles.mjs', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(source, /updatePublishedArticlesYear/);
});

test('legacy update-year HTTP route is removed', async () => {
  const source = await fs.readFile(
    new URL('../../server/http/article-routes.mjs', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(source, /\/api\/admin\/articles\/update-year/);

  assert.doesNotMatch(source, /updatePublishedArticlesYear/);
});

test('legacy update-year admin API client is removed', async () => {
  const source = await fs.readFile(
    new URL('../../src/admin/api/adminApi.js', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(source, /updateArticlesYear/);

  assert.doesNotMatch(source, /\/articles\/update-year/);
});

test('legacy update-year admin UI is removed', async () => {
  const source = await fs.readFile(
    new URL('../../src/admin/pages/ArticlesPage/ArticlesPage.jsx', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(source, /updateArticlesYear/);

  assert.doesNotMatch(source, /admin-year-button/);

  assert.doesNotMatch(source, /Обновить год/);
});
