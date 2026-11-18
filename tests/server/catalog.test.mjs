import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import express from 'express';

import {
  createCatalogState,
  publicCatalog,
  serializeBootstrap,
} from '../../shared/catalog/catalog.js';
import { objectTypes } from '../../src/data/objectTypes.js';
import { createCatalogStore } from '../../server/catalog/catalog-store.mjs';
import {
  normalizeCommercialUrl,
  readPublishedCommercialPages,
  createPublishedPagesReader,
} from '../../server/catalog/published-pages.mjs';
import { registerCatalogRoutes } from '../../server/http/catalog-routes.mjs';
import { createAdminAuth } from '../../server/auth/admin-auth.mjs';
import { createLeadIntake } from '../../server/leads/lead-intake.mjs';
import { LEAD_SOURCE_CATALOG } from '../../shared/contracts/lead.js';
import { createRequest, createResponse, withMutedConsole } from './http-test-utils.mjs';

const publishedPaths = objectTypes.map(item => item.path);

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-catalog-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const file = path.join(root, 'directions.json');
  return { root, file, store: createCatalogStore({ file }) };
}

test('the seed preserves the existing menu and only catalogs dedicated published regimes', () => {
  const state = createCatalogState();
  const data = publicCatalog(state, publishedPaths);
  assert.equal(data.cards.length, 14);
  assert.deepEqual(
    data.menuItems,
    objectTypes.map(({ path, title }) => ({ path, title })),
  );
  assert.equal(new Set(data.cards.map(card => card.url)).size, data.cards.length);
  assert.equal(data.cards[0].id, 'education');
  assert.equal(data.cards.find(card => card.id === 'education').regulation, 'ПП РФ № 1006');
  for (const id of ['market', 'trade', 'crowd', 'rosgvardia'])
    assert.ok(data.cards.some(card => card.id === id));
  assert.ok(!data.cards.some(card => card.id === 'energy'));
  assert.equal(data.settings.faq.length, 10);
});

test('card order, independent visibility and page copy survive restart', async t => {
  const { store, file } = await fixture(t);
  const state = await store.read();
  const hotel = state.cards.find(card => card.id === 'hotel');
  hotel.order = 0;
  hotel.showInMenu = false;
  const trade = state.cards.find(card => card.id === 'trade');
  trade.showInCatalog = false;
  state.settings.title = 'Обновлённый заголовок каталога';
  const next = await store.update(state, publishedPaths);
  assert.equal(next.revision, 1);
  const data = publicCatalog(await createCatalogStore({ file }).read(), publishedPaths);
  assert.equal(data.cards[0].id, 'hotel');
  assert.ok(!data.menuItems.some(item => item.path === hotel.url));
  assert.ok(!data.cards.some(item => item.id === 'trade'));
  assert.ok(data.menuItems.some(item => item.path === trade.url));
  assert.equal(data.settings.title, state.settings.title);
});

test('CMS adds a newly published page without automatically adding a menu item', async t => {
  const { store } = await fixture(t);
  const state = await store.read();
  const url = '/pasport-bezopasnosti-novogo-obekta/';
  state.cards.push({
    id: 'new-object',
    title: 'Новое направление',
    regulation: 'ПП РФ № 1055',
    description: 'Объект в установленной сфере применения.',
    url,
    order: 1,
    menuOrder: 200,
    showInCatalog: true,
    showInMenu: false,
  });
  await assert.rejects(store.update(state, publishedPaths), /Сначала опубликуйте/);
  const result = await store.update(state, [...publishedPaths, url]);
  const data = publicCatalog(result, [...publishedPaths, url]);
  assert.equal(data.cards[0].url, url);
  assert.ok(!data.menuItems.some(item => item.path === url));
});

test('duplicate normalized URLs, external links and noncommercial targets are rejected', async t => {
  const { store } = await fixture(t);
  for (const url of [
    'https://example.org/pasport-bezopasnosti-x/',
    '//evil.example/pasport-bezopasnosti-x/',
    '/blog/example/',
    '/admin/',
    '/pasport-bezopasnosti-gostinicy/?x=1',
    '/pasport-bezopasnosti-gostinicy/#contact',
  ]) {
    const state = await store.read();
    state.cards[0].url = url;
    await assert.rejects(store.update(state, publishedPaths), /внутренняя ссылка/);
  }
  const state = await store.read();
  state.cards[1].url = `https://pasport-bezopasnosty.ru${state.cards[0].url.replace(/\/$/, '')}`;
  await assert.rejects(store.update(state, publishedPaths), /уже есть/);
  assert.equal(
    normalizeCommercialUrl('https://pasport-bezopasnosty.ru/pasport-bezopasnosti-gostinicy'),
    '/pasport-bezopasnosti-gostinicy/',
  );
});

test('invalid settings, empty cards and invalid flags cannot replace the saved document', async t => {
  const { store } = await fixture(t);
  for (const mutate of [
    state => {
      state.settings.title = '';
    },
    state => {
      state.settings.faq[0].answer = '';
    },
    state => {
      state.cards[0].description = '';
    },
    state => {
      state.cards[0].showInMenu = 'false';
    },
    state => {
      state.cards[0].order = -1;
    },
    state => {
      state.settings.intro = '<script>alert(1)</script>';
    },
  ]) {
    const state = await store.read();
    mutate(state);
    await assert.rejects(store.update(state, publishedPaths));
    assert.equal((await store.read()).revision, 0);
  }
});

test('simultaneous stale saves cannot silently overwrite the first editor', async t => {
  const { store } = await fixture(t);
  const state = await store.read();
  const results = await Promise.allSettled([
    store.update(state, publishedPaths),
    store.update(state, publishedPaths),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(
    results.find(result => result.status === 'rejected').reason.code,
    'CATALOG_REVISION_CONFLICT',
  );
});

test('removing or closing a landing page hides its card and menu entry on public reads', () => {
  const state = createCatalogState();
  const hotel = state.cards.find(card => card.id === 'hotel');
  const data = publicCatalog(
    state,
    publishedPaths.filter(url => url !== hotel.url),
  );
  assert.ok(!data.cards.some(card => card.url === hotel.url));
  assert.ok(!data.menuItems.some(item => item.path === hotel.url));
});

test('published target detection rejects redirects, noindex, incorrect canonicals and arbitrary files', async t => {
  const { root } = await fixture(t);
  const html =
    '<h1>Объект</h1><link rel="canonical" href="https://pasport-bezopasnosty.ru/pasport-bezopasnosti-valid/">';
  for (const [name, source] of Object.entries({
    valid: html,
    noindex: html.replace(/valid/g, 'noindex') + '<meta name="robots" content="noindex,follow">',
    redirect: html.replace(/valid/g, 'redirect') + '<meta http-equiv="refresh" content="0;url=/">',
    wrong: html,
    empty: '',
  })) {
    const dir = path.join(root, `pasport-bezopasnosti-${name}`);
    await fs.mkdir(dir);
    await fs.writeFile(path.join(dir, 'index.html'), source);
  }
  assert.deepEqual(await readPublishedCommercialPages(root), [
    { url: '/pasport-bezopasnosti-valid/' },
  ]);
  const readPages = createPublishedPagesReader(root);
  assert.equal((await readPages()).length, 1);
  await fs.appendFile(
    path.join(root, 'pasport-bezopasnosti-valid/index.html'),
    '<meta name="robots" content="noindex">',
  );
  assert.equal((await readPages()).length, 0);
});

test('bootstrap serialization cannot close a script tag', () => {
  const serialized = serializeBootstrap({ title: '</script><script>alert(1)</script>' });
  assert.doesNotMatch(serialized, /[<>]/);
  assert.equal(JSON.parse(serialized).title, '</script><script>alert(1)</script>');
});

test('admin routes require a session, persist edits and render current HTML immediately', async t => {
  const { store, root } = await fixture(t);
  const app = express();
  app.use(express.json());
  const auth = createAdminAuth({
    password: 'test-password',
    secret: 'test-secret',
    isProduction: false,
  });
  app.post('/api/admin/login', auth.login);
  registerCatalogRoutes({
    app,
    adminAuth: auth,
    clientDir: root,
    store,
    readPages: async () => publishedPaths.map(url => ({ url })),
    renderPage: async data =>
      `<h1>${data.settings.title}</h1>${data.cards.map(card => `<a href="${card.url}">${card.title}</a>`).join('')}`,
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(origin + '/api/admin/directions')).status, 401);
  assert.equal(
    (
      await fetch(origin + '/api/admin/directions', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      })
    ).status,
    401,
  );
  const login = await fetch(origin + '/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: 'test-password' }),
  });
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const state = await (
    await fetch(origin + '/api/admin/directions', { headers: { cookie } })
  ).json();
  state.settings.title = 'Сохранённый каталог';
  const saved = await fetch(origin + '/api/admin/directions', {
    method: 'PUT',
    headers: { cookie, 'content-type': 'application/json' },
    body: JSON.stringify(state),
  });
  assert.equal(saved.status, 200);
  const page = await fetch(origin + '/postanovleniya/');
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Сохранённый каталог/);
  const redirect = await fetch(origin + '/postanovleniya?x=1', { redirect: 'manual' });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/postanovleniya/?x=1');
  const menu = await (await fetch(origin + '/api/directions/menu')).json();
  assert.equal(menu.menuItems.length, 15);
  assert.equal(menu.settings, undefined);
  const filtered = await fetch(origin + '/postanovleniya/?page=2');
  assert.equal(filtered.headers.get('x-robots-tag'), 'noindex, follow');
});

test('catalog lead source uses the existing intake validation and delivery path', async () => {
  const delivered = [];
  const intake = createLeadIntake({
    leadDelivery: {
      deliverLead: async lead => {
        delivered.push(lead);
        return { ok: true };
      },
    },
    env: {},
  });
  const body = {
    source: LEAD_SOURCE_CATALOG,
    requestId: 'catalog-lead-request',
    data: { name: 'Иван', phone: '+79990000000', consent: true, website: '' },
  };
  const response = createResponse();
  await withMutedConsole('info', () => intake.handleLead(createRequest({ body }), response));
  assert.equal(response.statusCode, 201);
  assert.equal(delivered[0].source, LEAD_SOURCE_CATALOG);
  const invalid = createResponse();
  await intake.handleLead(
    createRequest({
      body: { ...body, requestId: 'catalog-invalid-lead', data: { ...body.data, consent: false } },
    }),
    invalid,
  );
  assert.equal(invalid.statusCode, 400);
  assert.equal(delivered.length, 1);
});
