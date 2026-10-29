import { expect, test } from '@playwright/test';
import { marketObjectType } from '../../src/data/marketObjectType.js';
import {
  marketHeroActions,
  marketHeroFacts,
  marketLinks,
  marketSections,
} from '../../src/pages/MarketPage/marketPageData.js';

const marketPath = '/pasport-bezopasnosti-roznichnogo-rynka/';
const marketUrl = `https://pasport-bezopasnosty.ru${marketPath}`;
const actPath = '/akt-obsledovaniya-i-kategorirovaniya-obekta/';
const section = id => marketSections.find(item => item.id === id);
const pricing = section('prices');
const faq = section('faq');
const passportForm = section('form');
const contents = section('contents');
const processSection = section('process');
const approval = section('approval');
const copies = section('copies');
const actualization = section('actualization');
const comparison = section('comparison');
const viewportWidths = [320, 375, 768, 1024, 1440];

function localOrigin(baseURL) {
  const url = new URL(baseURL);
  expect(url.protocol).toBe('http:');
  expect(['127.0.0.1', 'localhost', '[::1]']).toContain(url.hostname);
  return url.origin;
}

async function expectTestLeadServer(request, baseURL) {
  const response = await request.get(`${localOrigin(baseURL)}/api/health`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    environment: 'test',
    transports: { backup: true, telegram: false, email: false },
  });
}

async function dismissCookieNotice(page) {
  const dismiss = page.getByRole('button', { name: 'Понятно', exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
}

async function openPage(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const response = await page.goto(marketPath);
  expect(response.status()).toBe(200);
  await dismissCookieNotice(page);
  await expect(page.locator('main.market-page')).toBeVisible();
  return page.locator('#lead-form');
}

async function openDirectory(page, width) {
  await page
    .getByRole('button', {
      name: width < 1180 ? 'Открыть меню' : 'Все разделы',
      exact: true,
    })
    .click();
  const directory = page.locator(width < 1180 ? '.site-nav__mobile-directory' : '#site-directory');
  await expect(directory).toBeVisible();
  return directory;
}

async function finishAnimations(locator) {
  await locator.evaluate(async element => {
    await Promise.all(
      element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})),
    );
  });
}

async function centerProcessMarker(marker) {
  await marker.evaluate(element => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
      behavior: 'instant',
    });
  });
}

async function expectContentVisible(page) {
  const hidden = await page
    .locator(
      '.market-hero, .market-heading, .market-object, .market-plan, .market-note, ' +
        '.market-deadline, .service-price-card, .process-step, #lead-form',
    )
    .evaluateAll(elements =>
      elements
        .filter(element => {
          if (!element.getClientRects().length) return true;
          for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            if (
              style.display === 'none' ||
              style.visibility !== 'visible' ||
              Number(style.opacity) < 1
            ) {
              return true;
            }
          }
          return false;
        })
        .map(element => element.className),
    );
  expect(hidden).toEqual([]);
}

function isLeadResponse(response) {
  return (
    new URL(response.url()).pathname === '/api/leads' && response.request().method() === 'POST'
  );
}

function expectLeadContext(payload, service, comment, baseURL) {
  expect(payload.source).toBe('passport-security-final-cta');
  expect(payload.requestId).toEqual(expect.any(String));
  expect(payload.requestId.length).toBeGreaterThan(0);
  expect(new URL(payload.page).origin).toBe(localOrigin(baseURL));
  expect(new URL(payload.page).pathname).toBe(marketPath);
  expect(payload.data.object).toBe(
    `Тип объекта: ${marketObjectType.title}\nУслуга: ${service}\n\n${comment}`,
  );
  expect(payload.data.consent).toBe(true);
  expect(payload.data.website).toBe('');
}

test.beforeEach(async ({ page, baseURL }) => {
  const origin = localOrigin(baseURL);
  await page.route(
    url => /^https?:$/.test(url.protocol) && url.origin !== origin,
    route => route.abort('blockedbyclient'),
  );
});

test.describe('retail market landing without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('prerenders approved sections, FAQ answers and usable native disclosures', async ({
    page,
  }) => {
    const response = await page.goto(marketPath);
    expect(response.status()).toBe(200);
    const main = page.locator('main.market-page');
    await expect(main).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(marketObjectType.h1);
    await expect(main.locator('h2')).toHaveCount(19);
    await expect(main.locator('.market-section')).toHaveCount(18);
    await expect(main.locator('.market-heading h2')).toHaveText(
      marketSections.map(item => item.title),
    );
    expect(
      await main.locator('.market-section').evaluateAll(elements => elements.map(item => item.id)),
    ).toEqual(marketSections.map(item => item.id));
    await expect(page.locator('#faq .market-disclosure__title')).toHaveText(
      faq.items.map(item => item.question),
    );
    await expect(page.locator('#faq .market-disclosure__body')).toHaveText(
      faq.items.map(item => item.answer),
    );
    const faqDetail = page.locator('#faq details').nth(17);
    await faqDetail.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(faqDetail).toHaveAttribute('open', '');
    await expect(faqDetail.locator('.market-disclosure__body')).toBeVisible();
    await expect(faqDetail.locator('.market-disclosure__body')).toHaveText(faq.items[17].answer);
    await page.keyboard.press('Space');
    await expect(faqDetail).not.toHaveAttribute('open');

    await expect(page.locator('#process .process-step')).toHaveCount(7);
    await expect(page.locator('#prices .service-price-card')).toHaveCount(3);
    await expect(main.locator('input[type="file"]')).toHaveCount(0);
    await expect(main).not.toContainText(/Для программиста|SEO-семантика|Wordstat/);
    await expectContentVisible(page);

    const formDetails = page.locator('#form details');
    await expect(formDetails).toHaveAttribute('open', '');
    await expect(formDetails.locator('li')).toHaveText(passportForm.items);
    await formDetails.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(formDetails).not.toHaveAttribute('open');
    await page.keyboard.press('Space');
    await expect(formDetails).toHaveAttribute('open', '');

    const detail = page.locator('#contents details').nth(1);
    await expect(detail).not.toHaveAttribute('open');
    await detail.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(detail).toHaveAttribute('open', '');
    await expect(detail.locator('.market-disclosure__body')).toHaveText(contents.items[1].text);

    await page
      .locator('.market-hero')
      .getByRole('link', { name: marketHeroActions[0].label, exact: true })
      .click();
    await expect(page).toHaveURL(url => url.pathname === marketPath && url.hash === '#lead-form');
    await expect(page.locator('#lead-form')).toBeInViewport();
  });
});

test('retail market SEO, schemas and sitemaps describe one canonical service', async ({
  page,
  request,
}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openPage(page);
  await expect(page).toHaveTitle(marketObjectType.seoTitle);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', marketUrl);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    marketObjectType.seoDescription,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index,follow/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', marketUrl);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    marketObjectType.seoTitle,
  );
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(selector)).toHaveAttribute(
      'content',
      /^https:\/\/pasport-bezopasnosty\.ru\//,
    );
  }
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll(elements => elements.map(item => JSON.parse(item.textContent)));
  for (const type of ['Organization', 'Service', 'WebPage', 'BreadcrumbList']) {
    expect(schemas.filter(item => item['@type'] === type)).toHaveLength(1);
  }
  expect(schemas.find(item => item['@type'] === 'Service')).toMatchObject({
    name: marketObjectType.seoName,
    url: marketUrl,
    description: marketObjectType.seoDescription,
    provider: { '@id': 'https://pasport-bezopasnosty.ru/#organization' },
  });
  expect(schemas.find(item => item['@type'] === 'WebPage')?.url).toBe(marketUrl);
  expect(schemas.find(item => item['@type'] === 'BreadcrumbList')?.itemListElement).toMatchObject([
    { position: 1, item: 'https://pasport-bezopasnosty.ru' },
    { position: 2, item: marketUrl },
  ]);
  await expect(page.locator('.market-breadcrumbs a')).toHaveAttribute('href', '/');
  await expect(page.locator('.market-hero__facts li')).toHaveText(marketHeroFacts);
  await expect(page.locator('.market-hero__price > span')).toHaveText('от');
  await expect(page.locator('.market-hero__price > strong')).toHaveText('9 500 ₽');
  await expect(page.locator('#prices .service-price-card h3')).toHaveText(
    pricing.items.map(item => item.title),
  );
  expect(
    await page
      .locator('#prices .service-price-card__price-line')
      .evaluateAll(elements => elements.map(item => item.textContent.replace(/\s/g, ''))),
  ).toEqual(['от9500₽', 'от9500₽', 'Порасчёту']);

  const brokenAnchors = await page.locator('main a[href]').evaluateAll(elements =>
    elements
      .filter(element => {
        const url = new URL(element.href);
        if (!/^https?:$/.test(url.protocol)) return false;
        if (![location.origin, 'https://pasport-bezopasnosty.ru'].includes(url.origin)) return true;
        return (
          url.origin === location.origin &&
          url.pathname === location.pathname &&
          url.hash &&
          !document.getElementById(decodeURIComponent(url.hash.slice(1)))
        );
      })
      .map(element => element.getAttribute('href')),
  );
  expect(brokenAnchors).toEqual([]);
  expect(
    await page.locator('[id]').evaluateAll(elements => {
      const ids = elements.map(item => item.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    }),
  ).toEqual([]);
  for (const link of Object.values(marketLinks)) {
    const locator = page.locator(`main a[href="${link.href}"]`);
    await expect(locator).toHaveCount(link.href === '/' ? 2 : 1);
    await expect(locator.first()).not.toHaveAttribute('rel', /nofollow/);
    await expect(locator.first()).not.toHaveAttribute('target', '_blank');
  }
  await expect(page.locator('#sample a[href="/blog/pasport-bezopasnosti-rynka/"]')).toContainText(
    marketLinks.article.label,
  );
  for (const href of ['/', marketLinks.trade.href, marketLinks.actualization.href]) {
    expect((await request.get(href)).status()).toBe(200);
  }
  for (const path of ['/sitemap.xml', '/sitemap-google.xml']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml.split(`<loc>${marketUrl}</loc>`)).toHaveLength(2);
    for (const slug of [
      '/pasport-bezopasnosti-rynka/',
      '/pasport-bezopasnosti-rynka-255/',
      '/pasport-bezopasnosti-prodovolstvennogo-rynka/',
    ]) {
      expect(xml).not.toContain(`<loc>https://pasport-bezopasnosty.ru${slug}</loc>`);
    }
  }
  expect(errors).toEqual([]);
});

test('retail market home card, both directories and trade backlink remain reachable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await dismissCookieNotice(page);
    const card = page.locator(`.object-type-card[href="${marketPath}"]`);
    await expect(card).toHaveCount(1);
    await expect(card).toContainText(marketObjectType.title);
    const image = card.getByRole('img', { name: marketObjectType.title, exact: true });
    await expect(image).toHaveAttribute('src', /^\/images\/illustrations\/[a-z0-9-]+\.webp$/);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate(item => item.complete && item.naturalWidth > 0))
      .toBe(true);
    const row = page.locator('#requirements-by-object tbody tr').filter({
      has: page.locator(`a[href="${marketPath}"]`),
    });
    await expect(row.locator('.regulation-guide__act')).toHaveText('ПП РФ № 255');
    await card.click();
    await expect(page.locator('h1')).toHaveText(marketObjectType.h1);
    let directory = await openDirectory(page, width);
    await expect(directory.locator(`a[href="${marketPath}"]`)).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(directory.locator(`a[href="${actPath}"]`)).toBeVisible();
    await expect(directory.locator(`a[href="${marketLinks.actualization.href}"]`)).toBeVisible();
    await directory.locator(`a[href="${actPath}"]`).click();
    await expect(page).toHaveURL(url => url.pathname === actPath);
    directory = await openDirectory(page, width);
    await directory.locator(`a[href="${marketPath}"]`).click();
    await expect(page.locator('h1')).toHaveText(marketObjectType.h1);
    await page.locator(`#comparison a[href="${marketLinks.trade.href}"]`).click();
    await expect(page).toHaveURL(url => url.pathname === marketLinks.trade.href);
    const backlink = page.locator(`.trade-market a[href="${marketPath}"]`);
    await expect(backlink).toHaveCount(1);
    await backlink.click();
    await expect(page.locator('h1')).toHaveText(marketObjectType.h1);
  }
});

test('market article recommendations use the exact slug and preserve other articles', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await dismissCookieNotice(page);
  for (const slug of ['pasport-bezopasnosti-rynka', 'market-e2e-unrelated']) {
    await page.evaluate(value => {
      sessionStorage.setItem(
        'passport-article-preview',
        JSON.stringify({
          id: `e2e-${value}`,
          slug: value,
          title: 'Тестовая статья для проверки ссылок',
          status: 'draft',
          content: '<p>Тестовые данные. Не публичная статья.</p>',
        }),
      );
    }, slug);
    const response = await page.goto('/article-preview.html');
    expect(response.status()).toBe(200);
    await expect(page.locator('.article-view__preview-badge')).toBeVisible();
    const links = page.locator('.article-services-grid .article-service-card');
    await expect(links).toHaveCount(2);
    expect(
      await links.evaluateAll(elements => elements.map(item => item.getAttribute('href'))),
    ).toEqual([
      slug === 'pasport-bezopasnosti-rynka' ? marketPath : actPath,
      marketLinks.actualization.href,
    ]);
    await expect(page.locator('.final-cta__benefits li').first()).toContainText(
      'Проверим основание для категорирования',
    );
    if (slug === 'pasport-bezopasnosti-rynka') {
      const link = page.locator(`.article-service-card[href="${marketPath}"]`);
      await expect(link).toContainText(marketObjectType.seoName);
      await link.click();
      await expect(page).toHaveURL(url => url.pathname === marketPath);
      await expect(page.locator('h1')).toHaveText(marketObjectType.h1);
    }
  }
});

test('all retail market CTAs preserve context before a local email-only submission', async ({
  page,
  request,
  baseURL,
}) => {
  await expectTestLeadServer(request, baseURL);
  const form = await openPage(page);
  const comment = 'Тестовая заявка: проверка контекста услуги.';
  await form.locator('input[name="name"]').fill('Анна');
  await form.locator('input[name="email"]').fill('market-email@example.com');
  await form.locator('textarea[name="object"]').fill(comment);
  await form.locator('input[name="consent"]').check();
  const actions = [
    ...marketHeroActions.map(action => ['.market-hero', action.label, action.service]),
    ...marketSections
      .filter(item => item.action)
      .map(item => [`#${item.id}`, item.action.label, item.action.service]),
    ...pricing.items.map(item => ['#prices', `Заказать: ${item.title}`, item.service]),
  ];
  expect(actions).toHaveLength(9);
  await expect(page.locator('main a[href="#lead-form"]')).toHaveCount(actions.length);
  for (const [selector, name, service] of actions) {
    await page.locator(selector).getByRole('link', { name, exact: true }).click();
    await expect(form.locator('output[name="service"]')).toHaveText(service);
    await expect(form.locator('textarea[name="object"]')).toHaveValue(comment);
    await expect(form.locator('input[name="email"]')).toHaveValue('market-email@example.com');
  }
  const serviceRows = section('service').table.rows;
  const benefits = [serviceRows[0][0], serviceRows[2][0], serviceRows[6][0]];
  expect(
    await page.locator('.final-cta__benefits li').evaluateAll(elements =>
      elements.map(item =>
        [...item.childNodes]
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent)
          .join('')
          .trim(),
      ),
    ),
  ).toEqual(benefits);
  await expect(page.locator('.final-cta__benefits')).not.toContainText('категорирования');
  await expect(form.locator('output[name="objectType"]')).toHaveText('Розничные рынки');

  const submitted = page.waitForResponse(isLeadResponse);
  await form.getByRole('button', { name: 'Отправить заявку', exact: false }).click();
  const response = await submitted;
  expect(response.status()).toBe(201);
  const payload = response.request().postDataJSON();
  expectLeadContext(payload, pricing.items[2].service, comment, baseURL);
  expect(payload.data.phone).toBe('');
  expect(payload.data.email).toBe('market-email@example.com');
  expect(await response.json()).toMatchObject({ ok: true, requestId: payload.requestId });
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
  await expect(form.locator('textarea[name="object"]')).toHaveValue('');
  await expect(form.locator('input[name="email"]')).toHaveValue('');
  await expect(form.locator('input[name="consent"]')).not.toBeChecked();
});

test('retail market enquiry accepts a phone without email on the local test API', async ({
  page,
  request,
  baseURL,
}) => {
  await expectTestLeadServer(request, baseURL);
  const form = await openPage(page);
  const comment = 'Тестовая заявка по телефону.';
  await page
    .locator('.market-hero')
    .getByRole('link', { name: marketHeroActions[1].label, exact: true })
    .click();
  await form.locator('input[name="name"]').fill('Ирина');
  await form.locator('input[name="phone"]').fill('79990000001');
  await form.locator('textarea[name="object"]').fill(comment);
  await form.locator('input[name="consent"]').check();
  const submitted = page.waitForResponse(isLeadResponse);
  await form.getByRole('button', { name: 'Отправить заявку', exact: false }).click();
  const response = await submitted;
  expect(response.status()).toBe(201);
  const payload = response.request().postDataJSON();
  expectLeadContext(payload, marketHeroActions[1].service, comment, baseURL);
  expect(payload.data.phone.replace(/\D/g, '')).toBe('79990000001');
  expect(payload.data.email).toBe('');
  expect(await response.json()).toMatchObject({ ok: true, requestId: payload.requestId });
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
});

test('retail market form rejects incomplete contacts, invalid email and missing consent', async ({
  page,
  baseURL,
}) => {
  let submissions = 0;
  await page.route(`${localOrigin(baseURL)}/api/leads`, async route => {
    submissions += 1;
    await route.fulfill({ status: 500, json: { ok: false } });
  });
  const form = await openPage(page);
  const submit = form.getByRole('button', { name: 'Отправить заявку', exact: false });
  await expect(form.locator('input[type="file"]')).toHaveCount(0);
  await expect(form.locator('input[name="website"]')).toHaveAttribute('tabindex', '-1');
  await submit.click();
  await expect(form.locator('input[name="name"]')).toHaveAttribute('aria-invalid', 'true');
  await form.locator('input[name="name"]').fill('Анна');
  await submit.click();
  await expect(form.locator('input[name="phone"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('input[name="email"]')).toHaveAttribute('aria-invalid', 'true');
  await form.locator('input[name="consent"]').check();
  await form.locator('input[name="email"]').fill('invalid-email');
  await submit.click();
  await expect(form.locator('#final-cta-status')).toHaveAttribute('role', 'alert');
  await form.locator('input[name="email"]').fill('market-validation@example.com');
  await form.locator('input[name="consent"]').uncheck();
  await submit.click();
  await expect(form.locator('input[name="consent"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('#final-cta-status')).toHaveAttribute('role', 'alert');
  expect(submissions).toBe(0);
});

test('retail market enquiry retains input after an API error and allows an explicit retry', async ({
  page,
  baseURL,
}) => {
  let releaseError;
  const pendingResponse = new Promise(resolve => {
    releaseError = resolve;
  });
  const attempts = [];
  await page.route(`${localOrigin(baseURL)}/api/leads`, async route => {
    const payload = route.request().postDataJSON();
    attempts.push(payload);
    if (attempts.length === 1) {
      await pendingResponse;
      await route.fulfill({ status: 503, json: { ok: false } });
      return;
    }
    await route.fulfill({ status: 201, json: { ok: true, requestId: payload.requestId } });
  });
  const form = await openPage(page);
  const comment = 'Сохранить введённые данные при ошибке.';
  const action = section('sample').action;
  await page.locator('#sample').getByRole('link', { name: action.label, exact: true }).click();
  await form.locator('input[name="name"]').fill('Анна');
  await form.locator('input[name="email"]').fill('market-retry@example.com');
  await form.locator('textarea[name="object"]').fill(comment);
  await form.locator('input[name="consent"]').check();
  const submit = form.locator('button[type="submit"]');
  try {
    await submit.click();
    await expect.poll(() => attempts.length).toBe(1);
    await expect(submit).toBeDisabled();
    await expect(submit).toContainText('Отправляем');
  } finally {
    releaseError();
  }
  await expect(form.locator('#final-cta-status')).toContainText('Не удалось отправить заявку');
  await expect(form.locator('#final-cta-status')).toHaveAttribute('role', 'alert');
  await expect(submit).toBeEnabled();
  await expect(form.locator('textarea[name="object"]')).toHaveValue(comment);
  await expect(form.locator('input[name="email"]')).toHaveValue('market-retry@example.com');
  await expect(form.locator('input[name="consent"]')).toBeChecked();
  await expect(form.locator('output[name="service"]')).toHaveText(action.service);
  await submit.click();
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
  expect(attempts).toHaveLength(2);
  expect(attempts[0].requestId).not.toBe(attempts[1].requestId);
  for (const payload of attempts) expectLeadContext(payload, action.service, comment, baseURL);
  await expect(form.locator('textarea[name="object"]')).toHaveValue('');
});

test('retail market approval, copies and update deadlines retain their distinct meanings', async ({
  page,
}) => {
  await openPage(page);
  await expect(page.locator('#process .process-step h3')).toHaveText(
    processSection.steps.map(item => item.title),
  );
  await expect(page.locator('#process .process-steps')).not.toContainText(
    /категорирован|акт обследования/i,
  );
  await expect(page.locator('#approval .market-approval-authorities p')).toHaveText(
    approval.authorities,
  );
  await expect(page.locator('#approval .market-approval-authorities li')).toHaveCount(2);
  await expect(page.locator('#approval .market-approval-result')).toHaveText(approval.approval);
  await expect(page.locator('#approval .market-note p')).toHaveText(approval.timing.paragraphs);
  await expect(page.locator('#copies .market-copies-table tbody tr')).toHaveCount(4);
  for (const [index, row] of copies.table.rows.entries()) {
    await expect(page.locator('#copies tbody tr').nth(index).locator('th, td')).toHaveText(row);
  }
  await expect(page.locator('.market-copies-extra p')).toHaveText(copies.copy);
  await expect(page.locator('#copies .market-note')).toHaveText(copies.note);
  await expect(page.locator('.market-deadline p')).toHaveText(actualization.timing.paragraphs);
  await expect(page.locator('.market-deadline__number')).toHaveText(['10', '3']);
  await expect(page.locator('#actualization .market-note')).toContainText(actualization.note);
  await expect(page.locator('#sample .market-note')).toHaveText(section('sample').note);
  await expect(page.locator('#form .market-copy p')).toHaveText(passportForm.paragraphs);
  await expect(page.locator('.market-documents-list > div')).toHaveCount(12);
  await expect(page.locator('.market-documents-list dt')).toHaveText(
    section('documents').table.rows.map(row => row[0]),
  );
  await expect(page.locator('.market-documents-list dd')).toHaveText(
    section('documents').table.rows.map(row => row[1]),
  );
  await expect(page.locator('.market-service-list h3')).toHaveText(
    section('service').table.rows.map(row => row[0]),
  );
  await expect(page.locator('.market-service-list p')).toHaveText(
    section('service').table.rows.map(row => row[1]),
  );
});

test('retail market FAQ and native disclosure icons work with the keyboard', async ({ page }) => {
  await openPage(page);
  const questions = page.locator('#faq details.market-disclosure');
  await expect(questions).toHaveCount(18);
  for (const index of [1, 17]) {
    const detail = questions.nth(index);
    const question = detail.locator('summary');
    const panel = detail.locator('.market-disclosure__body');
    await expect(detail).toHaveAttribute('name', 'market-faq');
    await question.focus();
    await expect(question).toBeFocused();
    await question.press('Enter');
    await expect(detail).toHaveAttribute('open', '');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveText(faq.items[index].answer);
    await expect(questions.first()).not.toHaveAttribute('open');
    await expect(page.locator('#faq details[open]')).toHaveCount(1);
    const icon = question.locator('.market-disclosure__icon');
    await finishAnimations(icon);
    const centers = await icon.evaluate(element =>
      ['::before', '::after'].map(pseudo => {
        const style = getComputedStyle(element, pseudo);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return [
          parseFloat(style.left) +
            parseFloat(style.width) / 2 +
            matrix.m41 -
            element.clientWidth / 2,
          parseFloat(style.top) +
            parseFloat(style.height) / 2 +
            matrix.m42 -
            element.clientHeight / 2,
        ];
      }),
    );
    for (const [x, y] of centers) {
      expect(Math.abs(x)).toBeLessThan(1);
      expect(Math.abs(y)).toBeLessThan(1);
    }
    await question.press('Space');
    await expect(detail).not.toHaveAttribute('open');
    await expect(panel).toBeHidden();
  }

  const disclosures = page.locator('#contents details');
  await expect(disclosures).toHaveCount(7);
  for (const index of [1, 6]) {
    const detail = disclosures.nth(index);
    const summary = detail.locator('summary');
    await summary.focus();
    await summary.press('Enter');
    await expect(detail).toHaveAttribute('open', '');
    await expect(detail.locator('.market-disclosure__body')).toHaveText(contents.items[index].text);
    await summary.press('Space');
    await expect(detail).not.toHaveAttribute('open');
    const icon = summary.locator('.market-disclosure__icon');
    await finishAnimations(icon);
    const centers = await icon.evaluate(element =>
      ['::before', '::after'].map(pseudo => {
        const style = getComputedStyle(element, pseudo);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return [
          parseFloat(style.left) +
            parseFloat(style.width) / 2 +
            matrix.m41 -
            element.clientWidth / 2,
          parseFloat(style.top) +
            parseFloat(style.height) / 2 +
            matrix.m42 -
            element.clientHeight / 2,
        ];
      }),
    );
    for (const [x, y] of centers) {
      expect(Math.abs(x)).toBeLessThan(1);
      expect(Math.abs(y)).toBeLessThan(1);
    }
  }
});

test('market comparison preserves both regimes and scrolls within its mobile region', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openPage(page);
  const wrapper = page.locator('#comparison .market-table-scroll');
  await expect(wrapper).toHaveAttribute('role', 'region');
  await expect(wrapper).toHaveAttribute('aria-label', comparison.title);
  await expect(wrapper).toHaveAttribute('tabindex', '0');
  await expect(wrapper.locator('thead th')).toHaveText(comparison.table.headers);
  for (const [index, row] of comparison.table.rows.entries()) {
    await expect(wrapper.locator('tbody tr').nth(index).locator('th, td')).toHaveText(row);
  }
  await wrapper.scrollIntoViewIfNeeded();
  await wrapper.focus();
  await expect(wrapper).toBeFocused();
  const rowHeader = wrapper.locator('tbody th').first();
  const before = await rowHeader.boundingBox();
  expect(before).not.toBeNull();
  expect(await wrapper.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await wrapper.press('ArrowRight');
  await expect.poll(() => wrapper.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  const after = await rowHeader.boundingBox();
  expect(after).not.toBeNull();
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('retail market fits mobile through desktop and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(marketPath);
    await dismissCookieNotice(page);
    await expectContentVisible(page);
    const overflow = await page
      .locator(
        '.market-hero, .market-section, .market-object, .market-note, .market-plan, ' +
          '.market-deadline, .market-table-scroll, .service-price-card, .process-step, ' +
          '#lead-form, main h1, main h2, .market-faq-list, .market-form-dossier, ' +
          '.market-service-list > li, .market-documents-list > div, .market-current-panel',
      )
      .evaluateAll(elements =>
        elements
          .filter(element => {
            const rect = element.getBoundingClientRect();
            return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1;
          })
          .map(element => ({ tag: element.tagName, className: element.className })),
      );
    expect(overflow, `Overflow at ${width}px`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    expect(
      await page
        .locator('main [data-scroll-reveal]')
        .evaluateAll(elements =>
          elements.every(item => getComputedStyle(item).animationName === 'none'),
        ),
    ).toBe(true);
    await expect(page.locator('#process .market-sticky')).toHaveCSS(
      'position',
      width >= 1100 ? 'sticky' : 'static',
    );
    const price = await page.locator('.market-hero__price').boundingBox();
    expect(price).not.toBeNull();
    expect(price.y).toBeGreaterThanOrEqual(0);
    expect(price.y + price.height).toBeLessThanOrEqual(900);
  }
});

test('market reveals on scroll, tracks seven steps and releases sticky on short screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(marketPath);
  await dismissCookieNotice(page);
  await page.mouse.move(0, 0);
  const card = page.locator('.market-plan').first();
  await expect(card).not.toHaveAttribute('data-scroll-visible');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-scroll-visible', '');
  await expect(card).toHaveCSS('animation-name', 'scroll-reveal-enter');
  await finishAnimations(card);
  await expect(card).toHaveCSS('opacity', '1');
  await expect(card).toHaveCSS('transform', 'none');
  const markers = page.locator('#process .process-step__observer');
  await expect(markers).toHaveCount(7);
  for (let index = 0; index < 7; index += 1) {
    await centerProcessMarker(markers.nth(index));
    await expect(page.locator('#process .process-step').nth(index)).toHaveClass(
      /process-step--active/,
    );
    await expect(page.locator('#process .process-step--active')).toHaveCount(1);
  }
  const intro = page.locator('#process .market-sticky');
  await expect(intro).toHaveCSS('position', 'sticky');
  await centerProcessMarker(markers.nth(3));
  await expect
    .poll(() => intro.evaluate(element => Math.round(element.getBoundingClientRect().top)))
    .toBe(110);
  await page.setViewportSize({ width: 1440, height: 700 });
  await expect(intro).toHaveCSS('position', 'static');
});
