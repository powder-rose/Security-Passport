export default function CatalogCardEditor({ card, pages, onChange, onRemove }) {
  const available = pages.some(page => page.url === card.url);
  return (
    <div className="admin-catalog-panel admin-catalog-fields">
      <h2>Карточка направления</h2>
      {Object.entries({
        title: 'Название',
        regulation: 'Номер ПП',
        description: 'Краткое описание',
      }).map(([key, label]) => (
        <div className="admin-catalog-field" key={key}>
          <label htmlFor={`catalog-card-${key}`}>{label}</label>
          <textarea
            id={`catalog-card-${key}`}
            rows={key === 'description' ? 3 : 2}
            value={card[key]}
            onChange={event => onChange({ ...card, [key]: event.target.value })}
            required
          />
        </div>
      ))}
      <label>
        <span>URL коммерческой страницы</span>
        <input
          list="catalog-published-pages"
          value={card.url}
          placeholder="/pasport-bezopasnosti-…/"
          onChange={event => onChange({ ...card, url: event.target.value })}
          required
        />
      </label>
      <datalist id="catalog-published-pages">
        {pages.map(page => (
          <option key={page.url} value={page.url} />
        ))}
      </datalist>
      {!available && (
        <p className="admin-catalog-warning">
          По этому адресу не найдена опубликованная индексируемая коммерческая страница. Видимую
          карточку сохранить нельзя.
        </p>
      )}
      <label>
        <span>Порядок в каталоге</span>
        <input
          type="number"
          min="0"
          max="100000"
          step="1"
          value={card.order}
          onChange={event => onChange({ ...card, order: Number(event.target.value) })}
          required
        />
      </label>
      <label className="admin-catalog-toggle">
        <input
          type="checkbox"
          checked={card.showInCatalog}
          onChange={event => onChange({ ...card, showInCatalog: event.target.checked })}
        />
        <span>Показывать в каталоге</span>
      </label>
      <label className="admin-catalog-toggle">
        <input
          type="checkbox"
          checked={card.showInMenu}
          onChange={event => onChange({ ...card, showInMenu: event.target.checked })}
        />
        <span>Показывать в основном меню</span>
      </label>
      <p className="admin-catalog-hint">
        Перед включением проверьте номер постановления, его действие и область применения. Новое
        направление не добавляется в меню автоматически.
      </p>
      <button type="button" onClick={onRemove}>
        Удалить карточку
      </button>
    </div>
  );
}
