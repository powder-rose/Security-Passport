const env = import.meta.env;

const baseDomain = env.VITE_BASE_DOMAIN?.trim() || 'boykovgroup.ru';
const protocol = env.VITE_SITE_PROTOCOL?.trim() || 'https';
const defaultUrl = (env.VITE_SITE_ORIGIN?.trim() || `${protocol}://${baseDomain}`).replace(/\/$/, '');

export const SITE = {
  brand: 'БОЙКОВГРУПП',
  legalName: 'ООО «СПЕЦКОНС»',
  baseDomain,
  defaultUrl,
  phone: '+7 (800) 201-20-43',
  phoneHref: 'tel:+78002012043',
  email: 'mail@pasport-bezopasnosty.ru',
  taxId: '5027310150',
  privacyUrl: env.VITE_PRIVACY_URL?.trim() || 'https://boykovgroup.ru/privacy',
  personalDataUrl: env.VITE_PERSONAL_DATA_URL?.trim() || 'https://boykovgroup.ru/personal-data',
  offerUrl: env.VITE_OFFER_URL?.trim() || 'https://boykovgroup.ru/oferta',
};
