import { useEffect, useMemo, useState } from 'react';

import { getPublicArticles } from '../../lib/articles.js';

import { BLOG_CATEGORIES, resolveArticleCategory } from './blogPageUtils.js';

export default function useBlogArticles({ initialArticles = null }) {
  const [articles, setArticles] = useState(Array.isArray(initialArticles) ? initialArticles : []);

  const [loading, setLoading] = useState(!Array.isArray(initialArticles));

  const [error, setError] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let cancelled = false;

    getPublicArticles()
      .then(result => {
        if (cancelled) {
          return;
        }

        setArticles(currentArticles => {
          const categoryById = new Map(
            currentArticles.map(article => [article.id, article.category || '']),
          );

          return result.map(article => ({
            ...article,

            category: article.category || categoryById.get(article.id) || '',
          }));
        });

        setError(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const prefix = '#blog-category-';

    if (!window.location.hash.startsWith(prefix)) {
      return;
    }

    const categoryId = window.location.hash.slice(prefix.length);

    if (categoryId === 'all') {
      setSelectedCategory('all');

      return;
    }

    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, []);

  const categorizedArticles = useMemo(() => {
    return articles.map(article => ({
      article,

      category: resolveArticleCategory(article),
    }));
  }, [articles]);

  const visibleCategories = useMemo(() => {
    const categories = new Map();

    categorizedArticles.forEach(({ category }) => {
      if (!category) {
        return;
      }

      if (categories.has(category.id)) {
        return;
      }

      categories.set(category.id, category);
    });

    const predefinedOrder = new Map(BLOG_CATEGORIES.map((category, index) => [category.id, index]));

    return [...categories.values()].sort((a, b) => {
      const aOrder = predefinedOrder.has(a.id) ? predefinedOrder.get(a.id) : 999;

      const bOrder = predefinedOrder.has(b.id) ? predefinedOrder.get(b.id) : 999;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.label.localeCompare(b.label, 'ru');
    });
  }, [categorizedArticles]);

  useEffect(() => {
    if (loading || selectedCategory === 'all') {
      return;
    }

    const categoryExists = visibleCategories.some(category => category.id === selectedCategory);

    if (!categoryExists) {
      setSelectedCategory('all');
    }
  }, [loading, selectedCategory, visibleCategories]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') {
      return categorizedArticles;
    }

    return categorizedArticles.filter(item => item.category?.id === selectedCategory);
  }, [categorizedArticles, selectedCategory]);

  const featuredEntry = filteredArticles[0] || null;

  const restEntries = filteredArticles.slice(1);

  const activeCategory =
    selectedCategory === 'all'
      ? null
      : visibleCategories.find(category => category.id === selectedCategory) || null;

  function chooseCategory(categoryId) {
    setSelectedCategory(categoryId);

    if (typeof window === 'undefined') {
      return;
    }

    const hash = `#blog-category-${categoryId}`;

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}${hash}`,
    );

    window.requestAnimationFrame(() => {
      const target = document.getElementById('blog-category-results');

      if (!target) {
        return;
      }

      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',

        block: 'start',
      });
    });
  }

  return {
    articles,
    loading,
    error,
    selectedCategory,
    visibleCategories,
    filteredArticles,
    featuredEntry,
    restEntries,
    activeCategory,
    chooseCategory,
  };
}
