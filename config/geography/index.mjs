import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname =
  path.dirname(fileURLToPath(import.meta.url));

const LOCATIONS_FILE =
  path.join(__dirname, 'locations.json');

function validateLocation(location, index) {
  if (!location || typeof location !== 'object') {
    throw new Error(
      `Geography #${index + 1}: invalid object`,
    );
  }

  if (typeof location.slug !== 'string') {
    throw new Error(
      `Geography #${index + 1}: slug required`,
    );
  }

  const inflectionMode =
    location.inflectionMode === 'neutral'
      ? 'neutral'
      : 'trusted';

  if (
    location.inflectionMode !== undefined &&
    location.inflectionMode !== 'trusted' &&
    location.inflectionMode !== 'neutral'
  ) {
    throw new Error(
      `Geography "${location.slug}": invalid inflectionMode`,
    );
  }

  for (const field of [
    'name',
    'region',
  ]) {
    if (
      typeof location[field] !== 'string' ||
      !location[field].trim()
    ) {
      throw new Error(
        `Geography "${location.slug}": ${field} required`,
      );
    }
  }

  const genitive =
    typeof location.genitive === 'string'
      ? location.genitive.trim()
      : '';

  const prepositional =
    typeof location.prepositional === 'string'
      ? location.prepositional.trim()
      : '';

  if (
    inflectionMode === 'trusted' &&
    (
      !genitive ||
      !prepositional
    )
  ) {
    throw new Error(
      `Geography "${location.slug}": trusted inflection requires genitive and prepositional`,
    );
  }

  if (
    location.slug &&
    !/^[a-z0-9-]+$/.test(location.slug)
  ) {
    throw new Error(
      `Geography "${location.slug}": invalid slug`,
    );
  }

  return Object.freeze({
    ...location,

    slug:
      location.slug.trim(),

    genitive,
    prepositional,
    inflectionMode,

    active:
      location.active !== false,

    isDefault:
      location.isDefault === true,

    priority:
      Number(location.priority || 0),
  });
}

const raw = JSON.parse(
  fs.readFileSync(
    LOCATIONS_FILE,
    'utf8',
  ),
);

if (!Array.isArray(raw)) {
  throw new Error(
    'Geography locations.json must contain an array',
  );
}

const validatedLocations =
  raw.map(validateLocation);


function getSeoPhraseKey(location) {
  const hasTrustedInflection =
    location.inflectionMode === 'trusted' &&
    Boolean(
      location.genitive &&
      location.prepositional,
    );

  if (hasTrustedInflection) {
    return (
      `trusted:` +
      location.prepositional
        .trim()
        .toLocaleLowerCase('ru-RU')
    );
  }

  const name =
    String(
      location.name || '',
    ).trim();

  const subject =
    String(
      location.subject ||
      location.region ||
      '',
    ).trim();

  const locationSeo =
    subject &&
    subject !== name
      ? `${name}, ${subject}`
      : name;

  return (
    `neutral:` +
    locationSeo.toLocaleLowerCase('ru-RU')
  );
}


const seoPhraseCounts =
  new Map();


for (const location of validatedLocations) {
  if (
    !location.active ||
    location.isDefault ||
    !location.slug ||
    location.seoIndexable !== true
  ) {
    continue;
  }

  const key =
    getSeoPhraseKey(location);

  seoPhraseCounts.set(
    key,
    (
      seoPhraseCounts.get(key) ||
      0
    ) + 1,
  );
}


export const LOCATIONS =
  Object.freeze(
    validatedLocations.map(
      (location) => {
        const subject =
          String(
            location.subject ||
            location.region ||
            '',
          ).trim();

        const seoPhraseKey =
          getSeoPhraseKey(location);

        const seoNeedsSubject =
          Boolean(
            location.active &&
            !location.isDefault &&
            location.slug &&
            location.seoIndexable === true &&
            (
              seoPhraseCounts.get(
                seoPhraseKey,
              ) || 0
            ) > 1 &&
            subject &&
            subject !== location.name,
          );

        return Object.freeze({
          ...location,
          seoNeedsSubject,
        });
      },
    ),
  );


const locationsBySlug =
  new Map();

for (const location of LOCATIONS) {
  if (locationsBySlug.has(location.slug)) {
    throw new Error(
      `Duplicate geography slug: "${location.slug}"`,
    );
  }

  locationsBySlug.set(
    location.slug,
    location,
  );
}

export const DEFAULT_LOCATION =
  LOCATIONS.find(
    (location) =>
      location.isDefault,
  );

if (!DEFAULT_LOCATION) {
  throw new Error(
    'Default geography is missing',
  );
}

if (
  LOCATIONS.filter(
    (location) =>
      location.isDefault,
  ).length !== 1
) {
  throw new Error(
    'Exactly one default geography is required',
  );
}

export function getLocationBySlug(slug = '') {
  return (
    locationsBySlug.get(
      String(slug).trim().toLowerCase(),
    ) || null
  );
}

export function getActiveLocations() {
  return LOCATIONS.filter(
    (location) => location.active,
  );
}

export function getRegionalLocations() {
  return getActiveLocations().filter(
    (location) =>
      !location.isDefault &&
      location.slug,
  );
}
