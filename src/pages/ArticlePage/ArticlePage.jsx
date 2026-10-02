import {
  useMemo,
} from 'react';

import {
  Helmet,
} from 'react-helmet-async';

import ArticleView
from '../../components/ArticleView/ArticleView.jsx';

import {
  SITE,
} from '../../config/site.js';

import './ArticlePage.css';

import useArticlePageData
from './useArticlePageData';


function absoluteImageUrl(value) {

  if (!value) {
    return '';
  }


  if (
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }


  return (
    `${SITE.federalUrl}` +
    `${value.startsWith('/') ? '' : '/'}` +
    `${value}`
  );

}


export default function ArticlePage({
  slug,
  initialArticle = null,
  initialArticles = null,
}) {

  const {
    article,
    relatedArticles,
    loading,
    notFound,
    error,
  } =
    useArticlePageData({
      slug,
      initialArticle,
      initialArticles,
    });


  const canonical =
    `${SITE.federalUrl}/blog/` +
    `${encodeURIComponent(slug)}/`;


  const seoTitle =
    article?.seoTitle ||
    article?.title ||
    'Статья — БОЙКОВГРУПП';


  const seoDescription =
    article?.seoDescription ||
    (
      article?.title
        ? `${article.title}. Практический материал БОЙКОВГРУПП по безопасности объектов и документации.`
        : ''
    );


  const articleImage =
    absoluteImageUrl(
      article?.ogImage ||
      article?.image
    );


  const ogImage =
    articleImage ||
    `${SITE.federalUrl}/images/og-passport-security.png`;


  const ogImageAlt =
    article?.imageAlt ||
    article?.title ||
    'Материал о безопасности объектов — БОЙКОВГРУПП';


  const articleSchema =
    useMemo(
      () => {

        if (!article) {
          return null;
        }


        const schema = {
          '@context':
            'https://schema.org',

          '@type':
            'Article',

          headline:
            article.title,

          description:
            seoDescription,

          url:
            canonical,

          mainEntityOfPage: {
            '@type':
              'WebPage',

            '@id':
              canonical,
          },

          author: {
            '@type':
              'Organization',

            name:
              SITE.brand,

            url:
              SITE.federalUrl,
          },

          publisher: {
            '@type':
              'Organization',

            name:
              SITE.brand,

            url:
              SITE.federalUrl,
          },

          inLanguage:
            'ru-RU',
        };


        if (
          article.publishedAt ||
          article.createdAt
        ) {

          schema.datePublished =
            article.publishedAt ||
            article.createdAt;

        }


        if (
          article.updatedAt
        ) {

          schema.dateModified =
            article.updatedAt;

        }


        if (ogImage) {
          schema.image = [
            ogImage,
          ];
        }


        return schema;

      },
      [
        article,
        canonical,
        ogImage,
        seoDescription,
      ]
    );


  if (loading) {

    return (

      <>
        <Helmet>

          <meta
            name="robots"
            content="noindex,follow"
          />

        </Helmet>

        <main className="article-page-state">

          <div className="article-page-state__inner">
            Загружаем статью…
          </div>

        </main>
      </>

    );

  }


  if (
    notFound
  ) {

    return (

      <>
        <Helmet>

          <title>
            Статья не найдена — БОЙКОВГРУПП
          </title>

          <meta
            name="robots"
            content="noindex,follow"
          />

        </Helmet>


        <main className="article-page-state">

          <div className="article-page-state__inner">

            <span>
              404
            </span>

            <h1>
              Статья не найдена
            </h1>

            <p>
              Возможно, материал был снят с публикации
              или адрес страницы изменился.
            </p>

            <a href="/blog/">
              Вернуться в блог →
            </a>

          </div>

        </main>
      </>

    );

  }


  if (
    error ||
    !article
  ) {

    return (

      <>
        <Helmet>

          <meta
            name="robots"
            content="noindex,follow"
          />

        </Helmet>


        <main className="article-page-state">

          <div className="article-page-state__inner">

            <h2>
              Не удалось загрузить статью
            </h2>

            <p>
              Попробуйте обновить страницу немного позже.
            </p>

            <a href="/blog/">
              Все статьи →
            </a>

          </div>

        </main>
      </>

    );

  }


  return (

    <>

      <Helmet>

        <html lang="ru" />

        <title>
          {seoTitle}
        </title>


        <meta
          name="description"
          content={seoDescription}
        />


        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />


        <link
          rel="canonical"
          href={canonical}
        />


        <meta
          property="og:type"
          content="article"
        />

        <meta
          property="og:locale"
          content="ru_RU"
        />

        <meta
          property="og:site_name"
          content={SITE.brand}
        />

        <meta
          property="og:title"
          content={
            article.ogTitle ||
            seoTitle
          }
        />

        <meta
          property="og:description"
          content={
            article.ogDescription ||
            seoDescription
          }
        />

        <meta
          property="og:url"
          content={canonical}
        />


        <meta
          property="og:image"
          content={ogImage}
        />

        <meta
          property="og:image:alt"
          content={ogImageAlt}
        />


        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={
            article.ogTitle ||
            seoTitle
          }
        />

        <meta
          name="twitter:description"
          content={
            article.ogDescription ||
            seoDescription
          }
        />


        <meta
          name="twitter:image"
          content={ogImage}
        />

        <meta
          name="twitter:image:alt"
          content={ogImageAlt}
        />


        {
          articleSchema
          &&
          (
            <script
              type="application/ld+json"
            >
              {
                JSON.stringify(
                  articleSchema
                )
              }
            </script>
          )
        }

      </Helmet>


      <ArticleView
        article={article}
        relatedArticles={
          relatedArticles
        }
        preview={false}
      />

    </>

  );

}
