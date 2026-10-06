import "./HotelPage.css";
import "./components/HotelHeroAndApplicability/HotelHeroAndApplicability.css";
import "./components/HotelRegulation/HotelRegulation.css";
import "./HotelPageResponsiveHeroRegulation.css";
import "./components/HotelCategories/HotelCategories.css";
import "./components/HotelPassportProcess/HotelPassportProcess.css";
import "./components/HotelApproval/HotelApproval.css";
import "./HotelPageResponsiveCategoriesProcessApproval.css";
import "./components/HotelServiceScope/HotelServiceScope.css";
import "./components/HotelPricing/HotelPricing.css";
import "./components/HotelRequiredDocuments/HotelRequiredDocuments.css";
import "./HotelPageResponsiveServicePricingDocuments.css";
import "./components/HotelPassportForm/HotelPassportForm.css";
import "./components/HotelPassportActualization/HotelPassportActualization.css";
import "./components/HotelAccommodationTypes/HotelAccommodationTypes.css";
import "./components/HotelCurrentRequirements/HotelCurrentRequirements.css";
import "./HotelPageResponsiveFormActualizationAccommodation.css";
import "./components/HotelWorkApproach/HotelWorkApproach.css";
import "./components/HotelFaq/HotelFaq.css";
import "./HotelPageResponsiveWorkFaq.css";
import "./HotelPageSharedPresentation.css";

import HotelHeroAndApplicability from "./components/HotelHeroAndApplicability/HotelHeroAndApplicability";

import HotelRegulation from "./components/HotelRegulation/HotelRegulation";

import HotelCategories from "./components/HotelCategories/HotelCategories";

import HotelPassportProcess from "./components/HotelPassportProcess/HotelPassportProcess";

import HotelApproval from "./components/HotelApproval/HotelApproval";

import HotelServiceScope from "./components/HotelServiceScope/HotelServiceScope";

import HotelPricing from "./components/HotelPricing/HotelPricing";

import HotelRequiredDocuments from "./components/HotelRequiredDocuments/HotelRequiredDocuments";

import HotelPassportForm from "./components/HotelPassportForm/HotelPassportForm";

import HotelPassportActualization from "./components/HotelPassportActualization/HotelPassportActualization";

import HotelAccommodationTypes from "./components/HotelAccommodationTypes/HotelAccommodationTypes";

import HotelCurrentRequirements from "./components/HotelCurrentRequirements/HotelCurrentRequirements";

import HotelWorkApproach from "./components/HotelWorkApproach/HotelWorkApproach";

import HotelFaq from "./components/HotelFaq/HotelFaq";
import FinalCTA from "../../sections/FinalCTA/FinalCTA";

export default function HotelPage({ objectType }) {
  return (
    <main id="main-content" className="hotel-page">
      <HotelHeroAndApplicability
        objectType={objectType}
      />

      <HotelRegulation />

      <HotelCategories />

      <HotelPassportProcess />

      <HotelApproval />

      <HotelServiceScope />

      <HotelPricing />

      <HotelRequiredDocuments />

      <HotelPassportForm />

      <HotelPassportActualization />

      <HotelAccommodationTypes />

      <HotelCurrentRequirements />

      <HotelWorkApproach />

      <HotelFaq />

      <FinalCTA />
    </main>
  );
}
