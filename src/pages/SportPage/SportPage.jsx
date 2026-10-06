import './SportPage.css';
import './components/SportHeroAndObjects/SportHeroAndObjects.css';
import './components/SportRegulation/SportRegulation.css';
import './components/SportCategories/SportCategories.css';
import './components/SportCategorizationAct/SportCategorizationAct.css';
import './components/SportPassportProcess/SportPassportProcess.css';
import './components/SportApproval/SportApproval.css';
import './components/SportRestrictedDocuments/SportRestrictedDocuments.css';
import './components/SportServiceScope/SportServiceScope.css';
import './components/SportPricing/SportPricing.css';
import './components/SportRequiredDocuments/SportRequiredDocuments.css';
import './components/SportPassportForm/SportPassportForm.css';
import './components/SportPassportActualization/SportPassportActualization.css';
import './components/SportWorkApproach/SportWorkApproach.css';
import './components/SportRelatedLinks/SportRelatedLinks.css';
import './components/SportFaq/SportFaq.css';
import './SportPageLateResponsiveAndOverrides.css';

import SportHeroAndObjects from './components/SportHeroAndObjects/SportHeroAndObjects';

import SportRegulation from './components/SportRegulation/SportRegulation';

import SportCategories from './components/SportCategories/SportCategories';

import SportCategorizationAct from './components/SportCategorizationAct/SportCategorizationAct';

import SportPassportProcess from './components/SportPassportProcess/SportPassportProcess';

import SportApproval from './components/SportApproval/SportApproval';

import SportRestrictedDocuments from './components/SportRestrictedDocuments/SportRestrictedDocuments';

import SportServiceScope from './components/SportServiceScope/SportServiceScope';

import SportPricing from './components/SportPricing/SportPricing';

import SportRequiredDocuments from './components/SportRequiredDocuments/SportRequiredDocuments';

import SportPassportForm from './components/SportPassportForm/SportPassportForm';

import SportPassportActualization from './components/SportPassportActualization/SportPassportActualization';

import SportWorkApproach from './components/SportWorkApproach/SportWorkApproach';

import SportRelatedLinks from './components/SportRelatedLinks/SportRelatedLinks';

import SportFaq from './components/SportFaq/SportFaq';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

export default function SportPage() {
  return (
    <main id="main-content" className="sport-page">
      <SportHeroAndObjects />

      <SportRegulation />

      <SportCategories />

      <SportCategorizationAct />

      <SportPassportProcess />

      <SportApproval />

      <SportRestrictedDocuments />

      <SportServiceScope />

      <SportPricing />

      <SportRequiredDocuments />

      <SportPassportForm />

      <SportPassportActualization />

      <SportWorkApproach />

      <SportRelatedLinks />

      <SportFaq />

      <FinalCTA />
    </main>
  );
}
