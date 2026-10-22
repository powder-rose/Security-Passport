import {
  AgricultureAction,
  AgricultureHeading,
  AgricultureList,
  AgricultureParagraphs,
  AgricultureSubheading,
} from './AgricultureContent';
import './AgricultureScope.css';

export function AgricultureApplicability({ section, onServiceSelect }) {
  return (
    <>
      <div className="agriculture-section-lead">
        <AgricultureHeading section={section} />
        <div className="agriculture-scope-intro" data-scroll-reveal>
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs} />
        </div>
      </div>

      <div className="agriculture-departments">
        {section.departments.map((department, index) => (
          <article className="agriculture-department" key={department.title} data-scroll-reveal>
            <span
              className="agriculture-department__number"
              data-number={String(index + 1).padStart(2, '0')}
              aria-hidden="true"
            />
            <AgricultureSubheading>{department.title}</AgricultureSubheading>
            <AgricultureParagraphs items={department.paragraphs} />
          </article>
        ))}
      </div>

      <aside className="agriculture-object-scope" data-scroll-reveal>
        <AgricultureSubheading>{section.scope.title}</AgricultureSubheading>
        <div className="agriculture-object-scope__content">
          <p className="agriculture-object-scope__lead">{section.scope.paragraphs[0]}</p>
          <AgricultureParagraphs items={section.scope.paragraphs.slice(1)} />
          <AgricultureAction action={section.action} onServiceSelect={onServiceSelect} accent />
        </div>
      </aside>
    </>
  );
}

export function AgricultureRegulations({ section }) {
  return (
    <>
      <div className="agriculture-regulation-intro" data-scroll-reveal>
        <AgricultureHeading section={section} />
        <div className="agriculture-scope-intro">
          <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
          <AgricultureParagraphs items={section.paragraphs} />
        </div>
      </div>

      <div className="agriculture-regulation-list">
        <p className="agriculture-regulation-list__intro">{section.listIntro}</p>
        <AgricultureList items={section.items} />
      </div>

      <div className="agriculture-regulation-history" data-scroll-reveal>
        <AgricultureParagraphs items={section.notes.slice(0, 2)} />
        <p className="agriculture-regulation-history__current">{section.notes[2]}</p>
      </div>
    </>
  );
}
