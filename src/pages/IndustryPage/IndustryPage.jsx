import './IndustryPage.css';
import { useState } from 'react';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import IndustryHero from './components/IndustryHero';
import IndustrySection from './components/IndustrySection';
import { industryHeroFacts, industrySections } from './industryPageData';
import useScrollReveal from '../../components/commercial/useScrollReveal';

export default function IndustryPage({ objectType }) {
  const [selectedService, setSelectedService] = useState(objectType.seoName);
  const pageRef = useScrollReveal();

  return (
    <main id="main-content" className="industry-page" ref={pageRef}>
      <IndustryHero
        objectType={objectType}
        facts={industryHeroFacts}
        onServiceSelect={setSelectedService}
      />

      {industrySections.map(section => (
        <IndustrySection key={section.id} section={section} onServiceSelect={setSelectedService} />
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
