import { lazy, Suspense, useState } from 'react';

import QuestionFields from '../../features/questions/QuestionFields.jsx';
import QuestionSeoFields from '../../features/questions/QuestionSeoFields.jsx';
import QuestionRelations from '../../features/questions/QuestionRelations.jsx';
import useQuestionEditor from '../../features/questions/useQuestionEditor.js';
import { QUESTION_STATUS_LABELS } from '../../features/questions/questionsApi.js';
import BlogPublicationStatus from '../ArticlesPage/components/BlogPublicationStatus.jsx';
import useBlogPublication from '../ArticlesPage/hooks/useBlogPublication.js';
import '../QuestionsPage/QuestionsAdmin.css';

const ArticleEditor = lazy(() => import('../../components/Editor/ArticleEditor.jsx'));

export default function QuestionEditPage() {
  const [id] = useState(() => window.location.pathname.match(/\/edit\/([^/]+)/)?.[1] || null);
  const publication = useBlogPublication();
  const editor = useQuestionEditor(id, publication.setPublication);
  const { record, form, catalog, error, notice, busy, warnings, change, save, action, preview } =
    editor;
  const [tab, setTab] = useState('content');
  const [scheduledAt, setScheduledAt] = useState('');
  const [overrideWarnings, setOverrideWarnings] = useState(false);
  const attempt = promise => {
    void promise.catch(() => {});
  };
  return (
    <div className="admin-questions admin-question-editor">
      <a className="admin-question-back" href="/admin/questions">
        ← Все вопросы
      </a>
      <div className="admin-questions__heading">
        <div>
          <p>{record ? QUESTION_STATUS_LABELS[record.status] : 'НОВЫЙ МАТЕРИАЛ'}</p>
          <h1>{record ? 'Редактор вопроса' : 'Новый вопрос'}</h1>
        </div>
        <span role="status">{busy ? 'Сохраняем…' : notice}</span>
      </div>
      <BlogPublicationStatus {...publication} onRetry={publication.retryPublication} />
      {error && (
        <p className="admin-question-error" role="alert">
          {error}
        </p>
      )}
      {catalog ? (
        <div className="admin-question-workspace">
          <div className="admin-question-panel">
            <div className="admin-question-tabs" role="tablist" aria-label="Редактор вопроса">
              {[
                ['content', 'Контент'],
                ['seo', 'SEO'],
                ['links', 'Связи'],
                ['history', 'История'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  id={`question-tab-${value}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === value}
                  aria-controls="question-edit-panel"
                  onClick={() => setTab(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <fieldset
              className="admin-question-fields"
              disabled={Boolean(record?.scheduledAt)}
              id="question-edit-panel"
              role="tabpanel"
              aria-labelledby={`question-tab-${tab}`}
            >
              {tab === 'content' && (
                <>
                  <QuestionFields
                    form={form}
                    catalog={catalog}
                    onChange={change}
                    disabled={Boolean(record?.scheduledAt)}
                  />
                  <label className="admin-question-editor-label">Основной текст</label>
                  <Suspense fallback={<p>Загружаем редактор…</p>}>
                    <ArticleEditor
                      value={form.content}
                      disabled={Boolean(record?.scheduledAt)}
                      onChange={value => change('content', value)}
                    />
                  </Suspense>
                </>
              )}
              {tab === 'seo' && <QuestionSeoFields form={form} onChange={change} />}
              {tab === 'links' && (
                <QuestionRelations
                  form={form}
                  catalog={catalog}
                  id={record?.id}
                  onChange={change}
                />
              )}
              {tab === 'history' && (
                <div className="admin-question-history">
                  <p>
                    Восстановление меняет только черновик. Опубликованная страница остаётся доступна
                    в текущей версии.
                  </p>
                  {record?.history.map(version => (
                    <div key={version.id}>
                      <span>
                        {new Date(version.savedAt).toLocaleString('ru-RU')}
                        <small>{version.draft.title || 'Без заголовка'}</small>
                      </span>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => attempt(action('restore', { versionId: version.id }))}
                      >
                        Восстановить
                      </button>
                    </div>
                  ))}
                  {!record?.history.length && <p>История появится после сохранения изменений.</p>}
                </div>
              )}
            </fieldset>
          </div>
          <aside className="admin-question-actions">
            <p>УПРАВЛЕНИЕ МАТЕРИАЛОМ</p>
            <button
              type="button"
              className="admin-button"
              disabled={busy || Boolean(record?.scheduledAt)}
              onClick={() => attempt(save())}
            >
              Сохранить черновик
            </button>
            <button type="button" disabled={busy} onClick={preview}>
              Предпросмотр ↗
            </button>
            <button
              type="button"
              disabled={busy || Boolean(record?.scheduledAt)}
              onClick={() => attempt(action('review'))}
            >
              На проверку
            </button>
            <button
              type="button"
              className="admin-question-publish"
              disabled={busy}
              onClick={() => attempt(action('publish', { overrideWarnings }))}
            >
              Опубликовать
            </button>
            {record?.live && (
              <a href={`/questions/${record.live.slug}/`} target="_blank" rel="noopener noreferrer">
                Открыть на сайте ↗
              </a>
            )}
            {warnings.length > 0 && (
              <div className="admin-question-warnings">
                <p>{warnings.join(' ')}</p>
                <label className="admin-question-check">
                  <input
                    type="checkbox"
                    checked={overrideWarnings}
                    onChange={event => setOverrideWarnings(event.target.checked)}
                  />
                  <span>Администратор: разрешить публикацию с предупреждениями о совпадениях</span>
                </label>
              </div>
            )}
            <details>
              <summary>Отложенная публикация</summary>
              {record?.scheduledAt ? (
                <>
                  <p>{new Date(record.scheduledAt).toLocaleString('ru-RU')}</p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => attempt(action('cancel-schedule'))}
                  >
                    Отменить расписание
                  </button>
                </>
              ) : (
                <>
                  <label className="admin-question-field">
                    <span>Дата и время на вашем устройстве</span>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={event => setScheduledAt(event.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={busy || !scheduledAt}
                    onClick={() =>
                      attempt(
                        action('schedule', {
                          scheduledAt: new Date(scheduledAt).toISOString(),
                          overrideWarnings,
                        }),
                      )
                    }
                  >
                    Запланировать
                  </button>
                </>
              )}
            </details>
            {record && (
              <button type="button" disabled={busy} onClick={() => attempt(action('archive'))}>
                Архивировать
              </button>
            )}
            <p className="admin-question-hint">
              Публикация требует заполненных SEO-полей, основной статьи и двух отметок проверки.
              Черновики сохраняются автоматически.
            </p>
          </aside>
        </div>
      ) : (
        !error && <p>Загружаем редактор…</p>
      )}
    </div>
  );
}
