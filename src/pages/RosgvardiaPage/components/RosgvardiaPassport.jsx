import {
  RosgvardiaAction,
  RosgvardiaDisclosure,
  RosgvardiaHeading,
  RosgvardiaLink,
  RosgvardiaList,
  RosgvardiaNote,
  RosgvardiaParagraphs,
} from './RosgvardiaContent';
import './RosgvardiaPassport.css';

export function RosgvardiaAct({ section }) {
  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
        <RosgvardiaLink link={section.link} />
      </div>
      <div className="rosgvardia-stack">
        <dl className="rosgvardia-act-facts" data-scroll-reveal>
          {section.table.rows.map(row => (
            <div key={row[0]}>
              <dt>{row[0]}</dt>
              <dd>{row[1]}</dd>
            </div>
          ))}
        </dl>
        <div className="rosgvardia-stack">
          <h3 className="rosgvardia-subheading">{section.listIntro}</h3>
          <RosgvardiaList items={section.items} />
        </div>
      </div>
    </div>
  );
}

export function RosgvardiaConfidentiality({ section }) {
  return (
    <>
      <div className="rosgvardia-split">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
      </div>
      <div className="rosgvardia-confidentiality-details">
        <div className="rosgvardia-stack">
          <h3 className="rosgvardia-subheading">{section.listIntro}</h3>
          <RosgvardiaList items={section.items} />
        </div>
        <div className="rosgvardia-stack">
          <RosgvardiaParagraphs items={section.notes.slice(0, 1)} />
          <RosgvardiaNote>{section.notes[1]}</RosgvardiaNote>
        </div>
      </div>
    </>
  );
}

export function RosgvardiaForm({ section, onServiceSelect }) {
  return (
    <>
      <div className="rosgvardia-split">
        <RosgvardiaHeading section={section} />
        <div className="rosgvardia-stack">
          <RosgvardiaParagraphs items={section.paragraphs} />
          <RosgvardiaAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
      </div>
      <RosgvardiaDisclosure title={section.listIntro}>
        <ol className="rosgvardia-form-sections">
          {section.items.map((item, index) => (
            <li key={item}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </RosgvardiaDisclosure>
      <RosgvardiaParagraphs items={section.notes} />
    </>
  );
}

export function RosgvardiaActualization({ section }) {
  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
        <div className="rosgvardia-actualization-term" data-scroll-reveal>
          <RosgvardiaParagraphs items={section.paragraphs} />
        </div>
        <RosgvardiaLink link={section.link} />
      </div>
      <div className="rosgvardia-stack">
        <h3 className="rosgvardia-subheading">{section.listIntro}</h3>
        <RosgvardiaList items={section.items} />
        <RosgvardiaParagraphs items={section.notes} />
      </div>
    </div>
  );
}
