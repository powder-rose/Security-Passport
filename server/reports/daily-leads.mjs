import path from 'node:path';
import { readJsonLines } from '../shared/jsonl.mjs';
import { resolveProjectRoot } from '../shared/project-root.mjs';
import { normalizeLead } from '../leads/admin-leads.mjs';
import { buildLeadText } from '../leads/lead-delivery.mjs';

export async function getDailyLeads(
  range,
  { file = path.resolve(resolveProjectRoot(), process.env.LEADS_FILE || 'data/leads.jsonl') } = {},
) {
  const start = Date.parse(range.start);
  const end = Date.parse(range.end);
  const leads = [];
  for await (const source of readJsonLines(file)) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) continue;
    const timestamp = Date.parse(source.receivedAt || source.submittedAt || '');
    if (!Number.isFinite(timestamp) || timestamp < start || timestamp >= end) continue;
    leads.push({ ...normalizeLead(source), details: buildLeadText(source) });
  }
  return leads.sort((a, b) => Date.parse(a.receivedAt) - Date.parse(b.receivedAt));
}

function escape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]|^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

export function buildLeadsCsv(leads) {
  const rows = [
    [
      'Дата, МСК',
      'Источник',
      'Имя',
      'Телефон',
      'Email',
      'Организация',
      'Объект / задача',
      'Страница',
      'Все сведения заявки',
    ],
  ];
  for (const lead of leads)
    rows.push([
      new Date(lead.receivedAt).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
      lead.sourceTitle,
      lead.name,
      lead.phone,
      lead.email,
      lead.company,
      lead.object || lead.interest,
      lead.page,
      lead.details,
    ]);
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
}

export function buildDailyLeadsText(leads) {
  const rows = ['ЗАЯВКИ ЗА ПРЕДЫДУЩИЙ ДЕНЬ', `Всего: ${leads.length}`, ''];
  if (!leads.length) rows.push('За этот день новых заявок не было.');
  for (const lead of leads.slice(0, 100))
    rows.push(
      `${lead.name || 'Без имени'} · ${lead.phone || lead.email || 'Контакт не указан'}`,
      `${lead.sourceTitle} · ${lead.object || lead.interest || lead.company || 'Без описания'}`,
      '',
    );
  rows.push('Полный список заявок и ответы анкеты приложены к письму.');
  return rows.join('\n');
}

export function buildDailyLeadsHtml(leads) {
  return `<section style="margin:36px 0"><h2 style="font-size:22px;color:#111">Заявки за предыдущий день · ${leads.length}</h2>${
    leads.length
      ? `<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr><th style="text-align:left;padding:10px;background:#edf3e5">Контакты</th><th style="text-align:left;padding:10px;background:#edf3e5">Объект / задача</th></tr></thead><tbody>${leads
          .slice(0, 100)
          .map(
            lead =>
              `<tr><td style="padding:12px 10px;border-bottom:1px solid #ddd;vertical-align:top"><strong>${escape(lead.name || 'Без имени')}</strong><br>${escape(lead.phone)}<br>${escape(lead.email)}</td><td style="padding:12px 10px;border-bottom:1px solid #ddd;vertical-align:top">${escape(lead.object || lead.interest || lead.company || 'Без описания')}<br><span style="color:#888">${escape(lead.sourceTitle)}</span></td></tr>`,
          )
          .join('')}</tbody></table>`
      : '<p style="color:#777">За этот день новых заявок не было.</p>'
  }<p style="font-size:12px;color:#777;line-height:1.7">${leads.length > 100 ? 'В письме показаны первые 100 заявок. ' : ''}Полный список, контакты и ответы анкеты — в приложенных файлах.</p></section>`;
}
