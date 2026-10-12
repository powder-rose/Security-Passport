export const BLOG_CATEGORIES = [
  {
    id: 'hotels',
    label: 'Гостиницы',
    description:
      'Материалы о категорировании, требованиях антитеррористической защищённости и паспортах безопасности гостиниц и других средств размещения.',
  },

  {
    id: 'culture',
    label: 'Культура',
    description:
      'Материалы о категорировании, обследовании, требованиях и паспортах безопасности объектов культуры.',
  },
];

const LEGACY_BLOG_CATEGORY_VALUES = new Set([
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

const BLOG_CATEGORY_TRANSLIT = Object.freeze({
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
});

function normalizeCategoryLabel(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

function createCategorySlugFallback(value) {
  let hash = 2166136261;

  for (const char of String(value || '')) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function createBlogCategorySlug(value) {
  const source = normalizeCategoryLabel(value).toLocaleLowerCase('ru-RU');

  const transliterated = Array.from(source)
    .map(char => {
      if (Object.prototype.hasOwnProperty.call(BLOG_CATEGORY_TRANSLIT, char)) {
        return BLOG_CATEGORY_TRANSLIT[char];
      }

      return char;
    })
    .join('');

  const slug = transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || `category-${createCategorySlugFallback(source)}`;
}

function createCustomBlogCategoryId(value) {
  return `custom-${createBlogCategorySlug(value)}`;
}

export function normalizeBlogCategoryId(value) {
  const categoryId = String(value || '').trim();

  if (!categoryId) {
    return '';
  }

  if (categoryId === 'all' || BLOG_CATEGORIES.some(category => category.id === categoryId)) {
    return categoryId;
  }

  if (!categoryId.startsWith('custom-')) {
    return categoryId;
  }

  const rawValue = categoryId.slice('custom-'.length);

  let decodedValue;

  try {
    decodedValue = decodeURIComponent(rawValue);
  } catch {
    return '';
  }

  if (!decodedValue) {
    return '';
  }

  return createCustomBlogCategoryId(decodedValue);
}

export function resolveArticleCategory(article) {
  const label = normalizeCategoryLabel(article?.category);

  if (!label) {
    return null;
  }

  const normalized = label.toLocaleLowerCase('ru-RU');

  if (LEGACY_BLOG_CATEGORY_VALUES.has(normalized)) {
    return null;
  }

  const predefined = BLOG_CATEGORIES.find(
    category =>
      category.id === normalized || category.label.toLocaleLowerCase('ru-RU') === normalized,
  );

  if (predefined) {
    return predefined;
  }

  return {
    id: createCustomBlogCategoryId(normalized),

    label,

    description: `Материалы по теме «${label}»: практические разборы требований, документов и подготовки материалов.`,
  };
}

export function formatDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
