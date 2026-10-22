import FAQList from '../../../sections/FAQ/FAQList';
import { AgricultureHeading, AgricultureSubheading } from './AgricultureContent';
import './AgricultureClosing.css';

export function AgricultureAdvantages({ section }) {
  return (
    <div className="agriculture-split">
      <div className="agriculture-section-intro">
        <AgricultureHeading section={section} />
        <AgricultureSubheading>{section.subheading}</AgricultureSubheading>
      </div>

      <ol className="agriculture-advantages">
        {section.items.map((item, index) => (
          <li className="agriculture-advantage" key={item.title} data-scroll-reveal>
            <span className="agriculture-advantage__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="agriculture-advantage__copy">
              <AgricultureSubheading>{item.title}</AgricultureSubheading>
              <p className="agriculture-paragraph">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AgricultureFaq({ section }) {
  return (
    <div className="agriculture-split">
      <div className="agriculture-section-intro">
        <AgricultureHeading section={section} />
      </div>
      <div className="agriculture-faq-panel" data-scroll-reveal>
        <FAQList items={section.items} compact />
      </div>
    </div>
  );
}
