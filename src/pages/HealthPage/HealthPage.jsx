import "./HealthPage.css";

import "./components/HealthHeroAndObjects/HealthHeroAndObjects.css";
import "./components/HealthRegulationAndCategories/HealthRegulationAndCategories.css";
import "./components/HealthCommissionAndAct/HealthCommissionAndAct.css";
import "./components/HealthPassportProcess/HealthPassportProcess.css";
import "./components/HealthRestrictedDocuments/HealthRestrictedDocuments.css";
import "./components/HealthServiceScope/HealthServiceScope.css";
import "./components/HealthPricing/HealthPricing.css";
import "./components/HealthRequiredDocuments/HealthRequiredDocuments.css";
import "./components/HealthPassportStructure/HealthPassportStructure.css";
import "./components/HealthPassportActualization/HealthPassportActualization.css";
import "./components/HealthMedicalOrganizations/HealthMedicalOrganizations.css";
import "./components/HealthCurrentRequirements/HealthCurrentRequirements.css";
import "./components/HealthWorkApproach/HealthWorkApproach.css";
import "./components/HealthFaq/HealthFaq.css";

import FinalCTA from "../../sections/FinalCTA/FinalCTA";

import { useCity } from "../../context/GeoContext";

import HealthHeroAndObjects from "./components/HealthHeroAndObjects/HealthHeroAndObjects";

import HealthRegulationAndCategories from "./components/HealthRegulationAndCategories/HealthRegulationAndCategories";

import HealthCommissionAndAct from "./components/HealthCommissionAndAct/HealthCommissionAndAct";

import HealthPassportProcess from "./components/HealthPassportProcess/HealthPassportProcess";

import HealthRestrictedDocuments from "./components/HealthRestrictedDocuments/HealthRestrictedDocuments";

import HealthServiceScope from "./components/HealthServiceScope/HealthServiceScope";

import HealthPricing from "./components/HealthPricing/HealthPricing";

import HealthRequiredDocuments from "./components/HealthRequiredDocuments/HealthRequiredDocuments";

import HealthPassportStructure from "./components/HealthPassportStructure/HealthPassportStructure";

import HealthPassportActualization from "./components/HealthPassportActualization/HealthPassportActualization";

import HealthMedicalOrganizations from "./components/HealthMedicalOrganizations/HealthMedicalOrganizations";

import HealthCurrentRequirements from "./components/HealthCurrentRequirements/HealthCurrentRequirements";

import HealthWorkApproach from "./components/HealthWorkApproach/HealthWorkApproach";

import HealthFaq from "./components/HealthFaq/HealthFaq";

export default function HealthPage() {
  const city = useCity();

  return (
    <main id="main-content" className="health-page">
      <HealthHeroAndObjects city={city} />

      <HealthRegulationAndCategories />

      <HealthCommissionAndAct />

      <HealthPassportProcess />

      <HealthRestrictedDocuments />

      <HealthServiceScope />

      <HealthPricing />

      <HealthRequiredDocuments />

      <HealthPassportStructure />

      <HealthPassportActualization />

      <HealthMedicalOrganizations />

      <HealthCurrentRequirements />

      <HealthWorkApproach />

      <HealthFaq />

      <FinalCTA />
    </main>
  );
}
