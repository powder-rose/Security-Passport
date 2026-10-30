import { expect, test } from '@playwright/test';
import { waterObjectType } from '../../src/data/waterObjectType.js';
import {
  waterHeroActions,
  waterHeroFacts,
  waterHeroPrice,
  waterSections,
} from '../../src/pages/WaterPage/waterPageData.js';

const waterPath = waterObjectType.path;
const section = id => waterSections.find(item => item.id === id);
const widths = [320, 375, 430, 640, 768, 1024, 1180, 1440, 1920];

async function openWater(page) {
  const response = await page.goto(waterPath);
  expect(response.status()).toBe(200);
  await expect(page.locator('main.water-page')).toBeVisible();
  const dismiss = page.getByRole('button', { name: 'Понятно', exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
}

async function noHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
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

test('water hero keeps its approved copy and actions without the removed price footnote', async ({
  page,
}) => {
  await openWater(page);
  const hero = page.locator('.water-hero');
  await expect(hero.locator('h1')).toHaveText(waterObjectType.h1);
  await expect(hero.locator('.water-hero__lead')).toHaveText(waterObjectType.pageLead);
  await expect(hero.locator('.water-hero__coverage')).toHaveText(waterObjectType.pageCoverage);
  await expect(hero.locator('.water-hero__facts li')).toHaveText(waterHeroFacts);
  await expect(hero.locator('.water-hero__price strong')).toHaveText(waterHeroPrice.price);
  await expect(hero).not.toContainText(waterHeroPrice.note);
  await expect(hero.locator('.water-hero__orbit, .water-hero__price-note')).toHaveCount(0);
  await expect(hero.locator('.water-hero__coverage-main')).toHaveCSS(
    'text-decoration-line',
    'underline',
  );
  for (const action of waterHeroActions) {
    await expect(hero.getByRole('link', { name: action.label, exact: true })).toHaveAttribute(
      'href',
      '#lead-form',
    );
  }
});

test('water registry and act retain their exact text and accessible table relationships', async ({
  page,
}) => {
  await openWater(page);
  await expect(page.locator('.water-registry p')).toHaveText(
    section('registry').paragraphs.slice(1),
  );
  const facts = page.locator('#act table');
  await expect(facts).toHaveRole('table');
  await expect(facts.locator('tbody tr')).toHaveCount(7);
  await expect(facts.locator('th[scope="row"]')).toHaveText(
    section('act').table.rows.map(row => row[0]),
  );
  await expect(facts.locator('td')).toHaveText(section('act').table.rows.map(row => row[1]));
  await expect(page.locator('#act .water-act__document')).toHaveCount(0);
  await expect(page.locator('main table')).toHaveCount(3);
  await expect(page.locator('.water-protection-measures p')).toHaveText(
    section('protection').items,
  );
});

test('water exclusions, replacement reasons and restricted lists have no redundant dividers', async ({
  page,
}) => {
  await openWater(page);
  await expect(page.locator('.water-exclusions > div:last-child')).toHaveCSS(
    'border-left-width',
    '0px',
  );
  for (const selector of [
    '.water-hero__facts li',
    '#validity .water-validity__reasons li',
    '#validity .water-disclosure',
    '#restricted .water-list li',
  ]) {
    const nodes = page.locator(selector);
    expect(await nodes.count()).toBeGreaterThan(0);
    const borders = await nodes.evaluateAll(elements =>
      elements.map(element => getComputedStyle(element).borderBottomWidth),
    );
    expect(borders.every(width => width === '0px')).toBe(true);
  }
  await expect(page.locator('.water-validity__deadline')).toHaveCSS('border-top-width', '0px');
  await expect(page.locator('.water-validity__reasons li > span:last-child')).toHaveText(
    section('validity').replacement.items,
  );
  await expect(page.locator('.water-validity__deadline p')).toHaveText(
    section('validity').replacement.timing,
  );
  await expect(page.locator('.water-information__panel--allowed .water-list li')).toHaveText(
    section('restricted').allowed.items,
  );
  await expect(page.locator('.water-information__panel--restricted .water-list li')).toHaveText(
    section('restricted').restricted.items,
  );
});

test('water presentation fits narrow screens and does not split its FAQ heading', async ({
  page,
}) => {
  await openWater(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await noHorizontalOverflow(page);
    const headings = await page
      .locator('main h1, main .water-heading h2')
      .evaluateAll(elements =>
        elements
          .filter(element => element.scrollWidth > element.clientWidth + 1)
          .map(element => element.textContent),
      );
    expect(headings, `Overflowing headings at ${width}px`).toEqual([]);
    const fragments = await page.locator('#water-faq-title').evaluate(element => {
      const word = 'водоснабжения';
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const lines = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const index = node.textContent.indexOf(word);
        if (index < 0) continue;
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + word.length);
        lines.push([...range.getClientRects()].map(rect => Math.round(rect.top)));
      }
      return lines;
    });
    expect(fragments).toHaveLength(1);
    expect(new Set(fragments[0]).size).toBe(1);
  }
});

test.describe('water presentation without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('retains all FAQ answers and keyboard-operated native disclosures', async ({ page }) => {
    const response = await page.goto(waterPath);
    expect(response.status()).toBe(200);
    await expect(page.locator('#faq details')).toHaveCount(24);
    await expect(page.locator('#faq .water-disclosure__body')).toHaveText(
      section('faq').items.map(item => item.answer),
    );
    const replacement = page.locator('#validity details');
    await replacement.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(replacement).not.toHaveAttribute('open');
    await page.keyboard.press('Space');
    await expect(replacement).toHaveAttribute('open', '');
    const lastFaq = page.locator('#faq details').last();
    await lastFaq.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(lastFaq.locator('.water-disclosure__body')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(lastFaq).not.toHaveAttribute('open');
    await expect(page.locator('#act table tbody tr')).toHaveCount(7);
  });
});

test('water enquiry actions preserve the selected service and comment without submitting', async ({
  page,
}) => {
  await openWater(page);
  const form = page.locator('#lead-form');
  const comment = 'Presentation regression: do not send';
  await form.locator('textarea[name="object"]').fill(comment);
  const actions = page.locator('main .service-action[href="#lead-form"]');
  const expected = [
    ...waterHeroActions.map(item => item.service),
    ...waterSections
      .filter(item => item.action && item.id !== 'prices')
      .map(item => item.action.service),
    ...section('prices').items.map(item => item.service),
    section('prices').action.service,
  ];
  const requests = [];
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/api/leads') requests.push(request.method());
  });
  await expect(actions).toHaveCount(expected.length);
  for (let index = 0; index < expected.length; index += 1) {
    await actions.nth(index).click();
    await expect(form.locator('output[name="service"]')).toHaveText(expected[index]);
    await expect(form.locator('textarea[name="object"]')).toHaveValue(comment);
  }
  expect(requests).toEqual([]);
});

test('water cards reveal on scroll and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await openWater(page);
  const card = page.locator('.water-protection-measures > li').nth(4);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-scroll-visible', '');
  await card.evaluate(element =>
    Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))),
  );
  await card.hover();
  await expect
    .poll(() => card.evaluate(element => getComputedStyle(element).transform))
    .not.toBe('none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).toHaveCSS('animation-name', 'none');
  await expect(card).toHaveCSS('transform', 'none');
  await expect(card).toBeVisible();
});
