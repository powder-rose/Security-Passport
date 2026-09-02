import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveSiteFromHost } from './site-region.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const LEADS_FILE = path.resolve(
  projectRoot,
  process.env.LEADS_FILE || 'data/leads.jsonl',
);

function text(value, max = 500) {
  return typeof value === 'string'
    ? value.trim().slice(0, max)
    : '';
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
  if (lead.source === 'passport-security-quiz') {
    return lead?.data?.answers?.contact || {};
  }

  return lead?.data || {};
}

function normalizeLead(lead) {
  const contact = getContactData(lead);
  const site = resolveLeadSite(lead);

  return {
    id: text(lead.id, 100),

    receivedAt:
      text(lead.receivedAt, 100) ||
      text(lead.submittedAt, 100),

    source: text(lead.source, 150),

    sourceTitle:
      lead.source === 'passport-security-quiz'
        ? 'Квиз'
        : 'Форма',

    city: site,

    name: text(contact.name, 200),
    phone: text(contact.phone, 150),
    email: text(contact.email, 300),

    company:
      text(contact.company, 300) ||
      text(lead?.data?.company, 300),

    object:
      text(contact.object, 500) ||
      text(lead?.data?.object, 500),

    page: text(lead.page, 1200),
  };
}

export async function getAdminLeads({
  limit = 100,
} = {}) {
  let content = '';

  try {
    content = await fs.readFile(
      LEADS_FILE,
      'utf8',
    );
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
      const lead = JSON.parse(trimmed);
      rows.push(normalizeLead(lead));
    } catch {
      // повреждённую строку пропускаем
    }
  }

  return rows
    .sort((a, b) => {
      const aTime =
        Date.parse(a.receivedAt) || 0;

      const bTime =
        Date.parse(b.receivedAt) || 0;

      return bTime - aTime;
    })
    .slice(0, Math.max(1, Math.min(limit, 500)));
}
