import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import QuestionView from '../../../features/questions/QuestionView.jsx';
import QuestionSeo from '../../../features/questions/QuestionSeo.jsx';
import Header from '../../../components/Header/Header.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import '../../../styles/reset.css';
import '../../../styles/variables.css';
import '../../../styles/typography.css';
import '../../../styles/global.css';
import '../../../pages/QuestionsPage/QuestionsPage.css';
import { questionRequest } from '../../features/questions/questionsApi.js';

export default function QuestionPreviewPage() {
  const id = window.location.pathname.split('/').filter(Boolean).at(-1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    questionRequest(`/${encodeURIComponent(id)}/preview`)
      .then(result => {
        if (active) setData(result);
      })
      .catch(error => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  if (!data) return <p role="status">{error || 'Загружаем предпросмотр…'}</p>;
  return (
    <HelmetProvider>
      <QuestionSeo question={data.question} noindex includeRobots={false} />
      <Header pathname="/questions/" />
      <main id="main-content" className="question-preview-shell">
        <QuestionView data={data} preview />
      </main>
      <Footer />
    </HelmetProvider>
  );
}
