import { SITE } from './site';

import { getObjectTypeByPathname } from '../data/objectTypes';

import { getServicePageByPathname } from '../data/servicePages';

function buildCanonical(pathname) {
  const baseUrl = SITE.defaultUrl.replace(/\/$/, '');

  const objectType = getObjectTypeByPathname(pathname);

  const servicePage = getServicePageByPathname(pathname);

  const pagePath = objectType?.path || servicePage?.path;

  return pagePath ? `${baseUrl}${pagePath}` : baseUrl;
}

export function buildSeo(pathname = '/') {
  const objectType = getObjectTypeByPathname(pathname);

  const servicePage = getServicePageByPathname(pathname);

  const baseUrl = SITE.defaultUrl.replace(/\/$/, '');

  const canonical = buildCanonical(pathname);

  let title;
  let description;

  if (servicePage) {
    const serviceSeoTitle = servicePage.seoTitle || servicePage.seoName;

    const serviceSeoDescription = servicePage.seoDescription || servicePage.description;

    title = `${serviceSeoTitle} | ` + `${SITE.brand}`;

    description = serviceSeoDescription;
  } else if (objectType) {
    const objectSeoTitle =
      objectType.seoTitle || `${objectType.seoName} — ` + `разработка от 9 500 ₽`;

    const objectSeoDescription =
      objectType.seoDescription ||
      `${objectType.seoName} от 9 500 ₽. ` +
        `Категорирование, акт обследования, ` +
        `разработка паспорта и сопровождение ` +
        `согласования. ${SITE.brand}.`;

    title = `${objectSeoTitle} | ${SITE.brand}`;

    description = objectSeoDescription;
  } else {
    title = `Разработка паспорта безопасности объекта — ` + `от 9 500 ₽ | ${SITE.brand}`;

    description =
      `Разработка паспорта безопасности объекта от 9 500 ₽. ` +
      `Категорирование, акт обследования, паспорт и ` +
      `сопровождение согласования. БОЙКОВГРУПП.`;
  }

  return {
    title,
    description,
    canonical,

    image: `${baseUrl}/images/og-passport-security.png`,
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

export function buildServiceSchema(pathname = '/') {
  const objectType = getObjectTypeByPathname(pathname);

  const servicePage = getServicePageByPathname(pathname);

  const seo = buildSeo(pathname);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',

    '@id': `${seo.canonical.replace(/\/$/, '')}/#service`,

    name: servicePage?.seoName || objectType?.seoName || 'Разработка паспорта безопасности объекта',

    description: seo.description,

    url: seo.canonical,

    serviceType: servicePage
      ? servicePage.seoName
      : objectType
        ? `Разработка и сопровождение: ` + `${objectType.seoName}`
        : 'Разработка и сопровождение ' + 'паспорта безопасности объекта',

    provider: {
      '@id': `${SITE.defaultUrl}/#organization`,
    },

    areaServed: {
      '@type': 'Country',
      name: 'Россия',
    },
  };
}
