import { questionPath } from '../../../shared/contracts/questions.js';

export default function QuestionCard({ question }) {
  return (
    <article className="question-card">
      <div className="question-card__meta">
        <span>{question.category}</span>
        {question.pinned && <span className="question-card__pinned">Важный вопрос</span>}
      </div>
      <h3>
        <a href={questionPath(question.slug)}>{question.title}</a>
      </h3>
      <p>{question.shortAnswer}</p>
      <a className="question-card__link" href={questionPath(question.slug)}>
        Читать ответ <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
