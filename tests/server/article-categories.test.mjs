import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  mergeArticleCategoryOptions,
  normalizeArticleCategory,
} from '../../src/admin/features/articles/model/articleCategoryOptions.js';

async function withArticleModule(articles, action) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-article-categories-'));

  const dataDirectory = path.join(directory, 'data');

  await fs.mkdir(dataDirectory, {
    recursive: true,
  });

  await fs.writeFile(
    path.join(dataDirectory, 'articles.json'),
    `${JSON.stringify(articles, null, 2)}\n`,
    'utf8',
  );

  const originalDirectory = process.cwd();

  try {
    process.chdir(directory);

    const moduleUrl = new URL('../../server/articles/admin-articles.mjs', import.meta.url);

    moduleUrl.searchParams.set('article-categories-test', crypto.randomUUID());

    const articleModule = await import(moduleUrl.href);

    return await action(articleModule);
  } finally {
    process.chdir(originalDirectory);

    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
}

test('shared article category options normalize, deduplicate and preserve defaults', () => {
  assert.equal(normalizeArticleCategory('  Торговые   объекты  '), 'Торговые объекты');

  assert.equal(normalizeArticleCategory('practice'), '');

  assert.deepEqual(
    mergeArticleCategoryOptions([
      'Культура',
      '  Образовательные   организации  ',
      'образовательные организации',
      'Торговые объекты',
      'practice',
      'гостиницы',
    ]),
    ['Гостиницы', 'Культура', 'Образовательные организации', 'Торговые объекты'],
  );
});

test('article category endpoint source combines defaults with persisted categories', async () => {
  await withArticleModule(
    [
      {
        id: 'culture',
        category: 'Культура',
      },
      {
        id: 'education',
        category: '  Образовательные   организации  ',
      },
      {
        id: 'education-duplicate',
        category: 'образовательные организации',
      },
      {
        id: 'trade',
        category: 'Торговые объекты',
      },
      {
        id: 'legacy',
        category: 'practice',
      },
      {
        id: 'hotel',
        category: 'Гостиницы',
      },
    ],
    async articleModule => {
      const categories = await articleModule.getArticleCategories();

      assert.deepEqual(categories, [
        'Гостиницы',
        'Культура',
        'Образовательные организации',
        'Торговые объекты',
      ]);
    },
  );
});

test('newly saved article category becomes available as an autocomplete option', async () => {
  await withArticleModule([], async articleModule => {
    await articleModule.createArticle({
      title: 'Паспорт безопасности спортивного объекта',
      category: '  Спорт  ',
      status: 'draft',
    });

    const categories = await articleModule.getArticleCategories();

    assert.deepEqual(categories, ['Гостиницы', 'Культура', 'Спорт']);
  });
});
