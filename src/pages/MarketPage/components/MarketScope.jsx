import getMarketSection from '../getMarketSection';
import {
  MarketAction,
  MarketHeading,
  MarketNote,
  MarketParagraphs,
  MarketSection,
} from './MarketContent';
import './MarketScope.css';

const objects = getMarketSection('objects');
const regulations = getMarketSection('regulations');
const responsibility = getMarketSection('responsibility');

export default function MarketScope({ onServiceSelect }) {
  return (
    <>
      <MarketSection section={objects} tone="paper">
        <div className="market-split">
          <MarketHeading section={objects} />
          <MarketParagraphs items={objects.paragraphs} />
        </div>
        <div className="market-object-grid">
          {objects.items.map((item, index) => (
            <article className="market-object" key={item.title} data-scroll-reveal>
              <span className="market-index" data-number={`0${index + 1}`} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="market-stack">
          <MarketNote text={objects.note} items={objects.notes} />
          <MarketAction action={objects.action} onServiceSelect={onServiceSelect} />
        </div>
      </MarketSection>

      <MarketSection section={regulations}>
        <div className="market-regulation-layout">
          <aside className="market-regulation-card market-sticky" aria-label="Нормативные факты">
            <span className="market-regulation-card__number" aria-hidden="true">
              255
            </span>
            <ul>
              {regulations.facts.map(fact => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </aside>
          <div className="market-stack">
            <MarketHeading section={regulations} />
            <MarketParagraphs items={regulations.paragraphs} />
            <MarketNote text={regulations.note} />
          </div>
        </div>
      </MarketSection>

      <MarketSection section={responsibility} tone="paper">
        <MarketHeading section={responsibility} />
        <div className="market-responsibility-columns">
          <MarketParagraphs items={responsibility.paragraphs.slice(0, 2)} />
          <MarketParagraphs items={responsibility.paragraphs.slice(2)} />
        </div>
        <MarketNote text={responsibility.note} />
      </MarketSection>
    </>
  );
}
