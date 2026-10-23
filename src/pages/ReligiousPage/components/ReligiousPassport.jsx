import {
  ReligiousAction,
  ReligiousHeading,
  ReligiousLink,
  ReligiousParagraphs,
  ReligiousSubheading,
} from './ReligiousContent';
import './ReligiousPassport.css';

export function ReligiousPassportForm({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs} />
      </div>

      <div className="religious-passport-form">
        <div className="religious-passport-form__contents" data-scroll-reveal>
          <ReligiousSubheading>{section.subheading}</ReligiousSubheading>
          <ol className="religious-passport-form__sections" aria-label={section.table.headers[1]}>
            {section.table.rows.map(row => (
              <li key={row[0]}>
                <span aria-hidden="true">{row[0]}</span>
                <p>{row[1]}</p>
              </li>
            ))}
          </ol>
          <ReligiousParagraphs items={section.notes} />
        </div>

        <div className="religious-passport-form__sample">
          <ReligiousSubheading>{section.sample.title}</ReligiousSubheading>
          <ReligiousParagraphs items={section.sample.paragraphs} />
          <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
      </div>
    </>
  );
}

export function ReligiousRestrictedDocuments({ section }) {
  return (
    <div className="religious-split">
      <div className="religious-intro">
        <ReligiousHeading section={section} />
        <span className="religious-protection-mark" aria-hidden="true">
          § 26
        </span>
      </div>
      <div className="religious-stack">
        <ReligiousParagraphs items={section.paragraphs.slice(0, 2)} />
        <div className="religious-protection-copy">
          <ReligiousParagraphs items={section.paragraphs.slice(2)} />
        </div>
      </div>
    </div>
  );
}

export function ReligiousActualization({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <div className="religious-intro">
          <ReligiousHeading section={section} />
          <ReligiousParagraphs items={section.paragraphs} />
          <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
          <ReligiousLink link={section.link} />
        </div>

        <div className="religious-stack">
          <p className="religious-paragraph">{section.listIntro}</p>
          <ol className="religious-actualization-items">
            {section.items.map((item, index) => (
              <li key={item} data-scroll-reveal>
                <span aria-hidden="true">{index + 1}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
          <p className="religious-paragraph">{section.note}</p>
        </div>
      </div>

      <div className="religious-validity" data-scroll-reveal>
        <ReligiousSubheading>{section.validity.title}</ReligiousSubheading>
        <ReligiousParagraphs items={section.validity.paragraphs} />
      </div>
    </>
  );
}

export function ReligiousMeasures({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs} />
      </div>

      <div className="religious-stack">
        <ReligiousSubheading>{section.subheading}</ReligiousSubheading>
        <div className="religious-measures" aria-label={section.table.headers[1]}>
          {section.table.rows.map(row => (
            <article className="religious-measure" key={row[0]} data-scroll-reveal>
              <p className="religious-measure__category">
                <span>{section.table.headers[0]}</span>
                <strong>{row[0]}</strong>
              </p>
              <p className="religious-measure__text">{row[1]}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="religious-split">
        <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
        <ReligiousParagraphs items={section.notes} />
      </div>
    </>
  );
}
