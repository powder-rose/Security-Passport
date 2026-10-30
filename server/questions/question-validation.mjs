import { questionPath, questionText } from '../../shared/contracts/questions.js';
import { sanitizeArticleContent } from '../articles/article-html.mjs';

export const QUESTION_ORIGIN = 'https://pasport-bezopasnosty.ru';

export function questionError(message, status = 400, code = 'QUESTION_INPUT_INVALID') {
  return Object.assign(new Error(message), { status, code });
}

const TEXT_FIELDS = [
  'title',
  'slug',
  'category',
  'shortAnswer',
  'content',
  'seoTitle',
  'seoDescription',
  'primaryKeyword',
  'authorId',
  'image',
  'imageAlt',
  'mainArticleSlug',
  'servicePath',
  'canonical',
  'seoReview',
  'normativeReview',
];
const LIST_FIELDS = ['keywords', 'articleSlugs', 'relatedQuestionIds'];

export function normalizeQuestion(input, previous = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw questionError('Некорректные данные вопроса.');
  }

  const result = {};

  for (const field of TEXT_FIELDS) {
    const value = input[field] ?? previous[field] ?? '';
    if (typeof value !== 'string') throw questionError(`Поле ${field} должно быть строкой.`);
    result[field] = value.trim();
  }

  for (const field of LIST_FIELDS) {
    const value = input[field] ?? previous[field] ?? [];
    if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
      throw questionError(`Поле ${field} должно быть списком строк.`);
    }
    result[field] = [...new Set(value.map(item => item.trim()).filter(Boolean))];
  }

  for (const field of ['indexable', 'pinned', 'showInBlog']) {
    const value = input[field] ?? previous[field] ?? field === 'indexable';
    if (typeof value !== 'boolean') throw questionError(`Некорректное поле ${field}.`);
    result[field] = value;
  }

  result.content = sanitizeArticleContent(result.content);
  for (const field of TEXT_FIELDS.filter(field => field !== 'content')) {
    result[field] = questionText(result[field]);
  }

  if (result.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result.slug)) {
    throw questionError('Slug может содержать латинские буквы, цифры и дефисы.');
  }
  if (['preview', 'page', 'search'].includes(result.slug)) {
    throw questionError('Этот slug зарезервирован системой.');
  }
  if (result.canonical) {
    let url;
    try {
      url = new URL(result.canonical, QUESTION_ORIGIN);
    } catch {
      throw questionError('Некорректный адрес canonical.');
    }
    if (
      url.origin !== QUESTION_ORIGIN ||
      !/^\/questions\/[a-z0-9-]+\/$/.test(url.pathname) ||
      url.search ||
      url.hash
    ) {
      throw questionError('Canonical должен вести на страницу вопроса основного сайта.');
    }
    result.canonical = url.href;
  }
  if (
    result.servicePath &&
    !/^\/(?:pasport-bezopasnosti-[a-z0-9-]+|akt-obsledovaniya-i-kategorirovaniya-obekta|aktualizaciya-pasporta-bezopasnosti-obekta)\/$/.test(
      result.servicePath,
    )
  ) {
    throw questionError('Выберите коммерческую страницу из каталога сайта.');
  }
  if (result.image && !/^\/uploads\/[a-zA-Z0-9_./-]+$/.test(result.image)) {
    throw questionError('Изображение должно находиться в общей медиабиблиотеке.');
  }
  return result;
}

export function findQuestionWarnings(draft, records, articles, id) {
  const normalize = value =>
    questionText(value)
      .toLocaleLowerCase('ru')
      .replace(/[?!.,:;«»—–-]/g, '')
      .trim();
  const candidates = [
    ...records
      .filter(item => item.id !== id)
      .flatMap(item => [item.draft, ...(item.live ? [item.live] : [])]),
    ...articles,
  ];
  const warnings = [];
  for (const [field, label] of [
    ['title', 'H1'],
    ['seoTitle', 'SEO Title'],
  ]) {
    if (
      draft[field] &&
      candidates.some(item => normalize(item[field]) === normalize(draft[field]))
    ) {
      warnings.push(`${label} совпадает с существующим материалом.`);
    }
  }
  return warnings;
}

export function validateQuestionPublication(draft, state, articles, id, overrideWarnings = false) {
  for (const [field, label] of [
    ['title', 'Заголовок'],
    ['slug', 'Slug'],
    ['category', 'Категория'],
    ['shortAnswer', 'Краткий ответ'],
    ['content', 'Основной текст'],
    ['seoTitle', 'SEO Title'],
    ['seoDescription', 'SEO Description'],
    ['authorId', 'Автор'],
    ['mainArticleSlug', 'Основная статья блога'],
  ]) {
    if (!questionText(draft[field])) throw questionError(`Заполните поле «${label}».`);
  }
  if (!state.categories.includes(draft.category))
    throw questionError('Категория отсутствует в справочнике.');
  if (!state.authors.some(author => author.id === draft.authorId))
    throw questionError('Выберите автора из списка.');
  if (draft.seoReview !== 'checked' || draft.normativeReview !== 'checked') {
    throw questionError(
      'Перед публикацией отметьте нормативную проверку и проверку пересечений.',
      409,
      'QUESTION_REVIEW_REQUIRED',
    );
  }
  for (const slug of [draft.mainArticleSlug, ...draft.articleSlugs]) {
    if (!articles.some(article => article.status === 'published' && article.slug === slug)) {
      throw questionError(`Связанная статья не опубликована: ${slug}`);
    }
  }
  const publishedIds = new Set(
    state.records.filter(record => record.live && record.id !== id).map(record => record.id),
  );
  if (draft.relatedQuestionIds.some(relatedId => !publishedIds.has(relatedId))) {
    throw questionError('Похожие вопросы должны быть опубликованы.');
  }
  if (draft.relatedQuestionIds.length > 4)
    throw questionError('Выберите не более четырёх похожих вопросов.');
  if (draft.image && !draft.imageAlt)
    throw questionError('Добавьте описание главного изображения.');
  const warnings = findQuestionWarnings(draft, state.records, articles, id);
  if (warnings.length && !overrideWarnings) {
    throw questionError(warnings.join(' '), 409, 'QUESTION_DUPLICATE_WARNING');
  }
  return { canonical: draft.canonical || `${QUESTION_ORIGIN}${questionPath(draft.slug)}` };
}
