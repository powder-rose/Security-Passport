import { useEffect, useRef, useState } from 'react';

import { QUESTION_SETTINGS } from '../../../shared/contracts/questions.js';

const EMPTY = {
  settings: QUESTION_SETTINGS,
  questions: [],
  categories: [],
  total: 0,
  page: 1,
  totalPages: 1,
  search: '',
  category: '',
};

function readQuery() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    category: params.get('category') || '',
    page: Math.max(1, Number.parseInt(params.get('page'), 10) || 1),
  };
}

export default function useQuestionCatalog(initialData) {
  const [data, setData] = useState(initialData || EMPTY);
  const [query, setQuery] = useState({ search: '', category: '', page: 1 });
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const cachedQueryRef = useRef(
    initialData
      ? JSON.stringify({
          search: initialData.search,
          category: initialData.category,
          page: initialData.page,
        })
      : '',
  );

  useEffect(() => {
    const update = () => setQuery(readQuery());
    update();
    setReady(true);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const key = JSON.stringify(query);
    if (!retry && key === cachedQueryRef.current) {
      setLoading(false);
      setError('');
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    const timer = window.setTimeout(
      async () => {
        try {
          const params = new URLSearchParams(query);
          const response = await fetch(`/api/questions?${params}`, { signal: controller.signal });
          const result = await response.json();
          if (!response.ok || !result.ok) throw new Error('Не удалось загрузить вопросы.');
          if (!controller.signal.aborted) {
            setData(result);
            cachedQueryRef.current = key;
          }
        } catch (error) {
          if (error.name !== 'AbortError' && !controller.signal.aborted)
            setError('Не удалось загрузить вопросы. Попробуйте ещё раз.');
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      },
      query.search ? 250 : 0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, ready, retry]);

  function changeQuery(patch) {
    const next = { ...query, page: 1, ...patch };
    setQuery(next);
    const params = new URLSearchParams();
    if (next.search) params.set('search', next.search);
    if (next.category) params.set('category', next.category);
    if (next.page > 1) params.set('page', next.page);
    const method = Object.hasOwn(patch, 'search') ? 'replaceState' : 'pushState';
    window.history[method](null, '', `/questions/${params.size ? `?${params}` : ''}`);
  }

  return { data, query, loading, error, changeQuery, retry: () => setRetry(value => value + 1) };
}
