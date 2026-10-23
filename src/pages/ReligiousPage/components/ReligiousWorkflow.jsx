import ProcessSteps from '../../../sections/Process/ProcessSteps';
import {
  ReligiousAction,
  ReligiousHeading,
  ReligiousParagraphs,
  ReligiousPriceText,
  ReligiousSubheading,
} from './ReligiousContent';
import ReligiousTable from './ReligiousTable';
import './ReligiousWorkflow.css';

export function ReligiousCommission({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <div className="religious-intro">
          <ReligiousHeading section={section} />
          <ReligiousParagraphs items={section.paragraphs} />
        </div>

        <div className="religious-stack">
          <div className="religious-workflow-members" data-scroll-reveal>
            <p className="religious-workflow-members__label">{section.listIntro}</p>
            <ul className="religious-workflow-members__list">
              {section.members.map((member, index) => (
                <li className="religious-workflow-member" key={member}>
                  <span className="religious-workflow-member__number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p>{member}</p>
                </li>
              ))}
            </ul>
          </div>
          <ReligiousParagraphs items={section.memberNotes} />
        </div>
      </div>

      <div className="religious-workflow-commission-details">
        <div className="religious-stack" data-scroll-reveal>
          <ReligiousSubheading>{section.timing.title}</ReligiousSubheading>
          <ReligiousTable table={section.timing.table} label={section.timing.title} />
          <p className="religious-workflow-term-note">{section.timing.note}</p>
        </div>

        <aside className="religious-note religious-stack" data-scroll-reveal>
          <ReligiousSubheading>{section.features.title}</ReligiousSubheading>
          <ReligiousParagraphs items={section.features.paragraphs} />
          <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
        </aside>
      </div>
    </>
  );
}

export function ReligiousProcess({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <div className="religious-intro">
          <ReligiousHeading section={section} />
          <ReligiousParagraphs items={section.paragraphs} />
          <ReligiousSubheading>{section.subheading}</ReligiousSubheading>
        </div>
        <ProcessSteps steps={section.steps} />
      </div>

      <div className="religious-workflow-process-term" data-scroll-reveal>
        <div className="religious-stack">
          <ReligiousSubheading>{section.timing.title}</ReligiousSubheading>
          <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
        <div className="religious-copy">
          <p className="religious-workflow-term-lead">{section.timing.paragraphs[0]}</p>
          <ReligiousParagraphs items={section.timing.paragraphs.slice(1)} />
        </div>
      </div>
    </>
  );
}

export function ReligiousApproval({ section, onServiceSelect }) {
  return (
    <>
      <div className="religious-split">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs} />
      </div>

      <div className="religious-stack">
        <p className="religious-workflow-authorities-intro">{section.listIntro}</p>
        <ul className="religious-workflow-authorities">
          {section.authorities.map((authority, index) => (
            <li
              className={`religious-workflow-authority${index === 0 ? ' religious-workflow-authority--dark' : index === 3 ? ' religious-workflow-authority--accent' : ''}`}
              key={authority}
              data-scroll-reveal
            >
              <span className="religious-workflow-authority__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p>{authority}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="religious-note" data-scroll-reveal>
        <p className="religious-paragraph">{section.note}</p>
      </div>

      <div className="religious-workflow-approval-details">
        <div className="religious-stack" data-scroll-reveal>
          <ReligiousSubheading>{section.timing.title}</ReligiousSubheading>
          <p className="religious-workflow-term-lead">{section.timing.paragraphs[0]}</p>
          <ReligiousParagraphs items={section.timing.paragraphs.slice(1)} />
        </div>

        <aside className="religious-workflow-order" data-scroll-reveal>
          <p className="religious-workflow-order__price">
            <ReligiousPriceText text={section.priceText} />
          </p>
          <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} accent />
        </aside>
      </div>
    </>
  );
}

export function ReligiousCopies({ section }) {
  return (
    <>
      <div className="religious-split">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs} />
      </div>

      <div className="religious-workflow-copies">
        {section.table.rows.map((row, index) => (
          <article
            className={`religious-workflow-copy${index === 1 ? ' religious-workflow-copy--dark' : ''}`}
            key={row[0]}
            data-scroll-reveal
          >
            <span className="religious-workflow-copy__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="religious-workflow-copy__content">
              <p className="religious-workflow-copy__label">{section.table.headers[0]}</p>
              <h3 className="religious-workflow-copy__title">{row[0]}</h3>
              <dl className="religious-workflow-copy__storage">
                <dt>{section.table.headers[1]}</dt>
                <dd>{row[1]}</dd>
              </dl>
            </div>
          </article>
        ))}
      </div>

      <div className="religious-workflow-copy-notes">
        <div className="religious-note" data-scroll-reveal>
          <p className="religious-paragraph">{section.notes[0]}</p>
        </div>
        <ReligiousParagraphs items={section.notes.slice(1)} />
      </div>
    </>
  );
}
