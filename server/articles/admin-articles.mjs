import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { sanitizeArticleContent } from './article-html.mjs';

const FILE = path.resolve('data/articles.json');

let writes = Promise.resolve();

async function readArticles() {
  try {
    const data = await fs.readFile(FILE, 'utf8');

    const articles = JSON.parse(data);

    if (!Array.isArray(articles)) {
      throw new Error('INVALID_ARTICLES_STORAGE');
    }

    return articles.map(article => ({
      ...article,

      content: sanitizeArticleContent(article?.content),
    }));
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function saveArticles(articles) {
  const temporary = `${FILE}.${process.pid}.${Date.now()}.tmp`;

  try {
    await fs.mkdir(path.dirname(FILE), {
      recursive: true,
    });

    await fs.writeFile(temporary, `${JSON.stringify(articles, null, 2)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    });

    await fs.rename(temporary, FILE);
  } catch (error) {
    await fs.rm(temporary, {
      force: true,
    });

    throw error;
  }
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

  if (!['draft', 'published'].includes(input.status)) {
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

function normalizeArticleCategory(value) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

function normalizeSeoField(value) {
  return String(value ?? '').trim();
}

function assertPublishedArticleSeo({ status, seoTitle, seoDescription }) {
  if (status !== 'published') {
    return;
  }

  if (normalizeSeoField(seoTitle) && normalizeSeoField(seoDescription)) {
    return;
  }

  const error = new Error('SEO Title and SEO Description are required for published articles');

  error.code = 'ARTICLE_SEO_REQUIRED';

  throw error;
}

const SLUG_TRANSLIT = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

function createSlug(value) {
  const source = String(value || '')
    .trim()
    .toLowerCase();

  const transliterated = Array.from(source)
    .map(char => {
      if (Object.prototype.hasOwnProperty.call(SLUG_TRANSLIT, char)) {
        return SLUG_TRANSLIT[char];
      }

      return char;
    })
    .join('');

  return transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function createUniqueSlug(articles, value, excludeId = null) {
  const base = createSlug(value) || 'article';

  let candidate = base;

  let suffix = 2;

  const isUsed = slug =>
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

async function createArticleMutation(data) {
  const articles = await readArticles();

  const now = new Date().toISOString();

  const seoTitle = normalizeSeoField(data.seoTitle);

  const seoDescription = normalizeSeoField(data.seoDescription);

  const status = data.status === 'published' ? 'published' : 'draft';

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

    category: normalizeArticleCategory(data.category),

    slug: createUniqueSlug(articles, data.slug || data.title || 'article'),

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
    const requestedSlug = createUniqueSlug(articles, data.slug, article.id);

    if (requestedSlug && requestedSlug !== article.slug) {
      if (article.slug) {
        legacySlugs.push(article.slug);
      }

      legacySlugs = [...new Set(legacySlugs)].filter(slug => slug && slug !== requestedSlug);

      nextSlug = requestedSlug;
    }
  }

  const nextStatus = data.status ?? article.status;

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

    updatedAt: new Date().toISOString(),
  };

  await saveArticles(articles);

  return articles[index];
}

async function deleteArticleMutation(id) {
  const articles = await readArticles();

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
