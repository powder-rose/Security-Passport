import { expect, test } from '@playwright/test';

const agriculturePath = '/pasport-bezopasnosti-obekta-minselhoza/';
const agricultureUrl = `https://pasport-bezopasnosty.ru${agriculturePath}`;
const agricultureH1 = 'Паспорт безопасности объекта Минсельхоза — разработка по ПП РФ № 1270';
const agricultureObjectType = 'Объекты Минсельхоза';
const actPath = '/akt-obsledovaniya-i-kategorirovaniya-obekta/';
const actualizationPath = '/aktualizaciya-pasporta-bezopasnosti-obekta/';
const passportService = 'Разработка паспорта безопасности';
const actService = 'Подготовка акта обследования и категорирования';

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
    .locator('.agriculture-hero, .agriculture-section h2, .service-price-card, .process-step')
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

test.describe('agriculture landing without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('prerendered content includes the complete FAQ and qualified regulatory terms', async ({
    page,
    request,
  }) => {
    const response = await request.get(agriculturePath);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html.match(/class="faq-item__answer"/g)).toHaveLength(16);
    expect(html).not.toContain('Для программиста');
    expect(html).not.toContain('Wordstat');

    await page.goto(agriculturePath);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(agricultureH1);
    await expect(page.locator('.agriculture-section h2')).toHaveCount(16);
    await expect(page.locator('#faq .faq-item__answer')).toHaveCount(16);
    const questions = await page.locator('#faq .faq-item__question').allTextContents();
    expect(new Set(questions).size).toBe(16);
    const answers = await page.locator('#faq .faq-item__answer').allTextContents();
    expect(answers.every(answer => answer.trim().length > 30)).toBe(true);

    await expect(page.locator('#objects')).toContainText(
      'Не каждое сельскохозяйственное предприятие',
    );
    await expect(page.locator('#categorization')).toContainText(
      'Подрядная организация не присваивает её самостоятельно.',
    );
    await expect(page.locator('#process')).toContainText(
      'в течение 30 дней после утверждения акта',
    );
    await expect(page.locator('#approval')).toContainText(
      'не является гарантированным общим сроком',
    );
    await expect(page.locator('#copies')).toContainText('составляется в одном экземпляре');
    await expect(page.locator('#actualization')).toContainText('Не реже одного раза в 3 года');
    await expect(page.locator('#actualization')).toContainText('Не реже одного раза в 5 лет');
    await expect(page.locator('#actualization')).toContainText('в течение двух месяцев');
    await expect(page.locator('#regulation-changes')).toContainText('до 2 сентября 2027 года');
    await expect(page.locator('#regulation-changes')).toContainText(
      'не утратил действие автоматически',
    );
    await expect(page.locator(`#categorization-act a[href="${actPath}"]`)).toHaveCount(1);
    await expect(page.locator(`#actualization a[href="${actualizationPath}"]`)).toHaveCount(1);
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    await expectContentVisible(page);

    await page
      .locator('.agriculture-hero')
      .getByRole('link', { name: 'Заказать паспорт', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${agriculturePath}#lead-form$`));
    await expect(page.locator('#lead-form')).toBeInViewport();
  });
});

test('agriculture SEO, schemas, sitemap and internal links describe one canonical service page', async ({
  page,
  request,
}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(agriculturePath);
  await expect(page).toHaveTitle(
    'Паспорт безопасности объекта Минсельхоза по ПП № 1270 — от 9 500 ₽ | БОЙКОВГРУПП',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', agricultureUrl);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index,follow/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Разработка паспорта безопасности по ПП РФ № 1270 для объектов Минсельхоза, Россельхознадзора и Росрыболовства. Категорирование, акт, согласование. От 9 500 ₽.',
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
  expect(schemas.find(schema => schema['@type'] === 'Service')?.url).toBe(agricultureUrl);
  expect(
    schemas.find(schema => schema['@type'] === 'BreadcrumbList')?.itemListElement,
  ).toMatchObject([
    { position: 1, item: 'https://pasport-bezopasnosty.ru' },
    { position: 2, item: agricultureUrl },
  ]);
  await expect(
    page.getByRole('navigation', { name: 'Хлебные крошки', exact: true }).getByRole('link'),
  ).toHaveAttribute('href', '/');

  const externalLinks = await page.locator('a[href]').evaluateAll(links =>
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
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect((await sitemap.text()).split(`<loc>${agricultureUrl}</loc>`)).toHaveLength(2);
  expect(errors).toEqual([]);
});

test('agriculture is reachable from home and both directories preserve the categorization act', async ({
  page,
}) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const cookieDismiss = page.getByRole('button', { name: 'Понятно', exact: true });
    if (await cookieDismiss.isVisible()) await cookieDismiss.click();

    const card = page.locator(`.object-type-card[href="${agriculturePath}"]`);
    await expect(card).toContainText(agricultureObjectType);
    await expect(card).toContainText('Россельхознадзора и Росрыболовства');
    const regulation = page.locator('#requirements-by-object tbody tr').filter({
      has: page.locator(`a[href="${agriculturePath}"]`),
    });
    await expect(regulation.locator('.regulation-guide__act')).toHaveText('ПП РФ № 1270');
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${agriculturePath}$`));

    let directory = await openDirectory(page, width);
    await expect(directory.locator(`a[href="${agriculturePath}"]`)).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(directory.locator(`a[href="${actPath}"]`)).toBeVisible();
    await directory.locator(`a[href="${actPath}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${actPath}$`));

    for (const path of [
      '/pasport-bezopasnosti-obekta-promyshlennosti/',
      '/pasport-bezopasnosti-obekta-tek/',
    ]) {
      await page.goto(path);
      directory = await openDirectory(page, width);
      await expect(directory.locator(`a[href="${actPath}"]`)).toBeVisible();
    }

    await page.goto('/');
    directory = await openDirectory(page, width);
    await directory.locator(`a[href="${agriculturePath}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${agriculturePath}$`));
    await expect(page.locator('h1')).toHaveText(agricultureH1);
  }
});

test('agriculture enquiry retains the service and comment and the local API accepts email without phone', async ({
  page,
  request,
}) => {
  const health = await request.get('/api/health');
  expect(health.status()).toBe(200);
  expect(await health.json()).toMatchObject({
    environment: 'test',
    transports: { backup: true, telegram: false, email: false },
  });

  await page.route('**/api/leads', async route => {
    expect(new URL(route.request().url()).origin).toBe(new URL(page.url()).origin);
    await route.continue();
  });
  await page.goto(agriculturePath);
  const form = page.locator('#lead-form');
  const comment = 'Есть паспорт по постановлению № 836, нужна проверка документов объекта.';
  await form.getByRole('textbox', { name: 'Комментарий', exact: true }).fill(comment);

  for (const [section, label, service] of [
    ['.agriculture-hero', 'Заказать паспорт', passportService],
    ['#prices', 'Заказать: Комплекс под ключ', 'Комплекс под ключ'],
    ['#categorization-act', 'Заказать акт обследования и категорирования', actService],
  ]) {
    await page.locator(section).getByRole('link', { name: label, exact: true }).click();
    await expect(form.locator('output[name="service"]')).toHaveText(service);
    await expect(form.getByRole('textbox', { name: 'Комментарий', exact: true })).toHaveValue(
      comment,
    );
  }
  await expect(form.locator('output[name="objectType"]')).toHaveText(agricultureObjectType);
  await form.getByLabel('Ваше имя', { exact: false }).fill('Анна');
  await form.getByLabel('Электронная почта', { exact: true }).fill('agriculture-e2e@example.com');
  await form.locator('input[name="consent"]').check();

  const submitted = page.waitForResponse(
    response =>
      new URL(response.url()).pathname === '/api/leads' && response.request().method() === 'POST',
  );
  await form.getByRole('button', { name: 'Отправить заявку', exact: false }).click();
  const response = await submitted;
  expect(response.status()).toBe(201);
  const payload = response.request().postDataJSON();
  expect(await response.json()).toMatchObject({ ok: true, requestId: payload.requestId });
  expect(payload.source).toBe('passport-security-final-cta');
  expect(payload.data.phone).toBe('');
  expect(payload.data.email).toBe('agriculture-e2e@example.com');
  expect(payload.data.object).toContain(`Тип объекта: ${agricultureObjectType}`);
  expect(payload.data.object).toContain(`Услуга: ${actService}`);
  expect(payload.data.object).toContain(comment);
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
});

test('agriculture informational enquiries and centered disclosure icons work with the keyboard', async ({
  page,
}) => {
  await page.goto(agriculturePath);
  for (const [section, label] of [
    ['.agriculture-hero', 'Проверить требования для объекта'],
    ['#passport-form', 'Получить форму паспорта по ПП РФ № 1270'],
    ['#regulation-changes', 'Проверить паспорт по ПП РФ № 836'],
  ]) {
    const action = page.locator(section).getByRole('link', { name: label, exact: true });
    await expect(action).toHaveAttribute('href', '#lead-form');
    await action.click();
    await expect(page.locator('#lead-form output[name="service"]')).toHaveText(label);
  }

  const disclosure = page.locator('.agriculture-price-disclosure');
  const summary = disclosure.locator('summary');
  await summary.scrollIntoViewIfNeeded();
  const iconState = () =>
    summary.evaluate(element => {
      const style = getComputedStyle(element, '::after');
      return {
        width: style.width,
        height: style.height,
        positions: style.backgroundPosition.split(',').map(position => position.trim()),
        sizes: style.backgroundSize
          .split(',')
          .map(size => size.trim().split(/\s+/).map(parseFloat)),
        content: style.content,
      };
    });
  const closed = await iconState();
  expect(closed.width).toBe(closed.height);
  expect(closed.content).toBe('""');
  expect(closed.positions).toEqual(['50% 50%', '50% 50%']);
  expect(closed.sizes[0][0]).toBeGreaterThan(closed.sizes[0][1]);
  expect(closed.sizes[1][1]).toBeGreaterThan(closed.sizes[1][0]);
  await summary.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect.poll(async () => (await iconState()).sizes[1][1]).toBe(0);
  await expect(disclosure.locator('.agriculture-price-disclosure__body')).toBeVisible();
  await summary.press('Space');
  await expect(disclosure).not.toHaveAttribute('open', '');
  await expect.poll(iconState).toEqual(closed);

  const question = page.getByRole('button', {
    name: 'Нужно ли переоформлять паспорт по № 836?',
    exact: true,
  });
  await question.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq .faq-item__panel:visible')).toHaveCount(1);
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
});

test('agriculture reveals progressively and its eight process steps track scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(agriculturePath);
  const reveal = page.locator('#prices .service-price-card').first();
  await expect(reveal).not.toHaveAttribute('data-scroll-visible');
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveAttribute('data-scroll-visible', '');

  const steps = page.locator('#process .process-step');
  await expect(steps).toHaveCount(8);
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
  const intro = page.locator('#process .agriculture-section-intro');
  await expect(intro).toHaveCSS('position', 'sticky');
  await expect.poll(async () => Math.round((await intro.boundingBox())?.y ?? -1)).toBe(110);
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(intro).toHaveCSS('position', 'static');
});

test('agriculture content and its comparison table fit mobile, tablet and desktop widths', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(agriculturePath);
    await page.locator('.agriculture-page details').evaluateAll(disclosures => {
      disclosures.forEach(disclosure => {
        disclosure.open = true;
      });
    });
    await expect(page.locator('#regulation-changes table tbody tr')).toHaveCount(7);
    await expect(page.locator('#prices .service-price-card')).toHaveCount(4);
    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth,
      page: document.documentElement.scrollWidth,
      tables: [...document.querySelectorAll('.agriculture-table-scroll')].map(element => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right };
      }),
      headings: [...document.querySelectorAll('.agriculture-page :is(h1, h2, h3)')].map(element => {
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
    expect(layout.page, `${width}px page overflow`).toBeLessThanOrEqual(width);
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
});

test('agriculture content remains visible with reduced motion and stops reveal animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(agriculturePath);
  await page.locator('#prices .service-price-card').first().scrollIntoViewIfNeeded();
  await page.evaluate(
    () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  const animated = await page
    .locator('.agriculture-page [data-scroll-reveal]')
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
