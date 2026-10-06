import './CulturePage.css';
import './components/CultureHeroAndObjects/CultureHeroAndObjects.css';
import './components/CultureRegulationAndCategories/CultureRegulationAndCategories.css';
import './components/CultureCategorization/CultureCategorization.css';
import './components/CultureActAndPassport/CultureActAndPassport.css';
import './CulturePageResponsiveCategoriesAct.css';
import './components/CultureActAndPassport/CultureActAndPassportPassport.css';
import './components/CultureApprovalAndRestrictions/CultureApprovalAndRestrictions.css';
import './CulturePageResponsivePassportApproval.css';
import './components/CultureServiceScope/CultureServiceScope.css';
import './components/CulturePricing/CulturePricing.css';
import './components/CultureRequiredDocuments/CultureRequiredDocuments.css';
import './components/CulturePassportForm/CulturePassportForm.css';
import './CulturePageResponsiveServiceForm.css';
import './components/CulturePassportActualization/CulturePassportActualization.css';
import './components/CultureCurrentRequirements/CultureCurrentRequirements.css';
import './components/CultureWorkApproach/CultureWorkApproach.css';
import './components/CultureFaq/CultureFaq.css';
import './CulturePageResponsiveTail.css';
import './CulturePageSharedPresentation.css';

import CultureHeroAndObjects from './components/CultureHeroAndObjects/CultureHeroAndObjects';

import CultureRegulationAndCategories from './components/CultureRegulationAndCategories/CultureRegulationAndCategories';

import CultureCategorization from './components/CultureCategorization/CultureCategorization';

import CultureActAndPassport from './components/CultureActAndPassport/CultureActAndPassport';

import CultureApprovalAndRestrictions from './components/CultureApprovalAndRestrictions/CultureApprovalAndRestrictions';

import CultureServiceScope from './components/CultureServiceScope/CultureServiceScope';

import CulturePricing from './components/CulturePricing/CulturePricing';

import CultureRequiredDocuments from './components/CultureRequiredDocuments/CultureRequiredDocuments';

import CulturePassportForm from './components/CulturePassportForm/CulturePassportForm';

import CulturePassportActualization from './components/CulturePassportActualization/CulturePassportActualization';

import CultureCurrentRequirements from './components/CultureCurrentRequirements/CultureCurrentRequirements';

import CultureWorkApproach from './components/CultureWorkApproach/CultureWorkApproach';

import CultureFaq from './components/CultureFaq/CultureFaq';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

export default function CulturePage({ objectType }) {
  return (
    <main id="main-content" className="culture-page">
      <CultureHeroAndObjects objectType={objectType} />

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
