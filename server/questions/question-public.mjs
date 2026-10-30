import { questionCard, questionPath } from '../../shared/contracts/questions.js';

export function publicQuestion(question) {
  const fields = [
    'id',
    'title',
    'slug',
    'category',
    'shortAnswer',
    'content',
    'seoTitle',
    'seoDescription',
    'author',
    'image',
    'imageAlt',
    'indexable',
    'canonical',
    'publishedAt',
    'modifiedAt',
    'pinned',
    'mainArticleSlug',
    'articleSlugs',
    'servicePath',
    'relatedQuestionIds',
  ];
  return Object.fromEntries(fields.map(field => [field, question[field]]));
}

export function questionPageData(state, question, articles = []) {
  const articleSlugs = new Set([question.mainArticleSlug, ...question.articleSlugs]);
  const selectedIds = new Set(question.relatedQuestionIds);
  return {
    question: publicQuestion(question),
    articles: articles
      .filter(article => article.status === 'published' && articleSlugs.has(article.slug))
      .map(({ id, title, slug, seoDescription }) => ({ id, title, slug, seoDescription })),
    relatedQuestions: state.records
      .flatMap(record =>
        record.live && selectedIds.has(record.id) && record.id !== question.id
          ? [questionCard(record.live)]
          : [],
      )
      .slice(0, 4),
    path: questionPath(question.slug),
  };
}
