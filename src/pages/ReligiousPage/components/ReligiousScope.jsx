import {
  ReligiousAction,
  ReligiousDisclosure,
  ReligiousHeading,
  ReligiousList,
  ReligiousParagraphs,
  ReligiousSubheading,
} from './ReligiousContent';
import './ReligiousScope.css';

export function ReligiousObjects({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs} />
      </div>

      <div className="religious-objects">
        {section.items.map((item, index) => (
          <article className="religious-object" key={item.title} data-scroll-reveal>
            <span className="religious-object__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <ReligiousSubheading>{item.title}</ReligiousSubheading>
            <p className="religious-paragraph">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="religious-applicability">
        <div className="religious-applicability__heading" data-scroll-reveal>
          <ReligiousSubheading>{section.applicability.title}</ReligiousSubheading>
          <p className="religious-applicability__answer">{section.applicability.paragraphs[0]}</p>
          <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
        <ReligiousParagraphs items={section.applicability.paragraphs.slice(1)} />
      </div>
    </>
  );
}

export function ReligiousRegulations({ section }) {
  return (
    <div className="religious-regulations">
      <aside className="religious-regulations__identity" data-scroll-reveal>
        <span>Постановление Правительства РФ</span>
        <strong>№ 1165</strong>
        <time dateTime="2019-09-05">05.09.2019</time>
      </aside>

      <div className="religious-stack">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs} />
        <ReligiousDisclosure title={section.disclosureTitle}>
          <ReligiousList items={section.items} />
        </ReligiousDisclosure>
        <div className="religious-note">
          <ReligiousParagraphs items={section.notes} />
        </div>
      </div>
    </div>
  );
}

export function ReligiousCategorization({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs} />
      </div>

      <div className="religious-stack">
        <ReligiousSubheading>{section.subheading}</ReligiousSubheading>
        <div className="religious-categories">
          {section.table.rows.map((row, index) => (
            <article className="religious-category" key={row[0]} data-scroll-reveal>
              <p className="religious-category__name">
                <span aria-hidden="true">{['I', 'II', 'III'][index]}</span>
                <strong>{row[0]}</strong>
              </p>
              <p className="religious-category__criterion">{section.table.headers[1]}</p>
              <p className="religious-category__value">{row[1]}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="religious-calculation">
        <div className="religious-stack">
          <ReligiousSubheading>{section.calculation.title}</ReligiousSubheading>
          <ReligiousParagraphs items={section.calculation.paragraphs} />
        </div>
        <div className="religious-stack">
          <p className="religious-calculation__label">{section.calculation.table.headers[1]}</p>
          <dl className="religious-calculation__metrics">
            {section.calculation.table.rows.map(row => (
              <div key={row[0]} data-scroll-reveal>
                <dt>{row[0]}</dt>
                <dd>{row[1]}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="religious-calculation__notes">
          <ReligiousParagraphs items={section.calculation.notes} />
        </div>
      </div>

      <div className="religious-split">
        <div className="religious-stack">
          <ReligiousSubheading>{section.uncategorized.title}</ReligiousSubheading>
          <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
        <ReligiousParagraphs items={section.uncategorized.paragraphs} />
      </div>
    </>
  );
}
