import { normalizeArticleCategory } from './articleCategoryOptions.js';
import {
  toMoscowDateTimeInput,
  fromMoscowDateTimeInput,
} from '../../../../../shared/contracts/article-schedule.js';

export { normalizeArticleCategory };

export function createEmptyArticleForm() {
  return {
    title: '',
    slug: '',
    content: '',
    image: '',
    imageAlt: '',
    category: '',
    status: 'draft',
    scheduledAt: '',
    seoTitle: '',
    seoDescription: '',
  };
}

export function createArticleFormFromRecord(article = {}) {
  return {
    ...createEmptyArticleForm(),
    title: article.title || '',
    slug: article.slug || '',
    content: article.content || '',
    image: article.image || '',
    imageAlt: article.imageAlt || '',
    category: normalizeArticleCategory(article.category),
    status: article.status || 'draft',
    scheduledAt: article.publicationSchedule?.at
      ? toMoscowDateTimeInput(article.publicationSchedule.at)
      : '',
    seoTitle: article.seoTitle || '',
    seoDescription: article.seoDescription || '',
    ogTitle: article.ogTitle || '',
    ogDescription: article.ogDescription || '',
    ogImage: article.ogImage || '',
  };
}

export function getArticleSchedulePayload(form) {
  return {
    scheduledAt: form.status === 'scheduled' ? fromMoscowDateTimeInput(form.scheduledAt) : null,
  };
}

export const ARTICLE_SAVE_ERRORS = {
  ARTICLE_SEO_REQUIRED:
    'Заполните SEO Title и SEO Description перед публикацией или планированием.',
  ARTICLE_SCHEDULE_INVALID: 'Выберите дату и время публикации.',
  ARTICLE_SCHEDULE_PAST: 'Время публикации уже прошло. Выберите будущую дату.',
  ARTICLE_CONFLICT:
    'Статья уже изменилась, возможно, наступило время публикации. Скопируйте несохранённый текст и обновите страницу.',
};

export function getNormalizedArticleSeo(form) {
  return {
    seoTitle: String(form.seoTitle || '').trim(),
    seoDescription: String(form.seoDescription || '').trim(),
  };
}
