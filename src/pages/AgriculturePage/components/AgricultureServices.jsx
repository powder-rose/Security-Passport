import ServicePriceCard from '../../../components/commercial/ServicePriceCard';
import {
  AgricultureAction,
  AgricultureHeading,
  AgricultureParagraphs,
  AgricultureSubheading,
} from './AgricultureContent';
import './AgricultureServices.css';

export function AgricultureServiceScope({ section, onServiceSelect }) {
  return (
    <>
      <div className="agriculture-section-lead">
        <AgricultureHeading section={section} />
        <div className="agriculture-copy" data-scroll-reveal>
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs} />
        </div>
      </div>

      <ul className="agriculture-deliverables">
        {section.items.map((item, index) => (
          <li className="agriculture-deliverable" key={item.title} data-scroll-reveal>
            <span
              className="agriculture-deliverable__number"
              data-number={String(index + 1).padStart(2, '0')}
              aria-hidden="true"
            />
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="agriculture-service-footer" data-scroll-reveal>
        <AgricultureParagraphs items={section.notes} />
        <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}

export function AgriculturePricing({ section, onServiceSelect }) {
  return (
    <>
      <AgricultureHeading section={section} />

      <div className="service-price-cards">
        {section.items.map(item => (
          <ServicePriceCard key={item.title} item={item} onServiceSelect={onServiceSelect} />
        ))}
      </div>

      <details className="agriculture-price-disclosure" data-scroll-reveal>
        <summary>
          <AgricultureSubheading>{section.context.title}</AgricultureSubheading>
        </summary>
        <div className="agriculture-price-disclosure__body">
          <AgricultureParagraphs items={section.context.paragraphs} />
        </div>
      </details>

      <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
    </>
  );
}

export function AgricultureRequiredDocuments({ section, onServiceSelect }) {
  return (
    <>
      <div className="agriculture-section-lead">
        <AgricultureHeading section={section} />
        <div className="agriculture-copy" data-scroll-reveal>
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <p className="agriculture-paragraph">{section.intro}</p>
        </div>
      </div>

      <dl className="agriculture-document-grid">
        {section.items.map(item => (
          <div className="agriculture-document-item" key={item.title} data-scroll-reveal>
            <dt>{item.title}</dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>

      <div className="agriculture-service-footer" data-scroll-reveal>
        <AgricultureParagraphs items={section.notes} />
        <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}
