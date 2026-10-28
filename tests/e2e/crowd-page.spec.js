import { expect, test } from '@playwright/test';

const crowdPath = '/pasport-bezopasnosti-mesta-massovogo-prebyvaniya-lyudej/';
const rosgvardiaPath = '/pasport-bezopasnosti-obekta-obyazatelnoj-ohrany-rosgvardii/';
const crowdUrl = `https://pasport-bezopasnosty.ru${crowdPath}`;
const crowdTitle =
  'Паспорт безопасности места массового пребывания людей по ПП РФ №272 — от 9 500 ₽ | БОЙКОВГРУПП';
const crowdDescription =
  'Разработка паспорта безопасности места массового пребывания людей по ПП РФ №272. Категорирование, акт, паспорт и сопровождение согласования. Стоимость от 9 500 ₽.';
const crowdH1 = 'Паспорт безопасности места массового пребывания людей — разработка и согласование';
const approved = {
  heading: 'ММПЛ и объекты обязательной охраны Росгвардии — в чём разница',
  intro:
    'Постановление Правительства РФ № 272 устанавливает отдельные требования к местам массового пребывания людей и объектам (территориям), подлежащим обязательной охране войсками национальной гвардии Российской Федерации.',
  lists:
    'Места массового пребывания людей включаются в соответствующие перечни, формируемые уполномоченными региональными или муниципальными органами власти. Объекты обязательной охраны Росгвардии определяются по отдельному перечню, утверждаемому распоряжением Правительства Российской Федерации.',
  differences:
    'Для этих направлений предусмотрены разные критерии категорирования, процедуры обследования, формы паспортов безопасности и порядок их утверждения.',
  notice:
    'Важно: объекты обязательной охраны Росгвардии не являются просто более крупными местами массового пребывания людей. Они относятся к самостоятельной категории объектов с отдельными нормативными требованиями.',
  anchor: 'Паспорт безопасности объекта, подлежащего обязательной охране Росгвардией',
  regulation:
    'В части мест массового пребывания людей постановление Правительства РФ № 272 устанавливает требования к их антитеррористической защищённости, порядок категорирования и форму паспорта безопасности ММПЛ. Отдельный блок постановления регулирует объекты (территории), подлежащие обязательной охране Росгвардией.',
  exclusions:
    'При формировании перечня ММПЛ учитываются исключения, предусмотренные пунктом 2 требований ПП РФ № 272, в том числе в отношении мест, подлежащих обязательной охране войсками национальной гвардии Российской Федерации.',
  process:
    'После обследования и категорирования паспорт безопасности места массового пребывания людей составляется в течение 30 дней по установленной форме.',
  copies: '6 экземпляров паспорта.',
};

test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL);
  expect(origin.protocol).toBe('http:');
  expect(['127.0.0.1', 'localhost', '[::1]']).toContain(origin.hostname);
  await page.route(
    url => /^https?:$/.test(url.protocol) && url.origin !== origin.origin,
    route => route.abort('blockedbyclient'),
  );
});

async function openCrowdPage(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(crowdPath);
  const dismiss = page.getByRole('button', { name: 'Понятно', exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
}

test.describe('MMPL corrections without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('prerenders the approved corrections in place and preserves the existing SEO', async ({
    page,
    request,
  }) => {
    const response = await page.goto(crowdPath);
    expect(response.status()).toBe(200);
    const main = page.locator('main.crowd-page');
    await expect(main).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(crowdH1);
    await expect(page).toHaveTitle(crowdTitle);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      crowdDescription,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', crowdUrl);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index,follow/);
    await expect(page.locator('.crowd-hero__price strong')).toHaveText('от 9 500 ₽');

    const difference = page.locator('.crowd-rosgvardia');
    await expect(difference.locator('h2')).toHaveText(approved.heading);
    await expect(difference.locator('.crowd-rosgvardia__copy > p')).toHaveText([
      approved.intro,
      approved.lists,
      approved.differences,
      approved.notice,
      approved.anchor,
    ]);
    await expect(difference.locator('strong')).toHaveText('Важно:');
    await expect(difference.locator('table, img, button, form')).toHaveCount(0);
    expect(
      await difference.evaluate(element => [
        element.previousElementSibling.className,
        element.nextElementSibling.className,
      ]),
    ).toEqual(['crowd-regime', 'crowd-regulation']);
    await expect(page.locator('.crowd-regime h2')).toHaveText(
      '«Место, где много людей» и ММПЛ по ПП РФ №272 — не всегда одно и то же',
    );
    await expect(page.locator('.crowd-regime a')).toHaveCount(0);
    const link = difference.getByRole('link', { name: approved.anchor, exact: true });
    await expect(main.locator(`a[href="${rosgvardiaPath}"]`)).toHaveCount(1);
    await expect(link).toHaveAttribute('href', rosgvardiaPath);
    await expect(link).not.toHaveAttribute('target');
    await expect(link).not.toHaveAttribute('rel', /nofollow/);
    await expect(link).not.toHaveClass(/button/);

    await expect(page.locator('.crowd-regulation__lead')).toHaveText(approved.regulation);
    await expect(page.locator('.crowd-regulation__points article')).toHaveCount(3);
    await expect(page.locator('.crowd-listing__heading > p')).toHaveText(
      'Перечень формируется исполнительными органами субъекта РФ или органами местного самоуправления по установленной процедуре.',
    );
    await expect(page.locator('.crowd-listing__note')).toHaveText(approved.exclusions);
    await expect(page.locator('.crowd-listing__step h3')).toHaveText([
      'Формирование перечня',
      'Согласование',
      'Работа с конкретным местом',
    ]);
    await expect(page.locator('.crowd-listing__step p')).toHaveText([
      'Решение принимается уполномоченным исполнительным органом субъекта РФ либо органом местного самоуправления.',
      'Перечень согласовывается с предусмотренными территориальными органами.',
      'После определения применимости требований проводится обследование и категорирование конкретного ММПЛ.',
    ]);
    const steps = page.locator('.crowd-process__list article');
    await expect(steps).toHaveCount(4);
    await expect(steps.nth(3).locator('h3')).toHaveText('Разработка паспорта безопасности');
    await expect(steps.nth(3).locator('p')).toHaveText(approved.process);
    await expect(steps.nth(3).locator('strong')).toHaveText(approved.copies);
    await expect(main).not.toContainText('До 6 экземпляров');
    await expect(steps.nth(0).locator('p')).toHaveText(
      'Комиссия проводит обследование места массового пребывания людей и рассматривает необходимые материалы по объекту.',
    );
    await expect(steps.nth(1).locator('strong')).toHaveText('Срок — до 30 дней');
    await expect(steps.nth(2).locator('strong')).toHaveText('Срок — до 10 дней');

    const external = await main.locator('a[href]').evaluateAll(links =>
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
    expect(external).toEqual([]);
    for (const path of ['/sitemap.xml', '/sitemap-google.xml']) {
      const sitemap = await request.get(path);
      expect(sitemap.status()).toBe(200);
      expect((await sitemap.text()).split(`<loc>${crowdUrl}</loc>`)).toHaveLength(2);
    }
  });
});

test('MMPL and Rosgvardia links work in both directions without changing existing hero actions', async ({
  page,
}) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openCrowdPage(page);
    await page.locator('.crowd-rosgvardia').getByRole('link', { name: approved.anchor }).click();
    await expect(page).toHaveURL(url => url.pathname === rosgvardiaPath);
    await expect(page.locator('h1')).toHaveText(approved.anchor);
    const backlink = page.locator(`#comparison a[href="${crowdPath}"]`);
    await expect(backlink).toHaveCount(1);
    await backlink.click();
    await expect(page).toHaveURL(url => url.pathname === crowdPath);

    const actions = page.locator('.crowd-hero__actions');
    await expect(actions.locator('a')).toHaveCount(2);
    await actions.getByRole('link', { name: 'Заказать паспорт', exact: true }).click();
    await expect(page).toHaveURL(url => url.pathname === crowdPath && url.hash === '#lead-form');
    await expect(page.locator('#lead-form')).toBeInViewport();
    await actions
      .getByRole('link', { name: 'Проверить, относится ли территория к ММПЛ', exact: true })
      .click();
    await expect(page).toHaveURL(
      url => url.pathname === crowdPath && url.hash === '#applicability',
    );
    await expect(page.locator('#applicability')).toBeInViewport();
  }
});

test('MMPL corrections fit mobile through desktop and expose the internal link to keyboard users', async ({
  page,
}) => {
  await openCrowdPage(page);
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page
      .locator(
        '.crowd-rosgvardia, .crowd-rosgvardia h2, .crowd-rosgvardia__copy > p, ' +
          '.crowd-listing__note, .crowd-process__list article:last-child',
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
    await expect(page.locator('.crowd-rosgvardia__notice strong')).toHaveCSS('font-weight', '700');
  }
  const link = page.locator('.crowd-rosgvardia__link');
  await link.focus();
  await expect(link).toBeFocused();
  await link.press('Enter');
  await expect(page).toHaveURL(url => url.pathname === rosgvardiaPath);
});

test('MMPL existing enquiry still validates consent and accepts a phone-only submission locally', async ({
  page,
  request,
  baseURL,
}) => {
  const origin = new URL(baseURL).origin;
  const health = await request.get('/api/health');
  expect(health.status()).toBe(200);
  expect(await health.json()).toMatchObject({
    environment: 'test',
    transports: { backup: true, telegram: false, email: false },
  });
  let submissions = 0;
  await page.route(`${origin}/api/leads`, async route => {
    submissions += 1;
    await route.continue();
  });
  await openCrowdPage(page);
  const form = page.locator('#lead-form');
  const comment = 'Тест ММПЛ: исходные документы готовы.';
  await form.locator('input[name="name"]').fill('Ирина');
  await form.locator('input[name="phone"]').fill('79990000004');
  await form.locator('textarea[name="object"]').fill(comment);
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('input[name="consent"]')).toHaveAttribute('aria-invalid', 'true');
  expect(submissions).toBe(0);
  await form.locator('input[name="consent"]').check();
  const submitted = page.waitForResponse(
    response => response.url() === `${origin}/api/leads` && response.request().method() === 'POST',
  );
  await form.locator('button[type="submit"]').click();
  const response = await submitted;
  expect(response.status()).toBe(201);
  const payload = response.request().postDataJSON();
  expect(payload.source).toBe('passport-security-final-cta');
  expect(payload.data.object).toBe(comment);
  expect(payload.data.phone.replace(/\D/g, '')).toBe('79990000004');
  expect(payload.data.email).toBe('');
  expect(payload.data.consent).toBe(true);
  expect(await response.json()).toMatchObject({ ok: true, requestId: payload.requestId });
  expect(submissions).toBe(1);
  await expect(form.locator('#final-cta-status')).toContainText('Заявка отправлена');
});
