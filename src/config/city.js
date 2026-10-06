import { SITE } from './site';


export const CITY =
  Object.freeze({
    slug: '',
    subdomain: '',

    name: 'Россия',

    nameGenitive:
      'России',

    namePrepositional:
      'России',

    genitive:
      'России',

    prepositional:
      'России',

    region:
      'Россия',

    subject:
      'Россия',

    type:
      'country',

    address:
      'Проспект Мира 101 ст.1',

    inflectionMode:
      'trusted',

    hasTrustedInflection:
      true,

    locationPhrase:
      'в России',

    locationSeo:
      'в России',

    isDefault:
      true,
  });


export function normalizeCity() {
  return CITY;
}


export function getCityUrl() {
  return SITE.defaultUrl;
}
