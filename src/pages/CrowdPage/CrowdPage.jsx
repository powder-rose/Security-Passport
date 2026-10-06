import './CrowdPage.css';
import './components/CrowdHero/CrowdHero.css';
import './components/CrowdApplicability/CrowdApplicability.css';
import './components/CrowdRegime/CrowdRegime.css';
import './CrowdPageResponsiveTop.css';
import './components/CrowdRegulation/CrowdRegulation.css';
import './components/CrowdListing/CrowdListing.css';
import './components/CrowdCategories/CrowdCategories.css';
import './components/CrowdPeopleCount/CrowdPeopleCount.css';
import './CrowdPageResponsiveMiddle.css';
import './components/CrowdPassportProcess/CrowdPassportProcess.css';
import './components/CrowdFaq/CrowdFaq.css';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

import CrowdHero from './components/CrowdHero/CrowdHero';

import CrowdApplicability from './components/CrowdApplicability/CrowdApplicability';

import CrowdRegime from './components/CrowdRegime/CrowdRegime';

import CrowdRegulation from './components/CrowdRegulation/CrowdRegulation';

import CrowdListing from './components/CrowdListing/CrowdListing';

import CrowdCategories from './components/CrowdCategories/CrowdCategories';

import CrowdPeopleCount from './components/CrowdPeopleCount/CrowdPeopleCount';

import CrowdPassportProcess from './components/CrowdPassportProcess/CrowdPassportProcess';

import CrowdFaq from './components/CrowdFaq/CrowdFaq';

export default function CrowdPage() {
  return (
    <main id="main-content" className="crowd-page">
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
