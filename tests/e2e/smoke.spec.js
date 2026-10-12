import { expect, test } from '@playwright/test';

const adminPassword = 'e2e-admin-password';

const text = {
  adminPanel: '\u0410\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c',

  signIn: '\u0412\u043e\u0439\u0442\u0438',

  invalidPassword:
    '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c.',

  articles: '\u0421\u0442\u0430\u0442\u044c\u0438',

  newArticle: '\u041d\u043e\u0432\u0430\u044f \u0441\u0442\u0430\u0442\u044c\u044f',

  loadError:
    '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u0442\u0430\u0442\u044c\u0438.',

  retry: '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c',

  empty: '\u0421\u0442\u0430\u0442\u0435\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442',
};

function collectPageErrors(page) {
  const errors = [];

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  return errors;
}

async function login(page, path) {
  const response = await page.goto(path);

  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole('heading', {
      name: text.adminPanel,
    }),
  ).toBeVisible();

  await page.locator('input[type="password"]').fill(adminPassword);

  await page.locator('button[type="submit"]').click();
}

test('public home and blog boot in a real browser', async ({ page }) => {
  const pageErrors = collectPageErrors(page);

  const home = await page.goto('/');

  expect(home?.status()).toBe(200);

  await expect(page.locator('#main-content')).toBeVisible();

  const blog = await page.goto('/blog/');

  expect(blog?.status()).toBe(200);

  await expect(page.locator('#main-content')).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test('direct admin articles deep link reaches the authenticated React route', async ({ page }) => {
  await login(page, '/admin/articles');

  await expect(
    page.getByRole('heading', {
      name: text.articles,
      exact: true,
    }),
  ).toBeVisible();

  await expect(page).toHaveURL(/\/admin\/articles$/);
});

test('direct lazy article-create route boots and consumes fresh=1', async ({ page }) => {
  await login(page, '/admin/articles/new?fresh=1');

  await expect(
    page.getByRole('heading', {
      name: text.newArticle,
      exact: true,
    }),
  ).toBeVisible();

  await expect(page).toHaveURL(/\/admin\/articles\/new$/);
});

test('invalid admin login exposes its browser error state', async ({ page }) => {
  const response = await page.goto('/admin/articles');

  expect(response?.status()).toBe(200);

  await page.locator('input[type="password"]').fill('wrong-e2e-password');

  await page.locator('button[type="submit"]').click();

  await expect(page.locator('.admin-form-error')).toHaveText(text.invalidPassword);
});

test('article-list API failure renders retry UI instead of a false empty state', async ({
  page,
}) => {
  await page.route('**/api/admin/articles', async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();

      return;
    }

    await route.fulfill({
      status: 500,

      contentType: 'application/json',

      body: JSON.stringify({
        ok: false,

        error: 'ARTICLES_READ_FAILED',
      }),
    });
  });

  await login(page, '/admin/articles');

  await expect(
    page.getByText(text.loadError, {
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole('button', {
      name: text.retry,
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByText(text.empty, {
      exact: true,
    }),
  ).toHaveCount(0);
});

test('cookie notice persists its dismissal across public pages', async ({ page }) => {
  await page.goto('/');

  const notice = page.getByRole('complementary', {
    name: /cookie/i,
  });

  await expect(notice).toBeVisible();

  await expect(
    notice.getByRole('link', {
      name: /Политика конфиденциальности/,
    }),
  ).toHaveAttribute('href', '/privacy/');

  await notice.getByRole('button', { name: 'Понятно' }).click();

  await expect(notice).toHaveCount(0);

  const saved = await page.evaluate(() => localStorage.getItem('passport-cookie-notice-v1'));

  expect(saved).toBe('dismissed');

  await page.reload();
  await expect(notice).toHaveCount(0);

  await page.goto('/blog/');
  await expect(notice).toHaveCount(0);
});

test('cookie notice fits the mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const notice = page.getByRole('complementary', {
    name: /cookie/i,
  });

  await expect(notice).toBeVisible();

  const bounds = await notice.boundingBox();

  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(375);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(812);
});
