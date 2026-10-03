import "./TradePage.css";

import "./components/TradeHeroAndObjects.css";
import "./components/TradeRegulation.css";
import "./components/TradeRegulationChanges.css";
import "./components/TradeCategorizationAndAct.css";
import "./components/TradePassportDevelopment.css";
import "./components/TradeApprovalAndCopies.css";
import "./components/TradeOwnership.css";
import "./components/TradeRestrictedDocuments.css";
import "./components/TradeServiceScope.css";
import "./components/TradePricing.css";
import "./components/TradeRequiredDocuments.css";
import "./components/TradePassportForm.css";
import "./components/TradePassportActualization.css";
import "./components/TradeShoppingCenterInfo.css";
import "./components/TradeWorkApproach.css";
import "./components/TradeFaq.css";

import TradeHeroAndObjects from "./components/TradeHeroAndObjects";

import TradeRegulation from "./components/TradeRegulation";

import TradeRegulationChanges from "./components/TradeRegulationChanges";

import TradeCategorizationAndAct from "./components/TradeCategorizationAndAct";

import TradePassportDevelopment from "./components/TradePassportDevelopment";

import TradeApprovalAndCopies from "./components/TradeApprovalAndCopies";

import TradeOwnership from "./components/TradeOwnership";

import TradeRestrictedDocuments from "./components/TradeRestrictedDocuments";

import TradeServiceScope from "./components/TradeServiceScope";

import TradePricing from "./components/TradePricing";

import TradeRequiredDocuments from "./components/TradeRequiredDocuments";

import TradePassportForm from "./components/TradePassportForm";

import TradePassportActualization from "./components/TradePassportActualization";

import TradeShoppingCenterInfo from "./components/TradeShoppingCenterInfo";

import TradeWorkApproach from "./components/TradeWorkApproach";

import TradeFaq from "./components/TradeFaq";
import FinalCTA from "../../sections/FinalCTA/FinalCTA";

import { useCity } from "../../context/GeoContext";

export default function TradePage() {
  const city = useCity();

  return (
    <main id="main-content" className="trade-page">
      <TradeHeroAndObjects city={city} />

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
