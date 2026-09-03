const env = import.meta.env;

const baseDomain =
  env.VITE_BASE_DOMAIN?.trim() ||
  'pasport-bezopasnosty.ru';

const protocol =
  env.VITE_SITE_PROTOCOL?.trim() ||
  'https';

const siteOrigin =
  env.VITE_SITE_ORIGIN
    ?.trim()
    ?.replace(/\/$/, '');

const envSubdomain =
  env.VITE_CITY_SUBDOMAIN?.trim() ||
  '';

const defaultFlag =
  env.VITE_CITY_IS_DEFAULT?.trim();


export function normalizeCity(input = {}) {
  const subdomain =
    String(
      input.subdomain ??
      input.slug ??
      '',
    ).trim();

  const isDefault =
    typeof input.isDefault === 'boolean'
      ? input.isDefault
      : !subdomain;

  const name =
    String(
      input.name ||
      'Россия',
    ).trim();

  const region =
    String(
      input.region ||
      name,
    ).trim();

  const subject =
    String(
      input.subject ||
      region ||
      name,
    ).trim();

  const requestedInflectionMode =
    input.inflectionMode === 'neutral'
      ? 'neutral'
      : 'trusted';

  const nameGenitive =
    String(
      input.nameGenitive ??
      input.genitive ??
      (isDefault ? 'России' : ''),
    ).trim();

  const namePrepositional =
    String(
      input.namePrepositional ??
      input.prepositional ??
      (isDefault ? 'России' : ''),
    ).trim();

  const hasTrustedInflection =
    requestedInflectionMode === 'trusted' &&
    Boolean(
      nameGenitive &&
      namePrepositional
    );

  const inflectionMode =
    hasTrustedInflection
      ? 'trusted'
      : 'neutral';

  const locationPhrase =
    hasTrustedInflection
      ? `в ${namePrepositional}`
      : name;

  const locationSeo =
    hasTrustedInflection
      ? locationPhrase
      : (
          subject &&
          subject !== name
            ? `${name}, ${subject}`
            : name
        );

  return {
    ...input,

    slug:
      String(
        input.slug ?? subdomain,
      ).trim(),

    subdomain,

    name,
    nameGenitive,
    namePrepositional,

    genitive:
      nameGenitive,

    prepositional:
      namePrepositional,

    region,
    subject,

    type:
      String(
        input.type ||
        (isDefault ? 'country' : 'city'),
      ).trim(),

    address:
      String(
        input.address || '',
      ).trim(),

    inflectionMode,
    hasTrustedInflection,

    locationPhrase,
    locationSeo,

    isDefault,
  };
}


export const CITY =
  normalizeCity({
    slug: envSubdomain,
    subdomain: envSubdomain,

    name:
      env.VITE_CITY_NAME?.trim() ||
      'Россия',

    genitive:
      env.VITE_CITY_GENITIVE?.trim() ||
      'России',

    prepositional:
      env.VITE_CITY_PREPOSITIONAL?.trim() ||
      'России',

    region:
      env.VITE_CITY_REGION?.trim() ||
      'Россия',

    address:
      env.VITE_CITY_ADDRESS?.trim() ||
      '',

    type:
      envSubdomain
        ? 'city'
        : 'country',

    isDefault:
      defaultFlag
        ? defaultFlag === 'true'
        : !envSubdomain,
  });


export function getCityUrl(city = CITY) {
  const current =
    normalizeCity(city);

  if (
    current.isDefault ||
    !current.subdomain
  ) {
    return (
      siteOrigin ||
      `${protocol}://${baseDomain}`
    );
  }

  return (
    `${protocol}://` +
    `${current.subdomain}.` +
    `${baseDomain}`
  );
}
