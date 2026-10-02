import './CulturePage.css';


import CultureHeroAndObjects
from './components/CultureHeroAndObjects';

import CultureRegulationAndCategories
from './components/CultureRegulationAndCategories';

import CultureCategorization
from './components/CultureCategorization';

import CultureActAndPassport
from './components/CultureActAndPassport';

import CultureApprovalAndRestrictions
from './components/CultureApprovalAndRestrictions';


import CultureServiceScope
from './components/CultureServiceScope';

import CulturePricing
from './components/CulturePricing';

import CultureRequiredDocuments
from './components/CultureRequiredDocuments';


import CulturePassportForm
from './components/CulturePassportForm';

import CulturePassportActualization
from './components/CulturePassportActualization';

import CultureCurrentRequirements
from './components/CultureCurrentRequirements';


import CultureWorkApproach
from './components/CultureWorkApproach';

import CultureFaq
from './components/CultureFaq';import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


// CULTURE_REGIONAL_WORK_TEXT_V1:start

function getNeutralCultureRegionPrepositional(
  name,
) {
  const value =
    String(name || '').trim();

  if (!value) {
    return '';
  }

  const parts =
    value.split(' — ');

  let head =
    parts[0];

  const tail =
    parts.length > 1
      ? ` — ${parts.slice(1).join(' — ')}`
      : '';

  if (
    head.startsWith(
      'Республика ',
    )
  ) {
    return (
      `Республике ${head.slice(
        'Республика '.length,
      )}${tail}`
    );
  }

  if (
    head.endsWith(
      ' Республика',
    )
  ) {
    head = head
      .replace(
        /ская Республика$/,
        'ской Республике',
      )
      .replace(
        /цкая Республика$/,
        'цкой Республике',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' область',
    )
  ) {
    head = head
      .replace(
        /ская /g,
        'ской ',
      )
      .replace(
        /цкая /g,
        'цкой ',
      )
      .replace(
        /ная /g,
        'ной ',
      )
      .replace(
        /яя /g,
        'ей ',
      )
      .replace(
        / область$/,
        ' области',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' край',
    )
  ) {
    head = head
      .replace(
        /ский край$/,
        'ском крае',
      )
      .replace(
        /цкий край$/,
        'цком крае',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' автономный округ',
    )
  ) {
    head = head
      .replace(
        /ский автономный округ$/,
        'ском автономном округе',
      )
      .replace(
        /цкий автономный округ$/,
        'цком автономном округе',
      );

    return `${head}${tail}`;
  }

  return '';
}


function getCultureRegionalWorkText(
  currentCity,
) {
  if (
    !currentCity ||
    currentCity.isDefault
  ) {
    return '';
  }

  if (
    currentCity.prepositional
  ) {
    return (
      `Работаем в ` +
      `${currentCity.prepositional}.`
    );
  }

  if (
    currentCity.type === 'region'
  ) {
    const regionName =
      getNeutralCultureRegionPrepositional(
        currentCity.name,
      );

    if (regionName) {
      return (
        `Работаем в ${regionName}.`
      );
    }

    return (
      `Работаем в регионе ` +
      `«${currentCity.name}».`
    );
  }

  if (
    currentCity.type === 'city'
  ) {
    return (
      `Работаем в городе ` +
      `«${currentCity.name}».`
    );
  }

  return (
    `Работаем в населённом пункте ` +
    `«${currentCity.name}».`
  );
}

// CULTURE_REGIONAL_WORK_TEXT_V1:end


export default function CulturePage({
  objectType,
}) {
  const city =
    useCity();

  const regionalWorkText =
    getCultureRegionalWorkText(
      city,
    );

  return (
    <main
      id="main-content"
      className="culture-page"
    >
      <CultureHeroAndObjects
        objectType={objectType}
        regionalWorkText={regionalWorkText}
      />


      <CultureRegulationAndCategories />


      <CultureCategorization />


      <CultureActAndPassport />


      <CultureApprovalAndRestrictions />


      <CultureServiceScope />

      <CulturePricing />

      <CultureRequiredDocuments />


      <CulturePassportForm />

      <CulturePassportActualization />

      <CultureCurrentRequirements />


      <CultureWorkApproach />

      <CultureFaq />


      <FinalCTA />

</main>
  );
}
