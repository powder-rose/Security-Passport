import { useCallback, useEffect, useRef, useState } from 'react';
import { getArticleSchedules, changeArticleSchedule } from '../../api/adminApi.js';
import { ARTICLE_SAVE_ERRORS } from '../../features/articles/model/articleForm.js';

export default function usePublicationPlan() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const activeRef = useRef(true);
  const sequenceRef = useRef(0);
  const refresh = useCallback(async () => {
    const current = ++sequenceRef.current;
    try {
      const result = await getArticleSchedules();
      if (!result?.ok) throw new Error('Не удалось получить расписание.');
      if (activeRef.current && current === sequenceRef.current) {
        setData(result);
        setError('');
      }
    } catch {
      if (activeRef.current && current === sequenceRef.current)
        setError('Не удалось обновить расписание. Последние данные могут быть неактуальны.');
    }
  }, []);
  useEffect(() => {
    activeRef.current = true;
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 5000);
    return () => {
      activeRef.current = false;
      window.clearInterval(timer);
    };
  }, [refresh]);
  async function change(record, action, scheduledAt) {
    setBusy(true);
    try {
      const result = await changeArticleSchedule(record.id, {
        action,
        scheduledAt,
        expectedUpdatedAt: record.updatedAt,
      });
      if (!result?.ok)
        throw new Error(
          ARTICLE_SAVE_ERRORS[result?.error] ||
            'Действие не выполнено. Обновите расписание и попробуйте снова.',
        );
      await refresh();
    } finally {
      setBusy(false);
    }
  }
  return { data, error, busy, refresh, change };
}
