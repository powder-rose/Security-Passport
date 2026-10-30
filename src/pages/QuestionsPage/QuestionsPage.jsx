import Container from '../../components/ui/Container/Container.jsx';
import FinalCTA from '../../sections/FinalCTA/FinalCTA.jsx';
import QuestionSeo from '../../features/questions/QuestionSeo.jsx';
import QuestionCard from '../../features/questions/QuestionCard.jsx';
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
        <section className="questions-hero">
          <Container>
            <nav className="questions-breadcrumbs" aria-label="Хлебные крошки">
              <a href="/">Главная</a>
              <span aria-hidden="true">/</span>
              <span>Вопрос — ответ</span>
            </nav>
            <div className="questions-hero__grid">
              <div>
                <p className="questions-eyebrow">
                  <span className="questions-dot" /> ВОПРОС — ОТВЕТ
                </p>
                <h1>{data.settings.title}</h1>
                <p className="questions-hero__description">{data.settings.description}</p>
                <a className="questions-hero__anchor" href="#questions-catalog">
                  Найти свой вопрос <span aria-hidden="true">↓</span>
                </a>
              </div>
              <aside className="questions-hero__note" aria-label="Как устроены ответы">
                <span className="questions-hero__note-label">ОТ СИТУАЦИИ К РЕШЕНИЮ</span>
                <span className="questions-hero__symbol" aria-hidden="true">
                  ?
                </span>
                <p>
                  Конкретный вопрос.
                  <br />
                  Понятный порядок действий.
                </p>
                <div className="questions-hero__steps">
                  <span>
                    01 <span>Краткий ответ</span>
                  </span>
                  <span>
                    02 <span>Разбор ситуации</span>
                  </span>
                  <span>
                    03 <span>Материалы по теме</span>
                  </span>
                </div>
              </aside>
            </div>
          </Container>
        </section>
        <section
          className="questions-catalog"
          id="questions-catalog"
          aria-labelledby="questions-catalog-title"
        >
          <Container>
            <div className="questions-catalog__heading">
              <div>
                <p className="questions-eyebrow">ПРАКТИЧЕСКИЕ РАЗЪЯСНЕНИЯ</p>
                <h2 id="questions-catalog-title">Найдите свою ситуацию</h2>
              </div>
              <p>
                Аренда, документы, согласование
                <br />и требования к вашему объекту.
              </p>
            </div>
            <form
              className="questions-search"
              role="search"
              onSubmit={event => event.preventDefault()}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <label className="visually-hidden" htmlFor="question-search">
                Поиск по вопросам и ответам
              </label>
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
            </form>
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
            <div aria-live="polite" aria-busy={loading}>
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
                  <h3>
                    {query.search || query.category
                      ? 'По вашему запросу пока нет ответов'
                      : 'Готовим первые ответы'}
                  </h3>
                  <p>Посмотрите материалы блога или обсудите свой объект с нашим специалистом.</p>
                  <a href="/blog/">Перейти в блог ↗</a>
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
            <div className="questions-help">
              <div>
                <span className="questions-eyebrow">РАЗБЕРЁМСЯ ВМЕСТЕ</span>
                <h2>Не нашли свой вопрос?</h2>
                <p>
                  В блоге — подробные разборы требований. Для конкретной ситуации можно обратиться к
                  нашему специалисту.
                </p>
              </div>
              <div className="questions-help__links">
                <a href="/blog/">
                  Экспертные материалы <span aria-hidden="true">↗</span>
                </a>
                <a href="#contact">
                  Обсудить свой объект <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </Container>
        </section>
        <FinalCTA />
      </main>
    </>
  );
}
