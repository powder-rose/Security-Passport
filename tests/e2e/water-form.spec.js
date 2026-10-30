import { expect, test } from '@playwright/test';
import { waterObjectType } from '../../src/data/waterObjectType.js';
import { waterSections } from '../../src/pages/WaterPage/waterPageData.js';

const passportForm = waterSections.find(section => section.id === 'form');
const widths = [320, 360, 375, 390, 430, 640, 768, 900, 1024, 1100, 1101, 1180, 1440, 1920];

async function openWater(page) {
  const response = await page.goto(waterObjectType.path);
  expect(response.status()).toBe(200);
  await expect(page.locator('main.water-page')).toBeVisible();
  const dismiss = page.getByRole('button', { name: 'Понятно', exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
}

test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL);
  expect(origin.protocol).toBe('http:');
  expect(['127.0.0.1', 'localhost', '[::1]']).toContain(origin.hostname);
  await page.route(
    url => /^https?:$/.test(url.protocol) && url.origin !== origin.origin,
    route => route.abort('blockedbyclient'),
  );
  await page.route('**/api/leads', route => route.abort('blockedbyclient'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('water passport form without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('preserves all content in independent white disclosures and one dark attachment card', async ({
    page,
  }) => {
    await openWater(page);
    const section = page.locator('#form');
    const details = section.locator('.water-form-outline > details');
    await expect(section.locator('h2')).toHaveText(passportForm.title);
    await expect(section.locator('.water-form-header .water-copy p')).toHaveText(
      passportForm.paragraphs,
    );
    await expect(section.locator('.water-form-document__intro')).toHaveText(passportForm.listLabel);
    await expect(details).toHaveCount(4);
    await expect(details.locator('.water-disclosure__title')).toHaveText(
      passportForm.items.map(item => item.title),
    );
    await expect(details.locator('.water-disclosure__body')).toHaveText(
      passportForm.items.map(item => item.text),
    );
    await expect(details.first()).toHaveAttribute('open', '');
    await expect(section.locator('details[open]')).toHaveCount(1);
    await expect(section.locator('.water-form-document')).toHaveCSS(
      'background-color',
      'rgba(0, 0, 0, 0)',
    );
    const card = section.locator('.water-form-attachments');
    await expect(card).toHaveCSS('background-color', 'rgb(21, 21, 21)');
    await expect(card).toHaveCSS('background-image', 'none');
    await expect(card.locator('h3')).toHaveText(passportForm.attachments.title);
    await expect(card.locator('li')).toHaveText(passportForm.attachments.items);
    const action = card.getByRole('link', { name: passportForm.action.label, exact: true });
    await expect(action).toHaveAttribute('href', '#lead-form');
    await expect(action).toHaveCSS('background-color', 'rgb(169, 240, 74)');
    for (let index = 0; index < passportForm.items.length; index += 1) {
      const detail = details.nth(index);
      if (!(await detail.evaluate(element => element.open))) {
        await detail.locator('summary').focus();
        await page.keyboard.press('Enter');
      }
      await expect(section.locator('details[open]')).toHaveCount(1);
      await expect(detail).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(detail).toHaveCSS('border-bottom-width', '0px');
      await expect(detail.locator('.water-index')).toHaveCSS(
        'background-color',
        'rgb(169, 240, 74)',
      );
      await expect(detail.locator('.water-disclosure__body')).toBeVisible();
      await detail.locator('summary').focus();
      await page.keyboard.press('Space');
      await expect(detail).not.toHaveAttribute('open');
      await page.keyboard.press('Enter');
      await expect(detail).toHaveAttribute('open', '');
    }
  });
});

test('water passport form adapts every open section without clipping or artificial equal heights', async ({
  page,
}) => {
  await openWater(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (let index = 0; index < passportForm.items.length; index += 1) {
      const detail = page.locator('#form details').nth(index);
      if (!(await detail.evaluate(element => element.open))) {
        await detail.locator('summary').focus();
        await page.keyboard.press('Enter');
      }
      const overflowing = await page.locator('#form').evaluate(section =>
        [section, ...section.querySelectorAll('*')]
          .filter(element => element.getClientRects().length)
          .filter(element => !element.closest('details:not([open]) .water-disclosure__body'))
          .filter(element => getComputedStyle(element).display !== 'inline')
          .filter(element => element.scrollWidth > element.clientWidth + 1)
          .map(element => element.className || element.tagName),
      );
      expect(overflowing, `${width}px, section ${index + 1}`).toEqual([]);
    }
    const layout = await page.locator('.water-form-layout').evaluate(element => {
      const outline = element.querySelector('.water-form-document').getBoundingClientRect();
      const card = element.querySelector('.water-form-attachments').getBoundingClientRect();
      return {
        outlineBottom: outline.bottom,
        outlineRight: outline.right,
        cardTop: card.top,
        cardLeft: card.left,
      };
    });
    if (width <= 1100) expect(layout.cardTop).toBeGreaterThanOrEqual(layout.outlineBottom);
    else expect(layout.cardLeft).toBeGreaterThan(layout.outlineRight);
    await expect(page.locator('.water-form-layout')).toHaveCSS('align-items', 'start');
  }
});

test('water passport form CTA retains its enquiry context without submitting', async ({ page }) => {
  await openWater(page);
  const form = page.locator('#lead-form');
  const comment = 'Water form design check; do not submit';
  const requests = [];
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/api/leads') requests.push(request.method());
  });
  await form.locator('textarea[name="object"]').fill(comment);
  await page
    .locator('#form')
    .getByRole('link', { name: passportForm.action.label, exact: true })
    .click();
  await expect(page).toHaveURL(url => url.hash === '#lead-form');
  await expect(form.locator('output[name="service"]')).toHaveText(passportForm.action.service);
  await expect(form.locator('textarea[name="object"]')).toHaveValue(comment);
  expect(requests).toEqual([]);
});

test('water passport form animates native disclosure height where supported and respects reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openWater(page);
  const detail = page.locator('#form details').nth(2);
  await detail.scrollIntoViewIfNeeded();
  const result = await detail.evaluate(async element => {
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
    element.open = false;
    await frame();
    await frame();
    const initial = element.getBoundingClientRect().height;
    const samples = [];
    const started = performance.now();
    element.open = true;
    while (performance.now() - started < 400) {
      await frame();
      samples.push(element.getBoundingClientRect().height);
    }
    return {
      initial,
      final: element.getBoundingClientRect().height,
      samples,
      supported:
        CSS.supports('interpolate-size', 'allow-keywords') &&
        CSS.supports('selector(details::details-content)'),
      transition: getComputedStyle(element, '::details-content').transitionProperty,
      duration: getComputedStyle(element, '::details-content').transitionDuration,
    };
  });
  expect(result.final).toBeGreaterThan(result.initial);
  if (result.supported) {
    expect(result.transition).toContain('block-size');
    expect(result.duration).toContain('0.24s');
  }
  await expect(detail.locator('.water-disclosure__body')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const next = page.locator('#form details').nth(1);
  await next.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(next.locator('.water-disclosure__body')).toBeVisible();
  await expect(next.locator('.water-disclosure__body')).toHaveCSS('animation-name', 'none');
  expect(await next.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
});
