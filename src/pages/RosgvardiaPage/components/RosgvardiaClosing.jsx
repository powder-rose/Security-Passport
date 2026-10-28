import FAQList from '../../../sections/FAQ/FAQList';
import {
  RosgvardiaHeading,
  RosgvardiaLink,
  RosgvardiaNote,
  RosgvardiaParagraphs,
} from './RosgvardiaContent';
import RosgvardiaTable from './RosgvardiaTable';
import './RosgvardiaClosing.css';

export function RosgvardiaComparison({ section }) {
  return (
    <>
      <div className="rosgvardia-split">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
      </div>
      <RosgvardiaTable table={section.table} label={section.title} comparison />
      <RosgvardiaNote>{section.note}</RosgvardiaNote>
      <RosgvardiaLink link={section.link} />
    </>
  );
}

export function RosgvardiaInspections({ section }) {
  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
      </div>
      <div className="rosgvardia-stack">
        <ul className="rosgvardia-inspection-facts">
          {section.facts.map((fact, index) => (
            <li key={fact} data-scroll-reveal>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <p>{fact}</p>
            </li>
          ))}
        </ul>
        <RosgvardiaParagraphs items={section.notes} />
      </div>
    </div>
  );
}

export function RosgvardiaStandard({ section }) {
  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
      </div>
      <div className="rosgvardia-stack">
        <RosgvardiaParagraphs items={section.paragraphs} />
        <RosgvardiaNote>{section.note}</RosgvardiaNote>
      </div>
    </div>
  );
}

export function RosgvardiaAdvantages({ section }) {
  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
        <RosgvardiaLink link={{ href: '/', label: 'Паспорт безопасности объекта' }} />
      </div>
      <ol className="rosgvardia-advantages">
        {section.items.map((item, index) => (
          <li key={item} data-scroll-reveal>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function RosgvardiaFaq({ section }) {
  const items = section.items.map((item, index) => ({
    ...item,
    id: `rosgvardia-${index + 1}`,
  }));

  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
      </div>
      <div className="rosgvardia-faq">
        <FAQList items={items} compact />
      </div>
    </div>
  );
}
