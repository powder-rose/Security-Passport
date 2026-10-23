import { expect, test } from '@playwright/test';
import {
  religiousHeroActions,
  religiousObjectOptions,
  religiousSections,
} from '../../src/pages/ReligiousPage/religiousPageData.js';

const religiousPath = '/pasport-bezopasnosti-religioznoj-organizacii/';
const religiousUrl = `https://pasport-bezopasnosty.ru${religiousPath}`;
const religiousH1 = 'Паспорт безопасности религиозной организации — разработка и согласование';
const religiousTitle =
  'Паспорт безопасности религиозной организации по ПП № 1165 — от 9 500 ₽ | БОЙКОВГРУПП';
const religiousDescription =
  'Разработка паспорта безопасности религиозной организации по ПП РФ № 1165. Паспорт храма, категорирование, акт обследования, согласование. От 9 500 ₽.';
const religiousObjectType = 'Религиозные организации';
const actPath = '/akt-obsledovaniya-i-kategorirovaniya-obekta/';
const actualizationPath = '/aktualizaciya-pasporta-bezopasnosti-obekta/';
const pricing = religiousSections.find(section => section.id === 'prices');
const faq = religiousSections.find(section => section.id === 'faq');
const processSection = religiousSections.find(section => section.id === 'process');
const examinationAct = religiousSections.find(section => section.id === 'examination-act');

async function openDirectory(page, width) {
  await page
    .getByRole('button', {
      name: width < 1180 ? 'Открыть меню' : 'Все разделы',
      exact: true,
    })
    .click();
  return page.locator(width < 1180 ? '.site-nav__mobile-directory' : '#site-directory');
}

async function expectContentVisible(page) {
  const hiddenContent = await page
    .locator('.religious-hero, .religious-section h2, .service-price-card, .process-step')
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
  expect(hiddenContent).toEqual([]);
}

test.describe('religious landing without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('prerenders all sections and FAQ answers with a working enquiry anchor', async ({
    page,
    request,
  }) => {
    const response = await request.get(religiousPath);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html.match(/class="faq-item__answer"/g)).toHaveLength(24);
    expect(html).not.toContain('Для программиста');
    expect(html).not.toContain('Wordstat');

    await page.goto(religiousPath);
    const main = page.locator('main.religious-page');
    await expect(main).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(religiousH1);
    await expect(main.locator('h2')).toHaveCount(20);
    await expect(page.locator('.religious-section h2')).toHaveCount(19);
    expect(
      await page
        .locator('.religious-section')
        .evaluateAll(sections => sections.map(item => item.id)),
    ).toEqual(religiousSections.map(section => section.id));
    await expect(page.locator('#faq .faq-item__question')).toHaveText(
      faq.items.map(item => item.question),
    );
    await expect(page.locator('#faq .faq-item__answer')).toHaveText(
      faq.items.map(item => item.answer),
    );
    await expect(page.locator('#prices .service-price-card')).toHaveCount(4);
    await expect(main.locator(`a[href="${actPath}"]`)).toHaveCount(0);
    await expect(main.locator('input[type="file"]')).toHaveCount(0);
    await expectContentVisible(page);

    await page
      .locator('.religious-hero')
      .getByRole('link', { name: 'Заказать паспорт', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${religiousPath}#lead-form$`));
    await expect(page.locator('#lead-form')).toBeInViewport();
  });
});

test('religious SEO, schemas, prices and internal links describe one canonical service', async ({
  page,
  request,
}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(religiousPath);
  await expect(page).toHaveTitle(religiousTitle);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    religiousDescription,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', religiousUrl);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index,follow/);
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
  expect(schemas.find(schema => schema['@type'] === 'Service')).toMatchObject({
    name: 'Паспорт безопасности религиозной организации',
    url: religiousUrl,
    description: religiousDescription,
  });
  expect(schemas.find(schema => schema['@type'] === 'WebPage')?.url).toBe(religiousUrl);
  expect(
    schemas.find(schema => schema['@type'] === 'BreadcrumbList')?.itemListElement,
  ).toMatchObject([
    { position: 1, item: 'https://pasport-bezopasnosty.ru' },
    { position: 2, item: religiousUrl },
  ]);
  await expect(
    page.getByRole('navigation', { name: 'Хлебные крошки', exact: true }).getByRole('link'),
  ).toHaveAttribute('href', '/');

  await expect(page.locator('#prices .service-price-card')).toHaveCount(4);
  await expect(page.locator('#prices .service-price-card h3')).toHaveText(
    pricing.items.map(item => item.title),
  );
  expect(
    await page
      .locator('#prices .service-price-card__price-line')
      .evaluateAll(elements => elements.map(element => element.textContent.replace(/\s/g, ''))),
  ).toEqual(['9500₽', '9500₽', 'от9500₽', 'от35000₽']);
  await expect(page.locator(`main a[href="${actPath}"]`)).toHaveCount(0);
  await expect(page.locator(`#actualization a[href="${actualizationPath}"]`)).toHaveCount(1);
  const externalLinks = await page.locator('main a[href]').evaluateAll(links =>
    links
      .filter(link => {
        const url = new URL(link.href);
        return (
          /^https?:$/.test(url.protocol) &&
          ![location.origin, 'https://pasport-bezopasnosty.ru'].includes(url.origin)
        );
      })
      .map(link => link.href),
  );
  expect(externalLinks).toEqual([]);
  const duplicateIds = await page.locator('[id]').evaluateAll(elements => {
    const ids = elements.map(element => element.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicateIds).toEqual([]);

  for (const path of ['/sitemap.xml', '/sitemap-google.xml']) {
    const sitemap = await request.get(path);
    expect(sitemap.status()).toBe(200);
    expect((await sitemap.text()).split(`<loc>${religiousUrl}</loc>`)).toHaveLength(2);
  }
  expect(errors).toEqual([]);
});

test('religious home card and both directories preserve the categorization act link', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const cookieDismiss = page.getByRole('button', { name: 'Понятно', exact: true });
    if (await cookieDismiss.isVisible()) await cookieDismiss.click();

    const card = page.locator(`.object-type-card[href="${religiousPath}"]`);
    await expect(card).toContainText(religiousObjectType);
    const illustration = card.getByRole('img', { name: religiousObjectType, exact: true });
    await expect(illustration).toHaveCount(1);
    await expect(illustration).toHaveAttribute('src', '/images/illustrations/overview.webp');
    await illustration.scrollIntoViewIfNeeded();
    await expect(illustration).toBeVisible();
    await expect
      .poll(() => illustration.evaluate(image => image.complete && image.naturalWidth > 0))
      .toBe(true);
    const regulation = page.locator('#requirements-by-object tbody tr').filter({
      has: page.locator(`a[href="${religiousPath}"]`),
    });
    await expect(regulation.locator('.regulation-guide__act')).toHaveText('ПП РФ № 1165');
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${religiousPath}$`));

    let directory = await openDirectory(page, width);
    await expect(directory.locator(`a[href="${religiousPath}"]`)).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(directory.locator(`a[href="${actPath}"]`)).toBeVisible();
    await expect(directory.locator(`a[href="${actualizationPath}"]`)).toBeVisible();
    await directory.locator(`a[href="${actPath}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${actPath}$`));

    await page.goto('/');
    directory = await openDirectory(page, width);
    await directory.locator(`a[href="${religiousPath}"]`).click();
    await expect(page.locator('h1')).toHaveText(religiousH1);
  }
});

test('all religious enquiries preserve context and require a subtype before local email submission', async ({
  page,
  request,
}) => {
  const health = await request.get('/api/health');
  expect(health.status()).toBe(200);
  expect(await health.json()).toMatchObject({
    environment: 'test',
    transports: { backup: true, telegram: false, email: false },
  });
  let submissions = 0;
  await page.route('**/api/leads', async route => {
    expect(new URL(route.request().url()).origin).toBe(new URL(page.url()).origin);
    submissions += 1;
    await route.continue();
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(religiousPath);
  const form = page.locator('#lead-form');
  const subtype = form.getByRole('combobox', { name: 'Тип религиозного объекта *', exact: true });
  const comment = 'Нужен паспорт храма, исходные документы готовы.';
  await expect(subtype).toHaveAttribute('required', '');
  await expect(subtype.locator('option')).toHaveText([
    'Выберите тип объекта',
    ...religiousObjectOptions,
  ]);
  await expect(subtype.locator('option:not([value=""])')).toHaveCount(7);
  await form.getByLabel('Ваше имя', { exact: false }).fill('Анна');
  await form.getByLabel('Электронная почта', { exact: true }).fill('religious-e2e@example.com');
  await form.getByRole('textbox', { name: 'Комментарий', exact: true }).fill(comment);
  await form.locator('input[name="consent"]').check();
  await form.getByRole('button', { name: 'Отправить заявку', exact: false }).click();
  await expect(form.locator('#final-cta-status')).toHaveText('Выберите тип религиозного объекта.');
  await expect(subtype).toHaveAttribute('aria-invalid', 'true');
  expect(submissions).toBe(0);

  await subtype.selectOption('Храм');
  await expect(subtype).not.toHaveAttribute('aria-invalid');
  const selections = [
    ...religiousHeroActions.map(action => ['.religious-hero', action.label, action.service]),
    ...religiousSections
      .filter(section => section.action)
      .map(section => [`#${section.id}`, section.action.label, section.action.service]),
    ...pricing.items.map(item => ['#prices', `Заказать: ${item.title}`, item.service]),
  ];
  await expect(page.locator('main a[href="#lead-form"]')).toHaveCount(selections.length);
  for (const [section, label, service] of selections) {
    await page.locator(section).getByRole('link', { name: label, exact: true }).click();
    await expect(form.locator('output[name="service"]')).toHaveText(service);
    await expect(form.getByRole('textbox', { name: 'Комментарий', exact: true })).toHaveValue(
      comment,
    );
    await expect(subtype).toHaveValue('Храм');
  }
  await page
    .locator('#examination-act')
    .getByRole('link', { name: examinationAct.action.label, exact: true })
    .click();
  const submitted = page.waitForResponse(
    response =>
      new URL(response.url()).pathname === '/api/leads' && response.request().method() === 'POST',
  );
  await form.getByRole('button', { name: 'Отправить заявку', exact: false }).click();
  const response = await submitted;
  expect(response.status()).toBe(201);
  const payload = response.request().postDataJSON();
  expect(await response.json()).toMatchObject({ ok: true, requestId: payload.requestId });
  expect(submissions).toBe(1);
  expect(payload.source).toBe('passport-security-final-cta');
  expect(payload.data.phone).toBe('');
  expect(payload.data.email).toBe('religious-e2e@example.com');
  expect(payload.data.object).toContain(`Тип объекта: ${religiousObjectType}`);
  expect(payload.data.object).toContain('Тип религиозного объекта: Храм');
  expect(payload.data.object).toContain(`Услуга: ${examinationAct.action.service}`);
  expect(payload.data.object).toContain(comment);
  expect(payload.data).not.toHaveProperty('objectType');
  expect(payload.data).not.toHaveProperty('selectedObjectType');
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
  await expect(subtype).toHaveValue('');
  await expect(form.getByRole('textbox', { name: 'Комментарий', exact: true })).toHaveValue('');
});

test('religious content fits mobile through desktop and stays visible with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(religiousPath);
    await page.locator('.religious-page details').evaluateAll(disclosures => {
      disclosures.forEach(disclosure => {
        disclosure.open = true;
      });
    });
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      tables: [...document.querySelectorAll('.religious-table')].map(element => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right };
      }),
      headings: [...document.querySelectorAll('.religious-page :is(h1, h2, h3)')].map(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const bounds = element.getBoundingClientRect();
        return {
          text: element.textContent,
          left: bounds.left,
          right: bounds.right,
          lines: [...range.getClientRects()].map(line => ({ left: line.left, right: line.right })),
        };
      }),
    }));
    expect(layout.width, `${width}px page overflow`).toBeLessThanOrEqual(width);
    expect(layout.tables.length).toBeGreaterThan(0);
    for (const table of layout.tables) {
      expect(table.left).toBeGreaterThanOrEqual(0);
      expect(table.right).toBeLessThanOrEqual(width);
    }
    for (const heading of layout.headings) {
      for (const line of heading.lines) {
        expect(line.left, heading.text).toBeGreaterThanOrEqual(heading.left - 1);
        expect(line.right, heading.text).toBeLessThanOrEqual(heading.right + 1);
      }
    }
  }

  await page.locator('#prices .service-price-card').first().scrollIntoViewIfNeeded();
  await page.evaluate(
    () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  const animated = await page
    .locator('.religious-page [data-scroll-reveal]')
    .evaluateAll(elements =>
      elements
        .filter(
          element =>
            getComputedStyle(element).animationName !== 'none' ||
            element.getAnimations().some(animation => animation.playState === 'running'),
        )
        .map(element => element.textContent.trim().slice(0, 100)),
    );
  expect(animated).toEqual([]);
  await expectContentVisible(page);
});

test('religious FAQ works with the keyboard and keeps its CSS plus centered', async ({ page }) => {
  await page.goto(religiousPath);
  const item = faq.items[1];
  const question = page.getByRole('button', { name: item.question, exact: true });
  await question.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq .faq-item__panel:visible')).toHaveCount(1);
  await expect(page.locator(`#faq-panel-${item.id}`)).toContainText(item.answer);
  const offsets = await question.locator('.faq-item__icon').evaluate(icon => {
    const circle = icon.getBoundingClientRect();
    return [...icon.querySelectorAll('span')].map(line => {
      const bounds = line.getBoundingClientRect();
      return {
        x: bounds.x + bounds.width / 2 - circle.x - circle.width / 2,
        y: bounds.y + bounds.height / 2 - circle.y - circle.height / 2,
      };
    });
  });
  expect(offsets).toHaveLength(2);
  for (const offset of offsets) {
    expect(Math.abs(offset.x)).toBeLessThan(1);
    expect(Math.abs(offset.y)).toBeLessThan(1);
  }
  await question.press('Space');
  await expect(question).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq .faq-item__panel:visible')).toHaveCount(0);

  const disclosure = page.locator('#prices .religious-disclosure');
  await disclosure.locator('summary').press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(disclosure.locator('.religious-disclosure__content')).toBeVisible();
  await disclosure.locator('summary').press('Space');
  await expect(disclosure).not.toHaveAttribute('open', '');
});

test('religious reveals progressively and all eight process steps track scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(religiousPath);
  const reveal = page.locator('#prices .service-price-card').first();
  await expect(reveal).not.toHaveAttribute('data-scroll-visible');
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveAttribute('data-scroll-visible', '');

  const steps = page.locator('#process .process-step');
  await expect(steps).toHaveCount(8);
  await expect(steps.locator('h3')).toHaveText(processSection.steps.map(step => step.title));
  for (const index of [0, 4]) {
    await steps
      .nth(index)
      .locator('.process-step__observer')
      .evaluate(element => {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
          behavior: 'instant',
        });
      });
    await expect(steps.nth(index)).toHaveClass(/process-step--active/);
  }
  await expect(steps.first()).not.toHaveClass(/process-step--active/);
  const intro = page.locator('#process .religious-intro');
  await expect(intro).toHaveCSS('position', 'sticky');
  await expect(intro).toHaveCSS('top', '110px');
  await expect.poll(async () => Math.round((await intro.boundingBox())?.y ?? -1)).toBe(110);
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(intro).toHaveCSS('position', 'static');
});
