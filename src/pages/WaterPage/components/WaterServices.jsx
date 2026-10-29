import ServicePriceCard from '../../../components/commercial/ServicePriceCard';
import getWaterSection from '../getWaterSection';
import { WaterAction, WaterHeading, WaterIndex, WaterNote, WaterSection } from './WaterContent';
import './WaterServices.css';

const service = getWaterSection('service');
const prices = getWaterSection('prices');
const documents = getWaterSection('documents');

export default function WaterServices({ onServiceSelect }) {
  return (
    <>
      <WaterSection section={service} tone="paper">
        <WaterHeading section={service} />
        <ol className="water-services">
          {service.items.map(item => (
            <li key={item.number} data-scroll-reveal>
              <WaterIndex number={item.number} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </WaterSection>
      <WaterSection section={prices}>
        <WaterHeading section={prices} />
        <div className="service-price-cards water-prices-grid">
          {prices.items.map(item => (
            <ServicePriceCard
              key={item.number}
              item={item}
              description={item.description}
              onServiceSelect={onServiceSelect}
            />
          ))}
        </div>
        <div className="water-prices-additional">
          <div>
            <p className="water-kicker">{prices.additionalService.label}</p>
            <h3>{prices.additionalService.title}</h3>
            <p>{prices.additionalService.description}</p>
          </div>
          <WaterAction action={prices.action} onServiceSelect={onServiceSelect} />
        </div>
      </WaterSection>
      <WaterSection section={documents} tone="paper">
        <div className="water-documents">
          <div className="water-sticky">
            <WaterHeading section={documents} />
            <WaterNote text={documents.note} />
          </div>
          <ol className="water-documents__list">
            {documents.items.map(item => (
              <li key={item.number} data-scroll-reveal>
                <WaterIndex number={item.number} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </WaterSection>
    </>
  );
}
