import FAQList from '../../../sections/FAQ/FAQList';
import { getIndustryContent } from './getIndustryContent';
import { IndustryHeading, IndustryParagraphs, IndustrySubheading } from './IndustryContent';
import './IndustryClosing.css';

export function IndustryAdvantages({ section }) {
  const [advantages] = getIndustryContent(section);

  return (
    <>
      <div className="industry-section-lead">
        <IndustryHeading section={section} />
        <div className="industry-copy">
          <IndustrySubheading>{advantages.title}</IndustrySubheading>
          <IndustryParagraphs items={advantages.paragraphs} />
        </div>
      </div>
      <div className="industry-advantages">
        {advantages.advantages.items.map((item, index) => (
          <article className="industry-advantage" key={item.title} data-scroll-reveal>
            <span
              className="industry-advantage__number"
              data-number={String(index + 1).padStart(2, '0')}
              aria-hidden="true"
            />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </>
  );
}

export function IndustryFaq({ section }) {
  const [questions] = getIndustryContent(section);

  return (
    <div className="industry-faq-layout">
      <div className="industry-section-intro">
        <IndustryHeading section={section} />
      </div>
      <FAQList items={questions.faq.items} compact />
    </div>
  );
}
