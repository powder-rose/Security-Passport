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
      <div className="energy-objects-layout">
        <div className="energy-copy">
          <p className="energy-paragraph">{section.paragraphs[2]}</p>
          <EnergyList items={section.items} variant="objects" />
        </div>
        <aside className="energy-objects-scope" data-scroll-reveal>
          <EnergyParagraphs items={section.notes} />
          <EnergyAction action={section.action} onServiceSelect={onServiceSelect} accent />
        </aside>
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
    <>
      <div className="energy-regulations-header">
        <EnergyHeading section={section} />
        <p className="energy-paragraph">{section.intro}</p>
      </div>
      <div className="energy-regulations-layout">
        <aside className="energy-regulations-statement" data-scroll-reveal>
          <span className="energy-regulations-mark" aria-hidden="true">
            №256-ФЗ
          </span>
          <p className="energy-paragraph">{section.paragraphs[0]}</p>
        </aside>
        <dl className="energy-regulations">
          {section.items.map((item, index) => (
            <div className="energy-regulation" key={item.title} data-scroll-reveal>
              <dt>
                <span
                  className="energy-regulation__number"
                  data-number={String(index + 1).padStart(2, '0')}
                  aria-hidden="true"
                />
                <span>{item.title}</span>
              </dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="energy-regulations-footer">
        <EnergyParagraphs items={section.paragraphs.slice(1)} />
      </div>
    </>
  );
}
