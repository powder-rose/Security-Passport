import { useEffect, useState } from 'react';

import { getBlogPublication, retryBlogPublication } from '../../../api/adminApi';

const POLLING_STATUSES = new Set(['queued', 'running']);

export default function useBlogPublication() {
  const [publication, setPublication] = useState(null);

  const [retrying, setRetrying] = useState(false);

  const publicationStatus = publication?.status;

  useEffect(() => {
    let active = true;

    async function checkPublication() {
      try {
        const result = await getBlogPublication();

        if (active && result?.ok) {
          setPublication(result.publication);
        }
      } catch (error) {
        if (active) {
          setPublication({
            status: 'unavailable',
            error: error.message,
          });
        }
      }
    }

    if (!publicationStatus) {
      checkPublication();
    }

    if (!POLLING_STATUSES.has(publicationStatus)) {
      return () => {
        active = false;
      };
    }

    const timer = window.setInterval(checkPublication, 4000);

    return () => {
      active = false;

      window.clearInterval(timer);
    };
  }, [publicationStatus]);

  async function retryPublication() {
    setRetrying(true);

    try {
      const result = await retryBlogPublication();

      if (!result?.ok) {
        throw new Error(result?.message || 'Не удалось повторить публикацию');
      }

      setPublication(result.publication);

      return result.publication;
    } finally {
      setRetrying(false);
    }
  }

  return {
    publication,
    setPublication,
    retryPublication,
    retrying,
  };
}
