import ArticleView
from '../../components/ArticleView/ArticleView.jsx';

import './ArticlePage.css';

import useArticlePageData
from './useArticlePageData';

import ArticleSeo
from './components/ArticleSeo';

import ArticlePageState
from './components/ArticlePageState';


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


  if (loading) {

    return (
      <ArticlePageState
        type="loading"
      />
    );

  }


  if (notFound) {

    return (
      <ArticlePageState
        type="not-found"
      />
    );

  }


  if (
    error ||
    !article
  ) {

    return (
      <ArticlePageState
        type="error"
      />
    );

  }


  return (

    <>

      <ArticleSeo
        article={article}
        slug={slug}
      />


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
