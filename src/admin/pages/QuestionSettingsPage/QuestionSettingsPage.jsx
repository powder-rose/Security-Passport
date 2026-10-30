import { useEffect, useState } from 'react';

import { questionRequest } from '../../features/questions/questionsApi.js';
import '../QuestionsPage/QuestionsAdmin.css';

export default function QuestionSettingsPage() {
  const [data, setData] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [renames, setRenames] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    questionRequest('/catalog')
      .then(result => {
        if (active) setData(result);
      })
      .catch(error => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function persist(categories = data.categories, rename = undefined) {
    setBusy(true);
    try {
      const result = await questionRequest('/settings', {
        method: 'PUT',
        body: { settings: data.settings, categories, rename },
      });
      setData(current => ({
        ...current,
        settings: result.settings,
        categories: result.categories,
      }));
      setMessage('Настройки сохранены. Обновление публичной версии поставлено в очередь.');
      setError('');
      setNewCategory('');
      setRenames({});
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-questions">
      <a className="admin-question-back" href="/admin/questions">
        ← Все вопросы
      </a>
      <h1>Настройки рубрики</h1>
      {error && (
        <p className="admin-question-error" role="alert">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {data && (
        <div className="admin-question-panel">
          <div className="admin-question-fields">
            {Object.entries({
              title: 'Заголовок главной страницы · H1',
              description: 'Описание рубрики',
              seoTitle: 'SEO Title',
              seoDescription: 'SEO Description',
            }).map(([key, title]) => (
              <label key={key} className="admin-question-field">
                <span>{title}</span>
                <textarea
                  rows="2"
                  value={data.settings[key]}
                  onChange={event =>
                    setData({ ...data, settings: { ...data.settings, [key]: event.target.value } })
                  }
                />
              </label>
            ))}
            <button
              type="button"
              className="admin-button"
              disabled={busy}
              onClick={() => persist()}
            >
              Сохранить настройки
            </button>
            <h2>Категории</h2>
            <p className="admin-question-hint">
              Переименование обновляет категорию у всех связанных вопросов. Используемую категорию
              нельзя удалить.
            </p>
            {data.categories.map(name => (
              <div key={name} className="admin-question-category-row">
                <input
                  aria-label={`Название категории ${name}`}
                  value={renames[name] ?? name}
                  onChange={event => setRenames({ ...renames, [name]: event.target.value })}
                />
                <button
                  type="button"
                  disabled={busy || !renames[name]?.trim() || renames[name] === name}
                  onClick={() =>
                    persist(
                      data.categories.map(value => (value === name ? renames[name].trim() : value)),
                      { from: name, to: renames[name].trim() },
                    )
                  }
                >
                  Переименовать
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => persist(data.categories.filter(value => value !== name))}
                >
                  Удалить
                </button>
              </div>
            ))}
            <div className="admin-question-category-row">
              <input
                aria-label="Новая категория"
                placeholder="Новая категория"
                value={newCategory}
                onChange={event => setNewCategory(event.target.value)}
              />
              <button
                type="button"
                disabled={busy || !newCategory.trim()}
                onClick={() => persist([...data.categories, newCategory.trim()])}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
