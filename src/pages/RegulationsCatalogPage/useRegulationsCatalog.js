import { useEffect, useState } from 'react';

import { CATALOG_SETTINGS } from '../../../shared/catalog/defaults.js';

// Only server data can establish which commercial directions are published.
export default function useRegulationsCatalog(initialData) {
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState(initialData ? 'ready' : 'loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (initialData) return;
    const controller = new AbortController();
    fetch('/api/directions', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Catalog unavailable');
        const result = await response.json();
        const validSettings =
          result?.settings &&
          Object.keys(CATALOG_SETTINGS).every(key =>
            key === 'faq'
              ? Array.isArray(result.settings[key])
              : typeof result.settings[key] === 'string',
          );
        const validCards =
          Array.isArray(result?.cards) &&
          result.cards.every(card =>
            ['id', 'title', 'regulation', 'description', 'url'].every(
              key => typeof card?.[key] === 'string',
            ),
          );
        if (!result?.ok || !validSettings || !validCards)
          throw new Error('Invalid catalog response');
        if (!controller.signal.aborted) {
          setData(result);
          setStatus('ready');
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') setStatus('error');
      });
    return () => controller.abort();
  }, [initialData, attempt]);

  function retry() {
    setStatus('loading');
    setAttempt(value => value + 1);
  }
  return { settings: data?.settings || CATALOG_SETTINGS, cards: data?.cards || [], status, retry };
}
