import { objectTypes } from '../../../data/objectTypes.js';
import { servicePages } from '../../../data/servicePages.js';

export default function QuestionRelations({ form, catalog, id, onChange }) {
  function toggle(field, value, selected) {
    onChange(
      field,
      selected ? [...form[field], value] : form[field].filter(item => item !== value),
    );
  }
  return (
    <div className="admin-question-fields">
      <label className="admin-question-field">
        <span>Основная статья блога · обязательна для публикации</span>
        <select
          value={form.mainArticleSlug}
          onChange={event => onChange('mainArticleSlug', event.target.value)}
        >
          <option value="">Выберите статью</option>
          {catalog.articles.map(article => (
            <option key={article.id} value={article.slug}>
              {article.title}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="admin-question-choice">
        <legend>Дополнительные статьи</legend>
        {catalog.articles
          .filter(article => article.slug !== form.mainArticleSlug)
          .map(article => (
            <label key={article.id} className="admin-question-check">
              <input
                type="checkbox"
                checked={form.articleSlugs.includes(article.slug)}
                onChange={event => toggle('articleSlugs', article.slug, event.target.checked)}
              />
              <span>{article.title}</span>
            </label>
          ))}
      </fieldset>
      <label className="admin-question-field">
        <span>Коммерческая страница</span>
        <select
          value={form.servicePath}
          onChange={event => onChange('servicePath', event.target.value)}
        >
          <option value="">Без блока услуги</option>
          {[...objectTypes, ...servicePages].map(service => (
            <option key={service.id} value={service.path}>
              {service.seoName}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="admin-question-choice">
        <legend>Похожие вопросы · до четырёх</legend>
        {catalog.questions
          .filter(question => question.id !== id)
          .map(question => (
            <label key={question.id} className="admin-question-check">
              <input
                type="checkbox"
                checked={form.relatedQuestionIds.includes(question.id)}
                onChange={event => toggle('relatedQuestionIds', question.id, event.target.checked)}
              />
              <span>{question.title}</span>
            </label>
          ))}
        {catalog.questions.filter(question => question.id !== id).length === 0 && (
          <p>Другие опубликованные вопросы пока отсутствуют.</p>
        )}
      </fieldset>
      <label className="admin-question-check">
        <input
          type="checkbox"
          checked={form.showInBlog || false}
          onChange={event => onChange('showInBlog', event.target.checked)}
        />
        <span>Показывать в выбранных статьях блога в блоке «Связанные вопросы»</span>
      </label>
      <label className="admin-question-check">
        <input
          type="checkbox"
          checked={form.pinned}
          onChange={event => onChange('pinned', event.target.checked)}
        />
        <span>Закрепить вверху каталога</span>
      </label>
    </div>
  );
}
