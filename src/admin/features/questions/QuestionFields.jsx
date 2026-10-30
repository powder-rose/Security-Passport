import { uploadArticleImage } from '../../api/adminApi.js';

export default function QuestionFields({ form, catalog, onChange, disabled }) {
  const field = (name, label, multiline = false) => (
    <label className="admin-question-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={form[name]}
          rows={name === 'shortAnswer' ? 5 : 3}
          onChange={event => onChange(name, event.target.value)}
          disabled={disabled}
        />
      ) : (
        <input
          value={form[name]}
          onChange={event => onChange(name, event.target.value)}
          disabled={disabled}
        />
      )}
    </label>
  );
  return (
    <fieldset className="admin-question-fields" disabled={disabled}>
      {field('title', 'Заголовок вопроса · H1')}
      {field('slug', 'Адрес /questions/slug/')}
      <div className="admin-question-columns">
        <label className="admin-question-field">
          <span>Категория</span>
          <select
            value={form.category}
            onChange={event => onChange('category', event.target.value)}
          >
            <option value="">Выберите категорию</option>
            {catalog.categories.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-question-field">
          <span>Автор</span>
          <select
            value={form.authorId}
            onChange={event => onChange('authorId', event.target.value)}
          >
            <option value="">Выберите автора</option>
            {catalog.authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {field('shortAnswer', 'Краткий ответ', true)}
      <details className="admin-question-image">
        <summary>Главное изображение · необязательно</summary>
        <p>Используется общая медиабиблиотека блога. Карточка корректно работает без обложки.</p>
        {field('image', 'Адрес изображения /uploads/…')}
        {field('imageAlt', 'Описание изображения · alt')}
        <label className="admin-question-field">
          <span>Загрузить изображение</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={async event => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                const result = await uploadArticleImage(file);
                if (!result.ok || !result.url)
                  throw new Error(result.message || 'Не удалось загрузить изображение.');
                onChange('image', result.url);
              } catch (error) {
                window.alert(error.message);
              }
              event.target.value = '';
            }}
          />
        </label>
      </details>
    </fieldset>
  );
}
