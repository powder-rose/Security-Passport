import './CategorizationActPage.css';


import CategorizationActHeroAndIntro
from './components/CategorizationActHeroAndIntro';

import CategorizationActObjectTypes
from './components/CategorizationActObjectTypes';

import CategorizationActRequirements
from './components/CategorizationActRequirements';


import CategorizationActProcess
from './components/CategorizationActProcess';

import CategorizationActServiceScope
from './components/CategorizationActServiceScope';

import CategorizationActPricing
from './components/CategorizationActPricing';

import CategorizationActSourceData
from './components/CategorizationActSourceData';


import CategorizationActSample
from './components/CategorizationActSample';

import CategorizationActStandard
from './components/CategorizationActStandard';

import CategorizationActDifference
from './components/CategorizationActDifference';

import CategorizationActFaq
from './components/CategorizationActFaq';

import Expert from '../../sections/Expert/Expert';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';


export default function CategorizationActPage() {


  return (
    <main
      id="main-content"
      className="categorization-act-page"
    >
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
