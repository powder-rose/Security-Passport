import './TradePage.css';


import TradeHeroAndObjects
from './components/TradeHeroAndObjects';

import TradeRegulation
from './components/TradeRegulation';


import TradeRegulationChanges
from './components/TradeRegulationChanges';

import TradeCategorizationAndAct
from './components/TradeCategorizationAndAct';


import TradePassportDevelopment
from './components/TradePassportDevelopment';

import TradeApprovalAndCopies
from './components/TradeApprovalAndCopies';

import TradeOwnership
from './components/TradeOwnership';


import TradeRestrictedDocuments
from './components/TradeRestrictedDocuments';

import TradeServiceScope
from './components/TradeServiceScope';

import TradePricing
from './components/TradePricing';

import TradeRequiredDocuments
from './components/TradeRequiredDocuments';


import TradePassportForm
from './components/TradePassportForm';

import TradePassportActualization
from './components/TradePassportActualization';

import TradeShoppingCenterInfo
from './components/TradeShoppingCenterInfo';

import TradeWorkApproach
from './components/TradeWorkApproach';

import TradeFaq
from './components/TradeFaq';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

import {
  useCity,
} from '../../context/GeoContext';


export default function TradePage() {
  const city =
    useCity();

  return (
    <main
      id="main-content"
      className="trade-page"
      data-trade-stage="1"
    >
      {/* TRADE_STAGE_1_V1:start */}

      <TradeHeroAndObjects
        city={city}
      />

      <TradeRegulation />

      {/* TRADE_STAGE_1_V1:end */}


      {/* TRADE_STAGE_2_V1:start */}

      <TradeRegulationChanges />

      <TradeCategorizationAndAct />

      {/* TRADE_STAGE_2_V1:end */}


      {/* TRADE_STAGE_3_V1:start */}

      <TradePassportDevelopment />

      <TradeApprovalAndCopies />

      <TradeOwnership />

      {/* TRADE_STAGE_3_V1:end */}


      {/* TRADE_STAGE_4_V1:start */}

      <TradeRestrictedDocuments />

      <TradeServiceScope />

      <TradePricing />

      <TradeRequiredDocuments />

      {/* TRADE_STAGE_4_V1:end */}


      {/* TRADE_STAGE_5_V1:start */}

      <TradePassportForm />

      <TradePassportActualization />

      <TradeShoppingCenterInfo />

      <TradeWorkApproach />

      <TradeFaq />

      {/* TRADE_STAGE_5_V1:end */}


      <FinalCTA />
</main>
  );
}
