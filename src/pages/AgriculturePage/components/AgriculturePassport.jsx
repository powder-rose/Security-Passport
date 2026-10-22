import {
  AgricultureAction,
  AgricultureHeading,
  AgricultureLink,
  AgricultureParagraphs,
  AgricultureSubheading,
} from './AgricultureContent';
import AgricultureTable from './AgricultureTable';
import './AgriculturePassport.css';

export function AgriculturePassportForm({ section, onServiceSelect }) {
  return (
    <div className="agriculture-split">
      <div className="agriculture-section-intro">
        <AgricultureHeading section={section} />
        <AgricultureParagraphs items={section.paragraphs.slice(0, 2)} />
      </div>

      <article className="agriculture-form-sheet" data-scroll-reveal>
        <div className="agriculture-form-sheet__body">
          <span className="agriculture-form-sheet__mark" aria-hidden="true">
            № 1270
          </span>
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs.slice(2)} />
        </div>

        <div className="agriculture-form-sheet__request">
          <AgricultureSubheading>{section.request.title}</AgricultureSubheading>
          <AgricultureParagraphs items={section.request.paragraphs} />
          <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
      </article>
    </div>
  );
}

export function AgricultureRestrictedDocuments({ section }) {
  return (
    <div className="agriculture-split">
      <div className="agriculture-section-intro">
        <AgricultureHeading section={section} />
        <div className="agriculture-restricted-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M10 14V9a6 6 0 0 1 12 0v5" />
            <rect x="6" y="14" width="20" height="15" rx="3" />
            <path d="M16 20v4" />
          </svg>
          <span>ДСП</span>
        </div>
      </div>

      <div className="agriculture-copy">
        <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
        <AgricultureParagraphs items={section.paragraphs.slice(0, 2)} />
        <p className="agriculture-restricted-rule" data-scroll-reveal>
          {section.paragraphs[2]}
        </p>
        <AgricultureParagraphs items={section.paragraphs.slice(3)} />
      </div>
    </div>
  );
}

export function AgricultureActualization({ section, onServiceSelect }) {
  return (
    <>
      <div className="agriculture-section-lead">
        <AgricultureHeading section={section} />
        <div className="agriculture-copy">
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs} />
        </div>
      </div>

      <div className="agriculture-periods">
        {section.periods.map((period, index) => (
          <article className="agriculture-period" key={period.title} data-scroll-reveal>
            <span className="agriculture-period__number" aria-hidden="true">
              {index === 0 ? '3' : '5'}
            </span>
            <div className="agriculture-period__copy">
              <h3 className="agriculture-period__title">{period.title}</h3>
              <p className="agriculture-period__condition">{period.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="agriculture-actualization-details">
        <div className="agriculture-copy">
          <AgricultureParagraphs items={section.notes.slice(0, 2)} />
          <p className="agriculture-paragraph agriculture-note" data-scroll-reveal>
            {section.notes[2]}
          </p>
        </div>
        <div className="agriculture-copy">
          <AgricultureParagraphs items={section.notes.slice(3)} />
          <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
          <AgricultureLink link={section.link} />
        </div>
      </div>
    </>
  );
}

export function AgricultureRegulationChanges({ section, onServiceSelect }) {
  return (
    <>
      <AgricultureHeading section={section} />

      <div className="agriculture-transition">
        <div className="agriculture-transition__numbers" aria-hidden="true" data-scroll-reveal>
          <span className="agriculture-transition__previous">836</span>
          <span className="agriculture-transition__arrow" />
          <span className="agriculture-transition__current">1270</span>
        </div>
        <div className="agriculture-copy">
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs.slice(0, 2)} />
        </div>
      </div>

      <div className="agriculture-transition-details">
        <p className="agriculture-transition-deadline" data-scroll-reveal>
          {section.paragraphs[2].split(/(2 сентября 2027 года)/).map(part =>
            part === '2 сентября 2027 года' ? (
              <time
                className="agriculture-transition-deadline__date"
                dateTime="2027-09-02"
                key={part}
              >
                {part}
              </time>
            ) : (
              part
            ),
          )}
        </p>
        <AgricultureParagraphs items={section.paragraphs.slice(3)} />
      </div>

      <div className="agriculture-regulation-comparison" data-scroll-reveal>
        <AgricultureSubheading>{section.table.title}</AgricultureSubheading>
        <AgricultureTable
          headers={section.table.headers}
          rows={section.table.rows}
          label={section.table.title}
        />
      </div>

      <div className="agriculture-existing-passport" data-scroll-reveal>
        <AgricultureSubheading>{section.existing.title}</AgricultureSubheading>
        <div className="agriculture-copy">
          <AgricultureParagraphs items={section.existing.paragraphs} />
          <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
      </div>
    </>
  );
}
