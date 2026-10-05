import "./CategorizationActPage.css";
import "./components/CategorizationActHeroAndIntro/CategorizationActHeroAndIntro.css";
import "./components/CategorizationActObjectTypes/CategorizationActObjectTypes.css";
import "./components/CategorizationActRequirements/CategorizationActRequirements.css";
import "./components/CategorizationActProcess/CategorizationActProcess.css";
import "./components/CategorizationActServiceScope/CategorizationActServiceScope.css";
import "./components/CategorizationActPricing/CategorizationActPricing.css";
import "./components/CategorizationActSourceData/CategorizationActSourceData.css";
import "./components/CategorizationActSample/CategorizationActSample.css";
import "./components/CategorizationActStandard/CategorizationActStandard.css";
import "./components/CategorizationActDifference/CategorizationActDifference.css";
import "./components/CategorizationActFaq/CategorizationActFaq.css";
import "./CategorizationActPageResponsive.css";
import "./components/CategorizationActHeroAndIntro/CategorizationActHeroAndIntroExpertVisual.css";

import CategorizationActHeroAndIntro from "./components/CategorizationActHeroAndIntro/CategorizationActHeroAndIntro";

import CategorizationActObjectTypes from "./components/CategorizationActObjectTypes/CategorizationActObjectTypes";

import CategorizationActRequirements from "./components/CategorizationActRequirements/CategorizationActRequirements";

import CategorizationActProcess from "./components/CategorizationActProcess/CategorizationActProcess";

import CategorizationActServiceScope from "./components/CategorizationActServiceScope/CategorizationActServiceScope";

import CategorizationActPricing from "./components/CategorizationActPricing/CategorizationActPricing";

import CategorizationActSourceData from "./components/CategorizationActSourceData/CategorizationActSourceData";

import CategorizationActSample from "./components/CategorizationActSample/CategorizationActSample";

import CategorizationActStandard from "./components/CategorizationActStandard/CategorizationActStandard";

import CategorizationActDifference from "./components/CategorizationActDifference/CategorizationActDifference";

import CategorizationActFaq from "./components/CategorizationActFaq/CategorizationActFaq";

import Expert from "../../sections/Expert/Expert";
import FinalCTA from "../../sections/FinalCTA/FinalCTA";

export default function CategorizationActPage() {
  return (
    <main id="main-content" className="categorization-act-page">
      <CategorizationActHeroAndIntro />

      <CategorizationActObjectTypes />

      <CategorizationActRequirements />

      <CategorizationActProcess />

      <CategorizationActServiceScope />

      <CategorizationActPricing />

      <CategorizationActSourceData />

      <CategorizationActSample />

      <CategorizationActStandard />

      <CategorizationActDifference />

      <Expert />

      <CategorizationActFaq />

      <FinalCTA />
    </main>
  );
}
