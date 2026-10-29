import { expect, test } from '@playwright/test';

const tradePath = '/pasport-bezopasnosti-torgovogo-obekta/';

for (const javaScriptEnabled of [false, true]) {
  test.describe(`trade page anchors with JavaScript ${javaScriptEnabled ? 'on' : 'off'}`, () => {
    test.use({
      javaScriptEnabled,
      reducedMotion: 'reduce',
      viewport: { width: 1440, height: 900 },
    });

    test('keeps document IDs unique and the top anchor on the shared header', async ({
      page,
      baseURL,
    }) => {
      const origin = new URL(baseURL);
      expect(origin.protocol).toBe('http:');
      expect(['127.0.0.1', 'localhost', '[::1]']).toContain(origin.hostname);

      await page.route(
        url => /^https?:$/.test(url.protocol) && url.origin !== origin.origin,
        route => route.abort('blockedbyclient'),
      );

      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${tradePath}#top`);
      expect(response.status()).toBe(200);
      await expect(page.locator('main.trade-page')).toBeVisible();
      await expect(page.locator('h1')).toHaveText(
        'Паспорт безопасности торгового объекта — разработка и согласование',
      );

      if (javaScriptEnabled) {
        const dismiss = page.getByRole('button', { name: 'Понятно', exact: true });
        if (await dismiss.isVisible()) await dismiss.click();
        const directory = page.getByRole('button', { name: 'Все разделы', exact: true });
        await directory.click();
        await expect(page.locator('#site-directory')).toBeVisible();
        await directory.click();
        await expect(page.locator('#site-directory')).toBeHidden();
      }

      const duplicates = await page.locator('[id]').evaluateAll(elements => {
        const groups = new Map();
        for (const element of elements) {
          const nodes = groups.get(element.id) || [];
          nodes.push({ tag: element.tagName.toLowerCase(), className: element.className });
          groups.set(element.id, nodes);
        }
        return [...groups]
          .filter(([, nodes]) => nodes.length > 1)
          .map(([id, nodes]) => ({ id, nodes }));
      });
      expect(duplicates, 'Duplicate document IDs').toEqual([]);
      await expect(page.locator('#top')).toHaveCount(1);
      await expect(page.locator('header.site-header')).toHaveAttribute('id', 'top');
      await expect(page.locator('section.trade-hero')).not.toHaveAttribute('id');
      await expect(page.locator('#lead-form')).toHaveCount(1);
      await expect(page.locator('#objects')).toHaveCount(1);
      await expect(page.locator('#retail-markets')).toHaveCount(1);
      await expect(page.locator('.trade-hero a[href="#lead-form"]')).toHaveCount(1);
      await expect(page.locator('.trade-hero a[href="#objects"]')).toHaveCount(1);
      expect(errors).toEqual([]);
    });
  });
}
