export const BASE_DOMAIN = 'pasport-bezopasnosty.ru';
export const SITE_PROTOCOL = 'https';

export const DEFAULT_REGION = {
  slug: '',
  name: 'Россия',
  genitive: 'России',
  prepositional: 'России',
  region: 'Россия',
  cdekAddress: '',
  active: true,
  isDefault: true,
};

export const REGIONS = [
  {
    slug: 'moscow',
    name: 'Москва',
    genitive: 'Москвы',
    prepositional: 'Москве',
    region: 'Москва',
    cdekAddress: '',
    active: true,
    isDefault: false,
  },
  {
    slug: 'spb',
    name: 'Санкт-Петербург',
    genitive: 'Санкт-Петербурга',
    prepositional: 'Санкт-Петербурге',
    region: 'Санкт-Петербург',
    cdekAddress: '',
    active: true,
    isDefault: false,
  },
  {
    slug: 'kazan',
    name: 'Казань',
    genitive: 'Казани',
    prepositional: 'Казани',
    region: 'Казань',
    cdekAddress: '',
    active: true,
    isDefault: false,
  },
];

export function getRegionBySlug(slug) {
  return REGIONS.find((region) => region.slug === slug) || null;
}

export function getActiveRegions() {
  return REGIONS.filter((region) => region.active);
}
