export const QUESTION_PAGE_SIZE = 12;

export const QUESTION_CATEGORIES = Object.freeze([
  'Общие вопросы',
  'Объекты культуры',
  'Образовательные организации',
  'Объекты спорта',
  'Гостиницы',
  'Торговые объекты',
  'Объекты здравоохранения',
  'Другие объекты',
]);

export const QUESTION_AUTHORS = Object.freeze([{ id: 'nikolay-boykov', name: 'Николай Бойков' }]);

export const QUESTION_SETTINGS = Object.freeze({
  title: 'Вопросы и ответы по паспортам безопасности',
  description:
    'Короткие разъяснения по антитеррористической защищённости, оформлению документов, ' +
    'категорированию и требованиям законодательства.',
  seoTitle: 'Вопросы и ответы по паспортам безопасности | БОЙКОВГРУПП',
  seoDescription:
    'Ответы на практические вопросы о паспортах безопасности: аренда, согласование, ' +
    'категорирование объектов и применимые требования.',
});

export function questionPath(slug) {
  return `/questions/${encodeURIComponent(slug)}/`;
}

export function questionText(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function questionCard(question) {
  const { id, title, slug, category, shortAnswer, publishedAt, modifiedAt, pinned } = question;

  return { id, title, slug, category, shortAnswer, publishedAt, modifiedAt, pinned };
}

export function sortQuestions(questions) {
  return [...questions].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0) ||
      a.id.localeCompare(b.id),
  );
}

export function questionCatalog(
  state,
  { search = '', category = '', page = 1, article = '' } = {},
) {
  const published = sortQuestions(
    state.records.flatMap(record => (record.live ? [record.live] : [])),
  );
  const query = String(search).trim().toLocaleLowerCase('ru');
  const filtered = published.filter(
    question =>
      (!article ||
        (question.showInBlog &&
          (question.mainArticleSlug === article || question.articleSlugs.includes(article)))) &&
      (!category || question.category === category) &&
      (!query ||
        questionText(`${question.title} ${question.shortAnswer} ${question.content}`)
          .toLocaleLowerCase('ru')
          .includes(query)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / QUESTION_PAGE_SIZE));
  const currentPage = Math.min(totalPages, Math.max(1, Number.parseInt(page, 10) || 1));

  return {
    settings: state.settings,
    categories: state.categories.filter(name => published.some(item => item.category === name)),
    questions: filtered
      .slice((currentPage - 1) * QUESTION_PAGE_SIZE, currentPage * QUESTION_PAGE_SIZE)
      .map(questionCard),
    total: filtered.length,
    page: currentPage,
    totalPages,
    search: String(search),
    category: String(category),
  };
}
