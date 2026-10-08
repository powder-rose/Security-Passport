import process from 'node:process';

import nodemailer from 'nodemailer';

import { LEAD_SOURCE_QUIZ } from '../../shared/contracts/lead.js';
import { appendLeadToFile } from './lead-storage.mjs';

function cleanString(value, maxLength = 2000) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function getPositiveTimeout(value, fallback) {
  const timeout = Number(value);

  if (!Number.isFinite(timeout) || timeout <= 0) {
    return fallback;
  }

  return Math.floor(timeout);
}

function formatLeadValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (value === true) {
    return 'Да';
  }

  if (value === false) {
    return 'Нет';
  }

  if (Array.isArray(value)) {
    return (
      value.filter(item => item !== null && item !== undefined && item !== '').join(', ') || '—'
    );
  }

  return String(value);
}

function addLeadField(lines, label, value) {
  if (value === null || value === undefined || value === '') {
    return;
  }

  lines.push(`${label}: ${formatLeadValue(value)}`);
}

function addLeadSection(lines, title, fields) {
  const section = [];

  fields.forEach(([label, value]) => {
    addLeadField(section, label, value);
  });

  if (!section.length) {
    return;
  }

  lines.push('', `=== ${title} ===`, ...section);
}

function getAnswerSelected(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value.selected ?? value.value ?? '';
  }

  return value;
}

function getAnswerOther(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value.other ?? '';
  }

  return '';
}

function addLeadAttribution(lines, lead) {
  const attribution = lead.attribution || {};

  addLeadSection(lines, 'РЕКЛАМА / АТРИБУЦИЯ', [
    ['Посадочная страница', attribution.landingPage],
    ['Источник перехода', attribution.referrer || lead.referrer],
    ['UTM source', attribution.utm_source || attribution.utmSource],
    ['UTM medium', attribution.utm_medium || attribution.utmMedium],
    ['UTM campaign', attribution.utm_campaign || attribution.utmCampaign],
    ['UTM content', attribution.utm_content || attribution.utmContent],
    ['UTM term', attribution.utm_term || attribution.utmTerm],
    ['YCLID', attribution.yclid],
  ]);
}

function buildQuizLeadText(lead) {
  const answers = lead.data?.answers || {};
  const objectType = answers.objectType || {};
  const location = answers.location || {};
  const objectMetrics = answers.objectMetrics || {};
  const contact = answers.contact || {};

  const lines = [
    'НОВАЯ ЗАЯВКА — КВИЗ «ПАСПОРТ БЕЗОПАСНОСТИ»',
    '',
    `ID: ${lead.id}`,
    `Получена: ${lead.receivedAt}`,
  ];

  if (lead.page) {
    lines.push(`Страница: ${lead.page}`);
  }

  addLeadSection(lines, 'ОБЪЕКТ', [
    ['Тип объекта', getAnswerSelected(objectType)],
    ['Уточнение', getAnswerOther(objectType)],
    ['Регион', location.region],
    ['Город', location.city],
  ]);

  addLeadSection(lines, 'ТЕКУЩАЯ СИТУАЦИЯ', [
    ['Уведомление о включении в перечень', getAnswerSelected(answers.notification)],
    ['Документы', getAnswerSelected(answers.documentsStatus)],
    ['Площадь, м²', objectMetrics.area],
    ['Максимум людей', objectMetrics.people],
  ]);

  addLeadSection(lines, 'КОНТАКТЫ', [
    ['Имя', contact.name],
    ['Телефон', contact.phone],
    ['Email', contact.email],
    ['Организация', contact.company],
    ['Согласие', contact.consent],
  ]);

  addLeadAttribution(lines, lead);

  return lines.join('\n').slice(0, 12000);
}

function buildFormLeadText(lead) {
  const data = lead.data || {};

  const lines = [
    'НОВАЯ ЗАЯВКА — ФОРМА «ОБСУДИТЬ ОБЪЕКТ»',
    '',
    `ID: ${lead.id}`,
    `Получена: ${lead.receivedAt}`,
  ];

  if (lead.page) {
    lines.push(`Страница: ${lead.page}`);
  }

  addLeadSection(lines, 'КОНТАКТЫ', [
    ['Имя', data.name],
    ['Телефон', data.phone],
    ['Email', data.email],
    ['Организация', data.company],
    ['Объект / задача', data.object],
    ['Согласие', data.consent],
  ]);

  addLeadAttribution(lines, lead);

  return lines.join('\n').slice(0, 12000);
}

function buildLeadText(lead) {
  if (lead.source === LEAD_SOURCE_QUIZ) {
    return buildQuizLeadText(lead);
  }

  return buildFormLeadText(lead);
}

function createMailTransport(env, timeoutMs) {
  const host = cleanString(env.SMTP_HOST, 300);
  const user = cleanString(env.SMTP_USER, 300);
  const pass = env.SMTP_PASS || '';

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(env.SMTP_PORT || 465),
    secure: String(env.SMTP_SECURE ?? 'true').toLowerCase() === 'true',
    connectionTimeout: timeoutMs,
    greetingTimeout: timeoutMs,
    socketTimeout: timeoutMs,
    dnsTimeout: timeoutMs,
    auth: {
      user,
      pass,
    },
  });
}

export function createLeadDelivery({ backupEnabled, leadsFile, env = process.env }) {
  const telegramTimeoutMs = getPositiveTimeout(env.TELEGRAM_TIMEOUT_MS, 10_000);
  const smtpTimeoutMs = getPositiveTimeout(env.SMTP_TIMEOUT_MS, 20_000);

  const mailTransport = createMailTransport(env, smtpTimeoutMs);

  async function saveBackup(lead) {
    if (!backupEnabled) {
      return {
        channel: 'backup',
        ok: false,
        skipped: true,
      };
    }

    await appendLeadToFile(leadsFile, lead);

    return {
      channel: 'backup',
      ok: true,
    };
  }

  async function sendTelegram(text) {
    const token = cleanString(env.TELEGRAM_BOT_TOKEN, 300);
    const chatId = cleanString(env.TELEGRAM_CHAT_ID, 120);

    if (!token || !chatId) {
      return {
        channel: 'telegram',
        ok: false,
        skipped: true,
      };
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      signal: AbortSignal.timeout(telegramTimeoutMs),
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4000),
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`TELEGRAM_${response.status}`);
    }

    return {
      channel: 'telegram',
      ok: true,
    };
  }

  async function sendEmail(text, lead) {
    const to = cleanString(env.LEAD_EMAIL_TO, 500);

    const from = cleanString(env.LEAD_EMAIL_FROM, 500) || cleanString(env.SMTP_USER, 300);

    if (!mailTransport || !to || !from) {
      return {
        channel: 'email',
        ok: false,
        skipped: true,
      };
    }

    await mailTransport.sendMail({
      from,
      to,
      subject:
        lead.source === LEAD_SOURCE_QUIZ
          ? 'Новая заявка: квиз паспорта безопасности'
          : 'Новая заявка: паспорт безопасности',
      text,
    });

    return {
      channel: 'email',
      ok: true,
    };
  }

  async function deliverLead(lead) {
    const text = buildLeadText(lead);

    const tasks = [saveBackup(lead), sendTelegram(text), sendEmail(text, lead)];

    const settled = await Promise.allSettled(tasks);

    const results = settled.map((result, index) => {
      const channel = ['backup', 'telegram', 'email'][index];

      if (result.status === 'fulfilled') {
        return result.value;
      }

      console.error(`[lead] ${channel} delivery failed:`, result.reason?.message || result.reason);

      return {
        channel,
        ok: false,
        error: true,
      };
    });

    const configured = results.filter(result => !result.skipped);

    const successful = configured.filter(result => result.ok);

    const configuredNotifications = configured.filter(result =>
      ['telegram', 'email'].includes(result.channel),
    );

    const successfulNotifications = configuredNotifications.filter(result => result.ok);

    // Notification transports are best-effort:
    // a temporary notification failure must not turn an
    // already persisted lead into a failed submission.
    const backupSucceeded = successful.some(result => result.channel === 'backup');

    return {
      ok: backupSucceeded || successfulNotifications.length > 0,

      results,
    };
  }

  function getTransportStatus() {
    return {
      backup: Boolean(backupEnabled),

      telegram: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),

      email: Boolean(mailTransport && env.LEAD_EMAIL_TO),
    };
  }

  return {
    deliverLead,
    getTransportStatus,
  };
}
