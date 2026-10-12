import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  pageModuleSources,
  objectPageSources,
  servicePageSources,
  getObjectPageSource,
  getServicePageSource,
  getPageImportKey,
} from '../../src/config/pageRouteRegistry.js';

import { objectTypes } from '../../src/data/objectTypes.js';
import { servicePages } from '../../src/data/servicePages.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('all registered page modules exist and match the Vite glob pattern', async () => {
  const sources = new Set([
    ...Object.values(pageModuleSources),
    ...Object.values(objectPageSources),
    ...Object.values(servicePageSources),
  ]);

  for (const source of sources) {
    assert.match(source, /^src\/pages\/[^/]+\/[^/]+Page\.jsx$/);

    await access(path.join(root, source));

    assert.equal(getPageImportKey(source), `./${source.slice(4)}`);
  }
});

test('object page registry matches supported object types', () => {
  const objectIds = objectTypes.map(objectType => objectType.id);

  assert.equal(new Set(objectIds).size, objectIds.length);

  const specializedIds = objectIds.filter(id => id !== 'social');

  assert.deepEqual(Object.keys(objectPageSources).sort(), specializedIds.sort());

  for (const id of specializedIds) {
    assert.equal(getObjectPageSource(id), objectPageSources[id]);
  }

  assert.equal(getObjectPageSource('social'), pageModuleSources.genericObject);

  assert.equal(getObjectPageSource('unknown'), pageModuleSources.genericObject);
});

test('service page registry matches supported services', () => {
  const serviceIds = servicePages.map(servicePage => servicePage.id);

  assert.equal(new Set(serviceIds).size, serviceIds.length);

  assert.deepEqual(Object.keys(servicePageSources).sort(), [...serviceIds].sort());

  for (const id of serviceIds) {
    assert.equal(getServicePageSource(id), servicePageSources[id]);
  }

  assert.equal(getServicePageSource('unknown'), null);
});

test('route registry rejects invalid sources and remains immutable', () => {
  assert.throws(() => getPageImportKey('../server/index.mjs'), TypeError);

  assert.throws(() => getPageImportKey('src/pages/HotelPage/HotelPage.js'), TypeError);

  assert.throws(() => getPageImportKey(null), TypeError);

  for (const registry of [pageModuleSources, objectPageSources, servicePageSources]) {
    assert.equal(Object.isFrozen(registry), true);
  }
});
