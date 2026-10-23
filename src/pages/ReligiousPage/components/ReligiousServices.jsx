import ServicePriceCard from '../../../components/commercial/ServicePriceCard';
import {
  ReligiousAction,
  ReligiousDisclosure,
  ReligiousHeading,
  ReligiousList,
  ReligiousParagraphs,
  ReligiousPriceText,
  ReligiousSubheading,
} from './ReligiousContent';
import ReligiousTable from './ReligiousTable';
import './ReligiousServices.css';

export function ReligiousExaminationAct({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <div className="religious-intro">
          <ReligiousHeading section={section} />
          <ReligiousParagraphs items={section.paragraphs} />
          <p className="religious-paragraph religious-note">{section.term}</p>
        </div>

        <div className="religious-stack">
          <div className="religious-act__document" data-scroll-reveal>
            <ReligiousSubheading>{section.subheading}</ReligiousSubheading>
            <table className="religious-act__table" aria-label={section.subheading}>
              <thead>
                <tr>
                  {section.table.headers.map(header => (
                    <th key={header} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map(row => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="religious-paragraph">{section.note}</p>
        </div>
      </div>

      <div className="religious-act__details" data-scroll-reveal>
        <ReligiousDisclosure title={section.listIntro}>
          <ReligiousList items={section.items} />
        </ReligiousDisclosure>
        <ReligiousDisclosure title={section.service.title}>
          <ReligiousParagraphs items={section.service.paragraphs} />
          <ReligiousList items={section.service.items} />
        </ReligiousDisclosure>
      </div>

      <div className="religious-act__order" data-scroll-reveal>
        <p className="religious-act__price">
          <ReligiousPriceText text={section.service.priceText} />
        </p>
        <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} accent />
      </div>
    </>
  );
}

export function ReligiousServiceScope({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <ReligiousHeading section={section} />
        <div data-scroll-reveal>
          <ReligiousParagraphs items={section.paragraphs} />
        </div>
      </div>

      <div className="religious-stack">
        <ReligiousSubheading>{section.subheading}</ReligiousSubheading>
        <div className="religious-services__grid">
          {section.items.map((item, index) => (
            <article className="religious-services__item" key={item.title} data-scroll-reveal>
              <span className="religious-services__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="religious-services__copy">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="religious-services__footer" data-scroll-reveal>
        <ReligiousParagraphs items={section.notes} />
        <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}

export function ReligiousPricing({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-pricing__intro">
        <ReligiousHeading section={section} />
        <p className="religious-paragraph" data-scroll-reveal>
          {section.paragraphs[0]}
        </p>
      </div>

      <div className="service-price-cards">
        {section.items.map(item => (
          <ServicePriceCard key={item.title} item={item} onServiceSelect={onServiceSelect} />
        ))}
      </div>

      <div className="religious-pricing__context" data-scroll-reveal>
        <ReligiousDisclosure title={section.subheading}>
          <ReligiousParagraphs items={section.paragraphs.slice(1)} />
        </ReligiousDisclosure>
        <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}

export function ReligiousRequiredDocuments({ section, onServiceSelect }) {
  return (
    <div className="religious-split">
      <div className="religious-intro">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs} />
        <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>

      <div className="religious-stack">
        <div data-scroll-reveal>
          <ReligiousTable table={section.table} label={section.title} />
        </div>
        <div className="religious-documents__notes religious-note" data-scroll-reveal>
          <ReligiousParagraphs items={section.notes} />
        </div>
      </div>
    </div>
  );
}
