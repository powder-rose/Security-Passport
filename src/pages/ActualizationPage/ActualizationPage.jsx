import './ActualizationPage.css';


import useActualizationTimeline
from './useActualizationTimeline';


import ActualizationHeroAndDefinition
from './components/ActualizationHeroAndDefinition';

import ActualizationReasons
from './components/ActualizationReasons';

import ActualizationChecklist
from './components/ActualizationChecklist';

import ActualizationCategorization
from './components/ActualizationCategorization';


import ActualizationWorkProcess
from './components/ActualizationWorkProcess';

import ActualizationServiceScope
from './components/ActualizationServiceScope';

import ActualizationPricing
from './components/ActualizationPricing';

import ActualizationRequiredDocuments
from './components/ActualizationRequiredDocuments';


import ActualizationPeriodicity
from './components/ActualizationPeriodicity';

import ActualizationReplacement
from './components/ActualizationReplacement';

import ActualizationObjectTypes
from './components/ActualizationObjectTypes';

import ActualizationCurrentRequirements
from './components/ActualizationCurrentRequirements';

import ActualizationFaq
from './components/ActualizationFaq';


import Expert from '../../sections/Expert/Expert';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';


export default function ActualizationPage() {


  useActualizationTimeline();


  return (
    <main
      id="main-content"
      className="actualization-page"
    >
      <ActualizationHeroAndDefinition />

      <ActualizationReasons />

      <ActualizationChecklist />

      <ActualizationCategorization />


      <ActualizationWorkProcess />

      <ActualizationServiceScope />

      <ActualizationPricing />

      <ActualizationRequiredDocuments />


      <ActualizationPeriodicity />

      <ActualizationReplacement />

      <ActualizationObjectTypes />

      <ActualizationCurrentRequirements />


      <Expert />


      <ActualizationFaq />


      <FinalCTA />
    </main>
  );
}
