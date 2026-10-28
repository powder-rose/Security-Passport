import {
  RosgvardiaAction,
  RosgvardiaHeading,
  RosgvardiaNote,
  RosgvardiaParagraphs,
} from './RosgvardiaContent';
import './RosgvardiaScope.css';

export function RosgvardiaObjects({ section, onServiceSelect }) {
  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
        <RosgvardiaAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
      <div className="rosgvardia-stack">
        <RosgvardiaParagraphs items={section.paragraphs} />
        <RosgvardiaNote>{section.note}</RosgvardiaNote>
        <RosgvardiaParagraphs items={section.notes} />
      </div>
    </div>
  );
}

export function RosgvardiaRegulations({ section }) {
  return (
    <>
      <div className="rosgvardia-split">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
      </div>
      <ul className="rosgvardia-regulation-facts" aria-label="Основные требования">
        {section.facts.map(fact => (
          <li key={fact} data-scroll-reveal>
            {fact}
          </li>
        ))}
      </ul>
      <div className="rosgvardia-stack">
        <RosgvardiaNote>{section.note}</RosgvardiaNote>
        <RosgvardiaParagraphs items={section.notes} />
      </div>
    </>
  );
}

export function RosgvardiaCategories({ section }) {
  return (
    <>
      <div className="rosgvardia-split">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
      </div>
      <div className="rosgvardia-stack">
        <h3 className="rosgvardia-subheading">{section.subheading}</h3>
        <ol className="rosgvardia-categories">
          {section.table.rows.map(row => (
            <li className="rosgvardia-category" key={row[0]} data-scroll-reveal>
              <div className="rosgvardia-category__head">
                <span>{section.table.headers[0]}</span>
                <strong>{row[0]}</strong>
              </div>
              <dl className="rosgvardia-category__details">
                <div>
                  <dt>{section.table.headers[1]}</dt>
                  <dd>{row[1]}</dd>
                </div>
                <div>
                  <dt>{section.table.headers[2]}</dt>
                  <dd>{row[2]}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
      <RosgvardiaParagraphs items={section.notes} />
    </>
  );
}
