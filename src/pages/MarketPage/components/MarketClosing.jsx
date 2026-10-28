import getMarketSection from '../getMarketSection';
import {
  MarketDisclosure,
  MarketHeading,
  MarketLink,
  MarketParagraphs,
  MarketSection,
} from './MarketContent';
import './MarketClosing.css';

const service = getMarketSection('service');
const advantages = getMarketSection('advantages');
const faq = getMarketSection('faq');

export default function MarketClosing() {
  return (
    <>
      <MarketSection section={service} tone="paper">
        <div className="market-service-heading">
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
            <li key={work} data-scroll-reveal>
              <span className="market-index" data-number={`0${index + 1}`} aria-hidden="true" />
              <h3>{work}</h3>
              <p>{result}</p>
            </li>
          ))}
        </ol>
      </MarketSection>

      <MarketSection section={advantages} tone="dark">
        <div className="market-advantages-heading">
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
      </MarketSection>

      <MarketSection section={faq}>
        <div className="market-faq-layout">
          <div className="market-sticky">
            <MarketHeading section={faq} />
          </div>
          <div className="market-faq-list">
            {faq.items.map((item, index) => (
              <MarketDisclosure
                key={item.id}
                title={item.question}
                number={String(index + 1).padStart(2, '0')}
                name="market-faq"
                open={index === 0}
              >
                <p>{item.answer}</p>
              </MarketDisclosure>
            ))}
          </div>
        </div>
      </MarketSection>
    </>
  );
}
