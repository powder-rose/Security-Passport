import { useMemo, useState } from 'react';
import {
  formatPublicationDate,
  toMoscowDateTimeInput,
} from '../../../../shared/contracts/article-schedule.js';
import usePublicationPlan from './usePublicationPlan.js';
import ScheduleDialog from './ScheduleDialog.jsx';
import ArrowIcon from '../../components/ArrowIcon.jsx';
import './PublicationPlanPage.css';

const states = {
  scheduled: 'Запланировано',
  publishing: 'Публикуется',
  success: 'Опубликовано',
  error: 'Нужна проверка',
  cancelled: 'Снято с расписания',
};
const tabs = [
  ['upcoming', 'Предстоящие'],
  ['history', 'История'],
  ['error', 'Ошибки'],
  ['all', 'Все'],
];
const successCopy = {
  schedule: 'Время публикации изменено.',
  cancel: 'Статья возвращена в черновики.',
  publish: 'Публикация началась.',
  retry: 'Публикация запущена повторно.',
};

export default function PublicationPlanPage() {
  const { data, error, busy, refresh, change } = usePublicationPlan();
  const [tab, setTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState('');
  const records = data?.schedules || [];
  const upcoming = records.filter(record =>
    ['scheduled', 'publishing'].includes(record.schedule.state),
  );
  const failures = records.filter(record => record.schedule.state === 'error');
  const completed = records.filter(record =>
    ['success', 'cancelled'].includes(record.schedule.state),
  );
  const next = [...upcoming]
    .filter(record => record.schedule.state === 'scheduled')
    .sort((a, b) => Date.parse(a.schedule.at) - Date.parse(b.schedule.at))[0];
  const groups = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('ru');
    const filtered = (data?.schedules || [])
      .filter(record => {
        const state = record.schedule.state;
        const matchesTab =
          tab === 'all' ||
          (tab === 'upcoming' && ['scheduled', 'publishing'].includes(state)) ||
          (tab === 'history' && ['success', 'cancelled'].includes(state)) ||
          (tab === 'error' && state === 'error');
        return (
          matchesTab &&
          (!query || `${record.title} ${record.category}`.toLocaleLowerCase('ru').includes(query))
        );
      })
      .sort(
        (a, b) =>
          (tab === 'history' ? -1 : 1) * (Date.parse(a.schedule.at) - Date.parse(b.schedule.at)),
      );
    const grouped = new Map();
    for (const record of filtered) {
      const key = toMoscowDateTimeInput(record.schedule.at).slice(0, 10);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(record);
    }
    return [...grouped.entries()];
  }, [data, tab, search]);
  async function submit(record, action, at) {
    await change(record, action, at);
    setDialog(null);
    setNotice(successCopy[action]);
  }
  return (
    <div className="publication-plan">
      <header className="publication-plan__hero">
        <div>
          <div className="publication-plan__eyebrow">
            <span aria-hidden="true" />
            Редакционный план
          </div>
          <h1>
            План публикаций<span>.</span>
          </h1>
          <p>
            Статьи выходят по расписанию.
            <br />
            Вы управляете временем и видите результат.
          </p>
        </div>
        <div className="publication-plan__hero-side">
          <span className="publication-plan__timezone">МОСКВА · UTC+3</span>
          <a href="/admin/articles/new?fresh=1" className="publication-plan__primary">
            Новая статья <ArrowIcon />
          </a>
        </div>
      </header>
      <div className="publication-plan__summary" aria-label="Сводка публикаций">
        <button type="button" onClick={() => setTab('upcoming')}>
          <span>В расписании</span>
          <strong>{upcoming.length.toString().padStart(2, '0')}</strong>
          <small>Запланированы и публикуются</small>
        </button>
        <button type="button" onClick={() => setTab('history')}>
          <span>Опубликовано по плану</span>
          <strong>
            {completed
              .filter(record => record.schedule.state === 'success')
              .length.toString()
              .padStart(2, '0')}
          </strong>
          <small>Публичная версия обновлена</small>
        </button>
        <button
          type="button"
          onClick={() => setTab('error')}
          className={failures.length ? 'has-errors' : ''}
        >
          <span>Требуют внимания</span>
          <strong>{failures.length.toString().padStart(2, '0')}</strong>
          <small>
            {failures.length ? 'Откройте ошибки для проверки' : 'Ошибок публикации нет'}
          </small>
        </button>
        <div className="publication-plan__next">
          <span>Ближайший выход</span>
          <strong>{next ? formatPublicationDate(next.schedule.at) : 'План свободен'}</strong>
          <small>{next?.title || 'Запланируйте статью в редакторе'}</small>
        </div>
      </div>
      <div className="publication-plan__live">
        <span
          className={data?.scheduler?.enabled && !data.scheduler.lastError ? 'is-online' : ''}
          aria-hidden="true"
        />
        <span>
          {data?.scheduler?.lastError ||
            (data?.scheduler?.enabled
              ? 'Расписание работает на сервере'
              : data
                ? 'Проверка расписания ещё не запущена'
                : 'Подключение к расписанию…')}
        </span>
        <span>Админку можно закрыть</span>
        <button type="button" onClick={refresh}>
          Обновить
        </button>
      </div>
      {notice && (
        <div className="publication-plan__notice" role="status">
          {notice}
        </div>
      )}
      {error && (
        <div className="publication-plan__error" role="alert">
          {error}
        </div>
      )}
      <section className="publication-plan__catalog" aria-label="Расписание статей">
        <div className="publication-plan__toolbar">
          <div className="publication-plan__tabs" aria-label="Фильтр публикаций">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={tab === key}
                onClick={() => setTab(key)}
              >
                {label}
                {key === 'error' && failures.length > 0 && <span>{failures.length}</span>}
              </button>
            ))}
          </div>
          <label className="publication-plan__search">
            <span>Поиск по статьям</span>
            <input
              type="search"
              placeholder="Найти статью…"
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </label>
        </div>
        {!data && !error ? (
          <div className="publication-plan__empty">Загружаем расписание…</div>
        ) : groups.length ? (
          groups.map(([day, items]) => (
            <section className="publication-plan__day" key={day}>
              <h2>
                {formatPublicationDate(items[0].schedule.at, {
                  hour: undefined,
                  minute: undefined,
                  weekday: 'long',
                })}
                <span>{items.length} в плане</span>
              </h2>
              {items.map(record => (
                <article className="publication-plan__row" key={record.id}>
                  <div className="publication-plan__time">
                    <time dateTime={record.schedule.at}>
                      {toMoscowDateTimeInput(record.schedule.at).slice(11)}
                    </time>
                    <span>МСК</span>
                  </div>
                  <div className="publication-plan__article">
                    <span className={'publication-plan__badge is-' + record.schedule.state}>
                      {states[record.schedule.state] || 'Статус неизвестен'}
                    </span>
                    <h3>
                      <a href={`/admin/articles/edit/${record.id}`}>
                        {record.title || 'Без заголовка'}
                      </a>
                    </h3>
                    <p>
                      {record.category || 'Без категории'}
                      {record.schedule.state === 'scheduled' &&
                      Date.parse(record.schedule.at) <= Date.parse(data.serverNow)
                        ? ' · Ожидает ближайшей проверки'
                        : ''}
                      {record.schedule.state === 'publishing'
                        ? ' · Обновляется публичная версия'
                        : ''}
                    </p>
                    {record.schedule.error && (
                      <p className="publication-plan__row-error">{record.schedule.error}</p>
                    )}
                  </div>
                  <div className="publication-plan__actions">
                    {record.status === 'scheduled' && record.schedule.state === 'scheduled' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setDialog({ record, action: 'schedule' })}
                        >
                          Перенести
                        </button>
                        <button
                          type="button"
                          onClick={() => setDialog({ record, action: 'publish' })}
                        >
                          Сейчас <ArrowIcon />
                        </button>
                        <button
                          type="button"
                          className="publication-plan__quiet"
                          aria-label={`Снять с расписания: ${record.title}`}
                          onClick={() => setDialog({ record, action: 'cancel' })}
                        >
                          Снять
                        </button>
                      </>
                    ) : record.schedule.state === 'error' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setDialog({ record, action: 'retry' })}
                        >
                          Повторить
                        </button>
                        <a href={`/admin/articles/edit/${record.id}`}>
                          Редактировать <ArrowIcon />
                        </a>
                      </>
                    ) : record.schedule.state === 'success' ? (
                      <a href={`/blog/${record.slug}/`} target="_blank" rel="noopener noreferrer">
                        На сайте <ArrowIcon />
                      </a>
                    ) : record.schedule.state === 'cancelled' ? (
                      <a href={`/admin/articles/edit/${record.id}`}>
                        Запланировать <ArrowIcon />
                      </a>
                    ) : (
                      <span>Публикуется…</span>
                    )}
                  </div>
                </article>
              ))}
            </section>
          ))
        ) : (
          <div className="publication-plan__empty">
            <span aria-hidden="true">
              <ArrowIcon />
            </span>
            <h2>
              {search
                ? 'Ничего не найдено'
                : tab === 'error'
                  ? 'Всё в порядке'
                  : tab === 'history'
                    ? 'История появится здесь'
                    : 'Время для следующей статьи'}
            </h2>
            <p>
              {search
                ? 'Попробуйте другое название или категорию.'
                : tab === 'error'
                  ? 'Ошибок публикации нет.'
                  : 'Откройте статью, выберите «По расписанию» и укажите время выхода.'}
            </p>
            <a href="/admin/articles">
              Перейти к статьям <ArrowIcon />
            </a>
          </div>
        )}
      </section>
      <p className="publication-plan__footnote">
        Проверка каждые 15 секунд. В указанное время начинается публикация. Статус «Опубликовано»
        появится после успешного обновления сайта.
      </p>
      {dialog && (
        <ScheduleDialog
          key={dialog.record.id + dialog.action}
          {...dialog}
          busy={busy}
          onSubmit={submit}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
