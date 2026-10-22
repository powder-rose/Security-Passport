import {
  AgricultureAction,
  AgricultureHeading,
  AgricultureLink,
  AgricultureParagraphs,
  AgricultureSubheading,
} from './AgricultureContent';
import AgricultureTable from './AgricultureTable';
import './AgricultureCategorization.css';

export function AgricultureCategorization({ section, onServiceSelect }) {
  return (
    <>
      <div className="agriculture-section-lead">
        <AgricultureHeading section={section} />
        <div className="agriculture-copy" data-scroll-reveal>
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs} />
        </div>
      </div>

      <div className="agriculture-category-matrix" data-scroll-reveal>
        <AgricultureTable
          headers={section.table.headers}
          rows={section.table.rows}
          label={section.subheading}
        />
      </div>

      <div className="agriculture-category-notes">
        <div className="agriculture-note" data-scroll-reveal>
          <AgricultureParagraphs items={section.notes.slice(0, 3)} />
        </div>
        <div className="agriculture-copy" data-scroll-reveal>
          <AgricultureParagraphs items={section.notes.slice(3)} />
          <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
        </div>
      </div>
    </>
  );
}

export function AgricultureCategorizationAct({ section, onServiceSelect }) {
  return (
    <>
      <AgricultureHeading section={section} />

      <div className="agriculture-act-layout">
        <div className="agriculture-copy" data-scroll-reveal>
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs.slice(0, 3)} />
        </div>
        <div className="agriculture-act-document" data-scroll-reveal>
          <span className="agriculture-act-document__mark" aria-hidden="true" />
          <AgricultureParagraphs items={section.paragraphs.slice(3)} />
          <AgricultureLink link={section.link} />
        </div>
      </div>

      <div className="agriculture-act-order" data-scroll-reveal>
        <p>{section.priceText}</p>
        <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}
