import './HealthPage.css';

import Container
from '../../components/ui/Container/Container';

import FinalCTA
from '../../sections/FinalCTA/FinalCTA';

import {
  useCity,
} from '../../context/GeoContext';

import HealthHeroAndObjects
from './components/HealthHeroAndObjects';

import HealthRegulationAndCategories
from './components/HealthRegulationAndCategories';

import HealthCommissionAndAct
from './components/HealthCommissionAndAct';

import HealthPassportProcess
from './components/HealthPassportProcess';

import HealthRestrictedDocuments
from './components/HealthRestrictedDocuments';

import HealthServiceScope
from './components/HealthServiceScope';

import HealthPricing
from './components/HealthPricing';

import HealthRequiredDocuments
from './components/HealthRequiredDocuments';

import HealthPassportStructure
from './components/HealthPassportStructure';

import HealthPassportActualization
from './components/HealthPassportActualization';

import HealthMedicalOrganizations
from './components/HealthMedicalOrganizations';

import HealthCurrentRequirements
from './components/HealthCurrentRequirements';

import HealthWorkApproach
from './components/HealthWorkApproach';

import HealthFaq
from './components/HealthFaq';


export default function HealthPage() {
  const city =
    useCity();

  return (
    <main
      id="main-content"
      className="health-page"
      data-health-stage="1"
    >
      {/* HEALTH_STAGE_1_V1:start */}

      <HealthHeroAndObjects
        city={city}
      />

      {/* HEALTH_STAGE_1_V1:end */}


      {/* HEALTH_STAGE_2_V1:start */}

      <HealthRegulationAndCategories />

      {/* HEALTH_STAGE_2_V1:end */}


      {/* HEALTH_STAGE_3_V1:start */}

      <HealthCommissionAndAct />

      {/* HEALTH_STAGE_3_V1:end */}


      {/* HEALTH_STAGE_4_V1:start */}

      <HealthPassportProcess />

      {/* HEALTH_STAGE_4_V1:end */}


      {/* HEALTH_STAGE_5_V1:start */}

      <HealthRestrictedDocuments />

      <HealthServiceScope />

      <HealthPricing />

      <HealthRequiredDocuments />

      {/* HEALTH_STAGE_5_V1:end */}


      {/* HEALTH_STAGE_6_V1:start */}

      <HealthPassportStructure />

      <HealthPassportActualization />

      <HealthMedicalOrganizations />

      <HealthCurrentRequirements />

      {/* HEALTH_STAGE_6_V1:end */}


      {/* HEALTH_STAGE_7_V1:start */}

      <HealthWorkApproach />

      <HealthFaq />

      {/* HEALTH_STAGE_7_V1:end */}


      <FinalCTA />
</main>
  );
}
