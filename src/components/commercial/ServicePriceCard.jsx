import ServiceAction from './ServiceAction';
import './ServicePriceCard.css';

export default function ServicePriceCard({ item, onServiceSelect, layout = 'card' }) {
  const emphasized = item.featured || layout === 'primary';

  return (
    <article
      className={`service-price-card service-price-card--${layout}${item.featured ? ' service-price-card--featured' : ''}`}
      data-scroll-reveal
    >
      <span className="service-price-card__number" data-number={item.number} aria-hidden="true" />
      <h3>{item.title}</h3>
      <div className="service-price-card__price-line">
        {item.pricePrefix ? <span>{item.pricePrefix}</span> : null}
        <strong>{item.price}</strong>
      </div>
      <ServiceAction
        service={item.service}
        onSelect={onServiceSelect}
        ariaLabel={`Заказать: ${item.title}`}
        secondary={!emphasized}
        accent={emphasized}
      >
        Заказать
      </ServiceAction>
    </article>
  );
}
