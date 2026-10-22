import ProcessSteps from '../../../sections/Process/ProcessSteps';
import {
  AgricultureAction,
  AgricultureHeading,
  AgricultureParagraphs,
  AgricultureSubheading,
} from './AgricultureContent';
import './AgricultureWorkflow.css';

export function AgricultureProcess({ section, onServiceSelect }) {
  return (
    <>
      <div className="agriculture-split">
        <div className="agriculture-section-intro">
          <AgricultureHeading section={section} />
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs} />
        </div>
        <ProcessSteps steps={section.steps} />
      </div>

      <div className="agriculture-process-footer" data-scroll-reveal>
        <AgricultureParagraphs items={section.notes} />
        <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}

export function AgricultureApproval({ section, onServiceSelect }) {
  return (
    <>
      <div className="agriculture-section-lead">
        <AgricultureHeading section={section} />
        <div className="agriculture-copy">
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <p className="agriculture-paragraph">{section.intro}</p>
        </div>
      </div>

      <div className="agriculture-authorities">
        {section.authorities.map((authority, index) => (
          <article
            className={`agriculture-authority${index === 1 ? ' agriculture-authority--accent' : ''}`}
            key={authority}
            data-scroll-reveal
          >
            <span className="agriculture-authority__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="agriculture-authority__arrow" aria-hidden="true">
              ↗
            </span>
            <p className="agriculture-authority__name">{authority}</p>
          </article>
        ))}
      </div>

      <div className="agriculture-approval-details">
        <AgricultureParagraphs items={section.paragraphs} />
        <div className="agriculture-approval-order" data-scroll-reveal>
          <p className="agriculture-approval-order__price">{section.priceText}</p>
          <p className="agriculture-paragraph">{section.note}</p>
          <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
      </div>
    </>
  );
}

export function AgricultureCopies({ section }) {
  return (
    <>
      <div className="agriculture-section-lead">
        <AgricultureHeading section={section} />
        <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
      </div>

      <div className="agriculture-copies-band" data-scroll-reveal>
        <span className="agriculture-copies-band__number" aria-hidden="true">
          1
        </span>
        <p className="agriculture-copies-band__text">{section.paragraphs[0]}</p>
      </div>

      <div className="agriculture-copies-details">
        <AgricultureParagraphs items={section.paragraphs.slice(1, 3)} />
        <AgricultureParagraphs items={section.paragraphs.slice(3)} />
      </div>
    </>
  );
}
