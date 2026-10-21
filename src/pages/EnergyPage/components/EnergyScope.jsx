import {
  EnergyAction,
  EnergyHeading,
  EnergyList,
  EnergyParagraphs,
  EnergySubheading,
} from './EnergyContent';
import './EnergyScope.css';

export function EnergyApplicability({ section, onServiceSelect }) {
  return (
    <>
      <div className="energy-section-lead">
        <EnergyHeading section={section} />
        <div className="energy-copy">
          <EnergySubheading>{section.subheading}</EnergySubheading>
          <EnergyParagraphs items={section.paragraphs.slice(0, 2)} />
        </div>
      </div>
      <div className="energy-copy">
        <p className="energy-paragraph">{section.paragraphs[2]}</p>
        <EnergyList items={section.items} variant="objects" />
      </div>
      <div className="energy-applicability-note">
        <EnergyParagraphs items={section.notes} />
        <EnergyAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
      <details className="energy-disclosure">
        <summary>
          <EnergySubheading>{section.categorization.title}</EnergySubheading>
        </summary>
        <div className="energy-disclosure__body">
          <EnergyParagraphs items={section.categorization.paragraphs} />
          <EnergyAction
            action={section.categorization.action}
            onServiceSelect={onServiceSelect}
            secondary
          />
        </div>
      </details>
    </>
  );
}

export function EnergyRegulations({ section }) {
  return (
    <div className="energy-split-layout">
      <div className="energy-section-intro">
        <EnergyHeading section={section} />
        <p className="energy-paragraph">{section.intro}</p>
        <EnergyParagraphs items={section.paragraphs} />
      </div>
      <dl className="energy-regulations">
        {section.items.map((item, index) => (
          <div className="energy-regulation" key={item.title} data-scroll-reveal>
            <span
              className="energy-regulation__number"
              data-number={String(index + 1).padStart(2, '0')}
              aria-hidden="true"
            />
            <dt>{item.title}</dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
