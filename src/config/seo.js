import {
  getCityUrl,
  normalizeCity,
} from './city';

import { SITE } from './site';


export function buildSeo(inputCity) {
  const city =
    normalizeCity(inputCity);

  const canonical =
    getCityUrl(city);

  const title =
    city.hasTrustedInflection
      ? (
          `Разработка паспорта безопасности ` +
          `${city.locationPhrase} — ${SITE.brand}`
        )
      : (
          `Разработка паспорта безопасности: ` +
          `${city.locationSeo} — ${SITE.brand}`
        );

  const description =
    city.hasTrustedInflection
      ? (
          `Разработка и сопровождение паспорта ` +
          `безопасности объекта ${city.locationPhrase}. ` +
          `Категорирование, подготовка документа ` +
          `и сопровождение согласования.`
        )
      : (
          `Разработка и сопровождение паспорта ` +
          `безопасности объекта — ${city.locationSeo}. ` +
          `Категорирование, подготовка документа ` +
          `и сопровождение согласования.`
        );

  return {
    title,
    description,
    canonical,

    image:
      `${canonical}/images/nikolay-boykov-hero.webp`,
  };
}


export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.defaultUrl}/#organization`,

  name: SITE.brand,
  legalName: SITE.legalName,
  url: SITE.defaultUrl,
  email: SITE.email,
  telephone: SITE.phone,
  taxID: SITE.taxId,

  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SITE.phone,
    email: SITE.email,
    contactType: 'customer service',
    areaServed: 'RU',
    availableLanguage: ['ru'],
  },
};


function buildAreaServed(city) {
  if (
    city.isDefault ||
    city.type === 'country'
  ) {
    return {
      '@type': 'Country',
      name: 'Россия',
    };
  }

  if (city.type === 'region') {
    return {
      '@type': 'AdministrativeArea',
      name: city.name,
    };
  }

  return {
    '@type': 'City',
    name: city.name,
  };
}


export function buildServiceSchema(
  inputCity,
) {
  const city =
    normalizeCity(inputCity);

  const seo =
    buildSeo(city);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${seo.canonical}/#service`,

    name:
      'Разработка паспорта безопасности объекта',

    description:
      seo.description,

    url:
      seo.canonical,

    serviceType:
      'Разработка и сопровождение паспорта безопасности объекта',

    provider: {
      '@id':
        `${SITE.defaultUrl}/#organization`,
    },

    areaServed:
      buildAreaServed(city),
  };
}
