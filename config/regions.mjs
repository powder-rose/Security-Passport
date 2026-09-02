export const BASE_DOMAIN = 'pasport-bezopasnosty.ru';
export const SITE_PROTOCOL = 'https';

export const DEFAULT_REGION = {
  slug: '',
  name: 'Россия',
  genitive: 'России',
  prepositional: 'России',
  region: 'Россия',
  address: 'Проспект Мира 101 ст.1',
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
    address: 'Проспект Мира 101 ст.1',
    active: true,
    isDefault: false,
  },
  {
    slug: 'spb',
    name: 'Санкт-Петербург',
    genitive: 'Санкт-Петербурга',
    prepositional: 'Санкт-Петербурге',
    region: 'Санкт-Петербург',
    address: 'Лиговский проспект, 50, лит. Х',
    active: true,
    isDefault: false,
  },
  {
    slug: 'kazan',
    name: 'Казань',
    genitive: 'Казани',
    prepositional: 'Казани',
    region: 'Казань',
    address: 'ул. Восстания, 16',
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
