import { expect, test } from '@playwright/test';

const energyPath = '/pasport-bezopasnosti-obekta-tek/';
const energyUrl = `https://pasport-bezopasnosty.ru${energyPath}`;
const energyTitle = 'Паспорт безопасности ТЭК и категорирование — от 9 500 ₽ | БОЙКОВГРУПП';
const energyH1 = 'Паспорт безопасности объекта ТЭК — разработка и категорирование';
const energyObjectType = 'Объекты топливно-энергетического комплекса';
const passportService = 'Разработка паспорта безопасности ТЭК';
const categorizationService = 'Категорирование объектов ТЭК';
const forbiddenActPath = '/akt-obsledovaniya-i-kategorirovaniya-obekta/';
const faqQuestions = [
  'Кому нужен паспорт безопасности объекта ТЭК?',
  'Какое постановление регулирует категорирование объектов ТЭК?',
  'Кто определяет категорию опасности объекта ТЭК?',
  'Какие категории опасности существуют?',
  'Что такое акт категорирования объекта ТЭК?',
  'Можно ли заказать только паспорт безопасности?',
  'Сколько стоит разработка паспорта безопасности ТЭК?',
  'Сколько стоит категорирование объекта ТЭК?',
  'Каким документом утверждена форма паспорта ТЭК?',
  'С кем согласовывается паспорт безопасности ТЭК?',
  'Нужно ли менять паспорт ТЭК каждые три года?',
  'Можно ли скачать заполненный образец паспорта?',
];

async function expectEnergyContentVisible(page) {
  const hiddenContent = await page
    .locator(
      '.energy-hero, .energy-section h2, #services h3, #prices .service-price-card, #process .process-step',
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

async function centerProcessStep(step) {
  await step.locator('.process-step__observer').evaluate(element => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
      behavior: 'instant',
    });
  });
}

test('energy landing prerenders its approved content, SEO and complete FAQ', async ({
  page,
  request,
}) => {
  const response = await request.get(energyPath);
  expect(response.status()).toBe(200);

  const html = await response.text();
  expect(html.match(/class="faq-item__answer"/g)).toHaveLength(12);
  for (const question of faqQuestions) {
    expect(html).toContain(question);
  }
  expect(html).toContain('03.12.2022 № 3722-р');
  expect(html).toContain('категория опасности может не присваиваться');
  expect(html).toContain('не предусматривает универсальной обязательной замены');
  expect(html).toContain(`href="${forbiddenActPath}"`);
  expect(html).not.toContain('Для программиста');

  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(energyPath);
  await expect(page.locator('main.energy-page')).toBeVisible();
  await expect(page).toHaveTitle(energyTitle);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText(energyH1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', energyUrl);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index,follow/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Разработка паспорта безопасности объекта ТЭК по 256-ФЗ, категорирование по ПП РФ № 459, подготовка акта и сопровождение согласования. От 9 500 ₽. Работаем по России.',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /^https:\/\/pasport-bezopasnosty\.ru\//,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    /^https:\/\/pasport-bezopasnosty\.ru\//,
  );
  await expect(page.locator('.energy-section h2')).toHaveCount(15);
  expect(
    await page
      .locator('.energy-section')
      .evaluateAll(sections => sections.map(section => section.id)),
  ).toEqual([
    'services',
    'objects',
    'regulations',
    'categorization',
    'categorization-act',
    'process',
    'approval',
    'passport-form',
    'service',
    'prices',
    'documents',
    'actualization',
    'restricted-documents',
    'advantages',
    'faq',
  ]);
  await expect(page.locator('#faq .faq-item__question')).toHaveText(faqQuestions);
  await expect(page.locator('#faq .faq-item__panel')).toHaveCount(12);
  await expect(page.locator('.energy-page table')).toHaveCount(2);
  await expect(page.locator('#categorization thead th')).toHaveText([
    'Категория',
    'Общая характеристика',
  ]);
  await expect(page.locator('#categorization tbody tr > :first-child')).toHaveText([
    'Высокая',
    'Средняя',
    'Низкая',
  ]);
  await expect(page.locator('#service thead th')).toHaveText(['Работа', 'Результат']);
  await expect(page.locator('#service tbody tr')).toHaveCount(7);
  await expect(page.locator('#prices .service-price-card')).toHaveCount(4);
  await expect(page.locator('#prices .service-price-card h3')).toHaveText([
    passportService,
    'Подготовка акта категорирования ТЭК',
    'Сопровождение согласования',
    'Комплекс работ под ключ',
  ]);
  expect(
    await page
      .locator('#prices .service-price-card__price-line')
      .evaluateAll(elements => elements.map(element => element.textContent.replace(/\s/g, ''))),
  ).toEqual(['9500₽', '9500₽', 'от9500₽', 'от35000₽']);
  await expect(page.locator(`.energy-page a[href="${forbiddenActPath}"]`)).toHaveCount(0);
  await expect(
    page
      .getByRole('navigation', { name: 'Хлебные крошки', exact: true })
      .getByRole('link', { name: 'Разработка паспорта безопасности объекта', exact: true }),
  ).toHaveAttribute('href', '/');

  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll(scripts => scripts.map(script => JSON.parse(script.textContent)));
  expect(schemas.filter(schema => schema['@type'] === 'Organization')).toHaveLength(1);
  expect(schemas.find(schema => schema['@type'] === 'Service')?.url).toBe(energyUrl);
  expect(schemas.find(schema => schema['@type'] === 'WebPage')?.url).toBe(energyUrl);
  expect(
    schemas.find(schema => schema['@type'] === 'BreadcrumbList')?.itemListElement,
  ).toMatchObject([
    { position: 1, item: 'https://pasport-bezopasnosty.ru' },
    { position: 2, item: energyUrl },
  ]);
  expect(errors).toEqual([]);

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect((await sitemap.text()).split(`<loc>${energyUrl}</loc>`)).toHaveLength(2);
});

test('energy commercial actions preserve the selected service and comment in an email enquiry', async ({
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

  await page.goto(energyPath);
  const form = page.locator('#lead-form');
  const comment = 'Нужна подготовка документации для объекта теплоснабжения.';
  await form.getByRole('textbox', { name: 'Комментарий', exact: true }).fill(comment);

  const selections = [
    ['.energy-hero', 'Заказать паспорт безопасности', passportService],
    [
      '#prices',
      'Заказать: Подготовка акта категорирования ТЭК',
      'Подготовка акта категорирования ТЭК',
    ],
    ['#prices', 'Заказать: Сопровождение согласования', 'Сопровождение согласования'],
    ['#prices', 'Заказать: Комплекс работ под ключ', 'Комплекс работ под ключ'],
    ['.energy-hero', 'Заказать категорирование объекта ТЭК', categorizationService],
  ];

  for (const [section, label, service] of selections) {
    await page.locator(section).getByRole('link', { name: label, exact: true }).click();
    await expect(form.locator('output[name="service"]')).toHaveText(service);
    await expect(form.getByRole('textbox', { name: 'Комментарий', exact: true })).toHaveValue(
      comment,
    );
  }
  await expect(form.locator('output[name="objectType"]')).toHaveText(energyObjectType);
  expect(submittedLead).toBeUndefined();

  await form.getByLabel('Ваше имя', { exact: false }).fill('Иван');
  await form.getByLabel('Электронная почта', { exact: true }).fill('ivan@example.com');
  await form.locator('input[name="consent"]').check();
  await form.getByRole('button', { name: 'Отправить заявку', exact: false }).click();

  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
  expect(submittedLead.source).toBe('passport-security-final-cta');
  expect(submittedLead.data.phone).toBe('');
  expect(submittedLead.data.email).toBe('ivan@example.com');
  expect(submittedLead.data.object).toContain(`Услуга: ${categorizationService}`);
  expect(submittedLead.data.object).toContain(`Тип объекта: ${energyObjectType}`);
  expect(submittedLead.data.object).toContain(comment);
  await expect(form.locator('output[name="service"]')).toHaveText(categorizationService);
});

test('energy informational actions retain their purpose and the FAQ opens and closes', async ({
  page,
}) => {
  await page.goto(energyPath);
  const service = page.locator('#lead-form output[name="service"]');
  const actions = [
    ['#objects', 'Проверить требования для моего объекта'],
    ['#objects', 'Проверить необходимость категорирования'],
    ['#passport-form', 'Получить форму паспорта безопасности ТЭК'],
    ['#prices', 'Рассчитать стоимость для объекта ТЭК'],
    ['#documents', 'Получить перечень необходимых документов'],
    [
      '#actualization',
      'Заказать актуализацию паспорта ТЭК',
      'Актуализация паспорта безопасности объекта ТЭК',
    ],
  ];

  for (const [section, label, expectedService = label] of actions) {
    if (label === 'Проверить необходимость категорирования') {
      await page.locator('#objects .energy-disclosure > summary').click();
    }
    const action = page.locator(section).getByRole('link', { name: label, exact: true });
    await expect(action).toHaveAttribute('href', '#lead-form');
    await action.click();
    await expect(service).toHaveText(expectedService);
  }

  const question = page.getByRole('button', {
    name: /Нужно ли менять паспорт ТЭК каждые три года/,
  });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq .faq-item__panel:visible')).toHaveCount(1);
  await expect(page.locator('#faq .faq-item__panel:visible')).toContainText(
    'Нет. Актуализация проводится при основаниях, предусмотренных ПП № 460.',
  );
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq .faq-item__panel:visible')).toHaveCount(0);
});

test('energy reveals progressively and its seven process steps follow scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(energyPath);

  const reveal = page.locator('#prices [data-scroll-reveal]').first();
  await expect(reveal).toHaveCount(1);
  await expect(reveal).not.toHaveAttribute('data-scroll-visible');
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveAttribute('data-scroll-visible', '');

  const intro = page.locator('.energy-process-layout > .energy-section-intro');
  const steps = page.locator('#process .process-step');
  await expect(steps).toHaveCount(7);
  await expect(steps.locator('h3')).toHaveText([
    'Определение требований',
    'Сбор документов',
    'Категорирование',
    'Акт категорирования',
    'Разработка паспорта',
    'Согласование',
    'Передача документов',
  ]);

  await centerProcessStep(steps.first());
  await expect(steps.first()).toHaveClass(/process-step--active/);
  await centerProcessStep(steps.nth(3));
  await expect(steps.nth(3)).toHaveClass(/process-step--active/);
  await expect(steps.first()).not.toHaveClass(/process-step--active/);
  await expect(intro).toHaveCSS('position', 'sticky');
  await expect(intro).toHaveCSS('top', '110px');
  await expect.poll(async () => Math.round((await intro.boundingBox())?.y ?? -1)).toBe(110);
  await expect(reveal).toHaveAttribute('data-scroll-visible', '');

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(intro).toHaveCSS('position', 'static');
});

test('energy content stays visible and reveal animations stop for reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(energyPath);
  await expect(page.locator('h1')).toHaveText(energyH1);
  await page.locator('#prices .service-price-card').first().scrollIntoViewIfNeeded();
  await page.evaluate(
    () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );

  const animatedContent = await page
    .locator('.energy-page [data-scroll-reveal]')
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
  await expectEnergyContentVisible(page);
});

test.describe('energy landing without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('prerendered content remains visible and the enquiry anchor still works', async ({
    page,
  }) => {
    await page.goto(energyPath);
    await expect(page.locator('h1')).toHaveText(energyH1);
    await expect(page.locator('.energy-section h2')).toHaveCount(15);
    await expect(page.locator('#faq .faq-item__answer')).toHaveCount(12);
    await expect(page.locator('#prices .service-price-card')).toHaveCount(4);
    await expectEnergyContentVisible(page);

    await page
      .locator('.energy-hero')
      .getByRole('link', { name: 'Заказать паспорт безопасности', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${energyPath}#lead-form$`));
    await expect(page.locator('#lead-form')).toBeInViewport();
  });
});

test('energy landing is reachable through the home card and both site directories', async ({
  page,
}) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const cookieDismiss = page.getByRole('button', { name: 'Понятно', exact: true });
    if (await cookieDismiss.isVisible()) {
      await cookieDismiss.click();
    }

    const card = page.locator(`.object-type-card[href="${energyPath}"]`);
    await expect(card).toContainText(energyObjectType);
    await expect(card).toContainText(
      'Разработка паспорта безопасности объекта ТЭК, категорирование и подготовка акта по Федеральному закону № 256-ФЗ.',
    );
    const regulation = page.locator('#requirements-by-object tbody tr').filter({
      has: page.locator(`a[href="${energyPath}"]`),
    });
    await expect(regulation.locator('.regulation-guide__act')).toHaveText(
      'Федеральный закон № 256-ФЗ',
    );
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${energyPath}$`));
    await expect(page.locator('h1')).toHaveText(energyH1);

    await page.goto('/');
    let directory;
    if (width < 1180) {
      await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
      directory = page.locator('.site-nav__mobile-directory');
    } else {
      await page.getByRole('button', { name: 'Все разделы', exact: true }).click();
      directory = page.locator('#site-directory');
    }

    const directoryLink = directory.locator(`a[href="${energyPath}"]`);
    await expect(directoryLink).toBeVisible();
    await directoryLink.click();
    await expect(page).toHaveURL(new RegExp(`${energyPath}$`));
    await expect(page.locator('h1')).toHaveText(energyH1);

    if (width < 1180) {
      await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
    }
    await page
      .locator('#site-navigation')
      .getByRole('link', { name: 'О документе', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${energyPath}#about-passport$`));
    await expect(page.locator('#regulations .energy-heading')).toBeInViewport();
  }
});

test('energy layout fits narrow screens and keeps the hero price above the fold', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 812 },
    { width: 375, height: 812 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(energyPath);

    if (viewport.width >= 375) {
      const price = page.locator('.energy-hero__price');
      await expect(price).toContainText(/от\s*9\s*500\s*₽/);
      await expect(price).toBeInViewport({ ratio: 1 });
      const bounds = await price.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
    }

    await page.locator('.energy-page details').evaluateAll(disclosures => {
      disclosures.forEach(disclosure => {
        disclosure.open = true;
      });
    });

    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth,
      page: document.documentElement.scrollWidth,
      tables: [...document.querySelectorAll('.energy-table-scroll')].map(element => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right };
      }),
      headings: [...document.querySelectorAll('.energy-page :is(h1, h2, h3)')].map(element => {
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
      expect(table.right).toBeLessThanOrEqual(viewport.width);
    }
    for (const heading of layout.headings) {
      for (const line of heading.lines) {
        expect(line.left, heading.text).toBeGreaterThanOrEqual(heading.left - 1);
        expect(line.right, heading.text).toBeLessThanOrEqual(heading.right + 1);
      }
    }
  }
});
