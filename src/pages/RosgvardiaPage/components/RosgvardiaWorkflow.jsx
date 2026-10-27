import ProcessSteps from '../../../sections/Process/ProcessSteps';
import {
  RosgvardiaHeading,
  RosgvardiaList,
  RosgvardiaNote,
  RosgvardiaParagraphs,
} from './RosgvardiaContent';
import RosgvardiaTable from './RosgvardiaTable';
import './RosgvardiaWorkflow.css';

export function RosgvardiaCommission({ section }) {
  return (
    <>
      <div className="rosgvardia-split">
        <div className="rosgvardia-intro">
          <RosgvardiaHeading section={section} />
          <RosgvardiaParagraphs items={section.paragraphs} />
        </div>
        <div className="rosgvardia-stack">
          <p className="rosgvardia-subheading">{section.listIntro}</p>
          <ul className="rosgvardia-members">
            {section.members.map((member, index) => (
              <li key={member} data-scroll-reveal>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p>{member}</p>
              </li>
            ))}
          </ul>
          <RosgvardiaParagraphs items={section.notes} />
        </div>
      </div>
      <div className="rosgvardia-commission-details">
        <div className="rosgvardia-stack">
          <h3 className="rosgvardia-subheading">{section.timing.title}</h3>
          <RosgvardiaTable table={section.timing.table} label="Сроки работы комиссии" />
        </div>
        <aside className="rosgvardia-workflow-aside" data-scroll-reveal>
          <RosgvardiaParagraphs items={section.serviceNotes} />
        </aside>
      </div>
    </>
  );
}

export function RosgvardiaProcess({ section }) {
  const steps = section.steps.map((step, index) => ({
    ...step,
    number: String(index + 1).padStart(2, '0'),
  }));

  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
        <div className="rosgvardia-process-term">
          <RosgvardiaParagraphs items={section.notes} />
        </div>
      </div>
      <ProcessSteps steps={steps} />
    </div>
  );
}

export function RosgvardiaApproval({ section }) {
  return (
    <>
      <div className="rosgvardia-split">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
      </div>
      <ol className="rosgvardia-approval-route">
        {section.table.rows.map((row, index) => (
          <li className="rosgvardia-approval-stop" key={row[0]} data-scroll-reveal>
            <span className="rosgvardia-approval-stop__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <dl>
              <dt>{section.table.headers[0]}</dt>
              <dd>{row[0]}</dd>
              <dt>{section.table.headers[1]}</dt>
              <dd>{row[1]}</dd>
            </dl>
          </li>
        ))}
      </ol>
      <div className="rosgvardia-approval-timing">
        <h3 className="rosgvardia-subheading">{section.timing.title}</h3>
        <RosgvardiaList items={section.timing.items} />
      </div>
      <RosgvardiaParagraphs items={section.notes} />
    </>
  );
}

export function RosgvardiaCopies({ section }) {
  return (
    <div className="rosgvardia-split">
      <div className="rosgvardia-intro">
        <RosgvardiaHeading section={section} />
        <RosgvardiaParagraphs items={section.paragraphs} />
      </div>
      <div className="rosgvardia-stack">
        <div className="rosgvardia-copies" data-scroll-reveal>
          <p className="rosgvardia-copies__stat">{section.kicker}</p>
          <p className="rosgvardia-copies__label">{section.listIntro}</p>
          <RosgvardiaList items={section.items} />
        </div>
        <RosgvardiaNote>{section.note}</RosgvardiaNote>
      </div>
    </div>
  );
}
