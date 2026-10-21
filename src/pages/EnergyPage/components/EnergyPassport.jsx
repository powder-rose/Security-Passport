import { EnergyAction, EnergyHeading, EnergyParagraphs, EnergySubheading } from './EnergyContent';
import './EnergyPassport.css';

export function EnergyPassportForm({ section, onServiceSelect }) {
  return (
    <div className="energy-split-layout">
      <div className="energy-section-intro">
        <EnergyHeading section={section} />
        <EnergySubheading>{section.subheading}</EnergySubheading>
        <EnergyParagraphs items={section.paragraphs.slice(0, 2)} />
      </div>

      <div className="energy-passport-form" data-scroll-reveal>
        <span className="energy-passport-form__mark" aria-hidden="true">
          № 3722-р
        </span>
        <EnergyParagraphs items={section.paragraphs.slice(2)} />

        <div className="energy-passport-form__request">
          <EnergySubheading>{section.request.title}</EnergySubheading>
          <EnergyParagraphs items={section.request.paragraphs} />
          <EnergyAction action={section.request.action} onServiceSelect={onServiceSelect} />
        </div>
      </div>
    </div>
  );
}

export function EnergyActualization({ section, onServiceSelect }) {
  return (
    <div className="energy-split-layout">
      <div className="energy-section-intro">
        <EnergyHeading section={section} />
        <EnergySubheading>{section.subheading}</EnergySubheading>
        <EnergyParagraphs items={section.paragraphs} />
      </div>

      <div className="energy-actualization-period" data-scroll-reveal>
        <div className="energy-actualization-period__heading">
          <span className="energy-actualization-period__number" aria-hidden="true">
            3
          </span>
          <EnergySubheading>{section.period.title}</EnergySubheading>
        </div>

        <div className="energy-note energy-actualization-period__condition">
          <EnergyParagraphs items={section.period.paragraphs.slice(0, 2)} />
        </div>
        <EnergyParagraphs items={section.period.paragraphs.slice(2)} />
        <EnergyAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </div>
  );
}

export function EnergyRestrictedDocuments({ section }) {
  return (
    <div className="energy-split-layout">
      <div className="energy-section-intro">
        <EnergyHeading section={section} />
        <div className="energy-restricted-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M10 14V9a6 6 0 0 1 12 0v5" />
            <rect x="6" y="14" width="20" height="15" rx="3" />
            <path d="M16 20v4" />
          </svg>
          <span>Ограниченный доступ</span>
        </div>
      </div>

      <div className="energy-copy">
        <EnergySubheading>{section.subheading}</EnergySubheading>
        <EnergyParagraphs items={section.paragraphs.slice(0, 2)} />
        <div className="energy-restricted-rule" data-scroll-reveal>
          <EnergyParagraphs items={section.paragraphs.slice(2, 3)} />
        </div>
        <EnergyParagraphs items={section.paragraphs.slice(3)} />
      </div>
    </div>
  );
}
