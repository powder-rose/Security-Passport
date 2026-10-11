import './BlogPublicationStatus.css';

const STATUS_COPY = {
  queued: {
    label: 'Публикация ожидает запуска',
    detail: 'Изменения сохранены и поставлены в очередь.',
  },

  running: {
    label: 'Публикация выполняется',
    detail: 'Обновляется публичная версия блога.',
  },

  success: {
    label: 'Публикация завершена',
    detail: 'Последние изменения доступны в публичной версии.',
  },

  error: {
    label: 'Ошибка публикации',
    detail: 'Изменения сохранены, но публичную версию обновить не удалось.',
  },

  unavailable: {
    label: 'Статус публикации недоступен',
    detail: 'Не удалось получить актуальное состояние публикации.',
  },
};

export default function BlogPublicationStatus({ publication, retrying, onRetry }) {
  if (!publication || publication.status === 'idle') {
    return null;
  }

  const copy = STATUS_COPY[publication.status];

  if (!copy) {
    return null;
  }

  const detail =
    publication.status === 'error' && publication.error ? publication.error : copy.detail;

  return (
    <div className={`blog-publication blog-publication--${publication.status}`} role="status">
      <div className="blog-publication__copy">
        <strong>{copy.label}</strong>

        <span>{detail}</span>
      </div>

      {publication.status === 'error' && (
        <button
          type="button"
          className="blog-publication__retry"
          onClick={onRetry}
          disabled={retrying}
        >
          {retrying ? 'Запуск...' : 'Повторить'}
        </button>
      )}
    </div>
  );
}
