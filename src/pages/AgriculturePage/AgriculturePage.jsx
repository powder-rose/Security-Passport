import './AgriculturePage.css';
import { useState } from 'react';
import useScrollReveal from '../../components/commercial/useScrollReveal';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import AgricultureHero from './components/AgricultureHero';
import AgricultureSection from './components/AgricultureSection';
import {
  agricultureHeroActions,
  agricultureHeroFacts,
  agricultureSections,
} from './agriculturePageData';

export default function AgriculturePage({ objectType }) {
  const [selectedService, setSelectedService] = useState(agricultureHeroActions[0].service);
  const pageRef = useScrollReveal();

  return (
    <main id="main-content" className="agriculture-page" ref={pageRef}>
      <AgricultureHero
        objectType={objectType}
        facts={agricultureHeroFacts}
        actions={agricultureHeroActions}
        onServiceSelect={setSelectedService}
      />

      {agricultureSections.map(section => (
        <AgricultureSection
          key={section.id}
          section={section}
          onServiceSelect={setSelectedService}
        />
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
