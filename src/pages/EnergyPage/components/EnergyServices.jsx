import ServicePriceCard from '../../../components/commercial/ServicePriceCard';
import { EnergyAction, EnergyHeading, EnergyParagraphs, EnergySubheading } from './EnergyContent';
import EnergyTable from './EnergyTable';
import './EnergyServices.css';

export function EnergyServiceScope({ section }) {
  return (
    <>
      <div className="energy-section-lead">
        <EnergyHeading section={section} />
        <div className="energy-copy">
          <EnergySubheading>{section.subheading}</EnergySubheading>
          <p className="energy-paragraph">{section.intro}</p>
        </div>
      </div>
      <EnergyTable headers={section.headers} rows={section.rows} label={section.title} />
      <div className="energy-service-footer">
        <EnergyParagraphs items={section.paragraphs} />
      </div>
    </>
  );
}

export function EnergyPricing({ section, onServiceSelect }) {
  const [primary, ...additional] = section.items;

  return (
    <>
      <div className="energy-section-lead">
        <EnergyHeading section={section} />
        <p className="energy-paragraph">{section.paragraphs[0]}</p>
      </div>
      <div className="energy-pricing-layout">
        <ServicePriceCard item={primary} onServiceSelect={onServiceSelect} layout="primary" />
        <div className="energy-price-rows">
          {additional.map(item => (
            <ServicePriceCard
              key={item.title}
              item={item}
              onServiceSelect={onServiceSelect}
              layout="row"
            />
          ))}
        </div>
      </div>
      <div className="energy-price-conditions">
        <EnergySubheading>{section.subheading}</EnergySubheading>
        <div className="energy-price-conditions__cases">
          {section.paragraphs.slice(1, 3).map(text => (
            <p className="energy-paragraph" key={text}>
              {text}
            </p>
          ))}
        </div>
        <p className="energy-paragraph">{section.paragraphs[3]}</p>
        <EnergyAction action={section.action} onServiceSelect={onServiceSelect} secondary />
      </div>
    </>
  );
}

export function EnergyRequiredDocuments({ section, onServiceSelect }) {
  return (
    <>
      <div className="energy-split-layout">
        <div className="energy-section-intro">
          <EnergyHeading section={section} />
          <p className="energy-paragraph">{section.intro}</p>
          <EnergyAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
        <dl className="energy-documents">
          {section.items.map((item, index) => (
            <div className="energy-document" key={item.title} data-scroll-reveal>
              <span
                className="energy-document__number"
                data-number={String(index + 1).padStart(2, '0')}
                aria-hidden="true"
              />
              <dt>{item.title}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="energy-documents-note">
        {section.paragraphs.map(text => (
          <p className="energy-paragraph" key={text}>
            {text}
          </p>
        ))}
      </div>
    </>
  );
}
