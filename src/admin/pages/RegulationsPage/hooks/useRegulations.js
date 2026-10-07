import { useEffect, useState } from 'react';

import { getRegulations } from '../../../api/adminApi';

async function fetchRegulations() {
  const result = await getRegulations();

  if (!result?.ok || !Array.isArray(result.regulations)) {
    throw new Error('Не удалось загрузить постановления');
  }

  return result.regulations;
}

export default function useRegulations(onLoadError) {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  async function reload() {
    const regulations = await fetchRegulations();

    setItems(regulations);

    return regulations;
  }

  useEffect(() => {
    let active = true;

    fetchRegulations()
      .then(regulations => {
        if (active) {
          setItems(regulations);
        }
      })
      .catch(error => {
        if (active) {
          onLoadError(error.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [onLoadError]);

  return {
    items,
    loading,
    reload,
  };
}
