const env = import.meta.env;

const baseDomain = env.VITE_BASE_DOMAIN?.trim() || 'pasport-bezopasnosty.ru';
const protocol = env.VITE_SITE_PROTOCOL?.trim() || 'https';
const defaultUrl = (env.VITE_SITE_ORIGIN?.trim() || `${protocol}://${baseDomain}`).replace(/\/$/, '');
const federalUrl = `${protocol}://${baseDomain}`.replace(/\/$/, '');

export const SITE = {
  brand: 'БОЙКОВГРУПП',
  legalName: 'ООО «СПЕЦКОНС»',
  baseDomain,
  defaultUrl,
  federalUrl,
  phone: '+7 (800) 201-20-43',
  phoneHref: 'tel:+78002012043',
  email: 'mail@pasport-bezopasnosty.ru',
  taxId: '5027310150',
  privacyUrl: `${federalUrl}/privacy/`,
  personalDataUrl: `${federalUrl}/personal-data/`,
  offerUrl: `${federalUrl}/oferta/`,
};
