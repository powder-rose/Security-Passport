import { normalizeArticleCategory } from './articleCategoryOptions.js';

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
    seoTitle: article.seoTitle || '',
    seoDescription: article.seoDescription || '',
    ogTitle: article.ogTitle || '',
    ogDescription: article.ogDescription || '',
    ogImage: article.ogImage || '',
  };
}

export function getNormalizedArticleSeo(form) {
  return {
    seoTitle: String(form.seoTitle || '').trim(),
    seoDescription: String(form.seoDescription || '').trim(),
  };
}
