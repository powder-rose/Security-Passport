import { useEffect, useState } from 'react';

import { questionRequest, QUESTION_STATUS_LABELS } from '../../features/questions/questionsApi.js';
import BlogPublicationStatus from '../ArticlesPage/components/BlogPublicationStatus.jsx';
import useBlogPublication from '../ArticlesPage/hooks/useBlogPublication.js';
import './QuestionsAdmin.css';

export default function QuestionsPage() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', status: '', authorId: '' });
  const [error, setError] = useState('');
  const publication = useBlogPublication();
  useEffect(() => {
    let active = true;
    questionRequest()
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
  async function act(record, action) {
    try {
      const result = await questionRequest(`/${record.id}/actions`, {
        method: 'POST',
        body: { action, revision: record.revision },
      });
      if (result.publication) publication.setPublication(result.publication);
      setData(await questionRequest());
      setError('');
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <div className="admin-questions">
      <div className="admin-questions__heading">
        <div>
          <p>КОНТЕНТ</p>
          <h1>Вопросы и ответы</h1>
        </div>
        <div>
          <a className="admin-question-secondary" href="/admin/questions/settings">
            Настройки рубрики
          </a>
          <a className="admin-button" href="/admin/questions/new">
            Создать вопрос
          </a>
        </div>
      </div>
      <BlogPublicationStatus {...publication} onRetry={publication.retryPublication} />
      {error && (
        <p className="admin-question-error" role="alert">
          {error}
        </p>
      )}
      {data ? (
        <>
          <div className="admin-questions__filters">
            <input
              aria-label="Поиск по вопросам"
              placeholder="Поиск по вопросам…"
              value={filters.search}
              onChange={event => setFilters({ ...filters, search: event.target.value })}
            />
            {[
              ['category', 'Все категории', data.categories.map(value => [value, value])],
              ['status', 'Все статусы', Object.entries(QUESTION_STATUS_LABELS)],
              ['authorId', 'Все авторы', data.authors.map(author => [author.id, author.name])],
            ].map(([field, title, options]) => (
              <select
                key={field}
                aria-label={title}
                value={filters[field]}
                onChange={event => setFilters({ ...filters, [field]: event.target.value })}
              >
                <option value="">{title}</option>
                {options.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            ))}
          </div>
          <div className="admin-questions__table">
            <table>
              <thead>
                <tr>
                  <th>Вопрос</th>
                  <th>Статус и SEO</th>
                  <th>Автор и дата изменения</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {data.records
                  .filter(
                    record =>
                      (!filters.search ||
                        record.draft.title
                          .toLocaleLowerCase('ru')
                          .includes(filters.search.toLocaleLowerCase('ru'))) &&
                      (!filters.category || record.draft.category === filters.category) &&
                      (!filters.status || record.status === filters.status) &&
                      (!filters.authorId || record.draft.authorId === filters.authorId),
                  )
                  .map(record => (
                    <tr key={record.id}>
                      <td>
                        <a href={`/admin/questions/edit/${record.id}`}>
                          {record.draft.title || 'Без заголовка'}
                        </a>
                        <small>{record.draft.category}</small>
                        <small>/questions/{record.draft.slug}/</small>
                      </td>
                      <td>
                        {QUESTION_STATUS_LABELS[record.status]}
                        <small>
                          {record.draft.seoReview === 'checked'
                            ? 'SEO: проверено'
                            : 'SEO: нужна проверка'}
                        </small>
                        {record.scheduleError && (
                          <small className="admin-question-error">{record.scheduleError}</small>
                        )}
                      </td>
                      <td>
                        {data.authors.find(author => author.id === record.draft.authorId)?.name}
                        <small>
                          {record.updatedAt
                            ? new Date(record.updatedAt).toLocaleString('ru-RU')
                            : 'Материал из ТЗ'}
                        </small>
                      </td>
                      <td>
                        <div className="admin-questions__row-actions">
                          <a href={`/admin/questions/edit/${record.id}`}>Редактировать</a>
                          <a
                            href={`/admin/questions/preview/${record.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Предпросмотр ↗
                          </a>
                          <button type="button" onClick={() => act(record, 'publish')}>
                            Опубликовать
                          </button>
                          <button type="button" onClick={() => act(record, 'archive')}>
                            Архивировать
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        !error && <p>Загружаем вопросы…</p>
      )}
    </div>
  );
}
