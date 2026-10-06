import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

const root = fileURLToPath(new URL('../', import.meta.url));
dotenv.config({ path: path.join(root, '.env.server') });

const registryFile = path.join(root, 'data/regulations.json');
const sentFile = path.join(root, 'data/regulation-reminder-sent.json');
const dryRun = process.argv.includes('--dry-run');

const parts = Object.fromEntries(
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(new Date())
    .filter(part => part.type !== 'literal')
    .map(part => [part.type, part.value]),
);

const today = `${parts.year}-${parts.month}-${parts.day}`;
const hour = Number(parts.hour);
const registry = JSON.parse(await fs.readFile(registryFile, 'utf8'));

if (!Array.isArray(registry.items)) {
  throw new Error('В реестре отсутствует массив items');
}

let sent = {};
try {
  const stored = JSON.parse(await fs.readFile(sentFile, 'utf8'));
  sent = stored.sent && typeof stored.sent === 'object' ? stored.sent : stored;

  if (!sent || typeof sent !== 'object' || Array.isArray(sent)) {
    throw new Error('Неверный формат журнала отправок');
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const pending = registry.items.filter(item => {
  const date = item.reviewDueDate;
  if (!date) return false;

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Неверная дата у постановления №${item.number}`);
  }

  const number = String(item.number);

  // Только после окончания указанного дня и только до первой успешной отправки.
  return date < today && !sent[`${number}:${date}`] && !sent[`${number}|${date}`];
});

console.log(`Москва: ${today}, ${parts.hour}:00; ожидают письма: ${pending.length}`);

if (dryRun) {
  for (const item of pending) {
    console.log(`Постановление №${item.number}; срок: ${item.reviewDueDate}`);
  }
  process.exit(0);
}

if (hour < 9 || pending.length === 0) process.exit(0);

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const to = process.env.REGULATION_EMAIL_TO || process.env.LEAD_EMAIL_TO;
const from = process.env.LEAD_EMAIL_FROM || user;
const port = Number(process.env.SMTP_PORT || 465);

if (!host || !user || !pass || !to || !from) {
  throw new Error('Не настроена почта для уведомлений');
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE.toLowerCase() === 'true' : port === 465,
  auth: { user, pass },
});

for (const item of pending) {
  const number = String(item.number);
  const date = item.reviewDueDate;
  const key = `${number}:${date}`;

  await transport.sendMail({
    from,
    to,
    subject: `Обновите постановление №${number}`,
    text: `Срок проверки постановления №${number} закончился ${date}.\nПроверьте постановление и обновите сведения в админке.`,
  });

  sent[key] = new Date().toISOString();
  const temporary = `${sentFile}.${process.pid}.tmp`;

  try {
    await fs.writeFile(temporary, JSON.stringify({ sent }, null, 2) + '\n', { mode: 0o600 });
    await fs.rename(temporary, sentFile);
  } catch (error) {
    await fs.rm(temporary, { force: true });
    throw error;
  }

  console.log(`Отправлено один раз: постановление №${number}, срок ${date}`);
}

transport.close();
