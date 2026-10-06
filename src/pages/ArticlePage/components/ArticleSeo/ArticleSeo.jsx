import { useMemo } from 'react';

import { Helmet } from 'react-helmet-async';

import { SITE } from '../../../../config/site.js';

function absoluteImageUrl(value) {
  if (!value) {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `${SITE.federalUrl}` + `${value.startsWith('/') ? '' : '/'}` + `${value}`;
}

export default function ArticleSeo({ article, slug }) {
  const canonical = `${SITE.federalUrl}/blog/` + `${encodeURIComponent(slug)}/`;

  const seoTitle = article?.seoTitle || article?.title || 'Статья — БОЙКОВГРУПП';

  const seoDescription =
    article?.seoDescription ||
    (article?.title
      ? `${article.title}. Практический материал БОЙКОВГРУПП по безопасности объектов и документации.`
      : '');

  const articleImage = absoluteImageUrl(article?.ogImage || article?.image);

  const ogImage = articleImage || `${SITE.federalUrl}/images/og-passport-security.png`;

  const ogImageAlt =
    article?.imageAlt || article?.title || 'Материал о безопасности объектов — БОЙКОВГРУПП';

  const articleSchema = useMemo(() => {
    if (!article) {
      return null;
    }

    const schema = {
      '@context': 'https://schema.org',

      '@type': 'Article',

      headline: article.title,

      description: seoDescription,

      url: canonical,

      mainEntityOfPage: {
        '@type': 'WebPage',

        '@id': canonical,
      },

      author: {
        '@type': 'Organization',

        name: SITE.brand,

        url: SITE.federalUrl,
      },

      publisher: {
        '@type': 'Organization',

        name: SITE.brand,

        url: SITE.federalUrl,
      },

      inLanguage: 'ru-RU',
    };

    if (article.publishedAt || article.createdAt) {
      schema.datePublished = article.publishedAt || article.createdAt;
    }

    if (article.updatedAt) {
      schema.dateModified = article.updatedAt;
    }

    if (ogImage) {
      schema.image = [ogImage];
    }

    return schema;
  }, [article, canonical, ogImage, seoDescription]);

  return (
    <Helmet>
      <html lang="ru" />

      <title>{seoTitle}</title>

      <meta name="description" content={seoDescription} />

      <meta
        name="robots"
        content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      />

      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="article" />

      <meta property="og:locale" content="ru_RU" />

      <meta property="og:site_name" content={SITE.brand} />

      <meta property="og:title" content={article.ogTitle || seoTitle} />

      <meta property="og:description" content={article.ogDescription || seoDescription} />

      <meta property="og:url" content={canonical} />

      <meta property="og:image" content={ogImage} />

      <meta property="og:image:alt" content={ogImageAlt} />

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={article.ogTitle || seoTitle} />

      <meta name="twitter:description" content={article.ogDescription || seoDescription} />

      <meta name="twitter:image" content={ogImage} />

      <meta name="twitter:image:alt" content={ogImageAlt} />

      {articleSchema && <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>}
    </Helmet>
  );
}
