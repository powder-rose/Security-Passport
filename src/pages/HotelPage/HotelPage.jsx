import './HotelPage.css';

import {
  getRegionalWorkText,
} from './hotelRegion';


import HotelHeroAndApplicability
from './components/HotelHeroAndApplicability';

import HotelRegulation
from './components/HotelRegulation';


import HotelCategories
from './components/HotelCategories';

import HotelPassportProcess
from './components/HotelPassportProcess';

import HotelApproval
from './components/HotelApproval';


import HotelServiceScope
from './components/HotelServiceScope';

import HotelPricing
from './components/HotelPricing';

import HotelRequiredDocuments
from './components/HotelRequiredDocuments';


import HotelPassportForm
from './components/HotelPassportForm';

import HotelPassportActualization
from './components/HotelPassportActualization';


import HotelAccommodationTypes
from './components/HotelAccommodationTypes';

import HotelCurrentRequirements
from './components/HotelCurrentRequirements';

import HotelWorkApproach
from './components/HotelWorkApproach';

import HotelFaq
from './components/HotelFaq';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';

export default function HotelPage({
  objectType,
}) {
  const city =
    useCity();

  const regionalWorkText =
    getRegionalWorkText(
      city,
    );

  return (
    <main
      id="main-content"
      className="hotel-page"
    >
      <HotelHeroAndApplicability
        objectType={objectType}
        regionalWorkText={regionalWorkText}
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
