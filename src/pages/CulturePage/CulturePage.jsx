import './CulturePage.css';

import {
  getCultureRegionalWorkText,
} from './cultureRegion';


import CultureHeroAndObjects
from './components/CultureHeroAndObjects';

import CultureRegulationAndCategories
from './components/CultureRegulationAndCategories';

import CultureCategorization
from './components/CultureCategorization';

import CultureActAndPassport
from './components/CultureActAndPassport';

import CultureApprovalAndRestrictions
from './components/CultureApprovalAndRestrictions';


import CultureServiceScope
from './components/CultureServiceScope';

import CulturePricing
from './components/CulturePricing';

import CultureRequiredDocuments
from './components/CultureRequiredDocuments';


import CulturePassportForm
from './components/CulturePassportForm';

import CulturePassportActualization
from './components/CulturePassportActualization';

import CultureCurrentRequirements
from './components/CultureCurrentRequirements';


import CultureWorkApproach
from './components/CultureWorkApproach';

import CultureFaq
from './components/CultureFaq';import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


export default function CulturePage({
  objectType,
}) {
  const city =
    useCity();

  const regionalWorkText =
    getCultureRegionalWorkText(
      city,
    );

  return (
    <main
      id="main-content"
      className="culture-page"
    >
      <CultureHeroAndObjects
        objectType={objectType}
        regionalWorkText={regionalWorkText}
      />


      <CultureRegulationAndCategories />


      <CultureCategorization />


      <CultureActAndPassport />


      <CultureApprovalAndRestrictions />


      <CultureServiceScope />

      <CulturePricing />

      <CultureRequiredDocuments />


      <CulturePassportForm />

      <CulturePassportActualization />

      <CultureCurrentRequirements />


      <CultureWorkApproach />

      <CultureFaq />


      <FinalCTA />

</main>
  );
}
