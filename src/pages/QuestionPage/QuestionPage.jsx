import { useEffect, useState } from 'react';

import QuestionSeo from '../../features/questions/QuestionSeo.jsx';
import QuestionView from '../../features/questions/QuestionView.jsx';
import '../../pages/QuestionsPage/QuestionsPage.css';

export default function QuestionPage({ slug, initialData = null }) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData?.question?.slug === slug) return undefined;
    const controller = new AbortController();
    fetch(`/api/questions/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error('Ответ не найден или временно недоступен.');
        if (!controller.signal.aborted) setData(result);
      })
      .catch(error => {
        if (error.name !== 'AbortError') setError('Ответ не найден или временно недоступен.');
      });
    return () => controller.abort();
  }, [slug, initialData]);

  if (!data?.question)
    return (
      <main className="question-loading" id="main-content">
        <QuestionSeo noindex />
        <p role="status">{error || 'Загружаем ответ…'}</p>
        <a href="/questions/">Ко всем вопросам</a>
      </main>
    );
  return (
    <>
      <QuestionSeo question={data.question} />
      <QuestionView data={data} />
    </>
  );
}
