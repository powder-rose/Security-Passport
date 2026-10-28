import getMarketSection from '../getMarketSection';
import {
  MarketAction,
  MarketDisclosure,
  MarketHeading,
  MarketList,
  MarketNote,
  MarketParagraphs,
  MarketSection,
} from './MarketContent';
import './MarketStructure.css';

const form = getMarketSection('form');
const contents = getMarketSection('contents');
const plans = getMarketSection('plans');

export default function MarketStructure({ onServiceSelect }) {
  return (
    <>
      <MarketSection section={form}>
        <div className="market-split">
          <div className="market-stack">
            <MarketHeading section={form} />
            <MarketNote text={form.note} />
          </div>
          <div className="market-stack">
            <MarketParagraphs items={form.paragraphs} />
            <MarketDisclosure title={form.listIntro} open>
              <MarketList items={form.items} ordered />
            </MarketDisclosure>
            <MarketAction action={form.action} onServiceSelect={onServiceSelect} />
          </div>
        </div>
      </MarketSection>

      <MarketSection section={contents} tone="paper">
        <div className="market-split">
          <div className="market-stack market-sticky">
            <MarketHeading section={contents} />
            <MarketNote text={contents.note} />
          </div>
          <div className="market-contents-disclosures">
            {contents.items.map((item, index) => (
              <MarketDisclosure key={item.title} title={item.title} open={index === 0}>
                {item.listIntro ? <p>{item.listIntro}</p> : null}
                {item.items ? <MarketList items={item.items} /> : null}
                {item.text ? <p>{item.text}</p> : null}
              </MarketDisclosure>
            ))}
          </div>
        </div>
      </MarketSection>

      <MarketSection section={plans}>
        <div className="market-split">
          <MarketHeading section={plans} />
          <MarketParagraphs items={plans.paragraphs} />
        </div>
        <p className="market-plans-intro">{plans.listIntro}</p>
        <div className="market-plans-grid">
          {plans.items.map((item, index) => (
            <article className="market-plan" key={item.title} data-scroll-reveal>
              <span className="market-index" data-number={`0${index + 1}`} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="market-stack">
          <MarketNote text={plans.note} />
          <MarketParagraphs items={plans.notes} />
        </div>
      </MarketSection>
    </>
  );
}
