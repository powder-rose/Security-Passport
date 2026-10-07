import './RegulationsList.css';

import { reviewReminder } from './regulationsModel.js';

export default function RegulationsList({ items, expanded, onOpen, onCreate }) {
  return (
    <>
      {expanded && (
        <div className="regulations-list">
          {items.map(item => (
            <button
              type="button"
              className="regulations-list__row"
              key={item.number}
              onClick={() => onOpen(item)}
            >
              <span className="regulations-list__name">Постановление №{item.number}</span>

              <span className="regulations-list__status">{reviewReminder(item)}</span>
            </button>
          ))}
        </div>
      )}

      <button type="button" className="regulations-add" onClick={onCreate}>
        <span className="regulations-add__label">Добавить постановление</span>

        <span className="regulations-add__plus" aria-hidden="true">
          +
        </span>
      </button>
    </>
  );
}
