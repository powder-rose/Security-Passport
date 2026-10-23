import FAQList from '../../../sections/FAQ/FAQList';
import {
  ReligiousAction,
  ReligiousDisclosure,
  ReligiousHeading,
  ReligiousLink,
  ReligiousParagraphs,
  ReligiousSubheading,
} from './ReligiousContent';
import './ReligiousClosing.css';

export function ReligiousVariants({ section, onServiceSelect }) {
  const [temple, ...otherObjects] = section.items;

  return (
    <div className="religious-split">
      <div className="religious-intro">
        <ReligiousHeading section={section} />
        <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>

      <div className="religious-stack">
        <article className="religious-variants__lead" data-scroll-reveal>
          <ReligiousSubheading>{temple.title}</ReligiousSubheading>
          <ReligiousParagraphs items={temple.paragraphs} />
        </article>
        <div className="religious-variants__details" data-scroll-reveal>
          {otherObjects.map(item => (
            <ReligiousDisclosure title={item.title} key={item.title}>
              <ReligiousParagraphs items={item.paragraphs} />
            </ReligiousDisclosure>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReligiousHeritage({ section, onServiceSelect }) {
  return (
    <div className="religious-split">
      <div className="religious-intro">
        <ReligiousHeading section={section} />
        <ReligiousParagraphs items={section.paragraphs.slice(0, 2)} />
      </div>

      <div className="religious-stack" data-scroll-reveal>
        <p className="religious-paragraph religious-note">{section.paragraphs[2]}</p>
        <ReligiousParagraphs items={section.paragraphs.slice(3)} />
        <ReligiousAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </div>
  );
}

export function ReligiousAdvantages({ section }) {
  return (
    <div className="religious-split">
      <div className="religious-intro">
        <ReligiousHeading section={section} />
        <ReligiousLink link={{ href: '/', label: 'Разработка паспорта безопасности объекта' }} />
      </div>

      <ol className="religious-advantages">
        {section.items.map((item, index) => (
          <li className="religious-advantages__item" key={item.title} data-scroll-reveal>
            <span className="religious-advantages__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="religious-advantages__copy">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ReligiousFaq({ section }) {
  return (
    <div className="religious-split">
      <div className="religious-intro">
        <ReligiousHeading section={section} />
      </div>
      <div className="religious-faq__panel" data-scroll-reveal>
        <FAQList items={section.items} compact />
      </div>
    </div>
  );
}
