import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

async function createTemporaryStorage(articles = []) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-article-input-test-'));

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

async function importArticleModule(directory) {
  const originalDirectory = process.cwd();

  process.chdir(directory);

  try {
    const moduleUrl = new URL('../../server/articles/admin-articles.mjs', import.meta.url);

    moduleUrl.searchParams.set('article-input-test', crypto.randomUUID());

    return await import(moduleUrl.href);
  } finally {
    process.chdir(originalDirectory);
  }
}

async function runInStorage(storage, action) {
  const originalDirectory = process.cwd();

  process.chdir(storage.directory);

  try {
    const articleModule = await importArticleModule(storage.directory);

    return await action(articleModule);
  } finally {
    process.chdir(originalDirectory);
  }
}

function articleFixture(overrides = {}) {
  return {
    id: 'article-1',
    title: 'Статья',
    content: '<p>Текст</p>',
    image: null,
    imageAlt: '',
    status: 'draft',
    category: '',
    slug: 'article',
    legacySlugs: [],
    seoTitle: '',
    seoDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: null,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
    publishedAt: null,
    ...overrides,
  };
}

async function assertInputRejected(operation) {
  await assert.rejects(operation, error => {
    assert.equal(error?.code, 'ARTICLE_INPUT_INVALID');

    return true;
  });
}

test('create rejects a missing article payload with a typed validation error', async () => {
  const storage = await createTemporaryStorage();

  try {
    await runInStorage(storage, async articleModule => {
      await assertInputRejected(() => articleModule.createArticle(null));
    });
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('create rejects an array payload instead of treating it as article data', async () => {
  const storage = await createTemporaryStorage();

  try {
    await runInStorage(storage, async articleModule => {
      await assertInputRejected(() => articleModule.createArticle([]));
    });
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('create rejects non-string persisted fields instead of writing them to storage', async () => {
  const storage = await createTemporaryStorage();

  try {
    await runInStorage(storage, async articleModule => {
      await assertInputRejected(() =>
        articleModule.createArticle({
          title: {
            unsafe: true,
          },
          status: 'draft',
        }),
      );
    });

    const persisted = JSON.parse(await fs.readFile(storage.articlesFile, 'utf8'));

    assert.deepEqual(persisted, []);
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('create rejects an unsupported article status', async () => {
  const storage = await createTemporaryStorage();

  try {
    await runInStorage(storage, async articleModule => {
      await assertInputRejected(() =>
        articleModule.createArticle({
          title: 'Статья',
          status: 'unexpected',
        }),
      );
    });
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('update rejects a missing article payload with a typed validation error', async () => {
  const storage = await createTemporaryStorage([articleFixture()]);

  try {
    await runInStorage(storage, async articleModule => {
      await assertInputRejected(() => articleModule.updateArticle('article-1', null));
    });
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('update rejects an unsupported status without corrupting storage', async () => {
  const storage = await createTemporaryStorage([articleFixture()]);

  try {
    await runInStorage(storage, async articleModule => {
      await assertInputRejected(() =>
        articleModule.updateArticle('article-1', {
          status: 'banana',
        }),
      );
    });

    const persisted = JSON.parse(await fs.readFile(storage.articlesFile, 'utf8'));

    assert.equal(persisted[0].status, 'draft');
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('update rejects non-string persisted fields', async () => {
  const storage = await createTemporaryStorage([articleFixture()]);

  try {
    await runInStorage(storage, async articleModule => {
      await assertInputRejected(() =>
        articleModule.updateArticle('article-1', {
          imageAlt: ['not', 'a', 'string'],
        }),
      );
    });
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('update rejects non-boolean updateSlug instead of silently ignoring it', async () => {
  const storage = await createTemporaryStorage([articleFixture()]);

  try {
    await runInStorage(storage, async articleModule => {
      await assertInputRejected(() =>
        articleModule.updateArticle('article-1', {
          slug: 'new-slug',
          updateSlug: 'true',
        }),
      );
    });
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});

test('valid create and update payloads remain supported', async () => {
  const storage = await createTemporaryStorage();

  try {
    await runInStorage(storage, async articleModule => {
      const article = await articleModule.createArticle({
        title: 'Новая статья',
        content: '<p>Текст</p>',
        image: null,
        imageAlt: '',
        category: 'Культура',
        status: 'draft',
        slug: 'novaya-statya',
        seoTitle: '',
        seoDescription: '',
      });

      assert.equal(article.title, 'Новая статья');

      assert.equal(article.status, 'draft');

      const updated = await articleModule.updateArticle(article.id, {
        title: 'Обновлённая статья',
        status: 'draft',
        image: '',
        imageAlt: '',
        category: 'Культура',
        seoTitle: '',
        seoDescription: '',
        updateSlug: false,
      });

      assert.equal(updated.title, 'Обновлённая статья');

      assert.equal(updated.status, 'draft');
    });
  } finally {
    await fs.rm(storage.directory, {
      recursive: true,
      force: true,
    });
  }
});
