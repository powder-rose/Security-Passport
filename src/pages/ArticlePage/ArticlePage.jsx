import { useEffect, useState } from 'react';

import ArticleView from '../../components/ArticleView/ArticleView.jsx';

import './components/ArticlePageState/ArticlePageState.css';

import useArticlePageData from './useArticlePageData';

import ArticleSeo from './components/ArticleSeo/ArticleSeo';

import ArticlePageState from './components/ArticlePageState/ArticlePageState';

export default function ArticlePage({
  slug,
  initialArticle = null,
  initialArticles = null,
  initialQuestions = null,
}) {
  const [questions, setQuestions] = useState(initialQuestions || []);
  useEffect(() => {
    if (initialQuestions !== null) return undefined;
    const controller = new AbortController();
    fetch(`/api/questions?article=${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(response => response.json())
      .then(result => {
        if (!controller.signal.aborted && result.ok) setQuestions(result.questions.slice(0, 4));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [slug, initialQuestions]);

  const { article, relatedArticles, loading, notFound, error } = useArticlePageData({
    slug,
    initialArticle,
    initialArticles,
  });

  if (loading) {
    return <ArticlePageState type="loading" />;
  }

  if (notFound) {
    return <ArticlePageState type="not-found" />;
  }

  if (error || !article) {
    return <ArticlePageState type="error" />;
  }

  return (
    <>
      <ArticleSeo article={article} slug={slug} />

      <ArticleView
        article={article}
        relatedArticles={relatedArticles}
        relatedQuestions={questions}
        preview={false}
      />
    </>
  );
}
