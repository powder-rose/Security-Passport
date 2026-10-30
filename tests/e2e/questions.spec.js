import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import { test, expect } from '@playwright/test';

import { createQuestionStore } from '../../server/questions/question-store.mjs';
import { registerQuestionRoutes } from '../../server/http/question-routes.mjs';
import { registerFrontendServing } from '../../server/http/frontend-serving.mjs';
import { createAdminAuth } from '../../server/auth/admin-auth.mjs';
import { prerenderQuestions } from '../../scripts/lib/prerender-questions.mjs';
import { createPrerenderDocument } from '../../scripts/lib/prerender-document.mjs';

const project = fileURLToPath(new URL('../../', import.meta.url));
let root;
let origin;
let server;

test.beforeAll(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-questions-browser-'));
  const store = createQuestionStore({
    file: path.join(root, 'questions.json'),
    readArticles: async () => articles,
  });
  const initial = await store.read();
  const articles = initial.records.map(record => ({
    id: record.draft.mainArticleSlug,
    slug: record.draft.mainArticleSlug,
    title:
      record.draft.mainArticleSlug === 'postanovlenie-176-obekty-kultury'
        ? 'Постановление №176 об объектах культуры'
        : 'Форма паспорта безопасности объекта культуры',
    status: 'published',
  }));
  for (const item of initial.records) {
    const record = await store.update(
      item.id,
      { seoReview: 'checked', normativeReview: 'checked', pinned: true },
      { revision: item.revision },
    );
    await store.action(item.id, { action: 'publish', revision: record.revision });
  }
  for (let index = 0; index < 13; index += 1) {
    const record = await store.create({
      ...initial.records[0].draft,
      slug: `fixture-${index}`,
      title: `Дополнительный вопрос ${index}`,
      seoTitle: `Дополнительный заголовок ${index}`,
      content: '<h2>Порядок действий</h2><p>Проверьте сведения об объекте.</p>',
      category: index === 12 ? 'Объекты культуры' : 'Общие вопросы',
      seoReview: 'checked',
      normativeReview: 'checked',
    });
    await store.action(record.id, { action: 'publish', revision: record.revision });
  }
  const { render } = await import('../../dist/server/entry-server.js');
  const template = await fs.readFile(path.join(project, 'dist/template/index.html'), 'utf8');
  const manifest = JSON.parse(
    await fs.readFile(path.join(project, 'dist/client/.vite/manifest.json'), 'utf8'),
  );
  const css = source => {
    const files = new Set();
    const visited = new Set();
    const visit = key => {
      if (visited.has(key)) return;
      visited.add(key);
      for (const file of manifest[key]?.css || []) files.add(file);
      for (const dependency of manifest[key]?.imports || []) visit(dependency);
    };
    visit(source);
    return [...files].map(file => `<link rel="stylesheet" href="/${file}">`).join('');
  };
  async function rebuild() {
    await prerenderQuestions({
      store,
      render,
      clientDir: root,
      canonical: 'https://pasport-bezopasnosty.ru',
      articles,
      createDocument: (result, data, source, bootstrapKey) =>
        createPrerenderDocument({ template, result, data, cssTags: css(source), bootstrapKey }),
    });
    return { status: 'success' };
  }
  await rebuild();
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  const auth = createAdminAuth({
    password: 'questions-e2e-password',
    secret: 'questions-e2e-secret',
    isProduction: false,
  });
  app.post('/api/admin/login', auth.login);
  app.post('/api/admin/logout', auth.logout);
  app.get('/api/admin/session', auth.requireAdmin, auth.session);
  app.get('/api/admin/blog-publication', auth.requireAdmin, (_req, res) =>
    res.json({ ok: true, publication: { status: 'idle' } }),
  );
  registerQuestionRoutes({
    app,
    store,
    adminAuth: auth,
    clientDir: root,
    readArticles: async () => articles,
    publish: rebuild,
  });
  registerFrontendServing({
    app,
    clientDir: path.join(project, 'dist/client'),
    isProduction: false,
  });
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

test.afterAll(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (root) await fs.rm(root, { recursive: true, force: true });
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('passport-cookie-notice-v1', 'dismissed'));
  await page.route('**/*', route =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort(),
  );
});

test('questions catalog searches the full answer, filters categories and paginates twelve at a time', async ({
  page,
}) => {
  await page.goto(origin + '/questions/');
  await expect(page.locator('.question-card')).toHaveCount(12);
  await page.getByRole('searchbox').fill('10 рабочих');
  await expect(page.locator('.question-card')).toHaveCount(1);
  await expect(page.locator('.question-card h3')).toContainText('не согласован');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
  await expect(page.locator('.question-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'Объекты культуры', exact: true }).click();
  await expect(page.locator('.question-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Все вопросы', exact: true }).click();
  await expect(page.locator('.question-card')).toHaveCount(12);
  await page
    .getByRole('navigation', { name: 'Страницы вопросов' })
    .getByRole('button', { name: '2', exact: true })
    .click();
  await expect(page.locator('.question-card')).toHaveCount(3);
});

test('question HTML contains its answer, unique metadata, breadcrumbs and chosen links before JavaScript', async ({
  page,
  request,
}) => {
  const url = origin + '/questions/pasport-bezopasnosti-arendovannogo-pomeshcheniya/';
  const response = await request.get(url);
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('Кто должен оформлять паспорт безопасности');
  expect(Buffer.byteLength(body)).toBeLessThan(2_000_000);
  await page.goto(url);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://pasport-bezopasnosty.ru/questions/pasport-bezopasnosti-arendovannogo-pomeshcheniya/',
  );
  await expect(page.locator('.question-short')).toContainText('арендатор');
  await expect(page.locator('.question-article-links a')).toHaveAttribute(
    'href',
    '/blog/postanovlenie-176-obekty-kultury/',
  );
  await expect(page.locator('.question-service > a')).toHaveAttribute(
    'href',
    '/pasport-bezopasnosti-obekta-kultury/',
  );
});

test('question pages fit mobile and desktop widths and keep the mobile navigation usable', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/questions/',
      '/questions/pasport-bezopasnosti-arendovannogo-pomeshcheniya/',
    ]) {
      await page.goto(origin + route);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
  await expect(
    page.locator('#site-navigation').getByRole('link', { name: 'Вопрос — ответ', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Открыть меню', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('the CMS autosaves a private draft, previews it with authentication and publishes it through the editor', async ({
  page,
}) => {
  await page
    .context()
    .request.post(origin + '/api/admin/login', { data: { password: 'questions-e2e-password' } });
  await page.goto(origin + '/admin/questions/new');
  await page
    .getByLabel('Заголовок вопроса · H1', { exact: true })
    .fill('Тестовый вопрос редактора');
  await page
    .getByLabel('Краткий ответ', { exact: true })
    .fill('Краткий ответ для проверки редактора.');
  await page.locator('.tiptap').fill('Основной текст для проверки редактора.');
  await expect(
    page.getByRole('status').filter({ hasText: 'Черновик сохранён автоматически' }),
  ).toBeVisible();
  const id = page.url().split('/').at(-1);
  expect(
    (await page.context().request.get(origin + '/questions/testovyy-vopros-redaktora/')).status(),
  ).toBe(404);
  await page.getByLabel('Заголовок вопроса · H1', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Опубликовать', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Заполните заголовок вопроса.');
  await page
    .getByLabel('Заголовок вопроса · H1', { exact: true })
    .fill('Тестовый вопрос редактора');
  await page.getByRole('tab', { name: 'SEO', exact: true }).click();
  await page.getByLabel('SEO Title', { exact: true }).fill('Уникальный SEO заголовок редактора');
  await page
    .getByLabel('SEO Description', { exact: true })
    .fill('Уникальное описание ответа для проверки CMS.');
  await page
    .getByLabel('Пересечения с блогом и другими вопросами проверены по фактическим данным поиска')
    .check();
  await page.getByLabel('Нормативная проверка материала выполнена').check();
  await page.getByRole('tab', { name: 'Связи', exact: true }).click();
  await page
    .getByLabel('Основная статья блога · обязательна для публикации')
    .selectOption('postanovlenie-176-obekty-kultury');
  // Changing a source resets the reviews, so confirm them after the last content change.
  await page.getByRole('tab', { name: 'SEO', exact: true }).click();
  await page
    .getByLabel('Пересечения с блогом и другими вопросами проверены по фактическим данным поиска')
    .check();
  await page.getByLabel('Нормативная проверка материала выполнена').check();
  await page.getByRole('button', { name: /^Сохранить черновик/ }).click();
  await expect(page.getByRole('button', { name: 'Предпросмотр ↗', exact: true })).toBeEnabled();
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Предпросмотр ↗', exact: true }).click();
  const popup = await popupPromise;
  await expect(popup.locator('h1')).toHaveText('Тестовый вопрос редактора');
  await expect(popup.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await popup.close();
  await page.getByRole('button', { name: 'Опубликовать', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Публикация поставлена в очередь' }),
  ).toBeVisible();
  const data = await (
    await page.context().request.get(origin + `/api/admin/questions/${id}`)
  ).json();
  expect(data.record.live.title).toBe('Тестовый вопрос редактора');
  expect(
    (await page.context().request.get(origin + '/questions/testovyy-vopros-redaktora/')).status(),
  ).toBe(200);
});
