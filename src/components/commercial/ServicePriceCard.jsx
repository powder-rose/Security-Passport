import ServiceAction from './ServiceAction';
import './ServicePriceCard.css';

export default function ServicePriceCard({ item, onServiceSelect, layout = 'card', description }) {
  const emphasized = item.featured || layout === 'primary';

  return (
    <article
      className={`service-price-card service-price-card--${layout}${item.featured ? ' service-price-card--featured' : ''}${description ? ' service-price-card--described' : ''}`}
      data-scroll-reveal
    >
      <span className="service-price-card__number" data-number={item.number} aria-hidden="true" />
      <h3>{item.title}</h3>
      {description ? <p className="service-price-card__description">{description}</p> : null}
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
