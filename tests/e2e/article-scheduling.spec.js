import { test, expect } from '@playwright/test';

let article;
test.beforeEach(async ({ page }) => {
  const login = await page.request.post('/api/admin/login', {
    data: { password: 'e2e-admin-password' },
  });
  expect(login.ok()).toBeTruthy();
  const response = await page.request.post('/api/admin/articles', {
    data: {
      title: 'Расписание: проверка ' + Date.now(),
      content: '<p>Текст статьи для браузерной проверки.</p>',
      seoTitle: 'Проверка публикации статьи',
      seoDescription: 'Описание статьи для проверки расписания.',
      status: 'scheduled',
      scheduledAt: '2099-05-01T06:00:00.000Z',
    },
  });
  const result = await response.json();
  expect(result.ok).toBeTruthy();
  article = result.article;
});
test.afterEach(async ({ page }) => {
  if (article) await page.request.delete('/api/admin/articles/' + article.id);
});

test('manager displays Moscow time, reschedules, searches, cancels and retains the draft', async ({
  page,
}) => {
  await page.goto('/admin/publications');
  await expect(page.getByRole('heading', { name: 'План публикаций.' })).toBeVisible();
  const row = page.locator('.publication-plan__row').filter({ hasText: article.title });
  await expect(row.locator('time')).toHaveText('09:00');
  await row.getByRole('button', { name: 'Перенести', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Дата и время, Москва').fill('2099-05-02T14:30');
  await dialog.getByRole('button', { name: 'Сохранить время' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(row.locator('time')).toHaveText('14:30');
  const saved = (await (await page.request.get('/api/admin/articles/' + article.id)).json())
    .article;
  expect(saved.publicationSchedule.at).toBe('2099-05-02T11:30:00.000Z');
  await page.getByRole('searchbox').fill('не существует такого материала');
  await expect(page.getByRole('heading', { name: 'Ничего не найдено' })).toBeVisible();
  await page.getByRole('searchbox').fill('');
  await row.getByRole('button', { name: 'Снять с расписания: ' + article.title }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Вернуть в черновики' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(row).toHaveCount(0);
  await page.getByRole('button', { name: 'История', exact: true }).click();
  await expect(row).toContainText('Снято с расписания');
  expect(
    (await (await page.request.get('/api/admin/articles/' + article.id)).json()).article.status,
  ).toBe('draft');
});

test('editor restores the schedule, keeps unsaved changes on validation failure and hides regulations navigation', async ({
  page,
}) => {
  await page.goto('/admin/articles/edit/' + article.id);
  await expect(page.getByRole('radio', { name: /По расписанию/ })).toBeChecked();
  await expect(page.getByLabel('Дата и время, Москва')).toHaveValue('2099-05-01T09:00');
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Нормативные документы' }),
  ).toHaveCount(0);
  await page.getByLabel('Дата и время, Москва').fill('2000-01-01T09:00');
  const alert = page.waitForEvent('dialog').then(async message => {
    expect(message.message()).toContain('Время публикации уже прошло');
    await message.accept();
  });
  await page.getByRole('button', { name: /^Запланировать/ }).click();
  await alert;
  await expect(page).toHaveURL(new RegExp('/admin/articles/edit/' + article.id));
  await expect(page.getByLabel('Заголовок', { exact: true })).toHaveValue(article.title);
});

test('publication manager remains usable at mobile width and daily email status is honest without SMTP', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/admin/publications');
  await expect(
    page.locator('.publication-plan__row').filter({ hasText: article.title }),
  ).toBeVisible();
  const width = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    body: document.documentElement.scrollWidth,
  }));
  expect(width.body).toBeLessThanOrEqual(width.viewport);
  await page.goto('/admin/');
  await expect(page.getByRole('heading', { name: 'Статистика и заявки' })).toBeVisible();
  await expect(page.getByText('mail@pasport-bezopasnosty.ru', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Нужно подключить почтовый сервер');
});
