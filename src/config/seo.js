import { CITY, getCityUrl } from './city';
import { SITE } from './site';

const canonical = getCityUrl(CITY);

export const seo = {
  title: `Разработка паспорта безопасности в ${CITY.namePrepositional} — ${SITE.brand}`,
  description: `Разработка и сопровождение паспорта безопасности объекта в ${CITY.namePrepositional}. Категорирование, подготовка документа и сопровождение согласования.`,
  canonical,
  image: `${canonical}/images/nikolay-boykov-hero.webp`,
};

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

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${canonical}/#service`,
  name: 'Разработка паспорта безопасности объекта',
  description: seo.description,
  url: canonical,
  serviceType: 'Разработка и сопровождение паспорта безопасности объекта',
  provider: {
    '@id': `${SITE.defaultUrl}/#organization`,
  },
  areaServed: CITY.isDefault
    ? { '@type': 'Country', name: 'Россия' }
    : { '@type': 'City', name: CITY.name },
};
