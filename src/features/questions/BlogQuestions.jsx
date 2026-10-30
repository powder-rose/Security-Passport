import { questionPath } from '../../../shared/contracts/questions.js';
import './BlogQuestions.css';

export default function BlogQuestions({ questions = [] }) {
  if (!questions.length) return null;
  return (
    <section className="article-related" aria-labelledby="blog-questions-title">
      <div className="article-related__head">
        <p>Вопрос — ответ</p>
        <h2 id="blog-questions-title">Связанные вопросы</h2>
      </div>
      <div className="article-related-grid">
        {questions.map(question => (
          <a
            className="article-related-card blog-question-card"
            key={question.id}
            href={questionPath(question.slug)}
          >
            <div className="article-related-card__body">
              <h3>{question.title}</h3>
              <p>{question.shortAnswer}</p>
              <span>Читать ответ →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
