import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createContentSlug } from '../../shared/contracts/content-slug.js';
import {
  QUESTION_AUTHORS,
  QUESTION_CATEGORIES,
  QUESTION_SETTINGS,
} from '../../shared/contracts/questions.js';
import { getArticles } from '../articles/admin-articles.mjs';
import { resolveProjectRoot } from '../shared/project-root.mjs';
import {
  normalizeQuestion,
  questionError,
  validateQuestionPublication,
  findQuestionWarnings,
} from './question-validation.mjs';

const MEANINGFUL_FIELDS = [
  'title',
  'shortAnswer',
  'content',
  'category',
  'authorId',
  'image',
  'imageAlt',
  'mainArticleSlug',
  'articleSlugs',
  'servicePath',
  'relatedQuestionIds',
  'seoTitle',
  'seoDescription',
];

export function createQuestionStore({
  file = path.resolve(resolveProjectRoot(), process.env.QUESTIONS_FILE || 'data/questions.json'),
  seedFile = new URL('./questions.seed.json', import.meta.url),
  readArticles = getArticles,
  now = () => new Date().toISOString(),
} = {}) {
  let writes = Promise.resolve();

  async function read() {
    let state;
    try {
      state = JSON.parse(await fs.readFile(file, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const seeds = seedFile ? JSON.parse(await fs.readFile(seedFile, 'utf8')) : [];
      state = {
        version: 1,
        settings: { ...QUESTION_SETTINGS },
        categories: [...QUESTION_CATEGORIES],
        authors: [...QUESTION_AUTHORS],
        records: seeds.map(seed => ({
          id: seed.id,
          revision: 1,
          status: 'review',
          createdAt: null,
          updatedAt: null,
          draft: normalizeQuestion(seed),
          live: null,
          scheduledAt: null,
          aliases: [],
          history: [],
        })),
      };
    }
    if (
      state.version !== 1 ||
      !Array.isArray(state.records) ||
      !Array.isArray(state.categories) ||
      !Array.isArray(state.authors) ||
      !state.settings
    ) {
      throw new Error('INVALID_QUESTIONS_STORAGE');
    }
    // Treat persisted rich text as untrusted at both read and write boundaries.
    for (const record of state.records) {
      record.draft = normalizeQuestion(record.draft);
      if (record.live)
        record.live = { ...record.live, content: normalizeQuestion(record.live).content };
    }
    return state;
  }

  async function save(state) {
    const temporary = `${file}.${crypto.randomUUID()}.tmp`;
    await fs.mkdir(path.dirname(file), { recursive: true });
    try {
      await fs.writeFile(temporary, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
      await fs.rename(temporary, file);
    } finally {
      await fs.rm(temporary, { force: true });
    }
  }

  function mutate(operation) {
    const queued = writes.then(async () => {
      const state = await read();
      const result = await operation(state);
      await save(state);
      return result;
    });
    writes = queued.catch(() => {});
    return queued;
  }

  function recordById(state, id) {
    const record = state.records.find(item => item.id === id);
    if (!record) throw questionError('Вопрос не найден.', 404, 'QUESTION_NOT_FOUND');
    return record;
  }

  function checkRevision(record, revision) {
    if (revision !== record.revision)
      throw questionError(
        'Материал изменён в другом окне. Обновите страницу перед сохранением.',
        409,
        'QUESTION_REVISION_CONFLICT',
      );
  }

  function checkSlug(state, record, slug) {
    if (
      slug &&
      state.records.some(
        item =>
          item.id !== record.id &&
          (item.draft.slug === slug || item.live?.slug === slug || item.aliases.includes(slug)),
      )
    ) {
      throw questionError(
        'Этот slug уже используется или зарезервирован редиректом.',
        409,
        'QUESTION_SLUG_CONFLICT',
      );
    }
  }

  function remember(record) {
    record.history.unshift({ id: crypto.randomUUID(), savedAt: now(), draft: record.draft });
    record.history = record.history.slice(0, 50);
  }

  function publishRecord(record, state, articles, overrideWarnings = false) {
    if (
      record.live &&
      record.live.slug !== record.draft.slug &&
      record.draft.canonical === record.live.canonical &&
      record.live.canonical === `https://pasport-bezopasnosty.ru/questions/${record.live.slug}/`
    )
      record.draft.canonical = '';
    const { canonical } = validateQuestionPublication(
      record.draft,
      state,
      articles,
      record.id,
      overrideWarnings,
    );
    checkSlug(state, record, record.draft.slug);
    const timestamp = now();
    const changed =
      !record.live ||
      MEANINGFUL_FIELDS.some(
        field => JSON.stringify(record.draft[field]) !== JSON.stringify(record.live[field]),
      );
    if (record.live && record.live.slug !== record.draft.slug) {
      record.aliases = [...new Set([...record.aliases, record.live.slug])].filter(
        slug => slug !== record.draft.slug,
      );
    }
    record.live = {
      ...record.draft,
      id: record.id,
      canonical,
      author: state.authors.find(author => author.id === record.draft.authorId),
      publishedAt: record.live?.publishedAt || timestamp,
      modifiedAt: changed ? timestamp : record.live.modifiedAt,
    };
    record.status = 'published';
    record.scheduledAt = null;
    delete record.scheduleOverrideWarnings;
    delete record.scheduleError;
    record.updatedAt = timestamp;
    record.revision += 1;
    return record;
  }

  async function create(input = {}) {
    return mutate(state => {
      const draft = normalizeQuestion(input);
      draft.slug ||= createContentSlug(draft.title);
      const record = {
        id: crypto.randomUUID(),
        revision: 1,
        status: 'draft',
        createdAt: now(),
        updatedAt: now(),
        draft,
        live: null,
        scheduledAt: null,
        aliases: [],
        history: [],
      };
      checkSlug(state, record, draft.slug);
      state.records.push(record);
      return record;
    });
  }

  function update(id, input, { revision, autosave = false } = {}) {
    return mutate(state => {
      const record = recordById(state, id);
      checkRevision(record, revision);
      if (record.scheduledAt) throw questionError('Сначала отмените отложенную публикацию.', 409);
      const draft = normalizeQuestion(input, record.draft);
      checkSlug(state, record, draft.slug);
      if (
        !autosave ||
        !record.history.length ||
        Date.parse(now()) - Date.parse(record.history[0].savedAt) > 60_000
      )
        remember(record);
      if (
        MEANINGFUL_FIELDS.some(
          field => JSON.stringify(draft[field]) !== JSON.stringify(record.draft[field]),
        )
      ) {
        if (!Object.hasOwn(input, 'seoReview')) draft.seoReview = 'pending';
        if (!Object.hasOwn(input, 'normativeReview')) draft.normativeReview = 'pending';
      }
      record.draft = draft;
      record.updatedAt = now();
      record.createdAt ||= now();
      record.revision += 1;
      if (!record.live) record.status = 'draft';
      return record;
    });
  }

  function action(
    id,
    { action: operation, revision, scheduledAt, versionId, overrideWarnings = false },
  ) {
    return mutate(async state => {
      const record = recordById(state, id);
      checkRevision(record, revision);
      if (operation === 'publish')
        return publishRecord(record, state, await readArticles(), overrideWarnings);
      if (operation === 'schedule') {
        if (
          !scheduledAt ||
          !Number.isFinite(Date.parse(scheduledAt)) ||
          Date.parse(scheduledAt) <= Date.parse(now())
        )
          throw questionError('Выберите будущее время публикации.');
        validateQuestionPublication(
          record.draft,
          state,
          await readArticles(),
          id,
          overrideWarnings,
        );
        record.scheduledAt = new Date(scheduledAt).toISOString();
        record.status = 'scheduled';
        record.scheduleOverrideWarnings = overrideWarnings === true;
      } else if (operation === 'cancel-schedule') {
        record.scheduledAt = null;
        record.status = record.live ? 'published' : 'draft';
      } else if (operation === 'archive') {
        record.live = null;
        record.scheduledAt = null;
        record.status = 'archived';
      } else if (operation === 'review') {
        record.status = record.live ? 'published' : 'review';
      } else if (operation === 'restore') {
        const version = record.history.find(item => item.id === versionId);
        if (!version) throw questionError('Версия не найдена.', 404);
        const restored = normalizeQuestion(version.draft);
        checkSlug(state, record, restored.slug);
        remember(record);
        record.draft = { ...restored, seoReview: 'pending', normativeReview: 'pending' };
        record.scheduledAt = null;
        record.status = record.live ? 'published' : 'draft';
      } else throw questionError('Неизвестное действие.');
      record.updatedAt = now();
      record.revision += 1;
      return record;
    });
  }

  function updateSettings(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input))
      throw questionError('Некорректные настройки.');
    return mutate(state => {
      if (input.categories) {
        if (
          !Array.isArray(input.categories) ||
          input.categories.some(name => typeof name !== 'string' || !name.trim())
        )
          throw questionError('Некорректный справочник категорий.');
        const categories = [...new Set(input.categories.map(name => name.trim()))];
        const rename = input.rename;
        if (rename) {
          if (!state.categories.includes(rename.from) || !categories.includes(rename.to))
            throw questionError('Некорректное переименование категории.');
          for (const record of state.records) {
            if (record.draft.category !== rename.from && record.live?.category !== rename.from)
              continue;
            if (record.draft.category === rename.from) record.draft.category = rename.to;
            if (record.live?.category === rename.from)
              record.live = { ...record.live, category: rename.to, modifiedAt: now() };
            record.revision += 1;
          }
        }
        if (
          state.records.some(record =>
            [record.draft.category, record.live?.category]
              .filter(Boolean)
              .some(name => !categories.includes(name)),
          )
        )
          throw questionError('Нельзя удалить используемую категорию.');
        state.categories = categories;
      }
      if (input.settings) {
        for (const key of Object.keys(QUESTION_SETTINGS)) {
          const value = input.settings[key];
          if (typeof value !== 'string' || !value.trim())
            throw questionError('Заполните настройки заголовков рубрики.');
          state.settings[key] = value.trim();
        }
      }
      return state;
    });
  }

  async function inspect(id) {
    const state = await read();
    const record = recordById(state, id);
    return {
      record,
      warnings: findQuestionWarnings(record.draft, state.records, await readArticles(), id),
    };
  }

  async function publishDue() {
    const state = await read();
    if (
      !state.records.some(
        record => record.scheduledAt && Date.parse(record.scheduledAt) <= Date.parse(now()),
      )
    )
      return [];
    return mutate(async current => {
      const published = [];
      const articles = await readArticles();
      for (const record of current.records) {
        if (!record.scheduledAt || Date.parse(record.scheduledAt) > Date.parse(now())) continue;
        try {
          publishRecord(record, current, articles, record.scheduleOverrideWarnings === true);
          published.push(record.id);
          delete record.scheduleError;
        } catch (error) {
          record.scheduleError = error.message;
          record.scheduledAt = null;
          record.status = record.live ? 'published' : 'review';
        }
      }
      return published;
    });
  }

  return { read, create, update, action, updateSettings, inspect, publishDue };
}

export const questionStore = createQuestionStore();
