import { Helmet } from 'react-helmet-async';

import { SITE } from '../../config/site.js';
import { QUESTION_SETTINGS, questionPath } from '../../../shared/contracts/questions.js';

export default function QuestionSeo({
  question = null,
  settings = QUESTION_SETTINGS,
  noindex = false,
  includeRobots = true,
}) {
  const canonical = question
    ? question.canonical || `${SITE.federalUrl}${questionPath(question.slug)}`
    : `${SITE.federalUrl}/questions/`;
  const title = question?.seoTitle || settings.seoTitle;
  const description = question?.seoDescription || settings.seoDescription;
  const image = `${SITE.federalUrl}${question?.image || '/images/og-passport-security.png'}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE.federalUrl}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Вопрос — ответ',
          item: `${SITE.federalUrl}/questions/`,
        },
        ...(question
          ? [{ '@type': 'ListItem', position: 3, name: question.title, item: canonical }]
          : []),
      ],
    },
    ...(question && !noindex
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: question.title,
            description,
            mainEntityOfPage: canonical,
            url: canonical,
            author: { '@type': 'Person', name: question.author?.name || 'Николай Бойков' },
            publisher: { '@id': `${SITE.federalUrl}/#organization` },
            datePublished: question.publishedAt,
            dateModified: question.modifiedAt,
            ...(question.image ? { image } : {}),
          },
        ]
      : []),
  ];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {includeRobots && (
        <meta
          name="robots"
          content={
            noindex || question?.indexable === false
              ? 'noindex,follow'
              : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
          }
        />
      )}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={question ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content={SITE.brand} />
      <meta property="og:image" content={image} />
      <meta
        property="og:image:alt"
        content={question?.imageAlt || 'Паспорт безопасности — БОЙКОВГРУПП'}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
    </Helmet>
  );
}
