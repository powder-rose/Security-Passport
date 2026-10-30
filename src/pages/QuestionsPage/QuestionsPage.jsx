import Container from '../../components/ui/Container/Container.jsx';
import FinalCTA from '../../sections/FinalCTA/FinalCTA.jsx';
import QuestionSeo from '../../features/questions/QuestionSeo.jsx';
import QuestionCard from '../../features/questions/QuestionCard.jsx';
import QuestionsHero from '../../features/questions/QuestionsHero.jsx';
import QuestionsHelp from '../../features/questions/QuestionsHelp.jsx';
import useQuestionCatalog from '../../features/questions/useQuestionCatalog.js';

import './QuestionsPage.css';

export default function QuestionsPage({ initialData = null }) {
  const { data, query, loading, error, changeQuery, retry } = useQuestionCatalog(initialData);
  return (
    <>
      <QuestionSeo
        settings={data.settings}
        noindex={Boolean(query.search || query.category || query.page > 1)}
      />
      <main className="questions-page" id="main-content">
        <QuestionsHero settings={data.settings} />
        <section
          className="questions-catalog"
          id="questions-catalog"
          aria-labelledby="questions-catalog-title"
        >
          <Container>
            <div className="questions-catalog__heading">
              <div>
                <p className="questions-eyebrow">ПОИСК ПО СИТУАЦИИ</p>
                <h2 id="questions-catalog-title">Ответы на ваши вопросы</h2>
              </div>
              <form
                className="questions-search"
                role="search"
                onSubmit={event => event.preventDefault()}
              >
                <label className="questions-search__label" htmlFor="question-search">
                  Поиск по ответам
                </label>
                <div className="questions-search__field">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <input
                    id="question-search"
                    type="search"
                    value={query.search}
                    placeholder="Найти ответ на вопрос…"
                    onChange={event => changeQuery({ search: event.target.value })}
                  />
                  {query.search && (
                    <button type="button" onClick={() => changeQuery({ search: '' })}>
                      Сбросить
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="questions-filterbar">
              <span className="questions-filterbar__label">Темы</span>
              <div className="questions-filters" aria-label="Категории вопросов">
                {['', ...data.categories].map(category => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={query.category === category}
                    onClick={() => changeQuery({ category })}
                  >
                    {category || 'Все вопросы'}
                  </button>
                ))}
              </div>
            </div>
            <div className="questions-results" aria-live="polite" aria-busy={loading}>
              {loading && <p className="questions-status">Ищем подходящие ответы…</p>}
              {error && (
                <p className="questions-status" role="alert">
                  {error}{' '}
                  <button type="button" onClick={retry}>
                    Повторить
                  </button>
                </p>
              )}
              {!loading && !error && data.questions.length === 0 && (
                <div className="questions-empty">
                  <span className="questions-empty__mark" aria-hidden="true">
                    ?
                  </span>
                  <div>
                    <h3>
                      {query.search || query.category
                        ? 'По вашему запросу пока нет ответов'
                        : 'Готовим первые ответы'}
                    </h3>
                    <p>
                      {query.search || query.category
                        ? 'Попробуйте другой запрос или выберите другую тему.'
                        : 'Скоро здесь появятся разъяснения по аренде, документам и согласованию.'}
                    </p>
                  </div>
                  {query.search || query.category ? (
                    <button type="button" onClick={() => changeQuery({ search: '', category: '' })}>
                      Сбросить фильтры <span aria-hidden="true">↗</span>
                    </button>
                  ) : (
                    <a href="/blog/">
                      Пока перейти в блог <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              )}
              {data.questions.length > 0 && (
                <div className="questions-results__heading">
                  <span>{query.search || query.category ? 'Результаты поиска' : 'Все ответы'}</span>
                  <span>Найдено: {data.total}</span>
                </div>
              )}
              <div className="questions-grid">
                {data.questions.map(question => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </div>
            {data.totalPages > 1 && (
              <nav className="questions-pagination" aria-label="Страницы вопросов">
                {Array.from({ length: data.totalPages }, (_, index) => index + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    aria-current={data.page === page ? 'page' : undefined}
                    onClick={() => {
                      changeQuery({ page });
                      document
                        .getElementById('questions-catalog-title')
                        ?.scrollIntoView({ block: 'start' });
                    }}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            )}
          </Container>
        </section>
        <QuestionsHelp />
        <FinalCTA />
      </main>
    </>
  );
}
