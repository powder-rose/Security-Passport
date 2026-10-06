import './TradePage.css';

import './components/TradeHeroAndObjects/TradeHeroAndObjects.css';
import './components/TradeRegulation/TradeRegulation.css';
import './components/TradeRegulationChanges/TradeRegulationChanges.css';
import './components/TradeCategorizationAndAct/TradeCategorizationAndAct.css';
import './components/TradePassportDevelopment/TradePassportDevelopment.css';
import './components/TradeApprovalAndCopies/TradeApprovalAndCopies.css';
import './components/TradeOwnership/TradeOwnership.css';
import './components/TradeRestrictedDocuments/TradeRestrictedDocuments.css';
import './components/TradeServiceScope/TradeServiceScope.css';
import './components/TradePricing/TradePricing.css';
import './components/TradeRequiredDocuments/TradeRequiredDocuments.css';
import './components/TradePassportForm/TradePassportForm.css';
import './components/TradePassportActualization/TradePassportActualization.css';
import './components/TradeShoppingCenterInfo/TradeShoppingCenterInfo.css';
import './components/TradeWorkApproach/TradeWorkApproach.css';
import './components/TradeFaq/TradeFaq.css';

import TradeHeroAndObjects from './components/TradeHeroAndObjects/TradeHeroAndObjects';

import TradeRegulation from './components/TradeRegulation/TradeRegulation';

import TradeRegulationChanges from './components/TradeRegulationChanges/TradeRegulationChanges';

import TradeCategorizationAndAct from './components/TradeCategorizationAndAct/TradeCategorizationAndAct';

import TradePassportDevelopment from './components/TradePassportDevelopment/TradePassportDevelopment';

import TradeApprovalAndCopies from './components/TradeApprovalAndCopies/TradeApprovalAndCopies';

import TradeOwnership from './components/TradeOwnership/TradeOwnership';

import TradeRestrictedDocuments from './components/TradeRestrictedDocuments/TradeRestrictedDocuments';

import TradeServiceScope from './components/TradeServiceScope/TradeServiceScope';

import TradePricing from './components/TradePricing/TradePricing';

import TradeRequiredDocuments from './components/TradeRequiredDocuments/TradeRequiredDocuments';

import TradePassportForm from './components/TradePassportForm/TradePassportForm';

import TradePassportActualization from './components/TradePassportActualization/TradePassportActualization';

import TradeShoppingCenterInfo from './components/TradeShoppingCenterInfo/TradeShoppingCenterInfo';

import TradeWorkApproach from './components/TradeWorkApproach/TradeWorkApproach';

import TradeFaq from './components/TradeFaq/TradeFaq';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

export default function TradePage() {
  return (
    <main id="main-content" className="trade-page">
      <TradeHeroAndObjects />

      <TradeRegulation />

      <TradeRegulationChanges />

      <TradeCategorizationAndAct />

      <TradePassportDevelopment />

      <TradeApprovalAndCopies />

      <TradeOwnership />

      <TradeRestrictedDocuments />

      <TradeServiceScope />

      <TradePricing />

      <TradeRequiredDocuments />

      <TradePassportForm />

      <TradePassportActualization />

      <TradeShoppingCenterInfo />

      <TradeWorkApproach />

      <TradeFaq />

      <FinalCTA />
    </main>
  );
}
