import ServicePriceCard from '../../../components/commercial/ServicePriceCard';
import getMarketSection from '../getMarketSection';
import {
  MarketAction,
  MarketHeading,
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
        <div className="market-split">
          <div className="market-stack">
            <MarketHeading section={sample} />
            <MarketAction action={sample.action} onServiceSelect={onServiceSelect} />
          </div>
          <div className="market-stack">
            <MarketParagraphs items={sample.paragraphs} />
            <MarketNote text={sample.note} />
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
        <div className="market-split">
          <MarketParagraphs items={prices.paragraphs} />
          <MarketAction action={prices.action} onServiceSelect={onServiceSelect} />
        </div>
      </MarketSection>

      <MarketSection section={documents} tone="paper">
        <div className="market-split">
          <MarketHeading section={documents} />
          <MarketNote items={documents.notes} />
        </div>
        <div className="market-documents-labels" aria-hidden="true">
          {documents.table.headers.map(header => (
            <span key={header}>{header}</span>
          ))}
        </div>
        <dl className="market-documents-list">
          {documents.table.rows.map(([group, description]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </MarketSection>
    </>
  );
}
