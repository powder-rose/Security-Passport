import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_LOCATION,
  getLocationBySlug,
} from '../config/geography/index.mjs';

import { resolveSiteFromHost } from './site-region.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const LEADS_FILE = path.resolve(
  projectRoot,
  process.env.LEADS_FILE || 'data/leads.jsonl',
);

const VISITS_FILE = path.resolve(
  projectRoot,
  process.env.VISITS_FILE || 'data/visits.jsonl',
);

const DAY_MS = 24 * 60 * 60 * 1000;
const MOSCOW_OFFSET_MS = 3 * 60 * 60 * 1000;

export const STAT_PERIODS = [
  { key: 'day', label: 'Сутки', days: 1 },
  { key: '7days', label: '7 дней', days: 7 },
  { key: '30days', label: '30 дней', days: 30 },
  { key: '365days', label: '365 дней', days: 365 },
];

async function readJsonLines(filePath) {
  let content = '';

  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  const rows = [];

  for (const line of content.split('\n')) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    try {
      rows.push(JSON.parse(trimmed));
    } catch {
      // Одна повреждённая строка не должна ломать весь отчёт.
    }
  }

  return rows;
}

function getStartOfMoscowDay(date = new Date()) {
  const shifted = date.getTime() + MOSCOW_OFFSET_MS;

  return (
    Math.floor(shifted / DAY_MS) * DAY_MS
    - MOSCOW_OFFSET_MS
  );
}

function getPeriodRange(days, now = new Date()) {
  const endMs = getStartOfMoscowDay(now);
  const startMs = endMs - days * DAY_MS;

  return {
    startMs,
    endMs,
    start: new Date(startMs).toISOString(),
    end: new Date(endMs).toISOString(),
  };
}

function getTimestamp(row, type) {
  const value = type === 'lead'
    ? row.receivedAt || row.submittedAt
    : row.receivedAt;

  const timestamp = Date.parse(value || '');

  return Number.isFinite(timestamp) ? timestamp : null;
}

const LEGACY_SITE_SLUGS = new Map([
  ['gay', 'gai'],
]);


function normalizeStatisticsSite(
  site,
) {
  const rawSlug =
    String(
      site?.slug ||
      '',
    )
      .trim()
      .toLowerCase();

  if (!rawSlug) {
    return {
      slug: 'unknown',
      name: 'Не определён',
    };
  }

  const slug =
    LEGACY_SITE_SLUGS.get(
      rawSlug,
    ) ||
    rawSlug;

  if (slug === 'russia') {
    return {
      slug: 'russia',
      name: DEFAULT_LOCATION.name,
    };
  }

  const location =
    getLocationBySlug(
      slug,
    );

  if (location) {
    return {
      slug: location.slug,
      name: location.name,
    };
  }

  return {
    slug,
    name:
      site?.name ||
      slug,
  };
}


function resolveLeadSite(lead) {
  if (
    lead?.site?.slug &&
    lead?.site?.name
  ) {
    return normalizeStatisticsSite(
      lead.site,
    );
  }

  if (lead?.page) {
    try {
      const url = new URL(lead.page);
      const site = resolveSiteFromHost(url.host);

      return normalizeStatisticsSite(
        site,
      );
    } catch {
      // fallback ниже
    }
  }

  return {
    slug: 'unknown',
    name: 'Не определён',
  };
}

function resolveVisitSite(visit) {
  if (
    visit?.site?.slug &&
    visit?.site?.name
  ) {
    return normalizeStatisticsSite(
      visit.site,
    );
  }

  return {
    slug: 'unknown',
    name: 'Не определён',
  };
}

const BASELINE_CITY_SLUGS = [
  'moscow',
  'spb',
  'kazan',
];


const BASELINE_CITIES =
  BASELINE_CITY_SLUGS.map(
    (slug) => {
      const location =
        getLocationBySlug(slug);

      if (!location) {
        throw new Error(
          `Baseline geography not found: ${slug}`,
        );
      }

      return {
        slug:
          location.slug,

        name:
          location.name,
      };
    },
  );


const KNOWN_CITIES = [
  {
    slug: 'russia',

    name:
      DEFAULT_LOCATION.name,
  },

  ...BASELINE_CITIES,
];


function getKnownCities() {
  return KNOWN_CITIES;
}

function createCityMap() {
  return new Map(
    getKnownCities().map((city) => [
      city.slug,
      {
        slug: city.slug,
        name: city.name,
        visits: 0,
        leads: 0,
      },
    ]),
  );
}

function ensureCity(map, site) {
  if (!map.has(site.slug)) {
    map.set(site.slug, {
      slug: site.slug,
      name: site.name || site.slug,
      visits: 0,
      leads: 0,
    });
  }

  return map.get(site.slug);
}

function calculateConversion(leads, visits) {
  if (!visits) return 0;

  return Number(
    ((leads / visits) * 100).toFixed(2),
  );
}

function aggregatePeriod({
  visits,
  leads,
  days,
  now,
}) {
  const range = getPeriodRange(days, now);
  const cities = createCityMap();

  for (const visit of visits) {
    const timestamp = getTimestamp(visit, 'visit');

    if (
      timestamp === null ||
      timestamp < range.startMs ||
      timestamp >= range.endMs
    ) {
      continue;
    }

    const site = resolveVisitSite(visit);
    const city = ensureCity(cities, site);

    city.visits += 1;
  }

  for (const lead of leads) {
    const timestamp = getTimestamp(lead, 'lead');

    if (
      timestamp === null ||
      timestamp < range.startMs ||
      timestamp >= range.endMs
    ) {
      continue;
    }

    const site = resolveLeadSite(lead);
    const city = ensureCity(cities, site);

    city.leads += 1;
  }

  const rows = [...cities.values()]
    .map((city) => ({
      ...city,
      conversion: calculateConversion(
        city.leads,
        city.visits,
      ),
    }))
    .sort((a, b) => {
      if (b.leads !== a.leads) {
        return b.leads - a.leads;
      }

      if (b.visits !== a.visits) {
        return b.visits - a.visits;
      }

      return a.name.localeCompare(
        b.name,
        'ru',
      );
    });

  const totals = rows.reduce(
    (result, row) => {
      result.visits += row.visits;
      result.leads += row.leads;
      return result;
    },
    {
      visits: 0,
      leads: 0,
    },
  );

  totals.conversion = calculateConversion(
    totals.leads,
    totals.visits,
  );

  return {
    range: {
      start: range.start,
      end: range.end,
      days,
    },
    totals,
    rows,
  };
}

export async function getStatistics({
  now = new Date(),
} = {}) {
  const [
    visits,
    leads,
  ] = await Promise.all([
    readJsonLines(VISITS_FILE),
    readJsonLines(LEADS_FILE),
  ]);

  const periods = {};

  for (const period of STAT_PERIODS) {
    periods[period.key] = {
      key: period.key,
      label: period.label,
      ...aggregatePeriod({
        visits,
        leads,
        days: period.days,
        now,
      }),
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    timezone: 'Europe/Moscow',
    periods,
  };
}
