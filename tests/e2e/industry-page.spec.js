import { expect, test } from '@playwright/test';

const industryPath = '/pasport-bezopasnosti-obekta-promyshlennosti/';
const industryUrl = `https://pasport-bezopasnosty.ru${industryPath}`;
const industryTitle =
  'Паспорт безопасности объекта промышленности по ПП № 258 — от 9 500 ₽ | БОЙКОВГРУПП';
const industryH1 = 'Паспорт безопасности объекта промышленности — разработка и согласование';
const actService = 'Акт категорирования промышленного объекта';
const forbiddenActPath = '/akt-obsledovaniya-i-kategorirovaniya-obekta/';

async function expectIndustryContentVisible(page) {
  const hiddenContent = await page
    .locator(
      '.industry-hero, .industry-hero [data-industry-reveal], .industry-section h2, .industry-price-card, .industry-approval-timeline__item, .industry-copy-register__row, .industry-document-register__item',
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
        .map(element => element.textContent.trim().slice(0, 120)),
    );

  expect(hiddenContent).toEqual([]);
}

test('industry landing prerenders its SEO, complete FAQ and approved internal links', async ({
  page,
  request,
}) => {
  const response = await request.get(industryPath);
  expect(response.status()).toBe(200);

  const html = await response.text();
  expect(html).toContain('ГОСТ Р 72551-2026');
  expect(html).toContain('Акт категорирования объекта (территории) промышленности.');
  expect(html).toContain('не означает обязательного завершения всех работ');
  expect(html.match(/class="faq-item__answer"/g)).toHaveLength(18);
  expect(html).not.toContain(`href="${forbiddenActPath}"`);
  expect(html).not.toContain('Для программиста');

  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(industryPath);
  await expect(page).toHaveTitle(industryTitle);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText(industryH1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', industryUrl);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index,follow/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Разработка паспорта безопасности промышленного объекта по ПП РФ № 258. Категорирование, подготовка акта категорирования и согласование. От 9 500 ₽. Работаем по России.',
  );
  await expect(page.locator('.industry-section h2')).toHaveCount(16);
  await expect(page.locator('#faq .faq-item__panel')).toHaveCount(18);
  await expect(page.locator('.industry-table-scroll')).toHaveCount(2);
  await expect(page.locator('#categorization thead th')).toHaveText([
    'Категория',
    'Прогнозируемое количество пострадавших',
    'Возможный материальный и экологический ущерб',
  ]);
  await expect(page.locator('#categorization tbody tr')).toHaveCount(3);
  await expect(page.locator('#service thead th')).toHaveText(['Работа', 'Результат']);
  await expect(page.locator('#service tbody tr')).toHaveCount(8);

  const approvalItems = page.locator('#approval .industry-approval-timeline__item');
  await expect(approvalItems).toHaveCount(3);
  await expect(approvalItems.locator('dt')).toHaveText([
    'Направление паспорта на согласование',
    'Согласование соответствующим органом',
    'Утверждение руководителем объекта',
  ]);
  await expect(approvalItems.locator('dd')).toHaveText([
    'В течение 3 рабочих дней после разработки',
    'В течение 10 рабочих дней со дня поступления',
    'Не позднее 3 рабочих дней после получения последней согласующей подписи',
  ]);

  const copyRows = page.locator('#copies .industry-copy-register__row');
  await expect(copyRows).toHaveCount(5);
  await expect(copyRows.locator('dt')).toHaveText([
    'Первый',
    'Второй',
    'Третий',
    'Четвёртый',
    'Пятый',
  ]);
  await expect(copyRows.locator('dd')).toHaveText([
    'Хранится у руководителя промышленного объекта',
    'Минпромторг России',
    'Уполномоченный исполнительный орган субъекта РФ',
    'Территориальный орган безопасности',
    'Территориальный орган МЧС России',
  ]);

  const documentItems = page.locator('#documents .industry-document-register__item');
  await expect(documentItems).toHaveCount(9);
  await expect(documentItems.locator('dt')).toHaveText([
    'Организация',
    'Объект',
    'Производственные площадки',
    'Территория',
    'Персонал',
    'Категорирование',
    'Паспорт',
    'Техническая документация',
    'Антитеррористическая защищённость',
  ]);
  await expect(documentItems.locator('dd')).toHaveText([
    'Наименование, реквизиты, правообладатель',
    'Адрес, назначение, характеристики',
    'Общие сведения о расположении и взаимосвязи',
    'Площадь и основные характеристики',
    'Численность работников и иных лиц',
    'Действующий акт категорирования при наличии',
    'Ранее утверждённый паспорт при наличии',
    'Необходимые исходные материалы',
    'Сведения в объёме, предусмотренном требованиями',
  ]);

  await expect(page.locator('#prices .industry-price-card')).toHaveCount(4);
  expect(await page.locator('#prices .industry-price-card__price-line').allTextContents()).toEqual([
    '9 500 ₽',
    '9 500 ₽',
    'от9 500 ₽',
    'от35 000 ₽',
  ]);

  await expect(
    page.getByRole('link', { name: 'Разработка паспорта безопасности объекта', exact: true }),
  ).toHaveAttribute('href', '/');
  await expect(
    page.getByRole('link', { name: 'Актуализация паспорта безопасности объекта', exact: true }),
  ).toHaveAttribute('href', '/aktualizaciya-pasporta-bezopasnosti-obekta/');

  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll(scripts => scripts.map(script => JSON.parse(script.textContent)));
  expect(schemas.filter(schema => schema['@type'] === 'Organization')).toHaveLength(1);
  expect(schemas.find(schema => schema['@type'] === 'Service')?.url).toBe(industryUrl);
  expect(schemas.find(schema => schema['@type'] === 'BreadcrumbList')).toBeTruthy();

  const externalWebLinks = await page.locator('a[href]').evaluateAll(anchors =>
    anchors
      .map(anchor => anchor.getAttribute('href'))
      .filter(href => /^https?:|^\/\//.test(href))
      .filter(href => new URL(href, location.href).hostname !== 'pasport-bezopasnosty.ru'),
  );
  expect(externalWebLinks).toEqual([]);
  expect(errors).toEqual([]);

  const sitemap = await request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain(`<loc>${industryUrl}</loc>`);
});

test('industry act enquiry preserves its service and comment and accepts an email contact', async ({
  page,
}) => {
  let submittedLead;

  await page.route('**/api/leads', async route => {
    submittedLead = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, requestId: submittedLead.requestId }),
    });
  });

  await page.goto(industryPath);
  const form = page.locator('#lead-form');
  const comment = 'Нужно подготовить документы для производственной площадки.';
  await form.getByRole('textbox', { name: 'Комментарий', exact: true }).fill(comment);

  await page
    .getByRole('link', { name: 'Заказать акт категорирования промышленного объекта', exact: true })
    .click();
  await expect(form.locator('output[name="service"]')).toHaveText(actService);
  await expect(form.locator('output[name="objectType"]')).toHaveText('Объекты промышленности');
  await expect(form.getByRole('textbox', { name: 'Комментарий', exact: true })).toHaveValue(
    comment,
  );

  await form.getByLabel('Ваше имя', { exact: false }).fill('Иван');
  await form.getByLabel('Электронная почта', { exact: true }).fill('ivan@example.com');
  await form.locator('input[name="consent"]').check();
  await form.getByRole('button', { name: 'Отправить заявку', exact: false }).click();

  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
  expect(submittedLead.source).toBe('passport-security-final-cta');
  expect(submittedLead.data.phone).toBe('');
  expect(submittedLead.data.email).toBe('ivan@example.com');
  expect(submittedLead.data.object).toContain(`Услуга: ${actService}`);
  expect(submittedLead.data.object).toContain('Тип объекта: Объекты промышленности');
  expect(submittedLead.data.object).toContain(comment);
  await expect(form.locator('output[name="service"]')).toHaveText(actService);

  await page.getByRole('link', { name: 'Заказать: Комплекс под ключ', exact: true }).click();
  await expect(form.locator('output[name="service"]')).toHaveText('Комплекс под ключ');

  const question = page.getByRole('button', {
    name: /Сколько экземпляров паспорта необходимо оформить/,
  });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq .faq-item__panel:visible')).toContainText('Пять экземпляров.');
});

test('industry process follows scrolling and adapts its sticky introduction', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(industryPath);

  const intro = page.locator('.industry-process-layout > .industry-section-intro');
  const firstStep = page.locator('#process .process-step').filter({
    has: page.getByRole('heading', { name: 'Проверка требований', exact: true }),
  });
  const laterStep = page.locator('#process .process-step').filter({
    has: page.getByRole('heading', { name: 'Акт категорирования', exact: true }),
  });

  await firstStep.locator('.process-step__observer').evaluate(element => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
      behavior: 'instant',
    });
  });
  await expect(firstStep).toHaveClass(/process-step--active/);

  await laterStep.locator('.process-step__observer').evaluate(element => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
      behavior: 'instant',
    });
  });
  await expect(laterStep).toHaveClass(/process-step--active/);
  await expect(firstStep).not.toHaveClass(/process-step--active/);
  await expect(intro).toHaveCSS('position', 'sticky');
  await expect(intro).toHaveCSS('top', '110px');
  await expect.poll(async () => Math.round((await intro.boundingBox())?.y ?? -1)).toBe(110);

  await page.setViewportSize({ width: 375, height: 900 });
  await expect(intro).toHaveCSS('position', 'static');
});

test('industry content remains visible without reveal animation in reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(industryPath);
  await expect(page.locator('h1')).toHaveText(industryH1);

  await page.locator('#copies .industry-copy-register__row').first().scrollIntoViewIfNeeded();
  await page.evaluate(
    () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );

  const animatedContent = await page
    .locator('.industry-page [data-industry-reveal]')
    .evaluateAll(elements =>
      elements
        .filter(
          element =>
            getComputedStyle(element).animationName !== 'none' ||
            element.getAnimations().some(animation => animation.playState === 'running'),
        )
        .map(element => element.textContent.trim().slice(0, 120)),
    );
  expect(animatedContent).toEqual([]);
  await expectIndustryContentVisible(page);
});

test.describe('industry conditions without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('content stays visible and production site conditions work with the keyboard', async ({
    page,
  }) => {
    await page.goto(industryPath);
    await expect(page.locator('h1')).toHaveText(industryH1);
    await expect(page.locator('#copies .industry-copy-register__row').first()).toBeVisible();
    await expectIndustryContentVisible(page);

    const disclosure = page.locator('#objects .industry-disclosure');
    const summary = disclosure.locator('summary');
    const condition = disclosure.getByText(
      'Согласно пункту 7 ПП РФ № 258 технологически или технически связанные производственные площадки при предусмотренных условиях могут категорироваться как один объект.',
      { exact: true },
    );

    await expect(summary).toHaveText('Нужен ли отдельный паспорт каждой производственной площадке');
    await expect(condition).toHaveCount(1);
    await expect(condition).toBeHidden();
    await expect(disclosure).not.toHaveAttribute('open');

    await summary.focus();
    await expect(summary).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('open', '');
    await expect(condition).toBeVisible();

    await page.keyboard.press('Space');
    await expect(disclosure).not.toHaveAttribute('open');
    await expect(condition).toBeHidden();
  });
});

for (const width of [375, 1440]) {
  test(`industry landing is reachable from home and the ${width}px directory`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const card = page.locator(`.object-type-card[href="${industryPath}"]`);
    await expect(card).toContainText('Объекты промышленности');
    await expect(card).toContainText(
      'Подготовка акта категорирования и сопровождение согласования.',
    );
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${industryPath}$`));
    await expect(page.locator('h1')).toHaveText(industryH1);

    if (width < 1180) {
      await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
      await expect(
        page.locator('.site-nav__mobile-directory').getByRole('link', {
          name: 'Объекты промышленности',
          exact: false,
        }),
      ).toHaveAttribute('aria-current', 'page');
      await page.locator('.site-header__menu-toggle').click();
    } else {
      await page.getByRole('button', { name: 'Все разделы', exact: true }).click();
      await expect(
        page.locator('#site-directory').getByRole('link', {
          name: 'Объекты промышленности',
          exact: false,
        }),
      ).toHaveAttribute('aria-current', 'page');
      await page.locator('#site-directory').getByRole('button', { name: 'Закрыть меню' }).click();
    }

    await expect(page.locator(`a[href="${forbiddenActPath}"]`)).toHaveCount(0);

    await page.locator('.industry-disclosure').evaluateAll(disclosures => {
      disclosures.forEach(disclosure => {
        disclosure.open = true;
      });
    });

    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth,
      page: document.documentElement.scrollWidth,
      tables: [...document.querySelectorAll('.industry-table-scroll')].map(element => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, width: element.clientWidth };
      }),
      headings: [...document.querySelectorAll('.industry-page :is(h1, h2, h3)')].map(element => {
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
    expect(layout.page).toBeLessThanOrEqual(layout.viewport);
    expect(layout.tables).toHaveLength(2);
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
  });
}
