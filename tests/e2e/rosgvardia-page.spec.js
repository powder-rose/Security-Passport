import { expect, test } from '@playwright/test';
import { rosgvardiaObjectType } from '../../src/data/rosgvardiaObjectType.js';
import {
  rosgvardiaHeroActions,
  rosgvardiaHeroFacts,
  rosgvardiaSections,
} from '../../src/pages/RosgvardiaPage/rosgvardiaPageData.js';

const rosgvardiaPath = '/pasport-bezopasnosti-obekta-obyazatelnoj-ohrany-rosgvardii/';
const rosgvardiaUrl = `https://pasport-bezopasnosty.ru${rosgvardiaPath}`;
const rosgvardiaH1 = 'Паспорт безопасности объекта, подлежащего обязательной охране Росгвардией';
const rosgvardiaTitle =
  'Паспорт безопасности объекта Росгвардии по ПП № 272 — от 9 500 ₽ | БОЙКОВГРУПП';
const actPath = '/akt-obsledovaniya-i-kategorirovaniya-obekta/';
const actualizationPath = '/aktualizaciya-pasporta-bezopasnosti-obekta/';
const crowdPath = '/pasport-bezopasnosti-mesta-massovogo-prebyvaniya-lyudej/';
const pricing = rosgvardiaSections.find(section => section.id === 'prices');
const faq = rosgvardiaSections.find(section => section.id === 'faq');
const passportForm = rosgvardiaSections.find(section => section.id === 'form');
const processSection = rosgvardiaSections.find(section => section.id === 'process');
const categories = rosgvardiaSections.find(section => section.id === 'categorization');
const approval = rosgvardiaSections.find(section => section.id === 'approval');
const comparison = rosgvardiaSections.find(section => section.id === 'comparison');
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
  await page.goto(rosgvardiaPath);
  await dismissCookieNotice(page);
  await expect(page.locator('main.rosgvardia-page')).toBeVisible();
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

async function expectPageContentVisible(page) {
  const hidden = await page
    .locator('.rosgvardia-hero, .rosgvardia-section h2, .service-price-card, .process-step')
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
        .map(element => element.textContent.trim().slice(0, 100)),
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
  expect(new URL(payload.page).pathname).toBe(rosgvardiaPath);
  expect(payload.data.object).toBe(
    `Тип объекта: ${rosgvardiaObjectType.title}\nУслуга: ${service}\n\n${comment}`,
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

test.describe('Rosgvardia landing without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('prerenders all approved sections, FAQ answers and passport details', async ({ page }) => {
    const response = await page.goto(rosgvardiaPath);
    expect(response.status()).toBe(200);
    const main = page.locator('main.rosgvardia-page');
    await expect(main).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(rosgvardiaH1);
    await expect(main.locator('h2')).toHaveCount(20);
    await expect(page.locator('.rosgvardia-section h2')).toHaveText(
      rosgvardiaSections.map(section => section.title),
    );
    expect(
      await page
        .locator('.rosgvardia-section')
        .evaluateAll(sections => sections.map(item => item.id)),
    ).toEqual(rosgvardiaSections.map(section => section.id));
    await expect(page.locator('#faq .faq-item__answer')).toHaveCount(19);
    await expect(page.locator('#faq .faq-item__question')).toHaveText(
      faq.items.map(item => item.question),
    );
    await expect(page.locator('#faq .faq-item__answer')).toHaveText(
      faq.items.map(item => item.answer),
    );
    await expect(page.locator('#process .process-step')).toHaveCount(8);
    await expect(page.locator('#prices .service-price-card')).toHaveCount(4);
    await expect(main.locator('input[type="file"]')).toHaveCount(0);
    await expect(main).not.toContainText(/Для программиста|Wordstat|SEO-приоритет/);
    await expect(main).not.toContainText(/распоряжени[^.\n]*№\s*\d/i);
    await expectPageContentVisible(page);

    const disclosure = page.locator('#form details');
    await expect(disclosure).not.toHaveAttribute('open');
    await disclosure.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('open', '');
    await expect(disclosure.locator('li p')).toHaveText(passportForm.items);
    await expect(disclosure.locator('li')).toHaveCount(12);
    await page.keyboard.press('Space');
    await expect(disclosure).not.toHaveAttribute('open');

    await page
      .locator('.rosgvardia-hero')
      .getByRole('link', { name: rosgvardiaHeroActions[0].label, exact: true })
      .click();
    await expect(page).toHaveURL(
      url => url.pathname === rosgvardiaPath && url.hash === '#lead-form',
    );
    await expect(page.locator('#lead-form')).toBeInViewport();
  });
});

test('Rosgvardia SEO, schemas, tariffs and sitemap describe one canonical service', async ({
  page,
  request,
}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openPage(page);
  await expect(page).toHaveTitle(rosgvardiaTitle);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', rosgvardiaUrl);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    rosgvardiaObjectType.seoDescription,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index,follow/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', rosgvardiaUrl);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    rosgvardiaTitle,
  );
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(selector)).toHaveAttribute(
      'content',
      /^https:\/\/pasport-bezopasnosty\.ru\//,
    );
  }
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll(scripts => scripts.map(script => JSON.parse(script.textContent)));
  expect(schemas.filter(schema => schema['@type'] === 'Organization')).toHaveLength(1);
  expect(schemas.filter(schema => schema['@type'] === 'Service')).toHaveLength(1);
  expect(schemas.find(schema => schema['@type'] === 'Service')).toMatchObject({
    name: rosgvardiaObjectType.seoName,
    url: rosgvardiaUrl,
    description: rosgvardiaObjectType.seoDescription,
    provider: { '@id': 'https://pasport-bezopasnosty.ru/#organization' },
  });
  expect(schemas.find(schema => schema['@type'] === 'WebPage')?.url).toBe(rosgvardiaUrl);
  expect(
    schemas.find(schema => schema['@type'] === 'BreadcrumbList')?.itemListElement,
  ).toMatchObject([
    { position: 1, item: 'https://pasport-bezopasnosty.ru' },
    { position: 2, item: rosgvardiaUrl },
  ]);
  await expect(
    page.getByRole('navigation', { name: 'Хлебные крошки', exact: true }).getByRole('link'),
  ).toHaveAttribute('href', '/');
  await expect(page.locator('.rosgvardia-hero__price')).toHaveText('от 9 500 ₽');
  await expect(page.locator('.rosgvardia-hero__facts li')).toHaveText(rosgvardiaHeroFacts);
  await expect(page.locator('#prices .service-price-card h3')).toHaveText(
    pricing.items.map(item => item.title),
  );
  expect(
    await page
      .locator('#prices .service-price-card__price-line')
      .evaluateAll(elements => elements.map(element => element.textContent.replace(/\s/g, ''))),
  ).toEqual(['от9500₽', 'от9500₽', 'от9500₽', 'от35000₽']);
  const invalidLinks = await page.locator('main a[href]').evaluateAll(links =>
    links
      .filter(link => {
        const url = new URL(link.href);
        if (!/^https?:$/.test(url.protocol)) return false;
        if (![location.origin, 'https://pasport-bezopasnosty.ru'].includes(url.origin)) return true;
        return (
          url.origin === location.origin &&
          url.pathname === location.pathname &&
          url.hash &&
          !document.getElementById(decodeURIComponent(url.hash.slice(1)))
        );
      })
      .map(link => link.getAttribute('href')),
  );
  expect(invalidLinks).toEqual([]);
  expect(
    await page.locator('[id]').evaluateAll(elements => {
      const ids = elements.map(element => element.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    }),
  ).toEqual([]);
  for (const href of [actPath, actualizationPath, crowdPath]) {
    await expect(page.locator(`main a[href="${href}"]`)).toHaveCount(1);
    const linkedPage = await request.get(href);
    expect(linkedPage.status()).toBe(200);
  }
  for (const path of ['/sitemap.xml', '/sitemap-google.xml']) {
    const sitemap = await request.get(path);
    expect(sitemap.status()).toBe(200);
    expect((await sitemap.text()).split(`<loc>${rosgvardiaUrl}</loc>`)).toHaveLength(2);
  }
  expect(errors).toEqual([]);
});

test('Rosgvardia home card, both directories and the MMPL backlink remain reachable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await dismissCookieNotice(page);
    const card = page.locator(`.object-type-card[href="${rosgvardiaPath}"]`);
    await expect(card).toHaveCount(1);
    await expect(card).toContainText(rosgvardiaObjectType.title);
    const image = card.getByRole('img', { name: rosgvardiaObjectType.title, exact: true });
    await expect(image).toHaveCount(1);
    await expect(image).toHaveAttribute('src', /^\/images\/illustrations\/[a-z0-9-]+\.webp$/);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate(item => item.complete && item.naturalWidth > 0))
      .toBe(true);
    const row = page.locator('#requirements-by-object tbody tr').filter({
      has: page.locator(`a[href="${rosgvardiaPath}"]`),
    });
    await expect(row.locator('.regulation-guide__act')).toHaveText('ПП РФ № 272');
    await card.click();
    await expect(page.locator('h1')).toHaveText(rosgvardiaH1);

    let directory = await openDirectory(page, width);
    await expect(directory.locator(`a[href="${rosgvardiaPath}"]`)).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(directory.locator(`a[href="${actPath}"]`)).toBeVisible();
    await expect(directory.locator(`a[href="${actualizationPath}"]`)).toBeVisible();
    await directory.locator(`a[href="${actPath}"]`).click();
    await expect(page).toHaveURL(url => url.pathname === actPath);

    directory = await openDirectory(page, width);
    await directory.locator(`a[href="${rosgvardiaPath}"]`).click();
    await expect(page.locator('h1')).toHaveText(rosgvardiaH1);
    await page.locator(`#comparison a[href="${crowdPath}"]`).click();
    await expect(page).toHaveURL(url => url.pathname === crowdPath);
    const backlink = page.locator(`.crowd-regime a[href="${rosgvardiaPath}"]`);
    await expect(backlink).toHaveCount(1);
    await backlink.click();
    await expect(page.locator('h1')).toHaveText(rosgvardiaH1);
  }
});

test('all Rosgvardia CTAs retain service and comment before a local email-only submission', async ({
  page,
  request,
  baseURL,
}) => {
  await expectTestLeadServer(request, baseURL);
  const form = await openPage(page);
  const comment = 'Тестовая заявка: требуется подготовка документации.';
  await form.locator('input[name="name"]').fill('Анна');
  await form.locator('input[name="email"]').fill('rosgvardia-email@example.com');
  await form.locator('textarea[name="object"]').fill(comment);
  await form.locator('input[name="consent"]').check();
  const selections = [
    ...rosgvardiaHeroActions.map(action => ['.rosgvardia-hero', action.label, action.service]),
    ...rosgvardiaSections
      .filter(section => section.action)
      .map(section => [`#${section.id}`, section.action.label, section.action.service]),
    ...pricing.items.map(item => ['#prices', `Заказать: ${item.title}`, item.service]),
  ];
  await expect(page.locator('main a[href="#lead-form"]')).toHaveCount(selections.length);
  for (const [selector, name, service] of selections) {
    await page.locator(selector).getByRole('link', { name, exact: true }).click();
    await expect(form.locator('output[name="service"]')).toHaveText(service);
    await expect(form.locator('textarea[name="object"]')).toHaveValue(comment);
    await expect(form.locator('input[name="email"]')).toHaveValue('rosgvardia-email@example.com');
  }
  const actOffer = pricing.items[1];
  await page
    .locator('#prices')
    .getByRole('link', { name: `Заказать: ${actOffer.title}`, exact: true })
    .click();
  const submitted = page.waitForResponse(isLeadResponse);
  await form.getByRole('button', { name: 'Отправить заявку', exact: false }).click();
  const response = await submitted;
  expect(new URL(response.url()).origin).toBe(localOrigin(baseURL));
  expect(response.status()).toBe(201);
  const payload = response.request().postDataJSON();
  expectLeadContext(payload, actOffer.service, comment, baseURL);
  expect(payload.data.phone).toBe('');
  expect(payload.data.email).toBe('rosgvardia-email@example.com');
  expect(await response.json()).toMatchObject({ ok: true, requestId: payload.requestId });
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
  await expect(form.locator('textarea[name="object"]')).toHaveValue('');
  await expect(form.locator('input[name="email"]')).toHaveValue('');
  await expect(form.locator('input[name="consent"]')).not.toBeChecked();
});

test('Rosgvardia enquiry also accepts a phone without email on the local test API', async ({
  page,
  request,
  baseURL,
}) => {
  await expectTestLeadServer(request, baseURL);
  const form = await openPage(page);
  const comment = 'Тестовая заявка по телефону.';
  await page
    .locator('.rosgvardia-hero')
    .getByRole('link', { name: rosgvardiaHeroActions[1].label, exact: true })
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
  expectLeadContext(payload, rosgvardiaHeroActions[1].service, comment, baseURL);
  expect(payload.data.phone.replace(/\D/g, '')).toBe('79990000001');
  expect(payload.data.email).toBe('');
  expect(await response.json()).toMatchObject({ ok: true, requestId: payload.requestId });
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
});

test('Rosgvardia form blocks incomplete contacts, invalid email and missing consent', async ({
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
  await form.locator('input[name="email"]').fill('rosgvardia-invalid@example.com');
  await form.locator('input[name="consent"]').uncheck();
  await submit.click();
  await expect(form.locator('input[name="consent"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('#final-cta-status')).toHaveAttribute('role', 'alert');
  expect(submissions).toBe(0);
});

test('Rosgvardia enquiry preserves input after an API error and supports an explicit retry', async ({
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
  const comment = 'Сохранить комментарий при ошибке отправки.';
  await page
    .locator('#form')
    .getByRole('link', { name: passportForm.action.label, exact: true })
    .click();
  await form.locator('input[name="name"]').fill('Анна');
  await form.locator('input[name="email"]').fill('rosgvardia-retry@example.com');
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
  await expect(form.locator('input[name="email"]')).toHaveValue('rosgvardia-retry@example.com');
  await expect(form.locator('input[name="consent"]')).toBeChecked();
  await expect(form.locator('output[name="service"]')).toHaveText(passportForm.action.service);
  await submit.click();
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
  expect(attempts).toHaveLength(2);
  expect(attempts[0].requestId).not.toBe(attempts[1].requestId);
  for (const payload of attempts) {
    expectLeadContext(payload, passportForm.action.service, comment, baseURL);
  }
  await expect(form.locator('textarea[name="object"]')).toHaveValue('');
});

test('Rosgvardia FAQ and passport disclosure work with keyboard and centered plus icons', async ({
  page,
}) => {
  await openPage(page);
  const questions = page.locator('#faq .faq-item__button');
  await expect(questions).toHaveCount(19);
  for (const index of [1, 18]) {
    const question = questions.nth(index);
    const panelId = await question.getAttribute('aria-controls');
    const panel = page.locator(`#${panelId}`);
    await question.focus();
    await question.press('Enter');
    await expect(question).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(faq.items[index].answer);
    await expect(questions.first()).toHaveAttribute('aria-expanded', 'false');
    const icon = question.locator('.faq-item__icon');
    await finishAnimations(icon);
    const offsets = await icon.evaluate(element => {
      const circle = element.getBoundingClientRect();
      return [...element.children].map(bar => {
        const rect = bar.getBoundingClientRect();
        return [
          rect.x + rect.width / 2 - circle.x - circle.width / 2,
          rect.y + rect.height / 2 - circle.y - circle.height / 2,
        ];
      });
    });
    for (const [x, y] of offsets) {
      expect(Math.abs(x)).toBeLessThan(1);
      expect(Math.abs(y)).toBeLessThan(1);
    }
    await question.press('Space');
    await expect(question).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  }
  const disclosure = page.locator('#form details');
  const summary = disclosure.locator('summary');
  await summary.focus();
  await summary.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(disclosure.locator('li p')).toHaveText(passportForm.items);
  await summary.press('Space');
  await expect(disclosure).not.toHaveAttribute('open');
  const icon = summary.locator('.rosgvardia-disclosure__icon');
  await finishAnimations(icon);
  const centers = await icon.evaluate(element =>
    ['::before', '::after'].map(pseudo => {
      const style = getComputedStyle(element, pseudo);
      const matrix = new DOMMatrixReadOnly(style.transform);
      return [
        parseFloat(style.left) + parseFloat(style.width) / 2 + matrix.m41 - element.clientWidth / 2,
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
});

test('Rosgvardia page fits mobile through desktop and respects reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(rosgvardiaPath);
    await dismissCookieNotice(page);
    await expectPageContentVisible(page);
    const overflow = await page
      .locator(
        '.rosgvardia-hero, .rosgvardia-section, .rosgvardia-category, .rosgvardia-note, ' +
          '.rosgvardia-table-scroll, .service-price-card, .process-step, #lead-form, main h1, main h2',
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
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(width);
    const animations = await page
      .locator('main [data-scroll-reveal]')
      .evaluateAll(elements => elements.map(element => getComputedStyle(element).animationName));
    expect(animations.every(name => name === 'none')).toBe(true);
    await expect(page.locator('#process .rosgvardia-intro')).toHaveCSS(
      'position',
      width >= 1100 ? 'sticky' : 'static',
    );
  }
});

test('Rosgvardia comparison keeps distinct criteria and keyboard-scrolls inside its mobile wrapper', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openPage(page);
  await expect(page.locator('.rosgvardia-category')).toHaveCount(3);
  for (const [index, row] of categories.table.rows.entries()) {
    const card = page.locator('.rosgvardia-category').nth(index);
    await expect(card.locator('.rosgvardia-category__head strong')).toHaveText(row[0]);
    await expect(card.locator('dd')).toHaveText(row.slice(1));
  }
  await expect(page.locator('#categorization')).not.toContainText(/50|200|1\s?000/);
  for (const [index, row] of approval.table.rows.entries()) {
    await expect(page.locator('.rosgvardia-approval-stop').nth(index).locator('dd')).toHaveText(
      row,
    );
  }
  await expect(page.locator('.rosgvardia-approval-timing li')).toHaveText(approval.timing.items);
  await expect(page.locator('#approval')).not.toContainText('МВД');
  await expect(page.locator('.rosgvardia-act-facts dd')).toHaveText([
    'Произвольная',
    '5',
    'Все члены комиссии',
    'Неотъемлемая часть паспорта',
    '10 дней после завершения обследования',
  ]);
  await expect(page.locator('.rosgvardia-copies__stat')).toHaveText('5 экземпляров');
  await expect(page.locator('#confidentiality h2')).toContainText('ДСП');
  await expect(page.locator('#standard')).toContainText(
    'ГОСТ Р 72551-2026 не заменяет ПП РФ № 272',
  );
  const wrapper = page.locator('#comparison .rosgvardia-table-scroll');
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

test('Rosgvardia reveals on scroll, tracks all process steps and releases sticky layout on short screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(rosgvardiaPath);
  await dismissCookieNotice(page);
  await page.mouse.move(0, 0);
  const category = page.locator('.rosgvardia-category').first();
  await expect(category).not.toHaveAttribute('data-scroll-visible');
  await category.scrollIntoViewIfNeeded();
  await expect(category).toHaveAttribute('data-scroll-visible', '');
  await expect(category).toHaveCSS('animation-name', 'scroll-reveal-enter');
  await finishAnimations(category);
  await expect(category).toHaveCSS('opacity', '1');
  await expect(category).toHaveCSS('transform', 'none');
  await expect(page.locator('#process .process-step h3')).toHaveText(
    processSection.steps.map(step => step.title),
  );
  const markers = page.locator('#process .process-step__observer');
  await expect(markers).toHaveCount(8);
  for (let index = 0; index < 8; index += 1) {
    await centerProcessMarker(markers.nth(index));
    await expect(page.locator('#process .process-step').nth(index)).toHaveClass(
      /process-step--active/,
    );
    await expect(page.locator('#process .process-step--active')).toHaveCount(1);
  }
  const intro = page.locator('#process .rosgvardia-intro');
  await expect(intro).toHaveCSS('position', 'sticky');
  await centerProcessMarker(markers.nth(3));
  await expect
    .poll(() => intro.evaluate(element => Math.round(element.getBoundingClientRect().top)))
    .toBe(110);
  await page.setViewportSize({ width: 1440, height: 700 });
  await expect(intro).toHaveCSS('position', 'static');
});
