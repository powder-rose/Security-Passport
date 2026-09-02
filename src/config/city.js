const env = import.meta.env;

const baseDomain = env.VITE_BASE_DOMAIN?.trim() || 'pasport-bezopasnosty.ru';
const protocol = env.VITE_SITE_PROTOCOL?.trim() || 'https';
const siteOrigin = env.VITE_SITE_ORIGIN?.trim()?.replace(/\/$/, '');
const subdomain = env.VITE_CITY_SUBDOMAIN?.trim() || '';
const defaultFlag = env.VITE_CITY_IS_DEFAULT?.trim();

export const CITY = {
  name: env.VITE_CITY_NAME?.trim() || 'Россия',
  nameGenitive: env.VITE_CITY_GENITIVE?.trim() || 'России',
  namePrepositional: env.VITE_CITY_PREPOSITIONAL?.trim() || 'России',
  region: env.VITE_CITY_REGION?.trim() || 'Россия',
  address: env.VITE_CITY_ADDRESS?.trim() || '',
  subdomain,
  isDefault: defaultFlag ? defaultFlag === 'true' : !subdomain,
};

export function getCityUrl(city = CITY) {
  if (city.isDefault || !city.subdomain) {
    return siteOrigin || `${protocol}://${baseDomain}`;
  }

  return `${protocol}://${city.subdomain}.${baseDomain}`;
}
