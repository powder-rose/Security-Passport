import './CrowdPage.css';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';


import CrowdHero
from './components/CrowdHero';

import CrowdApplicability
from './components/CrowdApplicability';

import CrowdRegime
from './components/CrowdRegime';


import CrowdRegulation
from './components/CrowdRegulation';

import CrowdListing
from './components/CrowdListing';

import CrowdCategories
from './components/CrowdCategories';

import CrowdPeopleCount
from './components/CrowdPeopleCount';


import CrowdPassportProcess
from './components/CrowdPassportProcess';

import CrowdFaq
from './components/CrowdFaq';


export default function CrowdPage() {
  return (
    <main
      id="main-content"
      className="crowd-page"
      data-crowd-stage="2"
    >

      <CrowdHero />

      <CrowdApplicability />

      <CrowdRegime />


      <CrowdRegulation />

      <CrowdListing />

      <CrowdCategories />

      <CrowdPeopleCount />


            <CrowdPassportProcess />

      <CrowdFaq />


      <FinalCTA />
    </main>
  );
}
