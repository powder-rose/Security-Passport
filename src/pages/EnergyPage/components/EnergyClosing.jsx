import FAQList from '../../../sections/FAQ/FAQList';
import { EnergyHeading, EnergyParagraphs, EnergySubheading } from './EnergyContent';
import './EnergyClosing.css';

export function EnergyAdvantages({ section }) {
  return (
    <>
      <div className="energy-section-lead">
        <EnergyHeading section={section} />
        <EnergySubheading>{section.subheading}</EnergySubheading>
      </div>

      <div className="energy-advantages">
        {section.items.map((item, index) => (
          <article className="energy-advantage" key={item.title} data-scroll-reveal>
            <span
              className="energy-advantage__number"
              data-number={String(index + 1).padStart(2, '0')}
              aria-hidden="true"
            />
            <EnergySubheading>
              <span className="energy-advantage__title">{item.title}</span>
            </EnergySubheading>
            <EnergyParagraphs items={[item.text]} />
          </article>
        ))}
      </div>
    </>
  );
}

export function EnergyFaq({ section }) {
  return (
    <div className="energy-faq-layout">
      <div className="energy-section-intro">
        <EnergyHeading section={section} />
      </div>
      <div className="energy-faq-panel" data-scroll-reveal>
        <FAQList items={section.items} compact />
      </div>
    </div>
  );
}
