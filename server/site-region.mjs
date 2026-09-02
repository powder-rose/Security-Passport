import {
  BASE_DOMAIN,
  DEFAULT_REGION,
  REGIONS,
} from '../config/regions.mjs';

const regionsBySlug = new Map(
  REGIONS.map((region) => [region.slug.toLowerCase(), region]),
);

export function resolveSiteFromHost(rawHost = '') {
  const host = String(rawHost)
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '');

  if (
    !host ||
    host === BASE_DOMAIN ||
    host === `www.${BASE_DOMAIN}`
  ) {
    return {
      slug: 'russia',
      name: DEFAULT_REGION.name,
      host: BASE_DOMAIN,
      isDefault: true,
    };
  }

  const suffix = `.${BASE_DOMAIN}`;

  if (!host.endsWith(suffix)) {
    return {
      slug: 'unknown',
      name: 'Не определён',
      host,
      isDefault: false,
    };
  }

  const slug = host.slice(0, -suffix.length);
  const region = regionsBySlug.get(slug);

  if (!region) {
    return {
      slug,
      name: slug,
      host,
      isDefault: false,
    };
  }

  return {
    slug: region.slug,
    name: region.name,
    host,
    isDefault: false,
  };
}
