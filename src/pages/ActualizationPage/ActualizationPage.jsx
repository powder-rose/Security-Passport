import './ActualizationPage.css';

import './components/ActualizationHeroAndDefinition/ActualizationHeroAndDefinition.css';
import './components/ActualizationReasons/ActualizationReasons.css';
import './components/ActualizationChecklist/ActualizationChecklist.css';
import './components/ActualizationCategorization/ActualizationCategorization.css';
import './components/ActualizationWorkProcess/ActualizationWorkProcess.css';
import './components/ActualizationServiceScope/ActualizationServiceScope.css';
import './components/ActualizationPricing/ActualizationPricing.css';
import './components/ActualizationRequiredDocuments/ActualizationRequiredDocuments.css';
import './components/ActualizationPeriodicity/ActualizationPeriodicity.css';
import './components/ActualizationReplacement/ActualizationReplacement.css';
import './components/ActualizationObjectTypes/ActualizationObjectTypes.css';
import './components/ActualizationCurrentRequirements/ActualizationCurrentRequirements.css';
import './components/ActualizationFaq/ActualizationFaq.css';

import useActualizationTimeline from './useActualizationTimeline';

import ActualizationHeroAndDefinition from './components/ActualizationHeroAndDefinition/ActualizationHeroAndDefinition';

import ActualizationReasons from './components/ActualizationReasons/ActualizationReasons';

import ActualizationChecklist from './components/ActualizationChecklist/ActualizationChecklist';

import ActualizationCategorization from './components/ActualizationCategorization/ActualizationCategorization';

import ActualizationWorkProcess from './components/ActualizationWorkProcess/ActualizationWorkProcess';

import ActualizationServiceScope from './components/ActualizationServiceScope/ActualizationServiceScope';

import ActualizationPricing from './components/ActualizationPricing/ActualizationPricing';

import ActualizationRequiredDocuments from './components/ActualizationRequiredDocuments/ActualizationRequiredDocuments';

import ActualizationPeriodicity from './components/ActualizationPeriodicity/ActualizationPeriodicity';

import ActualizationReplacement from './components/ActualizationReplacement/ActualizationReplacement';

import ActualizationObjectTypes from './components/ActualizationObjectTypes/ActualizationObjectTypes';

import ActualizationCurrentRequirements from './components/ActualizationCurrentRequirements/ActualizationCurrentRequirements';

import ActualizationFaq from './components/ActualizationFaq/ActualizationFaq';

import Expert from '../../sections/Expert/Expert';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

export default function ActualizationPage() {
  useActualizationTimeline();

  return (
    <main id="main-content" className="actualization-page">
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
