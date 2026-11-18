import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import test, { before, after, beforeEach } from 'node:test';
import {
  getDailyLeads,
  buildLeadsCsv,
  buildDailyLeadsHtml,
} from '../../server/reports/daily-leads.mjs';
import { getDailyReportStatus } from '../../server/reports/report-status.mjs';
import { LEAD_SOURCE_FINAL_CTA, LEAD_SOURCE_QUIZ } from '../../shared/contracts/lead.js';

const now = new Date('2026-11-18T06:00:00Z');
const range = { start: '2026-11-16T21:00:00.000Z', end: '2026-11-17T21:00:00.000Z' };
let root, sendDailyReport, getStatistics;
const previousCwd = process.cwd();
const previousRoot = process.env.PASSPORT_PROJECT_ROOT;
const env = {
  SMTP_HOST: 'smtp.example.test',
  SMTP_USER: 'sender@example.test',
  SMTP_PASS: 'private-fixture-password',
  DAILY_REPORT_EMAIL: 'mail@pasport-bezopasnosty.ru',
};
function lead(id, receivedAt, data = {}, source = LEAD_SOURCE_FINAL_CTA) {
  return {
    id,
    receivedAt,
    source,
    page: 'https://pasport-bezopasnosty.ru/',
    data: {
      name: 'Клиент',
      phone: '+79991234567',
      email: 'client@example.test',
      object: 'Образовательная организация',
      ...data,
    },
  };
}
async function writeRows(filename, rows) {
  await fs.writeFile(
    path.join(root, 'data', filename),
    rows.map(row => JSON.stringify(row)).join('\n') + '\n',
  );
}
async function assertPrivateFile(file) {
  const info = await fs.stat(file);
  assert.ok(info.isFile());
  // Windows reports synthesized mode bits rather than POSIX access permissions.
  if (process.platform !== 'win32') assert.equal(info.mode & 0o777, 0o600);
}
function options(patch = {}) {
  return {
    now,
    env,
    stateFile: path.join(root, 'data/daily-report.json'),
    readStatistics: getStatistics,
    readLeads: currentRange =>
      getDailyLeads(currentRange, { file: path.join(root, 'data/leads.jsonl') }),
    ...patch,
  };
}
before(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-daily-report-'));
  await fs.mkdir(path.join(root, 'data'));
  process.chdir(root);
  process.env.PASSPORT_PROJECT_ROOT = root;
  ({ getStatistics } = await import('../../server/analytics/statistics.mjs'));
  ({ sendDailyReport } = await import('../../scripts/send-daily-report.mjs'));
});
beforeEach(async () => {
  await fs.rm(path.join(root, 'data/daily-report.json'), { force: true });
  await writeRows('leads.jsonl', [lead('yesterday', '2026-11-17T12:00:00Z')]);
  await writeRows('visits.jsonl', [
    { receivedAt: '2026-11-17T12:00:00Z', meta: { userAgent: 'Mozilla/5.0' } },
  ]);
});
after(async () => {
  process.chdir(previousCwd);
  if (previousRoot === undefined) delete process.env.PASSPORT_PROJECT_ROOT;
  else process.env.PASSPORT_PROJECT_ROOT = previousRoot;
  await fs.rm(root, { recursive: true, force: true });
});

test('daily lead selection uses exact Moscow calendar boundaries, includes all sources and does not cap at 500', async () => {
  const rows = [
    lead('before', '2026-11-16T20:59:59.999Z'),
    lead('start', range.start),
    lead('end', range.end),
  ];
  for (let index = 0; index < 600; index++) rows.push(lead('row-' + index, '2026-11-17T12:00:00Z'));
  rows.push(
    lead(
      'quiz',
      '2026-11-17T12:00:00Z',
      {
        answers: {
          contact: { name: 'Имя из анкеты', phone: '+70000000001' },
          objectType: { selected: 'Школа' },
        },
      },
      LEAD_SOURCE_QUIZ,
    ),
  );
  await writeRows('leads.jsonl', rows);
  const result = await getDailyLeads(range, { file: path.join(root, 'data/leads.jsonl') });
  assert.equal(result.length, 602);
  assert.ok(result.some(item => item.id === 'start'));
  assert.ok(!result.some(item => item.id === 'end' || item.id === 'before'));
  assert.equal(result.find(item => item.id === 'quiz').name, 'Имя из анкеты');
  assert.ok(result.find(item => item.id === 'quiz').details.includes('Школа'));
  const html = buildDailyLeadsHtml(result);
  assert.ok(html.includes('первые 100'));
  assert.ok(buildLeadsCsv(result).includes('row-599'));
});

test('lead HTML is escaped and CSV neutralizes spreadsheet formulas while retaining phone numbers', async () => {
  await writeRows('leads.jsonl', [
    lead('unsafe', '2026-11-17T12:00:00Z', {
      name: '=1+1',
      object: '<img src=x onerror=alert(1)>',
      phone: '+79991234567',
    }),
  ]);
  const leads = await getDailyLeads(range, { file: path.join(root, 'data/leads.jsonl') });
  assert.ok(!buildDailyLeadsHtml(leads).includes('<img'));
  assert.ok(buildDailyLeadsHtml(leads).includes('&lt;img'));
  const csv = buildLeadsCsv(leads);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"\'=1+1"'));
  assert.ok(csv.includes('"\'+79991234567"'));
});

test('daily mail contains statistics and complete lead attachments and is not sent twice for the same date', async () => {
  const messages = [];
  let closed = 0;
  const transportFactory = () => ({
    async sendMail(message) {
      messages.push(message);
      return { accepted: [env.DAILY_REPORT_EMAIL], rejected: [] };
    },
    close() {
      closed++;
    },
  });
  const result = await sendDailyReport(options({ transportFactory }));
  assert.equal(result.status, 'sent');
  assert.equal(result.reportDate, '17.11.2026');
  assert.equal(messages[0].to, 'mail@pasport-bezopasnosty.ru');
  assert.ok(messages[0].html.includes('Клиент'));
  assert.equal(messages[0].attachments.length, 3);
  assert.ok(
    messages[0].attachments.some(
      item => item.filename === 'leads-2026-11-17.csv' && item.content.includes('+79991234567'),
    ),
  );
  assert.ok(
    messages[0].attachments.some(
      item =>
        item.filename.startsWith('lead-details-') &&
        item.content.includes('Образовательная организация'),
    ),
  );
  assert.equal((await sendDailyReport(options({ transportFactory }))).status, 'already_sent');
  assert.equal(messages.length, 1);
  assert.equal(closed, 1);
  await assertPrivateFile(path.join(root, 'data/daily-report.json'));
});

test('preview builds private files without connecting to SMTP or changing the send receipt', async () => {
  const result = await sendDailyReport(
    options({
      preview: true,
      transportFactory() {
        assert.fail('Preview must not connect to SMTP');
      },
    }),
  );
  assert.equal(result.status, 'preview');
  const file = path.join(result.directory, 'report.html');
  assert.ok((await fs.readFile(file, 'utf8')).includes('Заявки за предыдущий день'));
  await assertPrivateFile(file);
  await assert.rejects(
    fs.access(path.join(root, 'data/daily-report.json')),
    error => error.code === 'ENOENT',
  );
});

test('SMTP failures and rejected recipients cannot be recorded as success or expose passwords', async () => {
  let closed = 0;
  await assert.rejects(
    sendDailyReport(
      options({
        transportFactory: () => ({
          async sendMail() {
            throw Object.assign(new Error(env.SMTP_PASS), { code: 'EAUTH' });
          },
          close() {
            closed++;
          },
        }),
      }),
    ),
    error => error.code === 'EAUTH' && !error.message.includes(env.SMTP_PASS),
  );
  const saved = await fs.readFile(path.join(root, 'data/daily-report.json'), 'utf8');
  assert.ok(!saved.includes(env.SMTP_PASS));
  assert.equal(JSON.parse(saved).status, 'error');
  assert.equal(closed, 1);
  await assert.rejects(
    sendDailyReport(
      options({
        transportFactory: () => ({
          async sendMail() {
            return { rejected: [env.DAILY_REPORT_EMAIL] };
          },
        }),
      }),
    ),
    error => error.code === 'RECIPIENT_REJECTED',
  );
});

test('missing SMTP is visible in the admin status; an empty day still produces an explicit daily report', async () => {
  const status = await getDailyReportStatus({
    env: {},
    projectRoot: root,
    timerCheck: async () => false,
  });
  assert.equal(status.configured, false);
  assert.equal(status.recipient, env.DAILY_REPORT_EMAIL);
  assert.equal(status.time, '09:00');
  assert.equal(status.timerEnabled, false);
  assert.ok(!Object.hasOwn(status, 'SMTP_PASS'));
  await writeRows('leads.jsonl', []);
  let message;
  await sendDailyReport(
    options({
      transportFactory: () => ({
        async sendMail(value) {
          message = value;
          return { accepted: [env.DAILY_REPORT_EMAIL] };
        },
      }),
    }),
  );
  assert.ok(message.html.includes('За этот день новых заявок не было.'));
});
