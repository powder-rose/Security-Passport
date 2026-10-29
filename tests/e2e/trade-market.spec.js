import { expect, test } from '@playwright/test';

const approved = {
  title: 'Паспорт безопасности розничного рынка по ПП РФ № 255',
  paragraphs: [
    'Розничные рынки, организованные в соответствии с Федеральным законом № 271-ФЗ, имеют отдельные требования к оформлению паспорта безопасности, установленные постановлением Правительства РФ от 28 апреля 2007 года № 255.',
    'В отличие от ПП РФ № 1273, постановление № 255 не предусматривает самостоятельную процедуру категорирования рынка с присвоением категории и оформлением акта обследования и категорирования.',
    'Паспорт безопасности розничного рынка составляется по установленным требованиям к содержанию и оформлению, согласовывается с органами внутренних дел и государственного пожарного надзора МЧС России, после чего утверждается управляющей рынком компанией.',
  ],
  note: 'Важно: паспорт безопасности розничного рынка по ПП № 255 и паспорт безопасности торгового объекта по ПП № 1273 — разные документы. Применимый порядок определяется с учётом правового статуса конкретного объекта.',
  question: 'Нужен ли паспорт безопасности розничному рынку по ПП РФ № 1273?',
  answers: [
    'Розничные рынки, организованные по Федеральному закону № 271-ФЗ, оформляют паспорт безопасности в соответствии с ПП РФ № 255. Для них установлены специальные требования к содержанию, согласованию и оформлению документа.',
    'ПП РФ № 1273 предусматривает отдельный порядок для торговых объектов, на которые распространяются соответствующие требования. При определении применимого постановления необходимо учитывать правовой статус конкретного объекта.',
  ],
  marketAnchor: 'Паспорт безопасности розничного рынка по ПП РФ № 255',
  tradeAnchor: 'Паспорт безопасности торгового объекта по ПП РФ № 1273',
  cardTitle: 'Торговые площадки и территории',
};

const tradePath = '/pasport-bezopasnosti-torgovogo-obekta/';
const marketPath = '/pasport-bezopasnosti-roznichnogo-rynka/';
const origin = 'https://pasport-bezopasnosty.ru';
const tradeTitle =
  'Паспорт безопасности торгового объекта по ПП РФ №1273 — от 9 500 ₽ | БОЙКОВГРУПП';
const tradeH1 = 'Паспорт безопасности торгового объекта — разработка и согласование';

async function dismissCookies(page) {
  const button = page.getByRole('button', { name: 'Понятно', exact: true });
  if (await button.isVisible()) await button.click();
}

async function openTrade(page) {
  const response = await page.goto(tradePath);
  expect(response.status()).toBe(200);
  await dismissCookies(page);
}

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page, baseURL }) => {
  const local = new URL(baseURL);
  expect(local.protocol).toBe('http:');
  expect(['127.0.0.1', 'localhost', '[::1]']).toContain(local.hostname);
  await page.route(
    url => /^https?:$/.test(url.protocol) && url.origin !== local.origin,
    route => route.abort('blockedbyclient'),
  );
});

test.describe('trade and retail-market clarification without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('renders the approved block and one additional FAQ without altering the hero', async ({
    page,
  }) => {
    await openTrade(page);
    await expect(page).toHaveTitle(tradeTitle);
    await expect(page.locator('h1')).toHaveText(tradeH1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}${tradePath}`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index,follow/);
    await expect(page.locator('.trade-object h3')).toHaveText([
      'Магазины',
      'Супермаркеты',
      'Гипермаркеты',
      'Торговые центры',
      'Торговые комплексы',
      approved.cardTitle,
      'Автосалоны и иные объекты торговли',
    ]);
    await expect(page.locator('.trade-object__number')).toHaveText([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
    ]);
    await expect(page.locator('.trade-objects__notice')).toContainText(
      'Применимость ПП РФ №1273 определяется не названием бизнеса само по себе',
    );
    const block = page.locator('#retail-markets');
    await expect(
      page.locator('.trade-applicability + #retail-markets + .trade-regulation'),
    ).toHaveCount(1);
    await expect(block.locator('h2')).toHaveText(approved.title);
    await expect(block.locator('h3, table, form, button, img')).toHaveCount(0);
    await expect(block.locator('.trade-market__copy > p')).toHaveText([
      ...approved.paragraphs,
      approved.note,
    ]);
    await expect(block.locator('strong')).toHaveText('Важно');
    const link = block.locator('a');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAccessibleName(approved.marketAnchor);
    await expect(link).toHaveAttribute('href', marketPath);
    await expect(link).not.toHaveAttribute('target');
    await expect(link).not.toHaveAttribute('rel', /nofollow/);
    await expect(page.locator(`main.trade-page a[href="${marketPath}"]`)).toHaveCount(1);
    await expect(page.locator('.trade-faq__item')).toHaveCount(16);
    const item = page.locator('.trade-faq__item').last();
    await expect(item.locator('.trade-faq__question')).toHaveText(approved.question);
    await item.locator('summary').focus();
    await item.locator('summary').press('Enter');
    await expect(item).toHaveAttribute('open', '');
    await expect(item.locator('.trade-faq__answer p')).toHaveText(approved.answers);
    await item.locator('summary').press('Space');
    await expect(item).not.toHaveAttribute('open');
    await expect(page.locator('.trade-hero__price strong')).toHaveText('от 9 500 ₽');
    await expect(page.locator('#lead-form')).toHaveCount(1);
  });
});

test('trade and market links retain their approved anchors and work in both directions', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openTrade(page);
  await page.locator('#retail-markets a').click();
  await expect(page).toHaveURL(url => url.pathname === marketPath);
  await expect(page.locator('main.market-page')).toBeVisible();
  const backlink = page.locator(`#comparison a[href="${tradePath}"]`);
  await expect(backlink).toHaveAccessibleName(approved.tradeAnchor);
  await expect(backlink).not.toHaveAttribute('target');
  await expect(backlink).not.toHaveAttribute('rel', /nofollow/);
  await backlink.click();
  await expect(page).toHaveURL(url => url.pathname === tradePath);
  await expect(page.locator('h1')).toHaveText(tradeH1);
  expect(errors).toEqual([]);
});

test('the new trade block and FAQ fit narrow through desktop viewports', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openTrade(page);
    const item = page.locator('.trade-faq__item').last();
    await item.locator('summary').click();
    await expect(item).toHaveAttribute('open', '');
    await expect(item.locator('.trade-faq__answer')).toBeVisible();
    const overflow = await page
      .locator(
        '#retail-markets, #retail-markets h2, #retail-markets p, #retail-markets a, .trade-faq__item:last-child',
      )
      .evaluateAll(elements =>
        elements
          .filter(element => {
            const rect = element.getBoundingClientRect();
            return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1;
          })
          .map(element => element.className || element.tagName),
      );
    expect(overflow, `Overflow at ${width}px`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    const paragraphs = item.locator('.trade-faq__answer p');
    const first = await paragraphs.nth(0).boundingBox();
    const second = await paragraphs.nth(1).boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(second.y).toBeGreaterThan(first.y + first.height);
  }
});

test('existing trade enquiry anchors and validation still work without a production submission', async ({
  page,
  baseURL,
}) => {
  const requests = [];
  await page.route('**/api/leads', async route => {
    const request = route.request();
    expect(new URL(request.url()).origin).toBe(new URL(baseURL).origin);
    requests.push(request.postDataJSON());
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{"ok":true}' });
  });
  await openTrade(page);
  const missing = await page
    .locator('main a[href^="#"]')
    .evaluateAll(links =>
      links
        .filter(link => !document.getElementById(link.getAttribute('href').slice(1)))
        .map(link => link.getAttribute('href')),
    );
  expect(missing).toEqual([]);
  await page.locator('.trade-hero__actions a[href="#lead-form"]').click();
  await expect(page).toHaveURL(url => url.hash === '#lead-form');
  const form = page.locator('#lead-form');
  await expect(form).toBeInViewport();
  await form.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(form.locator('[role="alert"]')).toBeVisible();
  expect(requests).toHaveLength(0);
  await form.locator('input[name="name"]').fill('Тест торговой страницы');
  await form.locator('input[name="phone"]').fill('9991234567');
  await form
    .locator('textarea[name="object"]')
    .fill('Проверка интерфейса. Отправка перехвачена тестом.');
  await form.locator('input[name="consent"]').check();
  await form.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(form.locator('[role="status"]')).toContainText('Заявка отправлена');
  expect(requests).toHaveLength(1);
  expect(requests[0].source).toBe('passport-security-final-cta');
  expect(requests[0].data.object).toBe('Проверка интерфейса. Отправка перехвачена тестом.');
  expect(requests[0].data.consent).toBe(true);
});
