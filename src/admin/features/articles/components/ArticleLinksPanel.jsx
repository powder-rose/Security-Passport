export default function ArticleLinksPanel({ links, onFocus, onEdit, onRemove }) {
  return (
    <div className="article-links-panel">
      <div className="article-links-panel__head">
        <strong>Ссылки в статье</strong>

        <span>{links.length}</span>
      </div>

      {links.length === 0 ? (
        <div className="article-links-panel__empty">В тексте статьи ссылок нет.</div>
      ) : (
        <div className="article-links-panel__list">
          {links.map((link, index) => (
            <div key={`${link.from}-${link.to}-${link.href}`} className="article-links-panel__item">
              <button
                type="button"
                className="article-links-panel__info"
                title="Выделить ссылку в тексте"
                onClick={() => onFocus(link)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>

                <div>
                  <strong>{link.text.trim() || 'Ссылка без текста'}</strong>

                  <small>{link.href}</small>
                </div>
              </button>

              <div className="article-links-panel__actions">
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  Открыть ↗
                </a>

                <button type="button" onClick={() => onEdit(link)}>
                  Изменить
                </button>

                <button
                  type="button"
                  className="is-danger"
                  onClick={() => {
                    const ok = window.confirm('Удалить ссылку? Текст останется.');

                    if (ok) {
                      onRemove(link);
                    }
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
