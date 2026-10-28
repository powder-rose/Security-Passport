import ServicePriceCard from '../../../components/commercial/ServicePriceCard';
import getMarketSection from '../getMarketSection';
import { marketLinks } from '../marketPageData';
import {
  MarketAction,
  MarketHeading,
  MarketLink,
  MarketNote,
  MarketParagraphs,
  MarketSection,
} from './MarketContent';
import './MarketServices.css';

const sample = getMarketSection('sample');
const prices = getMarketSection('prices');
const documents = getMarketSection('documents');

export default function MarketServices({ onServiceSelect }) {
  return (
    <>
      <MarketSection section={sample} tone="paper">
        <div className="market-sample-layout">
          <div className="market-stack market-sticky">
            <MarketHeading section={sample} />
            <MarketAction action={sample.action} onServiceSelect={onServiceSelect} />
          </div>
          <div className="market-sample-copy">
            <MarketParagraphs items={sample.paragraphs} />
            <MarketNote text={sample.note} />
            <MarketLink link={marketLinks.article} />
          </div>
        </div>
      </MarketSection>

      <MarketSection section={prices}>
        <MarketHeading section={prices} />
        <p className="market-price-label">{prices.priceLabel}</p>
        <div className="market-price-grid">
          {prices.items.map(item => (
            <ServicePriceCard key={item.number} item={item} onServiceSelect={onServiceSelect} />
          ))}
        </div>
        <div className="market-pricing-footer">
          <MarketParagraphs items={prices.paragraphs} />
          <MarketAction action={prices.action} onServiceSelect={onServiceSelect} />
        </div>
      </MarketSection>

      <MarketSection section={documents} tone="paper">
        <div className="market-documents-heading">
          <MarketHeading section={documents} />
          <MarketNote items={documents.notes} />
        </div>
        <div className="market-documents-labels" aria-hidden="true">
          {documents.table.headers.map(header => (
            <span key={header}>{header}</span>
          ))}
        </div>
        <dl className="market-documents-list">
          {documents.table.rows.map(([group, description], index) => (
            <div key={group} data-scroll-reveal>
              <dt>
                <span
                  className="market-index"
                  data-number={String(index + 1).padStart(2, '0')}
                  aria-hidden="true"
                />
                {group}
              </dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </MarketSection>
    </>
  );
}
