import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';

import { getObjectTypeByPathname, objectTypes } from '../../src/data/objectTypes.js';
import { waterObjectType } from '../../src/data/waterObjectType.js';
import { getServicePageByPathname, servicePages } from '../../src/data/servicePages.js';
import {
  getObjectPageSource,
  getPageImportKey,
  objectPageSources,
} from '../../src/config/pageRouteRegistry.js';
import { waterLinks } from '../../src/pages/WaterPage/waterPageData.js';

const waterPath = '/pasport-bezopasnosti-obekta-vodosnabzheniya-i-vodootvedeniya/';

test('water is registered once through the shared object catalog', () => {
  assert.equal(objectTypes.filter(item => item.id === 'water').length, 1);
  assert.equal(objectTypes.filter(item => item.path === waterPath).length, 1);
  assert.equal(getObjectTypeByPathname(waterPath), waterObjectType);
  assert.equal(new Set(objectTypes.map(item => item.id)).size, objectTypes.length);
  assert.equal(new Set(objectTypes.map(item => item.path)).size, objectTypes.length);
});

test('water path normalization resolves to one canonical catalog entry', () => {
  for (const pathname of [
    waterPath,
    waterPath.slice(0, -1),
    `${waterPath}?utm_source=integration`,
    `${waterPath}#faq`,
  ]) {
    assert.equal(getObjectTypeByPathname(pathname), waterObjectType);
    assert.equal(getObjectTypeByPathname(pathname).path, waterPath);
  }
  assert.equal(getObjectTypeByPathname('/water-integration-missing/'), null);
});

test('water resolves through the shared specialized page registry', async () => {
  const source = 'src/pages/WaterPage/WaterPage.jsx';
  assert.equal(objectPageSources.water, source);
  assert.equal(getObjectPageSource('water'), source);
  assert.equal(getPageImportKey(source), './pages/WaterPage/WaterPage.jsx');
  assert.equal(Object.isFrozen(objectPageSources), true);
  await access(new URL(`../../${source}`, import.meta.url));
});

test('water catalog copy and metadata retain the approved wording', () => {
  assert.equal(
    waterObjectType.title,
    'Паспорт безопасности объектов водоснабжения и водоотведения',
  );
  assert.equal(
    waterObjectType.description,
    'Разработка по ПП РФ № 1467. Водозаборы, насосные станции, очистные сооружения.',
  );
  assert.equal(waterObjectType.regulationAct, 'ПП РФ № 1467');
  assert.equal(
    waterObjectType.seoTitle,
    'Паспорт безопасности водоснабжения и водоотведения по ПП № 1467 | БОЙКОВГРУПП',
  );
  assert.equal(waterObjectType.h1, 'Паспорт безопасности объекта водоснабжения и водоотведения');
});

test('water does not duplicate another commercial page or its SEO metadata', () => {
  for (const item of [...objectTypes, ...servicePages]) {
    if (item === waterObjectType) continue;
    assert.notEqual(item.path, waterPath);
    assert.notEqual(item.seoTitle, waterObjectType.seoTitle);
    assert.notEqual(item.seoDescription, waterObjectType.seoDescription);
  }
});

test('water internal links resolve through existing canonical catalogs', () => {
  for (const link of Object.values(waterLinks)) {
    assert.match(link.href, /^\/(?!\/)/);
    assert.equal(link.target, undefined);
    assert.equal(link.rel, undefined);
    if (link.href === '/') continue;
    const target = getObjectTypeByPathname(link.href) || getServicePageByPathname(link.href);
    assert.ok(target, `Unregistered water link: ${link.href}`);
    assert.equal(target.path, link.href);
  }
});

test('water preserves the act and actualization services in the shared directories', () => {
  const excluded = waterObjectType.excludedServiceIds || [];
  const visible = servicePages.filter(item => !excluded.includes(item.id));
  for (const link of [waterLinks.act, waterLinks.actualization]) {
    assert.equal(visible.filter(item => item.path === link.href).length, 1);
  }
});
