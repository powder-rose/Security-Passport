import { useEffect, useState } from 'react';

import { getRegulationPublication, retryRegulationPublication } from '../../../api/adminApi';

const POLLING_PHASES = new Set(['queued', 'publishing']);

export default function useRegulationPublication() {
  const [publication, setPublication] = useState(null);

  const publicationPhase = publication?.phase;

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

    if (!publicationPhase) {
      checkPublication();
    }

    if (!POLLING_PHASES.has(publicationPhase)) {
      return () => {
        active = false;
      };
    }

    const timer = window.setInterval(checkPublication, 4000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [publicationPhase]);

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
