export default function QuestionSeoFields({ form, onChange }) {
  return (
    <div className="admin-question-fields">
      <label className="admin-question-field">
        <span>SEO Title</span>
        <input value={form.seoTitle} onChange={event => onChange('seoTitle', event.target.value)} />
      </label>
      <label className="admin-question-field">
        <span>SEO Description</span>
        <textarea
          rows="3"
          value={form.seoDescription}
          onChange={event => onChange('seoDescription', event.target.value)}
        />
      </label>
      <label className="admin-question-field">
        <span>Основной ключ · только для редактора</span>
        <input
          value={form.primaryKeyword}
          onChange={event => onChange('primaryKeyword', event.target.value)}
        />
      </label>
      <label className="admin-question-field">
        <span>Дополнительные ключи · по одному на строку</span>
        <textarea
          rows="3"
          value={form.keywords.join('\n')}
          onChange={event => onChange('keywords', event.target.value.split('\n'))}
        />
      </label>
      <label className="admin-question-field">
        <span>Canonical · пустое поле = собственный URL</span>
        <input
          type="url"
          value={form.canonical}
          placeholder={`https://pasport-bezopasnosty.ru/questions/${form.slug}/`}
          onChange={event => onChange('canonical', event.target.value)}
        />
      </label>
      <label className="admin-question-check">
        <input
          type="checkbox"
          checked={form.indexable}
          onChange={event => onChange('indexable', event.target.checked)}
        />
        <span>Разрешить индексацию после публикации</span>
      </label>
      <label className="admin-question-check">
        <input
          type="checkbox"
          checked={form.seoReview === 'checked'}
          onChange={event => onChange('seoReview', event.target.checked ? 'checked' : 'pending')}
        />
        <span>Пересечения с блогом и другими вопросами проверены по фактическим данным поиска</span>
      </label>
      <label className="admin-question-check">
        <input
          type="checkbox"
          checked={form.normativeReview === 'checked'}
          onChange={event =>
            onChange('normativeReview', event.target.checked ? 'checked' : 'pending')
          }
        />
        <span>Нормативная проверка материала выполнена</span>
      </label>
      <p className="admin-question-hint">
        Отметки ставит редактор после проверки. Совпадения слов не означают автоматического вывода о
        каннибализации.
      </p>
    </div>
  );
}
