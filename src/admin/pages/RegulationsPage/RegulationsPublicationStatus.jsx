export default function RegulationsPublicationStatus({ publication, onRetry }) {
  if (!publication) {
    return null;
  }

  const label = {
    queued: 'Публикация ожидает сборки',
    publishing: 'Публикация выполняется',
    published: 'Публикация сайта завершена',
    unpublished: 'Есть неопубликованные изменения',
    failed: 'Ошибка публикации',
  }[publication.phase];

  if (!label) {
    return null;
  }

  return (
    <div
      className={`regulations-publication regulations-publication--${publication.phase}`}
      role="status"
    >
      <span>{label}</span>

      {publication.phase === 'failed' && (
        <button type="button" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}
