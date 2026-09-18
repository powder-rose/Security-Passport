import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isIP } from 'node:net';

import maxmind from 'maxmind';

import {
  LOCATIONS,
  DEFAULT_LOCATION,
  getLocationBySlug,
} from '../config/geography/index.mjs';


const __dirname =
  path.dirname(
    fileURLToPath(import.meta.url),
  );

const projectRoot =
  path.resolve(
    __dirname,
    '..',
  );

const GEOIP_DB =
  path.resolve(
    projectRoot,
    process.env.GEOIP_DB ||
      'data/geoip/dbip-city-lite.mmdb',
  );


const MAX_CITY_DISTANCE_KM = 120;
const MAX_REGION_DISTANCE_KM = 100;


const ACTIVE_LOCATIONS =
  LOCATIONS.filter(
    (location) =>
      location.active &&
      !location.isDefault &&
      location.slug,
  );


const COORDINATE_LOCATIONS =
  ACTIVE_LOCATIONS.filter(
    (location) =>
      Number.isFinite(
        Number(location.latitude),
      ) &&
      Number.isFinite(
        Number(location.longitude),
      ),
  );


const REGIONS_BY_SUBJECT_CODE =
  new Map(
    ACTIVE_LOCATIONS
      .filter(
        (location) =>
          location.type === 'region' &&
          location.subjectCode,
      )
      .map(
        (location) => [
          String(location.subjectCode),
          location,
        ],
      ),
  );


const CITY_ALIASES =
  new Map([
    ['st-petersburg', 'spb'],
    ['saint-petersburg', 'spb'],
    ['st-petersburg-city', 'spb'],
    ['moskva', 'moscow'],
    ['yekaterinburg', 'ekaterinburg'],
  ]);


let readerPromise = null;


function normalizeLatinSlug(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .toLowerCase()
    .replace(
      /\([^)]*\)/g,
      ' ',
    )
    .replace(
      /['’`]/g,
      '',
    )
    .replace(
      /[^a-z0-9]+/g,
      '-',
    )
    .replace(
      /^-+|-+$/g,
      '');
}


function normalizeCitySlug(value = '') {
  const slug =
    normalizeLatinSlug(value);

  return (
    CITY_ALIASES.get(slug) ||
    slug
  );
}


function toNumber(value) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function haversineKm(
  lat1,
  lon1,
  lat2,
  lon2,
) {
  const earthRadiusKm = 6371;

  const toRadians =
    (value) =>
      value * Math.PI / 180;

  const dLat =
    toRadians(
      lat2 - lat1,
    );

  const dLon =
    toRadians(
      lon2 - lon1,
    );

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(
      toRadians(lat1),
    ) *
      Math.cos(
        toRadians(lat2),
      ) *
      Math.sin(dLon / 2) ** 2;

  return (
    earthRadiusKm *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )
  );
}


function getGeoCoordinates(geo) {
  const latitude =
    toNumber(
      geo?.location?.latitude,
    );

  const longitude =
    toNumber(
      geo?.location?.longitude,
    );

  if (
    latitude === null ||
    longitude === null
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}


function nearestLocation(
  locations,
  coordinates,
) {
  if (
    !coordinates ||
    !locations.length
  ) {
    return null;
  }

  let best = null;

  for (const location of locations) {
    const latitude =
      toNumber(
        location.latitude,
      );

    const longitude =
      toNumber(
        location.longitude,
      );

    if (
      latitude === null ||
      longitude === null
    ) {
      continue;
    }

    const distanceKm =
      haversineKm(
        coordinates.latitude,
        coordinates.longitude,
        latitude,
        longitude,
      );

    if (
      !best ||
      distanceKm <
        best.distanceKm
    ) {
      best = {
        location,
        distanceKm,
      };
    }
  }

  return best;
}


function federalResult(
  reason,
  extra = {},
) {
  return {
    kind: 'federal',
    reason,

    location: {
      slug:
        DEFAULT_LOCATION.slug,

      name:
        DEFAULT_LOCATION.name,

      type:
        DEFAULT_LOCATION.type,
    },

    ...extra,
  };
}


function regionalResult(
  location,
  reason,
  extra = {},
) {
  return {
    kind:
      location.type === 'region'
        ? 'region'
        : 'city',

    reason,

    location: {
      slug: location.slug,
      name: location.name,
      subject:
        location.subject ||
        location.region,

      subjectCode:
        location.subjectCode ||
        null,

      type:
        location.type,
    },

    ...extra,
  };
}


export function matchRussianGeo(
  geo,
) {
  const countryCode =
    String(
      geo?.country?.iso_code ||
      '',
    ).toUpperCase();

  if (countryCode !== 'RU') {
    return federalResult(
      'outside-russia',
      {
        detectedCountry:
          countryCode ||
          null,
      },
    );
  }


  const cityName =
    String(
      geo?.city?.names?.en ||
      geo?.city?.names?.ru ||
      '',
    ).trim();

  const citySlug =
    normalizeCitySlug(
      cityName,
    );

  const coordinates =
    getGeoCoordinates(
      geo,
    );


  if (citySlug) {
    const exact =
      getLocationBySlug(
        citySlug,
      );

    if (
      exact &&
      exact.active &&
      !exact.isDefault &&
      (
        exact.type === 'city' ||
        exact.type === 'locality'
      )
    ) {
      return regionalResult(
        exact,
        'exact-city-slug',
        {
          detectedCity:
            cityName,

          distanceKm:
            null,
        },
      );
    }


    const candidates =
      ACTIVE_LOCATIONS.filter(
        (location) =>
          (
            location.type === 'city' ||
            location.type === 'locality'
          ) &&
          (
            location.slug ===
              citySlug ||
            location.slug.startsWith(
              `${citySlug}-`,
            )
          ),
      );


    if (candidates.length === 1) {
      return regionalResult(
        candidates[0],
        'single-city-candidate',
        {
          detectedCity:
            cityName,

          distanceKm:
            null,
        },
      );
    }


    if (
      candidates.length > 1 &&
      coordinates
    ) {
      const nearest =
        nearestLocation(
          candidates,
          coordinates,
        );

      if (
        nearest &&
        nearest.distanceKm <=
          MAX_CITY_DISTANCE_KM
      ) {
        return regionalResult(
          nearest.location,
          'city-name-plus-coordinates',
          {
            detectedCity:
              cityName,

            distanceKm:
              Number(
                nearest.distanceKm
                  .toFixed(1),
              ),
          },
        );
      }
    }
  }


  /*
   * Если название города DB-IP
   * не удалось надёжно связать с
   * нашей географией, используем
   * координаты только для определения
   * субъекта РФ.
   *
   * Мы НЕ выбираем ближайший случайный
   * населённый пункт как город пользователя.
   */
  if (coordinates) {
    const nearest =
      nearestLocation(
        COORDINATE_LOCATIONS,
        coordinates,
      );

    if (
      nearest &&
      nearest.distanceKm <=
        MAX_REGION_DISTANCE_KM
    ) {
      const subjectCode =
        String(
          nearest.location
            .subjectCode ||
          '',
        );

      const region =
        REGIONS_BY_SUBJECT_CODE.get(
          subjectCode,
        );

      if (region) {
        return regionalResult(
          region,
          'coordinate-region-fallback',
          {
            detectedCity:
              cityName ||
              null,

            nearestReference: {
              slug:
                nearest.location.slug,

              name:
                nearest.location.name,
            },

            distanceKm:
              Number(
                nearest.distanceKm
                  .toFixed(1),
              ),
          },
        );
      }
    }
  }


  return federalResult(
    'no-safe-match',
    {
      detectedCity:
        cityName ||
        null,
    },
  );
}


async function getReader() {
  if (!readerPromise) {
    readerPromise =
      maxmind.open(
        GEOIP_DB,
      );
  }

  return readerPromise;
}


export async function resolveIpLocation(
  rawIp = '',
) {
  const ip =
    String(rawIp)
      .trim()
      .replace(
        /^::ffff:/,
        '',
      );

  if (!isIP(ip)) {
    return federalResult(
      'invalid-ip',
    );
  }

  try {
    const reader =
      await getReader();

    const geo =
      reader.get(ip);

    if (!geo) {
      return federalResult(
        'geoip-not-found',
      );
    }

    return {
      ip,
      geo: {
        country:
          geo?.country?.iso_code ||
          null,

        city:
          geo?.city?.names?.en ||
          geo?.city?.names?.ru ||
          null,

        subdivision:
          geo?.subdivisions?.[0]
            ?.names?.en ||
          geo?.subdivisions?.[0]
            ?.names?.ru ||
          null,

        latitude:
          geo?.location?.latitude ??
          null,

        longitude:
          geo?.location?.longitude ??
          null,
      },

      ...matchRussianGeo(
        geo,
      ),
    };
  } catch (error) {
    return federalResult(
      'geoip-error',
      {
        error:
          error?.message ||
          String(error),
      },
    );
  }
}
