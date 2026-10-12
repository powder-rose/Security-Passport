import {
  buildArticleCategoryOptions,
  DEFAULT_ARTICLE_CATEGORIES,
  normalizeArticleCategoryOption,
} from '../../../../../shared/contracts/article-category.js';

export { DEFAULT_ARTICLE_CATEGORIES };

export function normalizeArticleCategory(value) {
  return normalizeArticleCategoryOption(value);
}

export function mergeArticleCategoryOptions(values = []) {
  return buildArticleCategoryOptions(values);
}
