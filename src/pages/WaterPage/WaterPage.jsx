import { useState } from 'react';
import useScrollReveal from '../../components/commercial/useScrollReveal';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { waterObjectType } from '../../data/waterObjectType';
import { waterHeroActions } from './waterPageData';
import WaterHero from './components/WaterHero';
import WaterScope from './components/WaterScope';
import WaterRegulation from './components/WaterRegulation';
import WaterCategorization from './components/WaterCategorization';
import WaterWorkflow from './components/WaterWorkflow';
import WaterLifecycle from './components/WaterLifecycle';
import WaterProtection from './components/WaterProtection';
import WaterServices from './components/WaterServices';
import WaterClosing from './components/WaterClosing';
import './WaterPage.css';

export default function WaterPage({ objectType = waterObjectType, preview = false }) {
  const [selectedService, setSelectedService] = useState(waterHeroActions[0].service);
  const pageRef = useScrollReveal();

  return (
    <main id="main-content" className="water-page" ref={pageRef}>
      <WaterHero objectType={objectType} onServiceSelect={setSelectedService} />
      <WaterScope onServiceSelect={setSelectedService} />
      <WaterRegulation onServiceSelect={setSelectedService} />
      <WaterCategorization onServiceSelect={setSelectedService} />
      <WaterWorkflow />
      <WaterLifecycle />
      <WaterProtection onServiceSelect={setSelectedService} />
      <WaterServices onServiceSelect={setSelectedService} />
      <WaterClosing />
      <FinalCTA
        preview={preview}
        service={selectedService}
        objectType={objectType.quizOption}
        objectPlaceholder="Укажите тип объекта и задачу, без служебных сведений"
        allowEmailOnly
      />
    </main>
  );
}
