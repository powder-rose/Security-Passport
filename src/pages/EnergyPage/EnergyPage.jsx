import './EnergyPage.css';
import { useState } from 'react';
import useScrollReveal from '../../components/commercial/useScrollReveal';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import EnergyHero from './components/EnergyHero';
import EnergySection from './components/EnergySection';
import { energyHeroActions, energyHeroFacts, energySections } from './energyPageData';

export default function EnergyPage({ objectType }) {
  const [selectedService, setSelectedService] = useState(energyHeroActions[0].service);
  const pageRef = useScrollReveal();

  return (
    <main id="main-content" className="energy-page" ref={pageRef}>
      <EnergyHero
        objectType={objectType}
        facts={energyHeroFacts}
        actions={energyHeroActions}
        onServiceSelect={setSelectedService}
      />

      {energySections.map(section => (
        <EnergySection key={section.id} section={section} onServiceSelect={setSelectedService} />
      ))}

      <FinalCTA
        service={selectedService}
        objectType={objectType.title}
        allowEmailOnly
        objectPlaceholder="Расскажите об объекте и необходимых документах"
      />
    </main>
  );
}
