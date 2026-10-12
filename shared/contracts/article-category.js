export const DEFAULT_ARTICLE_CATEGORIES = Object.freeze(['Гостиницы', 'Культура']);

export const LEGACY_ARTICLE_CATEGORY_VALUES = Object.freeze([
  'passport',
  'categorization',
  'requirements',
  'actualization',
  'practice',
  'паспорта безопасности',
  'категорирование объектов',
  'требования и законодательство',
  'актуализация паспорта',
  'практика и документы',
]);

const LEGACY_ARTICLE_CATEGORY_KEYS = new Set(
  LEGACY_ARTICLE_CATEGORY_VALUES.map(value => value.toLocaleLowerCase('ru-RU')),
);

export function sanitizeArticleCategory(value) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

export function normalizeArticleCategoryOption(value) {
  const category = sanitizeArticleCategory(value);

  if (LEGACY_ARTICLE_CATEGORY_KEYS.has(category.toLocaleLowerCase('ru-RU'))) {
    return '';
  }

  return category;
}

export function getArticleCategoryKey(value) {
  return sanitizeArticleCategory(value).toLocaleLowerCase('ru-RU');
}

export function buildArticleCategoryOptions(values = []) {
  const defaultKeys = new Set(DEFAULT_ARTICLE_CATEGORIES.map(getArticleCategoryKey));

  const dynamicCategories = new Map();

  for (const value of Array.isArray(values) ? values : []) {
    const category = normalizeArticleCategoryOption(value);

    if (!category) {
      continue;
    }

    const key = getArticleCategoryKey(category);

    if (defaultKeys.has(key) || dynamicCategories.has(key)) {
      continue;
    }

    dynamicCategories.set(key, category);
  }

  return [
    ...DEFAULT_ARTICLE_CATEGORIES,
    ...[...dynamicCategories.values()].sort((a, b) => a.localeCompare(b, 'ru')),
  ];
}
