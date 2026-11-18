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

  const loginResponse = page.waitForResponse(
    response =>
      new URL(response.url()).pathname === '/api/admin/login' &&
      response.request().method() === 'POST',
  );
  const sessionResponse = page.waitForResponse(
    response =>
      new URL(response.url()).pathname === '/api/admin/session' &&
      response.request().method() === 'GET',
  );
  await page.locator('button[type="submit"]').click();
  const signedIn = await loginResponse;
  expect(signedIn.status()).toBe(200);
  expect(await signedIn.json()).toMatchObject({ ok: true });
  const session = await sessionResponse;
  expect(session.status()).toBe(200);
  expect(await session.json()).toMatchObject({ ok: true, authenticated: true });
  await expect(page.locator('.admin-login')).toHaveCount(0);
  await expect(page.locator('.admin-sidebar__menu')).toBeVisible();
}

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus) return;
  try {
    const state = await page.evaluate(() => ({
      pathname: window.location.pathname,
      headings: [...document.querySelectorAll('h1')].map(node => node.textContent),
      loginVisible: Boolean(document.querySelector('.admin-login')),
      sectionLoading: document.body.innerText.includes('Загрузка раздела...'),
    }));
    console.error('SMOKE_FAILURE_STATE=' + JSON.stringify(state));
  } catch {
    console.error('SMOKE_FAILURE_STATE=PAGE_UNAVAILABLE');
  }
});

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

  await page.getByRole('link', { name: /^Создать статью/ }).click();
  await expect(page.getByRole('heading', { name: text.newArticle, exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/articles\/new$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: text.newArticle, exact: true })).toBeVisible();
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

for (const scenario of [
  {
    name: 'article list',
    path: '/admin/articles',
    heading: text.articles,
    suggestions: '#admin-blog-category-options option',
  },
  {
    name: 'article editor',
    path: '/admin/articles/new?fresh=1',
    heading: text.newArticle,
    suggestions: '#blog-category-suggestions-create option',
  },
]) {
  test(`article category autocomplete uses dynamic admin categories in the ${scenario.name}`, async ({
    page,
  }) => {
    const pageErrors = collectPageErrors(page);
    const categories = ['Гостиницы', 'Культура', 'Образовательные организации', 'Торговые объекты'];
    await page.route('**/api/admin/article-categories', async route => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, categories }),
      });
    });
    await login(page, scenario.path);
    await expect(page.getByRole('heading', { name: scenario.heading, exact: true })).toBeVisible();
    const options = page.locator(scenario.suggestions);
    await expect(options).toHaveCount(categories.length);
    expect(await options.evaluateAll(nodes => nodes.map(node => node.value))).toEqual(categories);
    expect(pageErrors).toEqual([]);
  });
}
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
  let listRequests = 0;
  await page.route('**/api/admin/blog-publication', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        publication: { status: 'error', error: 'Fixture publication error' },
      }),
    }),
  );
  await page.route('**/api/admin/articles', async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();

      return;
    }

    if (++listRequests > 1) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, articles: [] }),
      });
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

  const listError = page.locator('.admin-empty').filter({ hasText: text.loadError });

  await expect(
    page.getByText(text.loadError, {
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    listError.getByRole('button', {
      name: text.retry,
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByText(text.empty, {
      exact: true,
    }),
  ).toHaveCount(0);

  await expect(page.getByRole('status')).toContainText('Fixture publication error');
  await expect(page.getByRole('status').getByRole('button', { name: text.retry })).toBeVisible();
  await listError.getByRole('button', { name: text.retry, exact: true }).click();
  await expect(listError).toHaveCount(0);
  await expect(page.getByText(text.empty, { exact: true })).toBeVisible();
  expect(listRequests).toBe(2);
  await expect(page.getByRole('status')).toContainText('Fixture publication error');
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

  await notice.evaluate(async element => {
    await Promise.all(element.getAnimations().map(animation => animation.finished));
  });

  const bounds = await notice.boundingBox();

  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(375);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(812);
});

test('article callback replaces the inline quiz and previews without submitting a lead', async ({
  page,
}) => {
  const errors = collectPageErrors(page);
  const leadRequests = [];

  await page.goto('/');

  await page.evaluate(() => {
    sessionStorage.setItem(
      'passport-article-preview',
      JSON.stringify({
        id: 'article-callback-e2e',
        slug: 'article-callback-e2e',
        title: 'Паспорт безопасности тестового объекта',
        status: 'published',
        content:
          '<p>Введение в требования к объекту.</p>' +
          '<h2>Следующий раздел статьи</h2>' +
          '<p>Продолжение материала после предложения помощи.</p>',
      }),
    );
  });

  await page.route('**/api/leads', async route => {
    leadRequests.push(route.request().url());

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: '{"ok":true}',
    });
  });

  const response = await page.goto('/article-preview.html');

  expect(response?.status()).toBe(200);

  const article = page.locator('.article-view__article');
  const callback = article.locator('.article-callback');

  await expect(callback).toBeVisible();

  await expect(
    callback.getByRole('heading', {
      name: 'Не знаете, с чего начать?',
    }),
  ).toBeVisible();

  await expect(article.locator('.object-quiz')).toHaveCount(0);

  await expect(article.locator('.article-view__content').first()).toContainText(
    'Введение в требования',
  );

  await expect(article.locator('.article-view__content').last()).toContainText(
    'Продолжение материала',
  );

  await callback.getByRole('button', { name: 'Помочь разобраться' }).click();

  await callback.getByRole('button', { name: 'Вернуться к описанию' }).click();

  await expect(callback.getByRole('button', { name: 'Помочь разобраться' })).toBeFocused();

  await callback.getByRole('button', { name: 'Помочь разобраться' }).click();

  const form = callback.locator('.article-callback__form');

  await expect(form).toBeVisible();

  await expect(
    form.getByRole('radio', {
      name: 'Нужен ли мне паспорт безопасности?',
    }),
  ).toBeChecked();

  await form.locator('input[name="phone"]').fill('9991234567');
  await form.locator('input[name="consent"]').check();

  await form.getByRole('button', { name: 'Жду звонка специалиста' }).click();

  await expect(form.getByRole('status')).toContainText(
    'Режим предпросмотра: заявка не отправлена.',
  );

  expect(leadRequests).toHaveLength(0);

  await page.setViewportSize({ width: 375, height: 812 });

  const bounds = await callback.boundingBox();

  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(375);

  expect(errors).toEqual([]);
});

test('article callback remains available without safe headings', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/');

  await page.evaluate(() => {
    sessionStorage.setItem(
      'passport-article-preview',
      JSON.stringify({
        id: 'article-without-headings',
        slug: 'article-without-headings',
        title: 'Тестовая статья без подзаголовков',
        status: 'published',
        content: '<p>Текст статьи без заголовков второго уровня.</p>',
      }),
    );
  });

  const response = await page.goto('/article-preview.html');

  expect(response?.status()).toBe(200);

  const article = page.locator('.article-view__article');

  await expect(article.locator('.article-view__content')).toContainText(
    'Текст статьи без заголовков второго уровня.',
  );

  await expect(article.locator('.article-view__content + .article-callback')).toBeVisible();

  await expect(article.locator('.article-callback__title')).toHaveText('Не знаете, с чего начать?');

  expect(errors).toEqual([]);
});

test('blog category hash stays clean and migrates legacy custom hashes', async ({ page }) => {
  const pageErrors = collectPageErrors(page);

  await page.route('**/api/articles', async route => {
    await route.fulfill({
      status: 200,

      contentType: 'application/json',

      body: JSON.stringify({
        ok: true,

        articles: [
          {
            id: 'education-category-test',
            title: 'Паспорт безопасности образовательной организации',
            slug: 'education-category-test',
            image: '',
            imageAlt: '',
            seoDescription: 'Тестовый материал.',
            category: 'Образовательные организации',
            createdAt: '2026-10-12T10:00:00.000Z',
            updatedAt: '2026-10-12T10:00:00.000Z',
            publishedAt: '2026-10-12T10:00:00.000Z',
          },
        ],
      }),
    });
  });

  await page.goto('/');

  await page.evaluate(() => {
    localStorage.setItem('passport-cookie-notice-v1', 'dismissed');
  });

  const blog = await page.goto('/blog/');

  expect(blog?.status()).toBe(200);

  const category = page.getByRole('button', {
    name: /^Образовательные организации\./,
  });

  await expect(category).toBeVisible();

  await expect(category).toHaveAttribute('id', 'blog-category-obrazovatelnye-organizacii');

  await category.click();

  await expect(category).toHaveAttribute('aria-pressed', 'true');

  await expect(page).toHaveURL(/#blog-category-obrazovatelnye-organizacii$/);

  expect(page.url()).not.toContain('%');
  expect(page.url()).not.toContain('custom-');

  await page.reload();

  const reloadedCategory = page.getByRole('button', {
    name: /^Образовательные организации\./,
  });

  await expect(reloadedCategory).toHaveAttribute('aria-pressed', 'true');

  await expect(page).toHaveURL(/#blog-category-obrazovatelnye-organizacii$/);

  // Legacy format #1:
  // custom- + percent-encoded Cyrillic category.

  const legacyEncodedHash =
    '#blog-category-custom-' + encodeURIComponent('образовательные организации');

  await page.goto(`/blog/${legacyEncodedHash}`);

  const legacyEncodedCategory = page.getByRole('button', {
    name: /^Образовательные организации\./,
  });

  await expect(legacyEncodedCategory).toHaveAttribute('aria-pressed', 'true');

  await expect(page).toHaveURL(/#blog-category-obrazovatelnye-organizacii$/);

  expect(page.url()).not.toContain('%');
  expect(page.url()).not.toContain('custom-');

  // Legacy format #2:
  // the temporary readable custom-* format.

  const legacyReadableHash = '#blog-category-custom-obrazovatelnye-organizacii';

  await page.goto(`/blog/${legacyReadableHash}`);

  const legacyReadableCategory = page.getByRole('button', {
    name: /^Образовательные организации\./,
  });

  await expect(legacyReadableCategory).toHaveAttribute('aria-pressed', 'true');

  await expect(page).toHaveURL(/#blog-category-obrazovatelnye-organizacii$/);

  expect(page.url()).not.toContain('custom-');

  expect(pageErrors).toEqual([]);
});
