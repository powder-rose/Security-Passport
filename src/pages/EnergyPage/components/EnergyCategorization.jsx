import {
  EnergyAction,
  EnergyHeading,
  EnergyList,
  EnergyParagraphs,
  EnergySubheading,
} from './EnergyContent';
import EnergyTable from './EnergyTable';
import './EnergyCategorization.css';

export function EnergyCategorization({ section, onServiceSelect }) {
  return (
    <>
      <div className="energy-split-layout">
        <div className="energy-section-intro">
          <EnergyHeading section={section} />
          <EnergySubheading>{section.subheading}</EnergySubheading>
          <EnergyParagraphs items={section.paragraphs} />
        </div>
        <div className="energy-copy">
          <p className="energy-paragraph">{section.criteria.intro}</p>
          <EnergyList items={section.criteria.items} variant="criteria" />
          <div className="energy-note">
            <EnergyParagraphs items={section.commissionParagraphs} />
          </div>
        </div>
      </div>
      <div className="energy-copy">
        <EnergySubheading>{section.categories.title}</EnergySubheading>
        <p className="energy-paragraph">{section.categories.intro}</p>
        <EnergyTable
          headers={section.categories.headers}
          rows={section.categories.rows}
          label={section.categories.title}
          variant="categories"
        />
        <EnergyParagraphs items={section.categories.paragraphs} />
      </div>
      <div className="energy-categorization-result" data-scroll-reveal>
        <div className="energy-copy">
          <EnergySubheading>{section.results.title}</EnergySubheading>
          <p className="energy-paragraph">{section.results.intro}</p>
          <EnergyAction action={section.action} onServiceSelect={onServiceSelect} accent />
        </div>
        <EnergyList items={section.results.items} variant="results" />
      </div>
    </>
  );
}

export function EnergyCategorizationAct({ section, onServiceSelect }) {
  const priceIndex = section.priceText.indexOf('9 500 ₽');

  return (
    <div className="energy-section-lead">
      <div className="energy-copy">
        <EnergyHeading section={section} />
        <EnergySubheading>{section.subheading}</EnergySubheading>
        <EnergyParagraphs items={section.paragraphs.slice(0, 3)} />
      </div>
      <aside className="energy-act-card" data-scroll-reveal>
        <EnergyParagraphs items={section.paragraphs.slice(3)} />
        <p className="energy-act-card__price">
          <span>{section.priceText.slice(0, priceIndex)}</span>
          <strong>{section.priceText.slice(priceIndex)}</strong>
        </p>
        <EnergyAction action={section.action} onServiceSelect={onServiceSelect} accent />
      </aside>
    </div>
  );
}
