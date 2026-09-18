import {
  getCityUrl,
  normalizeCity,
} from './city';

import { SITE } from './site';

import {
  getObjectTypeByPathname,
} from '../data/objectTypes';

import {
  getServicePageByPathname,
} from '../data/servicePages';


function buildCanonical(
  city,
  pathname,
) {
  const baseUrl =
    getCityUrl(city)
      .replace(/\/$/, '');

  const objectType =
    getObjectTypeByPathname(
      pathname,
    );

  const servicePage =
    getServicePageByPathname(
      pathname,
    );

  const pagePath =
    objectType?.path ||
    servicePage?.path;

  if (!pagePath) {
    return baseUrl;
  }

  return (
    `${baseUrl}${pagePath}`
  );
}


export function buildSeo(
  inputCity,
  pathname = '/',
) {
  const city =
    normalizeCity(inputCity);

  const objectType =
    getObjectTypeByPathname(
      pathname,
    );

  const servicePage =
    getServicePageByPathname(
      pathname,
    );

  const cityBaseUrl =
    getCityUrl(city)
      .replace(/\/$/, '');

  const canonical =
    buildCanonical(
      city,
      pathname,
    );

  const seoTitleLocation =
    city.seoNeedsSubject &&
    city.subject &&
    city.subject !== city.name
      ? `${city.name}, ${city.subject}`
      : city.locationSeo;


  let title;
  let description;


  if (servicePage) {
    const serviceSeoTitle =
      servicePage.seoTitle ||
      servicePage.seoName;

    const serviceSeoDescription =
      servicePage.seoDescription ||
      servicePage.description;

    const serviceRegionalDescription =
      servicePage.regionalDescription ||
      servicePage.description;


    title =
      city.isDefault
        ? (
            `${serviceSeoTitle} | ` +
            `${SITE.brand}`
          )
        : city.hasTrustedInflection &&
          !city.seoNeedsSubject
          ? (
              `${servicePage.seoName} ` +
              `${city.locationPhrase} | ${SITE.brand}`
            )
          : (
              `${servicePage.seoName} — ` +
              `${seoTitleLocation} | ${SITE.brand}`
            );


    description =
      city.isDefault
        ? serviceSeoDescription
        : city.hasTrustedInflection &&
          !city.seoNeedsSubject
          ? (
              `${servicePage.seoName} ` +
              `${city.locationPhrase}. ` +
              `${serviceRegionalDescription}`
            )
          : (
              `${servicePage.seoName} — ` +
              `${seoTitleLocation}. ` +
              `${serviceRegionalDescription}`
            );

  } else if (objectType) {
    title =
      city.isDefault
        ? (
            `${objectType.seoName} — ` +
            `разработка от 9 500 ₽ | ${SITE.brand}`
          )
        : city.hasTrustedInflection &&
          !city.seoNeedsSubject
          ? (
              `${objectType.seoName} ` +
              `${city.locationPhrase} | ${SITE.brand}`
            )
          : (
              `${objectType.seoName} — ` +
              `${seoTitleLocation} | ${SITE.brand}`
            );

    description =
      city.isDefault
        ? (
            `${objectType.seoName} от 9 500 ₽. ` +
            `Категорирование, акт обследования, ` +
            `разработка паспорта и сопровождение ` +
            `согласования. ${SITE.brand}.`
          )
        : city.hasTrustedInflection &&
          !city.seoNeedsSubject
          ? (
              `${objectType.seoName} ` +
              `${city.locationPhrase}. ` +
              `Категорирование, акт обследования, ` +
              `разработка паспорта и сопровождение согласования.`
            )
          : (
              `${objectType.seoName}: ` +
              `${seoTitleLocation}. ` +
              `Категорирование, акт обследования, ` +
              `разработка паспорта и сопровождение согласования.`
            );
  } else {
    title =
      city.isDefault
        ? (
            `Разработка паспорта безопасности объекта — ` +
            `от 9 500 ₽ | ${SITE.brand}`
          )
        : city.seoNeedsSubject
          ? (
              `Паспорт безопасности — ` +
              `${seoTitleLocation} | ${SITE.brand}`
            )
          : city.hasTrustedInflection
            ? (
                `Паспорт безопасности ` +
                `${city.locationPhrase} | ${SITE.brand}`
              )
            : (
                `Паспорт безопасности — ` +
                `${seoTitleLocation} | ${SITE.brand}`
              );

    description =
      city.isDefault
        ? (
            `Разработка паспорта безопасности объекта от 9 500 ₽. ` +
            `Категорирование, акт обследования, паспорт и ` +
            `сопровождение согласования. БОЙКОВГРУПП.`
          )
        : (
            city.hasTrustedInflection &&
            !city.seoNeedsSubject
          )
          ? (
              `Разработка паспорта безопасности объекта ` +
              `${city.locationPhrase}. ` +
              `Категорирование, подготовка документа ` +
              `и сопровождение согласования.`
            )
          : (
              `Разработка паспорта безопасности объекта: ` +
              `${seoTitleLocation}. ` +
              `Категорирование, подготовка документа ` +
              `и сопровождение согласования.`
            );
  }


  return {
    title,
    description,
    canonical,

    image:
      `${cityBaseUrl}/images/og-passport-security.png`,
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

  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE.defaultUrl}/#logo`,
    url: `${SITE.defaultUrl}/favicon.png`,
    contentUrl: `${SITE.defaultUrl}/favicon.png`,
    width: 256,
    height: 256,
    caption: SITE.brand,
  },

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

  const subject =
    String(
      city.subject ||
      city.region ||
      '',
    ).trim();

  const area = {
    '@type': 'City',
    name: city.name,
  };

  if (
    subject &&
    subject !== city.name
  ) {
    area.containedInPlace = {
      '@type': 'AdministrativeArea',
      name: subject,
    };
  }

  return area;
}


export function buildServiceSchema(
  inputCity,
  pathname = '/',
) {
  const city =
    normalizeCity(inputCity);

  const objectType =
    getObjectTypeByPathname(
      pathname,
    );

  const servicePage =
    getServicePageByPathname(
      pathname,
    );

  const seo =
    buildSeo(
      city,
      pathname,
    );

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${seo.canonical.replace(/\/$/, '')}/#service`,

    name:
      servicePage?.seoName ||
      objectType?.seoName ||
      'Разработка паспорта безопасности объекта',

    description:
      seo.description,

    url:
      seo.canonical,

    serviceType:
      servicePage
        ? servicePage.seoName
        : objectType
          ? `Разработка и сопровождение: ${objectType.seoName}`
          : 'Разработка и сопровождение паспорта безопасности объекта',

    provider: {
      '@id':
        `${SITE.defaultUrl}/#organization`,
    },

    areaServed:
      buildAreaServed(city),
  };
}
