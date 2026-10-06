import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isBotVisit } from './bot-detection.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const LEADS_FILE = path.resolve(projectRoot, process.env.LEADS_FILE || 'data/leads.jsonl');

const VISITS_FILE = path.resolve(projectRoot, process.env.VISITS_FILE || 'data/visits.jsonl');

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

  return Math.floor(shifted / DAY_MS) * DAY_MS - MOSCOW_OFFSET_MS;
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
  const value = type === 'lead' ? row.receivedAt || row.submittedAt : row.receivedAt;

  const timestamp = Date.parse(value || '');

  return Number.isFinite(timestamp) ? timestamp : null;
}

const FEDERAL_SITE = Object.freeze({
  slug: 'russia',
  name: 'Россия',
});

function createFederalRow() {
  return {
    ...FEDERAL_SITE,
    visits: 0,
    leads: 0,
  };
}

function calculateConversion(leads, visits) {
  if (!visits) return 0;

  return Number(((leads / visits) * 100).toFixed(2));
}

function aggregatePeriod({ visits, leads, days, now }) {
  const range = getPeriodRange(days, now);
  const siteRow = createFederalRow();

  for (const visit of visits) {
    const timestamp = getTimestamp(visit, 'visit');

    if (timestamp === null || timestamp < range.startMs || timestamp >= range.endMs) {
      continue;
    }

    siteRow.visits += 1;
  }

  for (const lead of leads) {
    const timestamp = getTimestamp(lead, 'lead');

    if (timestamp === null || timestamp < range.startMs || timestamp >= range.endMs) {
      continue;
    }

    siteRow.leads += 1;
  }

  const rows = [
    {
      ...siteRow,
      conversion: calculateConversion(siteRow.leads, siteRow.visits),
    },
  ];

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

  totals.conversion = calculateConversion(totals.leads, totals.visits);

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

export async function getStatistics({ now = new Date() } = {}) {
  const [visits, leads] = await Promise.all([
    readJsonLines(VISITS_FILE),
    readJsonLines(LEADS_FILE),
  ]);

  const humanVisits = visits.filter(visit => !isBotVisit(visit));

  const periods = {};

  for (const period of STAT_PERIODS) {
    periods[period.key] = {
      key: period.key,
      label: period.label,
      ...aggregatePeriod({
        visits: humanVisits,
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
