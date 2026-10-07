import { useEffect, useState } from 'react';

import { getRegulationPublication, retryRegulationPublication } from '../../api/adminApi';

export default function useRegulationPublication() {
  const [publication, setPublication] = useState(null);

  useEffect(() => {
    let active = true;

    async function checkPublication() {
      try {
        const result = await getRegulationPublication();

        if (active && result?.ok) {
          setPublication(result.publication);
        }
      } catch (error) {
        if (active) {
          setPublication({
            phase: 'failed',
            error: error.message,
          });
        }
      }
    }

    checkPublication();

    const timer = window.setInterval(checkPublication, 4000);

    return () => {
      active = false;

      window.clearInterval(timer);
    };
  }, []);

  async function retryPublication() {
    const result = await retryRegulationPublication();

    if (!result?.ok) {
      throw new Error(result?.message || 'Не удалось запустить публикацию');
    }

    setPublication(result.publication);

    return result.publication;
  }

  return {
    publication,
    setPublication,
    retryPublication,
  };
}
