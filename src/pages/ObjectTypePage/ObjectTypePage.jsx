import './ObjectTypePage.css';

import ObjectQuiz from '../../sections/ObjectQuiz/ObjectQuiz';
import Process from '../../sections/Process/Process';
import Advantages from '../../sections/Advantages/Advantages';
import Prices from '../../sections/Prices/Prices';
import RequiredDocuments from '../../sections/RequiredDocuments/RequiredDocuments';
import Expert from '../../sections/Expert/Expert';
import FAQ from '../../sections/FAQ/FAQ';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';


import ObjectTypeHero
from './components/ObjectTypeHero';

import ObjectTypeServiceScope
from './components/ObjectTypeServiceScope';

import ObjectTypeLegalGuide
from './components/ObjectTypeLegalGuide';


export default function ObjectTypePage({
  objectType,
}) {
  return (
    <main
      id="main-content"
      className="object-service-page"
    >
      <ObjectTypeHero
        objectType={objectType}
      />

      <ObjectTypeServiceScope />


      <ObjectQuiz
        presetObjectType={
          objectType.quizOption
        }
      />


      <ObjectTypeLegalGuide
        objectTypeId={objectType.id}
      />

      <Process />
      <Advantages />
      <Prices />
      <RequiredDocuments />
      <Expert />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
