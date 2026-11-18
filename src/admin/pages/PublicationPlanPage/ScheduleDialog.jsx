import { useEffect, useRef, useState } from 'react';
import {
  formatPublicationDate,
  fromMoscowDateTimeInput,
  toMoscowDateTimeInput,
} from '../../../../shared/contracts/article-schedule.js';

const copy = {
  schedule: {
    title: 'Перенести публикацию',
    button: 'Сохранить время',
    description: 'Выберите новое время по Москве.',
  },
  cancel: {
    title: 'Снять с расписания?',
    button: 'Вернуть в черновики',
    description: 'Статья сохранится в черновиках. Её можно будет запланировать снова.',
  },
  publish: {
    title: 'Опубликовать сейчас?',
    button: 'Начать публикацию',
    description: 'Статья выйдет после обновления сайта, без ожидания запланированного времени.',
  },
  retry: {
    title: 'Повторить публикацию?',
    button: 'Повторить публикацию',
    description: 'Сервер ещё раз попробует обновить публичную версию статьи.',
  },
};

export default function ScheduleDialog({ record, action, busy, onSubmit, onClose }) {
  const dialogRef = useRef(null);
  const [value, setValue] = useState(() => toMoscowDateTimeInput(record.schedule.at));
  const [error, setError] = useState('');
  const [minimum] = useState(() => toMoscowDateTimeInput(Date.now() + 60_000));
  useEffect(() => {
    const element = dialogRef.current;
    element.showModal();
    return () => element.close();
  }, []);
  async function submit(event) {
    event.preventDefault();
    const at = fromMoscowDateTimeInput(new FormData(event.currentTarget).get('scheduledAt'));
    if (action === 'schedule' && (!at || Date.parse(at) <= Date.now())) {
      setError('Выберите будущую дату и время.');
      return;
    }
    setError('');
    try {
      await onSubmit(record, action, at);
    } catch (failure) {
      setError(failure.message || 'Не удалось выполнить действие.');
    }
  }
  const text = copy[action];
  return (
    <dialog
      ref={dialogRef}
      className="publication-dialog"
      aria-labelledby="publication-dialog-title"
      onCancel={event => {
        if (busy) event.preventDefault();
        else onClose();
      }}
    >
      <form onSubmit={submit}>
        <div className="publication-dialog__eyebrow">
          План публикаций <span>МСК · UTC+3</span>
        </div>
        <h2 id="publication-dialog-title">{text.title}</h2>
        <p className="publication-dialog__article">{record.title || 'Без заголовка'}</p>
        <p>{text.description}</p>
        {action === 'schedule' ? (
          <label>
            Дата и время, Москва
            <input
              type="datetime-local"
              name="scheduledAt"
              value={value}
              onChange={event => setValue(event.target.value)}
              onInput={event => setValue(event.currentTarget.value)}
              min={minimum}
              required
              autoFocus
            />
          </label>
        ) : (
          <p className="publication-dialog__date">
            По плану: {formatPublicationDate(record.schedule.at)} МСК
          </p>
        )}
        {error && (
          <p className="publication-plan__error" role="alert">
            {error}
          </p>
        )}
        <div className="publication-dialog__actions">
          <button type="button" onClick={onClose} disabled={busy}>
            Отмена
          </button>
          <button className="publication-plan__primary" type="submit" disabled={busy}>
            {busy ? 'Сохранение…' : text.button}
          </button>
        </div>
      </form>
    </dialog>
  );
}
