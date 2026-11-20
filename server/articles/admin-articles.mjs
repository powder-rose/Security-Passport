import { createContentSlug as createSlug } from '../../shared/contracts/content-slug.js';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  buildArticleCategoryOptions,
  sanitizeArticleCategory as normalizeArticleCategory,
} from '../../shared/contracts/article-category.js';

import { sanitizeArticleContent } from './article-html.mjs';
import { parseScheduleInstant } from '../../shared/contracts/article-schedule.js';

const FILE = path.resolve('data/articles.json');
const DELETED_SLUGS_FILE = path.resolve('data/deleted-article-slugs.json');

let writes = Promise.resolve();

async function readStoredArticles() {
  try {
    const data = await fs.readFile(FILE, 'utf8');

    const articles = JSON.parse(data);

    if (!Array.isArray(articles)) {
      throw new Error('INVALID_ARTICLES_STORAGE');
    }

    return articles;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function readArticles() {
  const articles = await readStoredArticles();

  return articles.map(article => ({
    ...article,

    content: sanitizeArticleContent(article?.content),
  }));
}

async function readDeletedSlugs() {
  try {
    const slugs = JSON.parse(await fs.readFile(DELETED_SLUGS_FILE, 'utf8'));
    if (!Array.isArray(slugs) || slugs.some(slug => typeof slug !== 'string' || !slug)) {
      throw new Error('INVALID_DELETED_ARTICLE_SLUGS');
    }
    return slugs;
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

export async function isDeletedArticleSlug(slug) {
  return (await readDeletedSlugs()).includes(slug);
}

async function saveJson(file, value) {
  const temporary = `${file}.${process.pid}.${Date.now()}.tmp`;

  try {
    await fs.mkdir(path.dirname(file), {
      recursive: true,
    });

    await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    });

    await fs.rename(temporary, file);
  } catch (error) {
    await fs.rm(temporary, {
      force: true,
    });

    throw error;
  }
}

function saveArticles(articles) {
  return saveJson(FILE, articles);
}

function queueArticleWrite(operation) {
  const queued = writes.then(operation);

  writes = queued.catch(() => {});

  return queued;
}

function createArticleInputError(field = 'payload') {
  const error = new TypeError(`Invalid article input: ${field}`);

  error.code = 'ARTICLE_INPUT_INVALID';

  return error;
}

function assertArticleInputObject(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createArticleInputError();
  }
}

function assertOptionalString(input, field) {
  if (!Object.hasOwn(input, field) || input[field] === undefined) {
    return;
  }

  if (typeof input[field] !== 'string') {
    throw createArticleInputError(field);
  }
}

function assertOptionalNullableString(input, field) {
  if (!Object.hasOwn(input, field) || input[field] === undefined) {
    return;
  }

  if (input[field] !== null && typeof input[field] !== 'string') {
    throw createArticleInputError(field);
  }
}

function assertOptionalArticleStatus(input) {
  if (!Object.hasOwn(input, 'status') || input.status === undefined) {
    return;
  }

  if (!['draft', 'published', 'scheduled'].includes(input.status)) {
    throw createArticleInputError('status');
  }
}

function validateCreateArticleInput(input) {
  assertArticleInputObject(input);

  for (const field of [
    'title',
    'content',
    'imageAlt',
    'category',
    'slug',
    'seoTitle',
    'seoDescription',
  ]) {
    assertOptionalString(input, field);
  }

  assertOptionalNullableString(input, 'image');

  assertOptionalArticleStatus(input);
  assertOptionalNullableString(input, 'scheduledAt');
  assertOptionalString(input, 'expectedUpdatedAt');

  return input;
}

function validateUpdateArticleInput(input) {
  assertArticleInputObject(input);

  for (const field of [
    'title',
    'content',
    'imageAlt',
    'category',
    'slug',
    'seoTitle',
    'seoDescription',
    'ogTitle',
    'ogDescription',
  ]) {
    assertOptionalString(input, field);
  }

  for (const field of ['image', 'ogImage']) {
    assertOptionalNullableString(input, field);
  }

  assertOptionalArticleStatus(input);
  assertOptionalNullableString(input, 'scheduledAt');
  assertOptionalString(input, 'expectedUpdatedAt');

  if (
    Object.hasOwn(input, 'updateSlug') &&
    input.updateSlug !== undefined &&
    typeof input.updateSlug !== 'boolean'
  ) {
    throw createArticleInputError('updateSlug');
  }

  if (input.updateSlug === true && typeof input.slug !== 'string') {
    throw createArticleInputError('slug');
  }

  return input;
}

function normalizeSeoField(value) {
  return String(value ?? '').trim();
}

function assertPublishedArticleSeo({ status, seoTitle, seoDescription }) {
  if (status !== 'published' && status !== 'scheduled') {
    return;
  }

  if (normalizeSeoField(seoTitle) && normalizeSeoField(seoDescription)) {
    return;
  }

  const error = new Error('SEO Title and SEO Description are required for published articles');

  error.code = 'ARTICLE_SEO_REQUIRED';

  throw error;
}

function scheduleError(code) {
  return Object.assign(new Error(code), { code });
}

function nextPublicationSchedule(article, data, status, now) {
  const previous = article?.publicationSchedule;
  if (status === 'scheduled') {
    const at = parseScheduleInstant(
      Object.hasOwn(data, 'scheduledAt') ? data.scheduledAt : previous?.at,
    );
    if (!at) throw scheduleError('ARTICLE_SCHEDULE_INVALID');
    const unchanged =
      article?.status === 'scheduled' && previous?.at === at && previous.state === 'scheduled';
    if (Date.parse(at) <= Date.parse(now) && !unchanged)
      throw scheduleError('ARTICLE_SCHEDULE_PAST');
    if (unchanged) return previous;
    return {
      id: crypto.randomUUID(),
      at,
      state: 'scheduled',
      createdAt: now,
      startedAt: null,
      finishedAt: null,
      error: null,
    };
  }
  if (!previous) return undefined;
  if (status === 'published' && article?.status === 'scheduled') {
    return { ...previous, state: 'publishing', startedAt: now, finishedAt: null, error: null };
  }
  if (status === 'draft' && previous.state !== 'cancelled') {
    return { ...previous, state: 'cancelled', finishedAt: now, error: null };
  }
  return previous;
}

async function createUniqueSlug(articles, value, excludeId = null) {
  const base = createSlug(value) || 'article';
  const deletedSlugs = new Set(await readDeletedSlugs());

  let candidate = base;

  let suffix = 2;

  const isUsed = slug =>
    deletedSlugs.has(slug) ||
    articles.some(
      article =>
        article.id !== excludeId &&
        (article.slug === slug ||
          (Array.isArray(article.legacySlugs) && article.legacySlugs.includes(slug))),
    );

  while (isUsed(candidate)) {
    candidate = `${base}-${suffix}`;

    suffix += 1;
  }

  return candidate;
}

export async function getArticles() {
  const articles = await readArticles();

  return articles.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

export async function getArticleCategories() {
  const articles = await readStoredArticles();

  return buildArticleCategoryOptions(articles.map(article => article?.category));
}

async function createArticleMutation(data) {
  const articles = await readArticles();

  const now = new Date().toISOString();

  const seoTitle = normalizeSeoField(data.seoTitle);

  const seoDescription = normalizeSeoField(data.seoDescription);

  const status = data.status || 'draft';
  const publicationSchedule = nextPublicationSchedule(null, data, status, now);

  assertPublishedArticleSeo({
    status,
    seoTitle,
    seoDescription,
  });

  const article = {
    id: crypto.randomUUID(),

    title: data.title || '',

    content: sanitizeArticleContent(data.content),

    image: data.image || null,

    imageAlt: data.imageAlt || '',

    status,
    ...(publicationSchedule ? { publicationSchedule } : {}),
    category: normalizeArticleCategory(data.category),

    slug: await createUniqueSlug(articles, data.slug || data.title || 'article'),

    legacySlugs: [],

    seoTitle,

    seoDescription,

    ogTitle: '',

    ogDescription: '',

    ogImage: null,

    createdAt: now,

    updatedAt: now,

    publishedAt: status === 'published' ? now : null,
  };

  articles.push(article);

  await saveArticles(articles);

  return article;
}

async function updateArticleMutation(id, data) {
  const articles = await readArticles();

  const index = articles.findIndex(item => item.id === id);

  if (index === -1) {
    return null;
  }

  const article = articles[index];
  if (data.expectedUpdatedAt !== undefined && data.expectedUpdatedAt !== article.updatedAt) {
    throw scheduleError('ARTICLE_CONFLICT');
  }

  let nextSlug = article.slug;

  let legacySlugs = Array.isArray(article.legacySlugs) ? [...article.legacySlugs] : [];

  /*
   * ВАЖНО:
   *
   * Обычное изменение заголовка больше
   * не должно менять публичный URL.
   *
   * Slug меняется только если админ
   * явно отправил updateSlug: true.
   */
  if (data.updateSlug === true && typeof data.slug === 'string') {
    const requestedSlug = await createUniqueSlug(articles, data.slug, article.id);

    if (requestedSlug && requestedSlug !== article.slug) {
      if (article.slug) {
        legacySlugs.push(article.slug);
      }

      legacySlugs = [...new Set(legacySlugs)].filter(slug => slug && slug !== requestedSlug);

      nextSlug = requestedSlug;
    }
  }

  const nextStatus = data.status ?? article.status;
  const now = new Date().toISOString();
  const publicationSchedule = nextPublicationSchedule(article, data, nextStatus, now);

  const nextSeoTitle =
    data.seoTitle !== undefined
      ? normalizeSeoField(data.seoTitle)
      : normalizeSeoField(article.seoTitle);

  const nextSeoDescription =
    data.seoDescription !== undefined
      ? normalizeSeoField(data.seoDescription)
      : normalizeSeoField(article.seoDescription);

  assertPublishedArticleSeo({
    status: nextStatus,

    seoTitle: nextSeoTitle,

    seoDescription: nextSeoDescription,
  });

  articles[index] = {
    ...article,

    title: data.title ?? article.title,

    content: data.content !== undefined ? sanitizeArticleContent(data.content) : article.content,

    image: data.image ?? article.image,

    imageAlt: data.imageAlt ?? article.imageAlt ?? '',

    status: nextStatus,
    ...(publicationSchedule ? { publicationSchedule } : {}),
    category:
      data.category !== undefined
        ? normalizeArticleCategory(data.category)
        : article.category || '',

    slug: nextSlug,

    legacySlugs,

    seoTitle: nextSeoTitle,

    seoDescription: nextSeoDescription,

    ogTitle: data.ogTitle || data.seoTitle || article.ogTitle || article.seoTitle || '',

    ogDescription:
      data.ogDescription ||
      data.seoDescription ||
      article.ogDescription ||
      article.seoDescription ||
      '',

    ogImage: data.ogImage || data.image || article.ogImage || article.image || null,

    publishedAt:
      data.status === 'published'
        ? article.publishedAt || new Date().toISOString()
        : article.publishedAt,

    updatedAt: now,
  };

  await saveArticles(articles);

  return articles[index];
}

async function deleteArticleMutation(id) {
  const articles = await readArticles();
  const article = articles.find(item => item.id === id);

  if (article && (article.status === 'published' || article.publishedAt)) {
    const slugs = [
      article.slug,
      ...(Array.isArray(article.legacySlugs) ? article.legacySlugs : []),
    ].filter(slug => typeof slug === 'string' && slug);

    if (slugs.length) {
      // Persist public URLs before removing the article. If the second write fails,
      // the existing article still wins over the redirect and deletion can be retried.
      const deletedSlugs = await readDeletedSlugs();
      await saveJson(DELETED_SLUGS_FILE, [...new Set([...deletedSlugs, ...slugs])]);
    }
  }

  const filtered = articles.filter(item => item.id !== id);

  await saveArticles(filtered);

  return true;
}

export function createArticle(data) {
  return queueArticleWrite(() => createArticleMutation(validateCreateArticleInput(data)));
}

export function updateArticle(id, data) {
  return queueArticleWrite(() => updateArticleMutation(id, validateUpdateArticleInput(data)));
}

export function deleteArticle(id) {
  return queueArticleWrite(() => deleteArticleMutation(id));
}

export async function getArticleById(id) {
  const articles = await readArticles();

  return articles.find(item => item.id === id) || null;
}

// Timer transitions share the editor's write queue and keep unrelated stored content intact.
export function publishDueArticles(now = new Date()) {
  return queueArticleWrite(async () => {
    const articles = await readStoredArticles();
    const instant = now.toISOString();
    const due = [];
    for (const article of articles) {
      const schedule = article.publicationSchedule;
      if (
        article.status !== 'scheduled' ||
        schedule?.state !== 'scheduled' ||
        Date.parse(schedule.at) > now.getTime()
      )
        continue;
      if (!parseScheduleInstant(schedule.at)) continue;
      try {
        assertPublishedArticleSeo({ ...article, status: 'published' });
        article.status = 'published';
        article.publishedAt ||= schedule.at;
        article.updatedAt = instant;
        article.publicationSchedule = {
          ...schedule,
          state: 'publishing',
          startedAt: instant,
          error: null,
        };
        due.push(article.id);
      } catch {
        article.publicationSchedule = {
          ...schedule,
          state: 'error',
          finishedAt: instant,
          error: 'Заполните SEO Title и SEO Description.',
        };
      }
    }
    if (
      due.length ||
      articles.some(
        article =>
          article.publicationSchedule?.finishedAt === instant &&
          article.publicationSchedule?.state === 'error',
      )
    )
      await saveArticles(articles);
    return due;
  });
}

export async function getScheduledArticles() {
  const articles = await readStoredArticles();
  return articles
    .filter(article => article.publicationSchedule)
    .map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      image: article.image || null,
      category: article.category || '',
      status: article.status,
      updatedAt: article.updatedAt,
      schedule: article.publicationSchedule,
    }));
}

export function prepareScheduledPublication() {
  return queueArticleWrite(async () => {
    const articles = await readStoredArticles();
    const jobs = [];
    let changed = false;
    for (const article of articles) {
      const schedule = article.publicationSchedule;
      if (article.status !== 'published' || !['publishing', 'error'].includes(schedule?.state))
        continue;
      jobs.push({ id: article.id, scheduleId: schedule.id });
      if (schedule.state === 'error') {
        article.publicationSchedule = {
          ...schedule,
          state: 'publishing',
          startedAt: new Date().toISOString(),
          finishedAt: null,
          error: null,
        };
        changed = true;
      }
    }
    if (changed) await saveArticles(articles);
    return jobs;
  });
}

export function settleScheduledPublication(jobs, error = null) {
  return queueArticleWrite(async () => {
    if (!jobs.length) return;
    const articles = await readStoredArticles();
    let changed = false;
    for (const job of jobs) {
      const article = articles.find(
        item => item.id === job.id && item.publicationSchedule?.id === job.scheduleId,
      );
      if (
        !article ||
        article.status !== 'published' ||
        !['publishing', 'error'].includes(article.publicationSchedule.state)
      )
        continue;
      article.publicationSchedule = {
        ...article.publicationSchedule,
        state: error ? 'error' : 'success',
        finishedAt: new Date().toISOString(),
        error: error ? 'Не удалось обновить сайт. Повторите публикацию.' : null,
      };
      changed = true;
    }
    if (changed) await saveArticles(articles);
  });
}
