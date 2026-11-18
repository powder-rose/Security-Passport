import { useState } from 'react';
import ArrowIcon from '../../../components/ArrowIcon.jsx';
import {
  fromMoscowDateTimeInput,
  toMoscowDateTimeInput,
  formatPublicationDate,
} from '../../../../../shared/contracts/article-schedule.js';
import './ArticlePublicationPanel.css';

const modes = [
  { value: 'draft', title: 'Черновик', detail: 'Сохранить для дальнейшей работы' },
  { value: 'scheduled', title: 'По расписанию', detail: 'Выбрать дату и время выхода' },
  { value: 'published', title: 'Опубликовать сейчас', detail: 'Обновить публичную версию' },
];

export default function ArticlePublicationPanel({ form, onChange }) {
  const [minimum] = useState(() => toMoscowDateTimeInput(Date.now() + 60_000));
  const instant = fromMoscowDateTimeInput(form.scheduledAt);
  function chooseShortcut(tomorrow = false) {
    const next = new Date(Date.now() + (tomorrow ? 86_400_000 : 3_600_000));
    const value = toMoscowDateTimeInput(next);
    onChange('scheduledAt', tomorrow ? value.slice(0, 10) + 'T09:00' : value);
  }
  return (
    <section className="article-publication-panel" aria-labelledby="article-publication-heading">
      <div className="article-publication-panel__heading">
        <h2 id="article-publication-heading">Публикация</h2>
        <span>МСК · UTC+3</span>
      </div>
      <fieldset className="article-publication-panel__modes">
        <legend className="article-publication-panel__legend">Когда опубликовать статью</legend>
        {modes.map(mode => (
          <label
            key={mode.value}
            className={
              'article-publication-panel__mode' + (form.status === mode.value ? ' is-selected' : '')
            }
          >
            <input
              type="radio"
              name="publication-mode"
              value={mode.value}
              checked={form.status === mode.value}
              onChange={() => onChange('status', mode.value)}
            />
            <span>
              <strong>{mode.title}</strong>
              <small>{mode.detail}</small>
            </span>
          </label>
        ))}
      </fieldset>
      {form.status === 'scheduled' && (
        <div className="article-publication-panel__schedule">
          <label htmlFor="article-scheduled-at">Дата и время, Москва</label>
          <input
            id="article-scheduled-at"
            type="datetime-local"
            value={form.scheduledAt || ''}
            min={minimum}
            onChange={event => onChange('scheduledAt', event.target.value)}
            onInput={event => onChange('scheduledAt', event.currentTarget.value)}
            required
          />
          <div className="article-publication-panel__shortcuts">
            <button type="button" onClick={() => chooseShortcut()}>
              Через час
            </button>
            <button type="button" onClick={() => chooseShortcut(true)}>
              Завтра, 09:00
            </button>
          </div>
          <p>
            {instant
              ? `Начало публикации: ${formatPublicationDate(instant)} МСК.`
              : 'Выберите время начала публикации.'}{' '}
            После обновления сайта статья появится в блоге и карте сайта. Закрывать админку можно.
          </p>
        </div>
      )}
      <a className="article-publication-panel__manager" href="/admin/publications">
        Открыть план публикаций <ArrowIcon />
      </a>
    </section>
  );
}
