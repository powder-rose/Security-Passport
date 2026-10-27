import { useState } from 'react';
import useScrollReveal from '../../components/commercial/useScrollReveal';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import RosgvardiaHero from './components/RosgvardiaHero';
import RosgvardiaSection from './components/RosgvardiaSection';
import {
  rosgvardiaHeroActions,
  rosgvardiaHeroFacts,
  rosgvardiaSections,
} from './rosgvardiaPageData';
import './RosgvardiaPage.css';

const passportOffer = rosgvardiaSections.find(section => section.id === 'prices').items[0];

export default function RosgvardiaPage({ objectType }) {
  const [selectedService, setSelectedService] = useState(rosgvardiaHeroActions[0].service);
  const pageRef = useScrollReveal();

  return (
    <main className="rosgvardia-page" id="main-content" ref={pageRef}>
      <RosgvardiaHero
        objectType={objectType}
        facts={rosgvardiaHeroFacts}
        actions={rosgvardiaHeroActions}
        offer={passportOffer}
        onServiceSelect={setSelectedService}
      />

      {rosgvardiaSections.map(section => (
        <RosgvardiaSection
          key={section.id}
          section={section}
          onServiceSelect={setSelectedService}
        />
      ))}

      <FinalCTA
        service={selectedService}
        objectType={objectType.title}
        objectPlaceholder="Расскажите об объекте и необходимых документах"
        allowEmailOnly
      />
    </main>
  );
}
