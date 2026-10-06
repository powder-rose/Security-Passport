import "./EducationPage.css";
import "./components/EducationHeroAndObjects/EducationHeroAndObjects.css";
import "./components/EducationRegulation/EducationRegulation.css";
import "./EducationPageResponsiveTop.css";
import "./components/EducationCategories/EducationCategories.css";
import "./components/EducationPassportProcess/EducationPassportProcess.css";
import "./components/EducationApproval/EducationApproval.css";
import "./EducationPageResponsiveCategoriesProcessApproval.css";
import "./components/EducationPassportCopies/EducationPassportCopies.css";
import "./components/EducationRestrictedDocuments/EducationRestrictedDocuments.css";
import "./components/EducationServiceScope/EducationServiceScope.css";
import "./components/EducationPricing/EducationPricing.css";
import "./EducationPageResponsiveCopiesServicePricing.css";
import "./components/EducationRequiredDocuments/EducationRequiredDocuments.css";
import "./components/EducationPassportForm/EducationPassportForm.css";
import "./components/EducationPassportActualization/EducationPassportActualization.css";
import "./EducationPageResponsiveDocumentsFormActualization.css";
import "./components/EducationAudience/EducationAudience.css";
import "./components/EducationCurrentRequirements/EducationCurrentRequirements.css";
import "./components/EducationRelatedLinks/EducationRelatedLinks.css";
import "./components/EducationFaq/EducationFaq.css";
import "./EducationPageResponsiveTail.css";
import "./EducationPageSharedDesktop.css";

import { getRegionalWorkText } from "./educationRegion";

import EducationHeroAndObjects from "./components/EducationHeroAndObjects/EducationHeroAndObjects";

import EducationRegulation from "./components/EducationRegulation/EducationRegulation";

import EducationCategories from "./components/EducationCategories/EducationCategories";

import EducationPassportProcess from "./components/EducationPassportProcess/EducationPassportProcess";

import EducationApproval from "./components/EducationApproval/EducationApproval";

import EducationPassportCopies from "./components/EducationPassportCopies/EducationPassportCopies";

import EducationRestrictedDocuments from "./components/EducationRestrictedDocuments/EducationRestrictedDocuments";

import EducationServiceScope from "./components/EducationServiceScope/EducationServiceScope";

import EducationPricing from "./components/EducationPricing/EducationPricing";

import EducationRequiredDocuments from "./components/EducationRequiredDocuments/EducationRequiredDocuments";

import EducationPassportForm from "./components/EducationPassportForm/EducationPassportForm";

import EducationPassportActualization from "./components/EducationPassportActualization/EducationPassportActualization";

import EducationAudience from "./components/EducationAudience/EducationAudience";

import EducationCurrentRequirements from "./components/EducationCurrentRequirements/EducationCurrentRequirements";

import EducationRelatedLinks from "./components/EducationRelatedLinks/EducationRelatedLinks";

import EducationFaq from "./components/EducationFaq/EducationFaq";
import FinalCTA from "../../sections/FinalCTA/FinalCTA";
import { CITY } from "../../config/city";

export default function EducationPage({ objectType }) {
  const city = CITY;

  const regionalWorkText = getRegionalWorkText(city);

  return (
    <main id="main-content" className="education-page">
      <EducationHeroAndObjects
        objectType={objectType}
        regionalWorkText={regionalWorkText}
      />

      <EducationRegulation />

      <EducationCategories />

      <EducationPassportProcess />

      <EducationApproval />

      <EducationPassportCopies />

      <EducationRestrictedDocuments />

      <EducationServiceScope />

      <EducationPricing />

      <EducationRequiredDocuments />

      <EducationPassportForm />

      <EducationPassportActualization />

      <EducationAudience />

      <EducationCurrentRequirements />

      <EducationRelatedLinks />

      <EducationFaq />

      <FinalCTA />
    </main>
  );
}
