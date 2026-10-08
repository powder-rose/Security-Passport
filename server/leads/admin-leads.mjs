import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { LEAD_SOURCE_QUIZ } from '../../shared/contracts/lead.js';
import { readJsonLines } from '../shared/jsonl.mjs';
import { resolveSiteFromHost } from '../shared/site-region.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const LEADS_FILE = path.resolve(projectRoot, process.env.LEADS_FILE || 'data/leads.jsonl');

function text(value, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function resolveLeadSite(lead) {
  if (lead?.site?.slug && lead?.site?.name) {
    return {
      slug: lead.site.slug,
      name: lead.site.name,
    };
  }

  if (lead?.page) {
    try {
      const url = new URL(lead.page);
      const site = resolveSiteFromHost(url.host);

      return {
        slug: site.slug,
        name: site.name,
      };
    } catch {
      // fallback below
    }
  }

  return {
    slug: 'unknown',
    name: 'Не определён',
  };
}

function getContactData(lead) {
  if (lead.source === LEAD_SOURCE_QUIZ) {
    return lead?.data?.answers?.contact || {};
  }

  return lead?.data || {};
}

function normalizeLead(lead) {
  const contact = getContactData(lead);
  const site = resolveLeadSite(lead);

  return {
    id: text(lead.id, 100),

    receivedAt: text(lead.receivedAt, 100) || text(lead.submittedAt, 100),

    source: text(lead.source, 150),

    sourceTitle: lead.source === LEAD_SOURCE_QUIZ ? 'Квиз' : 'Форма',

    city: site,

    name: text(contact.name, 200),
    phone: text(contact.phone, 150),
    email: text(contact.email, 300),

    company: text(contact.company, 300) || text(lead?.data?.company, 300),

    object: text(contact.object, 500) || text(lead?.data?.object, 500),

    page: text(lead.page, 1200),
  };
}

function getLeadTimestamp(lead) {
  return Date.parse(lead.receivedAt) || 0;
}

function findOldestLeadIndex(entries) {
  let oldestIndex = 0;

  for (let index = 1; index < entries.length; index += 1) {
    const entry = entries[index];
    const oldest = entries[oldestIndex];

    if (
      entry.timestamp < oldest.timestamp ||
      (entry.timestamp === oldest.timestamp && entry.order > oldest.order)
    ) {
      oldestIndex = index;
    }
  }

  return oldestIndex;
}

export async function getAdminLeads({ limit = 100 } = {}) {
  const safeLimit = Math.max(1, Math.min(Number.parseInt(limit, 10) || 100, 500));
  const entries = [];
  let order = 0;

  for await (const lead of readJsonLines(LEADS_FILE)) {
    const normalized = normalizeLead(lead);

    entries.push({
      lead: normalized,
      timestamp: getLeadTimestamp(normalized),
      order,
    });

    order += 1;

    if (entries.length > safeLimit) {
      entries.splice(findOldestLeadIndex(entries), 1);
    }
  }

  entries.sort((a, b) => b.timestamp - a.timestamp || a.order - b.order);

  return entries.map(entry => entry.lead);
}

export async function getAdminLeadsPage({ page = 1, limit = 50, search = '' } = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);

  const safeLimit = Math.max(1, Math.min(Number.parseInt(limit, 10) || 50, 100));

  const query = String(search || '')
    .trim()
    .toLocaleLowerCase('ru')
    .slice(0, 200);

  /*
   * Берём до 500 последних заявок.
   *
   * Это сохраняет текущий защитный лимит
   * и не позволяет API вернуть
   * неограниченный массив.
   */
  const all = await getAdminLeads({
    limit: 500,
  });

  const filtered = query
    ? all.filter(lead => {
        const haystack = [
          lead?.city?.name,
          lead?.name,
          lead?.phone,
          lead?.email,
          lead?.company,
          lead?.sourceTitle,
          lead?.object,
        ]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase('ru');

        return haystack.includes(query);
      })
    : all;

  const total = filtered.length;

  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  const resolvedPage = Math.min(safePage, totalPages);

  const offset = (resolvedPage - 1) * safeLimit;

  return {
    leads: filtered.slice(offset, offset + safeLimit),

    pagination: {
      page: resolvedPage,

      limit: safeLimit,

      total,

      totalPages,

      hasPrevious: resolvedPage > 1,

      hasNext: resolvedPage < totalPages,
    },
  };
}
