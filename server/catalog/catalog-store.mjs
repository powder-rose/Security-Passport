import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createCatalogState } from '../../shared/catalog/catalog.js';
import { CATALOG_SETTINGS } from '../../shared/catalog/defaults.js';
import { resolveProjectRoot } from '../shared/project-root.mjs';
import { normalizeCommercialUrl } from './published-pages.mjs';

export function catalogError(message, status = 400, code = 'CATALOG_INPUT_INVALID') {
  return Object.assign(new Error(message), { status, code });
}

function text(value, label, maximum = 10000) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum || /[<>]/.test(value)) {
    throw catalogError(`Заполните поле «${label}» обычным текстом (до ${maximum} символов).`);
  }
  return value.trim();
}

function normalizeSettings(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw catalogError('Некорректные настройки.');
  const settings = {};
  for (const key of Object.keys(CATALOG_SETTINGS).filter(key => key !== 'faq')) {
    settings[key] = text(
      input[key],
      key,
      key === 'seoTitle' ? 250 : key === 'seoDescription' ? 600 : 10000,
    );
  }
  if (!Array.isArray(input.faq) || !input.faq.length || input.faq.length > 30)
    throw catalogError('FAQ должен содержать от 1 до 30 вопросов.');
  settings.faq = input.faq.map((item, index) => ({
    id: `catalog-${index + 1}`,
    question: text(item?.question, 'Вопрос', 500),
    answer: text(item?.answer, 'Ответ', 5000),
  }));
  return settings;
}

function normalizeCards(input, publishedPaths) {
  if (!Array.isArray(input) || input.length > 150)
    throw catalogError('Некорректный список направлений.');
  const urls = new Set();
  const ids = new Set();
  return input.map((item, index) => {
    if (!item || typeof item !== 'object') throw catalogError('Некорректная карточка.');
    const url = normalizeCommercialUrl(item.url);
    if (!url)
      throw catalogError(
        'Нужна внутренняя ссылка на коммерческую страницу паспорта безопасности без параметров и якорей.',
      );
    if (urls.has(url)) throw catalogError(`Адрес уже есть в каталоге: ${url}`);
    urls.add(url);
    const id = item.id || crypto.randomUUID();
    if (typeof id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(id) || ids.has(id))
      throw catalogError('Некорректный идентификатор карточки.');
    ids.add(id);
    for (const key of ['showInCatalog', 'showInMenu']) {
      if (typeof item[key] !== 'boolean')
        throw catalogError('Укажите видимость карточки и пункта меню.');
    }
    if ((item.showInCatalog || item.showInMenu) && !publishedPaths.has(url)) {
      throw catalogError(
        `Сначала опубликуйте коммерческую страницу: ${url}. Либо выключите оба переключателя видимости.`,
      );
    }
    const order = item.order;
    const menuOrder = item.menuOrder ?? (index + 1) * 10;
    if (
      ![order, menuOrder].every(
        value => Number.isSafeInteger(value) && value >= 0 && value <= 100000,
      )
    ) {
      throw catalogError('Порядок должен быть целым числом от 0 до 100000.');
    }
    return {
      id,
      title: text(item.title, 'Название', 250),
      regulation: text(item.regulation, 'Номер ПП', 180),
      description: text(item.description, 'Краткое описание', 800),
      url,
      order,
      menuOrder,
      showInCatalog: item.showInCatalog,
      showInMenu: item.showInMenu,
    };
  });
}

export function createCatalogStore({
  file = path.resolve(resolveProjectRoot(), process.env.CATALOG_FILE || 'data/directions.json'),
} = {}) {
  let writes = Promise.resolve();
  async function read() {
    let state;
    try {
      state = JSON.parse(await fs.readFile(file, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') return createCatalogState();
      throw error;
    }
    if (
      state.version !== 1 ||
      !Number.isSafeInteger(state.revision) ||
      !Array.isArray(state.cards) ||
      !state.settings
    ) {
      throw new Error('INVALID_CATALOG_STORAGE');
    }
    return state;
  }
  function update(input, publishedPaths) {
    const queued = writes.then(async () => {
      const previous = await read();
      if (input?.revision !== previous.revision)
        throw catalogError(
          'Каталог изменён в другом окне. Обновите страницу перед сохранением.',
          409,
          'CATALOG_REVISION_CONFLICT',
        );
      const next = {
        version: 1,
        revision: previous.revision + 1,
        settings: normalizeSettings(input.settings),
        cards: normalizeCards(input.cards, new Set(publishedPaths)),
      };
      await fs.mkdir(path.dirname(file), { recursive: true });
      const temporary = `${file}.${crypto.randomUUID()}.tmp`;
      try {
        await fs.writeFile(temporary, JSON.stringify(next, null, 2) + '\n', { mode: 0o600 });
        await fs.rename(temporary, file);
      } finally {
        await fs.rm(temporary, { force: true });
      }
      return next;
    });
    writes = queued.catch(() => {});
    return queued;
  }
  return { read, update };
}

export const catalogStore = createCatalogStore();
