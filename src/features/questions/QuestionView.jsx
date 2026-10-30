import { useEffect, useRef } from 'react';

import Container from '../../components/ui/Container/Container.jsx';
import FinalCTA from '../../sections/FinalCTA/FinalCTA.jsx';
import { objectTypes } from '../../data/objectTypes.js';
import { servicePages } from '../../data/servicePages.js';
import { reachGoal, METRICA_GOALS } from '../../lib/analytics.js';
import QuestionContent, { questionHeadings } from './QuestionContent.jsx';
import QuestionCard from './QuestionCard.jsx';

import './QuestionView.css';

function dateLabel(date) {
  return date
    ? new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Moscow',
      }).format(new Date(date))
    : '';
}

function Contents({ headings }) {
  return (
    <nav aria-label="Содержание ответа">
      <p className="questions-eyebrow">В ЭТОМ ОТВЕТЕ</p>
      <ol>
        {headings.map(heading => (
          <li key={heading.id} className={heading.level === 3 ? 'question-toc__nested' : undefined}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function QuestionView({ data, preview = false }) {
  const { question, articles = [], relatedQuestions = [] } = data;
  const Root = preview ? 'div' : 'main';
  const { html, headings } = questionHeadings(question.content);
  const progressRef = useRef(null);
  const service = [...objectTypes, ...servicePages].find(
    item => item.path === question.servicePath,
  );
  const updated =
    question.modifiedAt && question.modifiedAt.slice(0, 10) !== question.publishedAt?.slice(0, 10);

  useEffect(() => {
    if (preview) return undefined;
    const update = () => {
      const length = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty(
        '--question-progress',
        `${length > 0 ? Math.min(100, (window.scrollY / length) * 100) : 0}%`,
      );
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [preview]);

  return (
    <>
      <Root
        id={preview ? undefined : 'main-content'}
        className={`question-page${preview ? ' question-page--preview' : ''}`}
      >
        {!preview && <div ref={progressRef} className="question-progress" aria-hidden="true" />}
        <Container>
          <nav className="questions-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">Главная</a>
            <span aria-hidden="true">/</span>
            <a href="/questions/">Вопрос — ответ</a>
            <span aria-hidden="true">/</span>
            <span>{question.title}</span>
          </nav>
          <header className="question-header">
            <div className="question-header__meta">
              <a href={`/questions/?category=${encodeURIComponent(question.category)}`}>
                {question.category}
              </a>
              {preview && (
                <span className="question-preview-label">Предпросмотр · не опубликовано</span>
              )}
            </div>
            <h1>{question.title}</h1>
            <div className="question-header__byline">
              <span>{question.author?.name || 'Николай Бойков'}</span>
              {question.publishedAt && (
                <span>
                  Опубликовано{' '}
                  <time dateTime={question.publishedAt}>{dateLabel(question.publishedAt)}</time>
                </span>
              )}
              {updated && (
                <span>
                  Обновлено{' '}
                  <time dateTime={question.modifiedAt}>{dateLabel(question.modifiedAt)}</time>
                </span>
              )}
            </div>
          </header>
          <div className="question-layout">
            <article className="question-article">
              <section className="question-short" aria-labelledby="question-short-title">
                <div className="question-short__label">
                  <span className="questions-dot" />
                  <h2 id="question-short-title">Краткий ответ</h2>
                </div>
                <p>{question.shortAnswer}</p>
              </section>
              {headings.length > 0 && (
                <details className="question-mobile-toc">
                  <summary>
                    В этом ответе <span aria-hidden="true">↓</span>
                  </summary>
                  <Contents headings={headings} />
                </details>
              )}
              {question.image && (
                <figure className="question-image">
                  <img
                    src={question.image}
                    alt={question.imageAlt || ''}
                    width="1200"
                    height="675"
                  />
                </figure>
              )}
              <QuestionContent html={html} />
              <a className="question-back" href="/questions/">
                ← Ко всем вопросам
              </a>
            </article>
            {headings.length > 0 && (
              <aside className="question-toc">
                <Contents headings={headings} />
                <a className="question-toc__contact" href={preview ? '/#contact' : '#contact'}>
                  Обсудить свой объект <span aria-hidden="true">↗</span>
                </a>
              </aside>
            )}
          </div>
          {articles.length > 0 && (
            <section className="question-related" aria-labelledby="question-blog-title">
              <p className="questions-eyebrow">ЭКСПЕРТНЫЕ МАТЕРИАЛЫ</p>
              <h2 id="question-blog-title">Подробнее по теме</h2>
              <div className="question-article-links">
                {articles.map(article => (
                  <a
                    key={article.id || article.slug}
                    href={`/blog/${encodeURIComponent(article.slug)}/`}
                  >
                    <span>Из блога</span>
                    <h3>{article.title}</h3>
                    <span className="question-article-links__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
          {service && (
            <section className="question-service" aria-labelledby="question-service-title">
              <div>
                <p className="questions-eyebrow">ПОМОЩЬ С ДОКУМЕНТАМИ</p>
                <h2 id="question-service-title">
                  Решим вопрос
                  <br />
                  по вашему объекту
                </h2>
                <p>{service.seoName || service.title}</p>
              </div>
              <a
                href={service.path}
                onClick={() => {
                  if (!preview)
                    reachGoal(METRICA_GOALS.questionServiceClick, {
                      question: question.slug,
                      service: service.path,
                    });
                }}
              >
                Посмотреть условия <span aria-hidden="true">↗</span>
              </a>
            </section>
          )}
          {relatedQuestions.length > 0 && (
            <section className="question-related" aria-labelledby="question-related-title">
              <p className="questions-eyebrow">ПРОДОЛЖИТЬ РАЗБОР</p>
              <h2 id="question-related-title">Другие вопросы по теме</h2>
              <div className="questions-grid">
                {relatedQuestions.map(item => (
                  <QuestionCard key={item.id} question={item} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </Root>
      <FinalCTA preview={preview} />
    </>
  );
}
