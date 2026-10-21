import { EnergyAction, EnergyHeading, EnergyParagraphs } from './EnergyContent';
import './EnergyOffers.css';

export default function EnergyOffers({ section, onServiceSelect }) {
  return (
    <>
      <EnergyHeading section={section} />
      <div className="energy-offers">
        {section.offers.map((offer, index) => (
          <article className="energy-offer" key={offer.title} data-scroll-reveal>
            <span
              className="energy-offer__number"
              data-number={String(index + 1).padStart(2, '0')}
              aria-hidden="true"
            />
            <h3>{offer.title}</h3>
            <EnergyParagraphs items={offer.paragraphs} />
            <div className="energy-offer__footer">
              <p className="energy-offer__price">
                {offer.priceText.replace('9 500 ₽', '9\u00a0500\u00a0₽')}
              </p>
              {offer.note ? <p className="energy-paragraph">{offer.note}</p> : null}
              <EnergyAction
                action={offer.action}
                onServiceSelect={onServiceSelect}
                accent={index === 0}
              />
            </div>
          </article>
        ))}
      </div>
      <div className="energy-note">
        <p className="energy-paragraph">{section.note}</p>
      </div>
    </>
  );
}
