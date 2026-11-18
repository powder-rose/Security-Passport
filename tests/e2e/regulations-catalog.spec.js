import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import { expect, test } from '@playwright/test';

import { createCatalogStore } from '../../server/catalog/catalog-store.mjs';
import { registerCatalogRoutes } from '../../server/http/catalog-routes.mjs';
import { registerFrontendServing } from '../../server/http/frontend-serving.mjs';
import { createAdminAuth } from '../../server/auth/admin-auth.mjs';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
let origin;
let server;
let root;
let file;

test.beforeAll(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-catalog-browser-'));
  file = path.join(root, 'directions.json');
  const clientDir = path.join(projectRoot, 'dist/client');
  const store = createCatalogStore({ file });
  const app = express();
  app.use(express.json());
  const auth = createAdminAuth({
    password: 'catalog-e2e-password',
    secret: 'catalog-e2e-secret',
    isProduction: false,
  });
  app.post('/api/admin/login', auth.login);
  app.get('/api/admin/session', auth.requireAdmin, auth.session);
  app.post('/api/admin/logout', auth.logout);
  registerCatalogRoutes({ app, adminAuth: auth, clientDir, store });
  registerFrontendServing({ app, clientDir, isProduction: false });
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.beforeEach(async ({ page }) => {
  await fs.rm(file, { force: true });
  await page.addInitScript(() => localStorage.setItem('passport-cookie-notice-v1', 'dismissed'));
});
test.afterAll(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (root) await fs.rm(root, { recursive: true, force: true });
});

test('catalog SSR includes metadata and fourteen distinct links without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto(origin + '/postanovleniya/');
  expect(response.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText(
    'Паспорта безопасности объектов по постановлениям Правительства РФ',
  );
  await expect(page).toHaveTitle(
    'Паспорта безопасности по постановлениям Правительства РФ | БОЙКОВГРУПП',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://pasport-bezopasnosty.ru/postanovleniya/',
  );
  const cards = page.locator('.regulations-catalog-card');
  await expect(cards).toHaveCount(14);
  const hrefs = await cards.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  expect(new Set(hrefs).size).toBe(14);
  for (const href of hrefs) expect((await context.request.get(origin + href)).status()).toBe(200);
  await expect(page.locator('.faq-item')).toHaveCount(10);
  await context.close();
});

test('catalog fits five viewports and reuses the FAQ and contact form', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + '/postanovleniya/');
  for (const width of [320, 375, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    const columns = await page
      .locator('.regulations-catalog-grid')
      .evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width <= 760 ? 1 : 2);
    const titleOverflow = await page.locator('.final-cta h2').evaluate(node => {
      const range = document.createRange();
      range.selectNodeContents(node);
      return range.getBoundingClientRect().right - node.parentElement.getBoundingClientRect().right;
    });
    expect(titleOverflow).toBeLessThanOrEqual(1);
  }
  const question = page.locator('.faq-item__button').nth(1);
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: 'Не знаете, какое постановление подходит?' }).click();
  await expect(page.locator('#contact')).toBeInViewport();
  await expect(page.locator('form#lead-form')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('desktop and mobile menus retain the original links and add the catalog row', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + '/postanovleniya/');
  await page.getByRole('button', { name: 'Все разделы' }).click();
  const desktop = page.locator('#site-directory');
  await expect(desktop.getByRole('link', { name: 'Смотреть все постановления' })).toBeVisible();
  expect(
    await desktop
      .locator('.site-directory__links--objects')
      .evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length),
  ).toBe(2);
  await expect(
    desktop.getByRole('link', { name: 'Акт обследования и категорирования объекта', exact: false }),
  ).toBeVisible();
  await expect(desktop.locator('.site-directory__links--objects a')).toHaveCount(15);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 375, height: 900 });
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  const mobile = page.locator('#site-navigation');
  const link = mobile.getByRole('link', { name: 'Смотреть все постановления' });
  await link.scrollIntoViewIfNeeded();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/postanovleniya/');
  await expect(mobile.locator('.site-directory__links--objects a')).toHaveCount(15);
  await link.click();
  await expect(page.getByRole('button', { name: 'Открыть меню' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('CMS changes order, card and menu visibility and page text without a rebuild', async ({
  page,
}) => {
  await page.goto(origin + '/admin/directions');
  await page.getByLabel('Пароль').fill('catalog-e2e-password');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(
    page.getByRole('heading', { name: 'Каталог постановлений', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: /Образовательные организации/ }).click();
  await page.getByLabel('Название', { exact: true }).fill('Проверенная карточка образования');
  await page.getByLabel('Порядок в каталоге').fill('0');
  await page.getByLabel('Показывать в основном меню').uncheck();
  await page.getByText('Тексты страницы и SEO', { exact: true }).click();
  await page.getByLabel('Заголовок страницы · H1').fill('Каталог для проверки CMS');
  await page.getByRole('button', { name: 'Сохранить каталог' }).click();
  await expect(page.getByRole('status')).toContainText('Сохранено');
  const response = await page.request.get(origin + '/postanovleniya/');
  const html = await response.text();
  expect(html).toContain('Каталог для проверки CMS');
  await page.goto(origin + '/postanovleniya/');
  await expect(page.locator('h1')).toHaveText('Каталог для проверки CMS');
  await expect(page.locator('.regulations-catalog-card').first()).toContainText(
    'Проверенная карточка образования',
  );
  const menu = await (await page.request.get(origin + '/api/directions/menu')).json();
  expect(menu.menuItems.some(item => item.path.includes('obrazovatelnoj'))).toBe(false);
});

test('CMS can add a card and rejects duplicate links without losing edits', async ({ page }) => {
  await page.request.post(origin + '/api/admin/login', {
    data: { password: 'catalog-e2e-password' },
  });
  await page.goto(origin + '/admin/directions');
  await page.getByRole('button', { name: 'Добавить', exact: true }).click();
  await page.getByLabel('Название', { exact: true }).fill('Новое направление');
  await page.getByLabel('Номер ПП', { exact: true }).fill('ПП РФ № 447');
  await page.getByLabel('Краткое описание').fill('Описание нового направления.');
  await page.getByLabel('URL коммерческой страницы').fill('/pasport-bezopasnosti-gostinicy/');
  await page.getByRole('button', { name: 'Сохранить каталог' }).click();
  await expect(page.getByRole('alert')).toContainText('Адрес уже есть');
  await expect(page.getByLabel('Название', { exact: true })).toHaveValue('Новое направление');
  // Replace an existing record: no duplicate URL can enter the saved catalog.
  await page.getByRole('button', { name: /Гостиницы и средства размещения/ }).click();
  await page.getByRole('button', { name: 'Удалить карточку', exact: true }).click();
  await page.getByRole('button', { name: /Новое направление/ }).click();
  await page.getByLabel('Показывать в каталоге').check();
  await expect(page.getByLabel('Показывать в основном меню')).not.toBeChecked();
  await page.getByRole('button', { name: 'Сохранить каталог' }).click();
  await expect(page.getByRole('status')).toContainText('Сохранено');
  await page.goto(origin + '/postanovleniya/');
  await expect(
    page.locator('.regulations-catalog-card').filter({ hasText: 'Новое направление' }),
  ).toHaveCount(1);
});

test('development handles an unavailable API without sample cards and supports retry', async ({
  page,
}) => {
  const template = await fs.readFile(path.join(projectRoot, 'dist/template/index.html'), 'utf8');
  await page.route('**/postanovleniya/', route =>
    route.fulfill({ contentType: 'text/html', body: template }),
  );
  let unavailable = true;
  await page.route('**/api/directions', route =>
    unavailable ? route.fulfill({ status: 503, json: { ok: false } }) : route.continue(),
  );
  await page.goto(origin + '/postanovleniya/');
  await expect(page.getByRole('alert')).toContainText('Список направлений временно недоступен');
  await expect(page.locator('.regulations-catalog-card')).toHaveCount(0);
  unavailable = false;
  await page.getByRole('button', { name: 'Повторить загрузку' }).click();
  await expect(page.locator('.regulations-catalog-card')).toHaveCount(14);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('the shared form submits the catalog source to the existing leads endpoint', async ({
  page,
}) => {
  let body;
  await page.route('**/api/leads', async route => {
    body = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto(origin + '/postanovleniya/');
  const form = page.locator('#lead-form');
  await expect(form.getByRole('button', { name: 'Обсудить объект' })).toBeVisible();
  await form.locator('input[name="name"]').fill('Проверка формы');
  await form.locator('input[name="phone"]').fill('9991234567');
  await form.locator('input[type="checkbox"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#final-cta-status')).toContainText('Заявка отправлена');
  expect(body.source).toBe('Каталог постановлений');
});
