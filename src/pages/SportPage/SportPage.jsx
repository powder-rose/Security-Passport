import './SportPage.css';


import SportHeroAndObjects
from './components/SportHeroAndObjects';

import SportRegulation
from './components/SportRegulation';


import SportCategories
from './components/SportCategories';

import SportCategorizationAct
from './components/SportCategorizationAct';


import SportPassportProcess
from './components/SportPassportProcess';

import SportApproval
from './components/SportApproval';


import SportRestrictedDocuments
from './components/SportRestrictedDocuments';

import SportServiceScope
from './components/SportServiceScope';

import SportPricing
from './components/SportPricing';


import SportRequiredDocuments
from './components/SportRequiredDocuments';

import SportPassportForm
from './components/SportPassportForm';

import SportPassportActualization
from './components/SportPassportActualization';


import SportWorkApproach
from './components/SportWorkApproach';

import SportRelatedLinks
from './components/SportRelatedLinks';

import SportFaq
from './components/SportFaq';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


export default function SportPage() {
  const city =
    useCity();

  return (
    <main
      id="main-content"
      className="sport-page"
      data-sport-stage="1"
    >
      {/* SPORT_STAGE_1_V1:start */}

      <SportHeroAndObjects
        city={city}
      />

      <SportRegulation />


      {/* SPORT_STAGE_2_V1:start */}

      <SportCategories />

      <SportCategorizationAct />

      {/* SPORT_STAGE_2_V1:end */}


      {/* SPORT_STAGE_3_V1:start */}

      <SportPassportProcess />

      <SportApproval />

      {/* SPORT_STAGE_3_V1:end */}


      {/* SPORT_STAGE_4_V1:start */}

      <SportRestrictedDocuments />

      <SportServiceScope />

      <SportPricing />

      {/* SPORT_STAGE_4_V1:end */}


      {/* SPORT_STAGE_5_V1:start */}

      <SportRequiredDocuments />

      <SportPassportForm />

      <SportPassportActualization />

      {/* SPORT_STAGE_5_V1:end */}


      {/* SPORT_STAGE_6_V1:start */}

      <SportWorkApproach />

      <SportRelatedLinks />

      <SportFaq />

      {/* SPORT_STAGE_6_V1:end */}


      <FinalCTA />

      {/* SPORT_STAGE_1_V1:end */}
</main>
  );
}
