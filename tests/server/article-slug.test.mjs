import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

async function createTemporaryArticleStorage(articles) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-articles-test-'));

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

    moduleUrl.searchParams.set('test', crypto.randomUUID());

    return await import(moduleUrl.href);
  } finally {
    process.chdir(originalDirectory);
  }
}

function createArticleFixture(overrides = {}) {
  return {
    id: 'article-1',
    title: 'Исходный заголовок',
    content: '<p>Текст статьи</p>',
    image: null,
    imageAlt: '',
    status: 'published',
    category: 'Культура',
    slug: 'original-slug',
    legacySlugs: [],
    seoTitle: 'SEO title',
    seoDescription: 'SEO description',
    ogTitle: '',
    ogDescription: '',
    ogImage: null,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
    publishedAt: '2026-10-01T10:00:00.000Z',
    ...overrides,
  };
}

test('article title update preserves the existing public slug', async () => {
  const storage = await createTemporaryArticleStorage([createArticleFixture()]);

  try {
    const articleModule = await importArticleModuleForDirectory(storage.directory);

    const originalDirectory = process.cwd();

    process.chdir(storage.directory);

    try {
      const updated = await articleModule.updateArticle('article-1', {
        title: 'Полностью новый заголовок статьи',
      });

      assert.equal(updated.title, 'Полностью новый заголовок статьи');
      assert.equal(updated.slug, 'original-slug');
      assert.deepEqual(updated.legacySlugs, []);
    } finally {
      process.chdir(originalDirectory);
    }

    const persisted = JSON.parse(await fs.readFile(storage.articlesFile, 'utf8'));

    assert.equal(persisted[0].title, 'Полностью новый заголовок статьи');
    assert.equal(persisted[0].slug, 'original-slug');
    assert.deepEqual(persisted[0].legacySlugs, []);
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('article slug changes only when updateSlug is explicitly requested', async () => {
  const storage = await createTemporaryArticleStorage([createArticleFixture()]);

  try {
    const articleModule = await importArticleModuleForDirectory(storage.directory);

    const originalDirectory = process.cwd();

    process.chdir(storage.directory);

    try {
      const updated = await articleModule.updateArticle('article-1', {
        title: 'Новый заголовок',
        slug: 'new-public-slug',
        updateSlug: true,
      });

      assert.equal(updated.slug, 'new-public-slug');
      assert.deepEqual(updated.legacySlugs, ['original-slug']);
    } finally {
      process.chdir(originalDirectory);
    }

    const persisted = JSON.parse(await fs.readFile(storage.articlesFile, 'utf8'));

    assert.equal(persisted[0].slug, 'new-public-slug');
    assert.deepEqual(persisted[0].legacySlugs, ['original-slug']);
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('explicit slug update cannot reuse an existing current slug', async () => {
  const storage = await createTemporaryArticleStorage([
    createArticleFixture(),
    createArticleFixture({
      id: 'article-2',
      title: 'Вторая статья',
      slug: 'occupied-slug',
      createdAt: '2026-10-02T10:00:00.000Z',
      updatedAt: '2026-10-02T10:00:00.000Z',
      publishedAt: '2026-10-02T10:00:00.000Z',
    }),
  ]);

  try {
    const articleModule = await importArticleModuleForDirectory(storage.directory);

    const originalDirectory = process.cwd();

    process.chdir(storage.directory);

    try {
      const updated = await articleModule.updateArticle('article-1', {
        slug: 'occupied-slug',
        updateSlug: true,
      });

      assert.equal(updated.slug, 'occupied-slug-2');
      assert.deepEqual(updated.legacySlugs, ['original-slug']);
    } finally {
      process.chdir(originalDirectory);
    }
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('explicit slug update cannot reuse a legacy slug', async () => {
  const storage = await createTemporaryArticleStorage([
    createArticleFixture(),
    createArticleFixture({
      id: 'article-2',
      title: 'Вторая статья',
      slug: 'second-article',
      legacySlugs: ['old-second-slug'],
      createdAt: '2026-10-02T10:00:00.000Z',
      updatedAt: '2026-10-02T10:00:00.000Z',
      publishedAt: '2026-10-02T10:00:00.000Z',
    }),
  ]);

  try {
    const articleModule = await importArticleModuleForDirectory(storage.directory);

    const originalDirectory = process.cwd();

    process.chdir(storage.directory);

    try {
      const updated = await articleModule.updateArticle('article-1', {
        slug: 'old-second-slug',
        updateSlug: true,
      });

      assert.equal(updated.slug, 'old-second-slug-2');
      assert.deepEqual(updated.legacySlugs, ['original-slug']);
    } finally {
      process.chdir(originalDirectory);
    }
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});
