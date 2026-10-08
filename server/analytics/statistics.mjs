import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isBotVisit } from './bot-detection.mjs';
import { readJsonLines } from '../shared/jsonl.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

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

function calculateConversion(leads, visits) {
  if (!visits) {
    return 0;
  }

  return Number(((leads / visits) * 100).toFixed(2));
}

function createPeriodStates(now) {
  return STAT_PERIODS.map(definition => {
    const range = getPeriodRange(definition.days, now);

    return {
      ...definition,
      ...range,
      visits: 0,
      leads: 0,
    };
  });
}

function recordTimestamp(states, timestamp, field) {
  if (timestamp === null) {
    return;
  }

  for (const state of states) {
    if (timestamp < state.startMs || timestamp >= state.endMs) {
      continue;
    }

    state[field] += 1;
  }
}

async function aggregateJsonLines(filePath, type, states) {
  for await (const row of readJsonLines(filePath)) {
    if (type === 'visit' && isBotVisit(row)) {
      continue;
    }

    recordTimestamp(states, getTimestamp(row, type), type === 'visit' ? 'visits' : 'leads');
  }
}

function finalizePeriod(state) {
  const row = {
    ...FEDERAL_SITE,
    visits: state.visits,
    leads: state.leads,
    conversion: calculateConversion(state.leads, state.visits),
  };

  return {
    key: state.key,
    label: state.label,

    range: {
      start: state.start,
      end: state.end,
      days: state.days,
    },

    totals: {
      visits: row.visits,
      leads: row.leads,
      conversion: row.conversion,
    },

    rows: [row],
  };
}

export async function getStatistics({ now = new Date() } = {}) {
  const states = createPeriodStates(now);

  await Promise.all([
    aggregateJsonLines(VISITS_FILE, 'visit', states),
    aggregateJsonLines(LEADS_FILE, 'lead', states),
  ]);

  const periods = {};

  for (const state of states) {
    periods[state.key] = finalizePeriod(state);
  }

  return {
    generatedAt: new Date().toISOString(),
    timezone: 'Europe/Moscow',
    periods,
  };
}
