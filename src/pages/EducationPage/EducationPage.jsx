import './EducationPage.css';

import {
  getRegionalWorkText,
} from './educationRegion';


import EducationHeroAndObjects
from './components/EducationHeroAndObjects';

import EducationRegulation
from './components/EducationRegulation';


import EducationCategories
from './components/EducationCategories';

import EducationPassportProcess
from './components/EducationPassportProcess';

import EducationApproval
from './components/EducationApproval';


import EducationPassportCopies
from './components/EducationPassportCopies';

import EducationRestrictedDocuments
from './components/EducationRestrictedDocuments';

import EducationServiceScope
from './components/EducationServiceScope';

import EducationPricing
from './components/EducationPricing';


import EducationRequiredDocuments
from './components/EducationRequiredDocuments';

import EducationPassportForm
from './components/EducationPassportForm';

import EducationPassportActualization
from './components/EducationPassportActualization';


import EducationAudience
from './components/EducationAudience';

import EducationCurrentRequirements
from './components/EducationCurrentRequirements';

import EducationRelatedLinks
from './components/EducationRelatedLinks';

import EducationFaq
from './components/EducationFaq';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


// EDUCATION_STAGE_2_V1:start


// EDUCATION_STAGE_2_V1:end


// EDUCATION_STAGE_3_V1:start


// EDUCATION_STAGE_3_V1:end


// EDUCATION_STAGE_4_V1:start


// EDUCATION_STAGE_4_V1:end


// EDUCATION_STAGE_5_V1:start


// EDUCATION_STAGE_5_V1:end


export default function EducationPage({
  objectType,
}) {
  const city =
    useCity();

  const regionalWorkText =
    getRegionalWorkText(
      city,
    );


  return (
    <main
      id="main-content"
      className="education-page"
    >
      <EducationHeroAndObjects
        objectType={objectType}
        regionalWorkText={regionalWorkText}
      />

      <EducationRegulation />


      {/* EDUCATION_STAGE_2_V1:sections */}

      <EducationCategories />

      <EducationPassportProcess />

      <EducationApproval />

      {/* EDUCATION_STAGE_3_V1:sections */}

      <EducationPassportCopies />

      <EducationRestrictedDocuments />

      <EducationServiceScope />

      <EducationPricing />

      {/* EDUCATION_STAGE_4_V1:sections */}

      <EducationRequiredDocuments />

      <EducationPassportForm />

      <EducationPassportActualization />

      {/* EDUCATION_STAGE_5_V1:sections */}

      <EducationAudience />

      <EducationCurrentRequirements />

      <EducationRelatedLinks />

      <EducationFaq />


      <FinalCTA />
</main>
  );
}
