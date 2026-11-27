import { useEffect, useRef, useState } from 'react';

export default function ArticleDocumentDialog({ title, editing, onSave, onRemove, onClose }) {
  const dialogRef = useRef(null);
  const [value, setValue] = useState(title);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  function save(event) {
    event.preventDefault();

    if (!value.trim()) {
      setError('Укажите название документа.');
      return;
    }

    if (!onSave(value)) {
      setError('Выделите отдельные абзацы, не часть таблицы или строки.');
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="article-document-dialog"
      aria-labelledby="article-document-dialog-title"
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
    >
      <form onSubmit={save}>
        <p className="article-document-dialog__eyebrow">Редактор статей</p>
        <h2 id="article-document-dialog-title">
          {editing ? 'Настроить документ' : 'Врезка документа'}
        </h2>
        <p>Образец будет оформлен отдельной карточкой с раскрытием текста и кнопкой запроса.</p>
        <label htmlFor="article-document-name">
          Название документа
          <input
            id="article-document-name"
            autoFocus
            value={value}
            onChange={event => setValue(event.target.value)}
            maxLength={160}
            placeholder="Например: Акт обследования и категорирования"
            required
          />
        </label>
        <p>Текст внутри врезки можно редактировать как обычную статью, включая списки и таблицы.</p>
        {error && (
          <p className="article-document-dialog__error" role="alert">
            {error}
          </p>
        )}
        <div className="article-document-dialog__actions">
          {onRemove && (
            <button type="button" onClick={onRemove}>
              Убрать оформление
            </button>
          )}
          <button type="button" onClick={onClose}>
            Отмена
          </button>
          <button type="submit">{editing ? 'Сохранить' : 'Вставить документ'}</button>
        </div>
      </form>
    </dialog>
  );
}
