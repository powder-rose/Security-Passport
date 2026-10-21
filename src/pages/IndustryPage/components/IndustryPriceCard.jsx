import IndustryAction from './IndustryAction';
import './IndustryPriceCard.css';

export default function IndustryPriceCard({ item, onServiceSelect }) {
  return (
    <article
      className={`industry-price-card${item.featured ? ' industry-price-card--featured' : ''}`}
      data-industry-reveal
    >
      <span className="industry-price-card__number" data-number={item.number} aria-hidden="true" />
      <h3>{item.title}</h3>
      <div className="industry-price-card__price-line">
        {item.pricePrefix ? <span>{item.pricePrefix}</span> : null}
        <strong>{item.price}</strong>
      </div>
      <IndustryAction
        service={item.service}
        onSelect={onServiceSelect}
        ariaLabel={`Заказать: ${item.title}`}
        secondary={!item.featured}
        accent={item.featured}
      >
        Заказать
      </IndustryAction>
    </article>
  );
}
