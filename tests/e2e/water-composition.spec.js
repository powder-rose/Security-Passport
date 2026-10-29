import { expect, test } from '@playwright/test';
import { waterObjectType } from '../../src/data/waterObjectType.js';
import { waterSections } from '../../src/pages/WaterPage/waterPageData.js';

const section = id => waterSections.find(item => item.id === id);
const widths = [320, 375, 430, 640, 768, 900, 1024, 1180, 1440, 1920];

async function openPage(page) {
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

test('water regulation topics retain all eight statements without decorative counters', async ({
  page,
}) => {
  await openPage(page);
  const topics = page.locator('.water-regulations__topics');
  await expect(topics.locator('li > span')).toHaveText(section('regulations').items);
  await expect(topics.locator('.water-index')).toHaveCount(0);
  await expect(topics).toHaveCSS('list-style-type', 'none');
  await expect(page.locator('#regulations .water-heading h2')).toHaveText(
    section('regulations').title,
  );
});

test('water replacement reasons preserve their text and independent five-year and three-month context', async ({
  page,
}) => {
  await openPage(page);
  const validity = section('validity');
  await expect(page.locator('.water-validity__term .water-copy p')).toHaveText(validity.paragraphs);
  await expect(page.locator('.water-validity__reasons li > span')).toHaveText(
    validity.replacement.items,
  );
  await expect(page.locator('.water-validity__reasons .water-index')).toHaveCount(0);
  await expect(page.locator('.water-validity__deadline p')).toHaveText(validity.replacement.timing);
  const disclosure = page.locator('#validity details');
  await disclosure.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(disclosure).not.toHaveAttribute('open');
  await page.keyboard.press('Space');
  await expect(disclosure).toHaveAttribute('open', '');
});

test.describe('water document outline without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps every section and attachment with a single keyboard-operated open outline item', async ({
    page,
  }) => {
    const response = await page.goto(waterObjectType.path);
    expect(response.status()).toBe(200);
    const form = section('form');
    const outlines = page.locator('#form .water-form-document details');
    await expect(outlines).toHaveCount(4);
    await expect(outlines.locator('.water-disclosure__title')).toHaveText(
      form.items.map(item => item.title),
    );
    await expect(outlines.locator('.water-disclosure__body')).toHaveText(
      form.items.map(item => item.text),
    );
    await expect(page.locator('.water-form-attachments__list > li')).toHaveText(
      form.attachments.items,
    );
    await expect(page.locator('.water-form-attachments')).toHaveCSS(
      'background-color',
      'rgb(21, 21, 21)',
    );
    for (let index = 1; index < form.items.length; index += 1) {
      const detail = outlines.nth(index);
      await detail.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(detail).toHaveAttribute('open', '');
      await expect(page.locator('#form details[open]')).toHaveCount(1);
      await expect(detail.locator('.water-disclosure__body')).toBeVisible();
    }
    await expect(
      page.locator('#form').getByRole('link', { name: form.action.label, exact: true }),
    ).toHaveAttribute('href', '#lead-form');
  });
});

test('water FAQ keeps its white surface without the unrequested green answer fill', async ({
  page,
}) => {
  await openPage(page);
  const faq = section('faq');
  const details = page.locator('#faq details');
  await expect(details).toHaveCount(faq.items.length);
  await expect(details.locator('.water-disclosure__body')).toHaveText(
    faq.items.map(item => item.answer),
  );
  await expect(page.locator('.water-faq-list')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  for (const index of [0, 1, faq.items.length - 1]) {
    const detail = details.nth(index);
    if (!(await detail.evaluate(element => element.open))) {
      await detail.locator('summary').focus();
      await page.keyboard.press('Enter');
    }
    await expect(detail.locator('.water-disclosure__body')).toBeVisible();
    for (const element of [detail, detail.locator('.water-disclosure__body')]) {
      await expect(element).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(element).toHaveCSS('background-image', 'none');
    }
    await expect(detail.locator('.water-disclosure__icon')).toHaveCSS(
      'background-color',
      'rgb(169, 240, 74)',
    );
  }
});

test('water composition fits desktop and narrow screens without new document ID collisions', async ({
  page,
}) => {
  await openPage(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const overflows = await page.evaluate(() => {
      const nodes = [
        ...document.querySelectorAll(
          '.water-regulations__topics, .water-validity__reasons, .water-form-header, ' +
            '.water-form-document, .water-form-attachments, #water-faq-title',
        ),
      ];
      return {
        page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        elements: nodes
          .filter(node => node.scrollWidth > node.clientWidth + 1)
          .map(node => node.className || node.id),
      };
    });
    expect(overflows.page, `Document overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(overflows.elements, `Component overflow at ${width}px`).toEqual([]);
  }
  const duplicates = await page.locator('[id]').evaluateAll(elements => {
    const ids = elements.map(element => element.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicates).toEqual([]);
});
