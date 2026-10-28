import { expect, test } from '@playwright/test';

const actPath = '/akt-obsledovaniya-i-kategorirovaniya-obekta/';
const expectedPoints = [
  [
    'Оформляется по итогам обследования объекта и работы комиссии.',
    'Фиксирует категорию, присвоенную объекту по результатам обследования.',
    'Подписывается членами комиссии, участвовавшими в категорировании.',
    'Становится основанием для последующей разработки паспорта.',
  ],
  [
    'Разрабатывается с учётом результатов категорирования и сведений из акта.',
    'Содержит характеристики объекта, возможные угрозы и действующие меры защиты.',
    'Утверждается и согласуется в порядке, установленном применимым постановлением.',
    'Не заменяет акт обследования и не отменяет необходимость работы комиссии.',
  ],
];

async function openHome(page) {
  const response = await page.goto('/');
  expect(response.status()).toBe(200);
  const dismiss = page.getByRole('button', { name: 'Понятно', exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
  return page.locator('#comparison');
}

async function expectImagesLoaded(section) {
  const images = section.locator('.document-card__image');
  await expect(images).toHaveCount(2);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('alt', '');
    await expect(image).toHaveAttribute('width', '512');
    await expect(image).toHaveAttribute('height', '512');
    await expect
      .poll(() => image.evaluate(item => item.complete && item.naturalWidth === 512))
      .toBe(true);
  }
}

test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL).origin;
  await page.route(
    url => /^https?:$/.test(url.protocol) && url.origin !== origin,
    route => route.abort('blockedbyclient'),
  );
});

test.describe('homepage document comparison without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('preserves both documents, all four points per card and their original actions', async ({
    page,
  }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    const section = page.locator('#comparison');
    await expect(section.locator('h2')).toHaveText(
      'Акт категорирования и паспорт безопасности — не одно и то же',
    );
    const cards = section.locator('.document-card');
    await expect(cards).toHaveCount(2);
    await expect(cards.locator('h3')).toHaveText([
      'Акт обследования и категорирования',
      'Паспорт безопасности',
    ]);
    for (let index = 0; index < 2; index += 1) {
      await expect(cards.nth(index).locator('li > span:last-child')).toHaveText(
        expectedPoints[index],
      );
    }
    await expect(cards.first().locator('.document-card__action')).toHaveAttribute('href', actPath);
    await expect(cards.last().locator('.document-card__action')).toHaveAttribute(
      'href',
      '#contact',
    );
    await expect(section.locator('.documents-comparison__notice')).toContainText(
      'Заказать только паспорт можно не во всех случаях.',
    );
    await expectImagesLoaded(section);
  });
});

test('homepage document cards fit mobile, tablet and desktop without clipped content', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const section = await openHome(page);
    await expectImagesLoaded(section);
    const overflow = await section
      .locator('.document-card, .document-card__image, h3, li, .document-card__action')
      .evaluateAll(elements =>
        elements
          .filter(element => {
            const bounds = element.getBoundingClientRect();
            return bounds.left < -1 || bounds.right > document.documentElement.clientWidth + 1;
          })
          .map(element => ({ tag: element.tagName, className: element.className })),
      );
    expect(overflow, `Document comparison overflow at ${width}px`).toEqual([]);
    const cards = await section.locator('.document-card').evaluateAll(elements =>
      elements.map(element => {
        const bounds = element.getBoundingClientRect();
        return { x: bounds.x, y: bounds.y, bottom: bounds.bottom };
      }),
    );
    if (width > 900) {
      expect(Math.abs(cards[0].y - cards[1].y)).toBeLessThan(1);
      expect(Math.abs(cards[0].bottom - cards[1].bottom)).toBeLessThan(1);
    } else {
      expect(cards[1].y).toBeGreaterThanOrEqual(cards[0].bottom);
    }
    await expect(section.locator('.document-card__image').first()).toHaveCSS('transform', 'none');
    const animations = await section
      .locator('[data-scroll-reveal]')
      .evaluateAll(elements => elements.map(element => getComputedStyle(element).animationName));
    expect(animations).toEqual(['none', 'none']);
  }
});

test('homepage document actions remain keyboard-operable and retain their destinations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let section = await openHome(page);
  const act = section.locator('.document-card--light .document-card__action');
  await act.focus();
  await expect(act).toBeFocused();
  await act.press('Enter');
  await expect(page).toHaveURL(url => url.pathname === actPath);
  await expect(page.locator('h1')).toHaveText('Акт обследования и категорирования объекта');

  section = await openHome(page);
  const passport = section.locator('.document-card--dark .document-card__action');
  await passport.focus();
  await expect(passport).toBeFocused();
  await passport.press('Enter');
  await expect(page).toHaveURL(url => url.pathname === '/' && url.hash === '#contact');
  await expect(page.locator('#contact')).toBeInViewport();
  await expect(page.locator('#lead-form')).toBeVisible();
});

test('homepage document artwork reveals on scroll without hiding the card copy', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const section = await openHome(page);
  await page.mouse.move(0, 0);
  for (const artwork of await section.locator('[data-scroll-reveal]').all()) {
    await artwork.scrollIntoViewIfNeeded();
    await expect(artwork).toHaveAttribute('data-scroll-visible', '');
    await artwork.evaluate(async element => {
      await Promise.all(
        element.getAnimations().map(animation => animation.finished.catch(() => {})),
      );
    });
    await expect(artwork).toHaveCSS('opacity', '1');
    await expect(artwork).toHaveCSS('transform', 'none');
  }
  await expect(section.locator('.document-card__list')).toHaveCount(2);
  const hidden = await section.locator('h3, li, .document-card__action').evaluateAll(
    elements =>
      elements.filter(element => {
        const style = getComputedStyle(element);
        return (
          style.visibility !== 'visible' || style.display === 'none' || Number(style.opacity) < 1
        );
      }).length,
  );
  expect(hidden).toBe(0);
});
