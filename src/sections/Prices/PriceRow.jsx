import './Prices.css';

export default function PriceRow({ item, onServiceSelect }) {
  return (
    <article className={`price-row${item.featured ? ' price-row--featured' : ''}`}>
      <div className="price-row__index" aria-hidden="true">
        {item.number}
      </div>

      <div className="price-row__service">
        {item.label ? <span className="price-row__label">{item.label}</span> : null}
        <h3>{item.title}</h3>
        {item.description ? <p>{item.description}</p> : null}
      </div>

      <div className="price-row__value">
        <div className="price-row__price-line">
          {item.pricePrefix ? <span className="price-row__prefix">{item.pricePrefix}</span> : null}
          <strong>{item.price}</strong>
        </div>
        {item.note ? <span className="price-row__note">{item.note}</span> : null}
      </div>

      <a
        className="price-row__action"
        href={onServiceSelect ? '#lead-form' : '#contact'}
        aria-label={`Заказать: ${item.title}`}
        onClick={onServiceSelect ? () => onServiceSelect(item.service) : undefined}
      >
        <span>Заказать</span>
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
