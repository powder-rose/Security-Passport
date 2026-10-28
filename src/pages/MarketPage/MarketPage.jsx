import { useState } from 'react';
import useScrollReveal from '../../components/commercial/useScrollReveal';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { marketObjectType } from '../../data/marketObjectType';
import { marketHeroActions } from './marketPageData';
import getMarketSection from './getMarketSection';
import MarketHero from './components/MarketHero';
import MarketScope from './components/MarketScope';
import MarketStructure from './components/MarketStructure';
import MarketWorkflow from './components/MarketWorkflow';
import MarketServices from './components/MarketServices';
import MarketUpdates from './components/MarketUpdates';
import MarketClosing from './components/MarketClosing';
import './MarketPage.css';

const serviceRows = getMarketSection('service').table.rows;
const consultationBenefits = [serviceRows[0][0], serviceRows[2][0], serviceRows[6][0]];

export default function MarketPage({ objectType = marketObjectType, preview = false }) {
  const [selectedService, setSelectedService] = useState(marketHeroActions[0].service);
  const pageRef = useScrollReveal();

  return (
    <main id="main-content" className="market-page" ref={pageRef}>
      <MarketHero objectType={objectType} onServiceSelect={setSelectedService} />
      <MarketScope onServiceSelect={setSelectedService} />
      <MarketStructure onServiceSelect={setSelectedService} />
      <MarketWorkflow />
      <MarketServices onServiceSelect={setSelectedService} />
      <MarketUpdates />
      <MarketClosing />
      <FinalCTA
        preview={preview}
        service={selectedService}
        objectType={objectType.title}
        objectPlaceholder="Укажите тип рынка и необходимые документы"
        benefits={consultationBenefits}
        allowEmailOnly
      />
    </main>
  );
}
