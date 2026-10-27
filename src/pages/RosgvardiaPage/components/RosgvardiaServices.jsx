import ServicePriceCard from '../../../components/commercial/ServicePriceCard';
import {
  RosgvardiaAction,
  RosgvardiaHeading,
  RosgvardiaNote,
  RosgvardiaParagraphs,
} from './RosgvardiaContent';
import './RosgvardiaServices.css';

export function RosgvardiaServiceScope({ section }) {
  return (
    <>
      <div className="rosgvardia-split">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
      </div>
      <dl className="rosgvardia-service-results">
        {section.items.map((item, index) => (
          <div className="rosgvardia-service-result" key={item.title} data-scroll-reveal>
            <dt>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {item.title}
            </dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>
      <RosgvardiaNote>{section.note}</RosgvardiaNote>
    </>
  );
}

export function RosgvardiaPricing({ section, onServiceSelect }) {
  return (
    <>
      <RosgvardiaHeading section={section} />
      <div className="rosgvardia-prices">
        {section.items.map(item => (
          <ServicePriceCard key={item.service} item={item} onServiceSelect={onServiceSelect} />
        ))}
      </div>
      <div className="rosgvardia-price-notes">
        <RosgvardiaParagraphs items={section.paragraphs} />
        <RosgvardiaAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}

export function RosgvardiaDocuments({ section }) {
  return (
    <>
      <div className="rosgvardia-split">
        <RosgvardiaHeading section={section} />
        <RosgvardiaNote>{section.note}</RosgvardiaNote>
      </div>
      <dl className="rosgvardia-documents">
        {section.items.map(item => (
          <div className="rosgvardia-document" key={item.title} data-scroll-reveal>
            <dt>{item.title}</dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
