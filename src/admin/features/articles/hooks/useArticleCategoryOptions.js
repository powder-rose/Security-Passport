import { useCallback, useEffect, useState } from 'react';

import { getArticleCategories } from '../../../api/adminApi.js';
import {
  DEFAULT_ARTICLE_CATEGORIES,
  mergeArticleCategoryOptions,
} from '../model/articleCategoryOptions.js';

export function useArticleCategoryOptions() {
  const [categoryOptions, setCategoryOptions] = useState(() => [...DEFAULT_ARTICLE_CATEGORIES]);

  useEffect(() => {
    let cancelled = false;

    getArticleCategories()
      .then(result => {
        if (cancelled) {
          return;
        }

        if (!result?.ok || !Array.isArray(result.categories)) {
          return;
        }

        setCategoryOptions(mergeArticleCategoryOptions(result.categories));
      })
      .catch(error => {
        if (!cancelled) {
          console.error(error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const rememberCategory = useCallback(category => {
    setCategoryOptions(current => mergeArticleCategoryOptions([...current, category]));
  }, []);

  return {
    categoryOptions,
    rememberCategory,
  };
}
