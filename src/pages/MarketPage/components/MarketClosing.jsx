import FAQList from '../../../sections/FAQ/FAQList';
import getMarketSection from '../getMarketSection';
import { MarketHeading, MarketLink, MarketParagraphs, MarketSection } from './MarketContent';
import './MarketClosing.css';

const service = getMarketSection('service');
const advantages = getMarketSection('advantages');
const faq = getMarketSection('faq');

export default function MarketClosing() {
  return (
    <>
      <MarketSection section={service} tone="paper">
        <div className="market-split">
          <MarketHeading section={service} />
          <MarketParagraphs items={service.paragraphs} />
        </div>
        <div className="market-service-labels" aria-hidden="true">
          {service.table.headers.map(header => (
            <span key={header}>{header}</span>
          ))}
        </div>
        <ol className="market-service-list">
          {service.table.rows.map(([work, result], index) => (
            <li key={work}>
              <span className="market-index" data-number={`0${index + 1}`} aria-hidden="true" />
              <h3>{work}</h3>
              <p>{result}</p>
            </li>
          ))}
        </ol>
      </MarketSection>

      <MarketSection section={advantages}>
        <div className="market-split">
          <div className="market-stack">
            <MarketHeading section={advantages} />
            <MarketLink link={advantages.link} />
          </div>
          <ul className="market-advantages-list">
            {advantages.items.map((item, index) => (
              <li key={item} data-scroll-reveal>
                <span className="market-index" data-number={`0${index + 1}`} aria-hidden="true" />
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </MarketSection>

      <MarketSection section={faq} tone="paper">
        <MarketHeading section={faq} />
        <div className="market-faq-list">
          <FAQList items={faq.items} />
        </div>
      </MarketSection>
    </>
  );
}
