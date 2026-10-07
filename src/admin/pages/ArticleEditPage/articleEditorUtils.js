export const BLOG_CATEGORIES = [
  {
    id: 'hotels',
    label: 'Гостиницы',
  },
  {
    id: 'culture',
    label: 'Культура',
  },
];

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

export function createSlug(value) {
  const source = String(value || '')
    .trim()
    .toLowerCase();

  return Array.from(source)
    .map(char =>
      Object.prototype.hasOwnProperty.call(SLUG_TRANSLIT, char) ? SLUG_TRANSLIT[char] : char,
    )
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function validatePublicationSeo(form) {
  if (form.status !== 'published') {
    return true;
  }

  const missing = [];

  if (!String(form.seoTitle || '').trim()) {
    missing.push('SEO Title');
  }

  if (!String(form.seoDescription || '').trim()) {
    missing.push('SEO Description');
  }

  if (missing.length === 0) {
    return true;
  }

  alert(
    `Статью нельзя опубликовать без SEO-полей:\n\n${missing.join('\n')}\n\nЧерновик можно сохранить без них.`,
  );

  return false;
}
