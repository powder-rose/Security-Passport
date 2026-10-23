import { useState } from 'react';
import useScrollReveal from '../../components/commercial/useScrollReveal';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import ReligiousHero from './components/ReligiousHero';
import ReligiousSection from './components/ReligiousSection';
import {
  religiousHeroActions,
  religiousHeroFacts,
  religiousObjectOptions,
  religiousSections,
} from './religiousPageData';
import './ReligiousPage.css';

export default function ReligiousPage({ objectType }) {
  const [selectedService, setSelectedService] = useState(religiousHeroActions[0].service);
  const pageRef = useScrollReveal();

  return (
    <main className="religious-page" id="main-content" ref={pageRef}>
      <ReligiousHero
        objectType={objectType}
        facts={religiousHeroFacts}
        actions={religiousHeroActions}
        onServiceSelect={setSelectedService}
      />

      {religiousSections.map(section => (
        <ReligiousSection key={section.id} section={section} onServiceSelect={setSelectedService} />
      ))}

      <FinalCTA
        service={selectedService}
        objectType={objectType.title}
        objectTypeOptions={religiousObjectOptions}
        objectTypeLabel="Тип религиозного объекта"
        objectPlaceholder="Расскажите об объекте и необходимых документах"
        allowEmailOnly
      />
    </main>
  );
}
