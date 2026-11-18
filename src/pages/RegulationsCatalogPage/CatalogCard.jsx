import './CatalogCard.css';

export default function CatalogCard({ card }) {
  return (
    <a className="regulations-catalog-card" href={card.url}>
      <span className="regulations-catalog-card__regulation">{card.regulation}</span>
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <span className="regulations-catalog-card__link">
        Подробнее <span aria-hidden="true">↗</span>
      </span>
    </a>
  );
}
