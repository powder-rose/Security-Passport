import process from 'node:process';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.SERVER_ENV_FILE || '.env.server',
});

const { getStatistics, STAT_PERIODS } = await import('../server/statistics.mjs');

const REPORT_EMAIL = process.env.DAILY_REPORT_EMAIL || 'mail@pasport-bezopasnosty.ru';

const FROM_EMAIL = process.env.LEAD_EMAIL_FROM || process.env.SMTP_USER || '';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatNumber(value) {
  return new Intl.NumberFormat('ru-RU').format(Number(value) || 0);
}

function formatPercent(value, visits) {
  if (!visits) return '—';

  return (
    new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0) + '%'
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function getPeriodEndDate(period) {
  return new Date(new Date(period.range.end).getTime() - 1);
}

function periodRangeText(period) {
  const start = formatDate(period.range.start);

  const end = formatDate(getPeriodEndDate(period));

  return start === end ? start : `${start} — ${end}`;
}

function getActiveRows(period) {
  return period.rows
    .filter(row => Number(row.visits) > 0 || Number(row.leads) > 0)
    .sort((a, b) => {
      if (b.leads !== a.leads) {
        return b.leads - a.leads;
      }

      if (b.visits !== a.visits) {
        return b.visits - a.visits;
      }

      if (b.conversion !== a.conversion) {
        return b.conversion - a.conversion;
      }

      return a.name.localeCompare(b.name, 'ru');
    });
}

function buildRowsHtml(rows) {
  if (!rows.length) {
    return `
      <tr>
        <td
          colspan="4"
          style="
            padding:18px 12px;
            color:#777;
            text-align:center;
            border-bottom:1px solid #e7e7e7;
          "
        >
          За этот период активности нет
        </td>
      </tr>
    `;
  }

  return rows
    .map(
      row => `
    <tr>
      <td style="
        padding:10px 12px;
        border-bottom:1px solid #e7e7e7;
        text-align:left;
      ">
        ${escapeHtml(row.name)}
      </td>

      <td style="
        padding:10px 12px;
        border-bottom:1px solid #e7e7e7;
        text-align:right;
      ">
        ${formatNumber(row.visits)}
      </td>

      <td style="
        padding:10px 12px;
        border-bottom:1px solid #e7e7e7;
        text-align:right;
      ">
        ${formatNumber(row.leads)}
      </td>

      <td style="
        padding:10px 12px;
        border-bottom:1px solid #e7e7e7;
        text-align:right;
      ">
        ${formatPercent(row.conversion, row.visits)}
      </td>
    </tr>
  `,
    )
    .join('');
}

function buildOverviewHtml(statistics) {
  const rows = STAT_PERIODS.map(definition => {
    const period = statistics.periods[definition.key];

    return `
          <tr>
            <td style="
              padding:14px 12px;
              border-bottom:1px solid #e7e7e7;
              text-align:left;
              vertical-align:top;
            ">
              <div style="
                font-weight:700;
                color:#111;
              ">
                ${escapeHtml(period.label)}
              </div>

              <div style="
                margin-top:4px;
                color:#888;
                font-size:10px;
                line-height:1.4;
              ">
                ${escapeHtml(periodRangeText(period))}
              </div>
            </td>

            <td style="
              padding:14px 12px;
              border-bottom:1px solid #e7e7e7;
              text-align:right;
              vertical-align:top;
              font-weight:700;
            ">
              ${formatNumber(period.totals.visits)}
            </td>

            <td style="
              padding:14px 12px;
              border-bottom:1px solid #e7e7e7;
              text-align:right;
              vertical-align:top;
              font-weight:700;
              color:#1260ff;
            ">
              ${formatNumber(period.totals.leads)}
            </td>

            <td style="
              padding:14px 12px;
              border-bottom:1px solid #e7e7e7;
              text-align:right;
              vertical-align:top;
              font-weight:700;
            ">
              ${formatPercent(period.totals.conversion, period.totals.visits)}
            </td>
          </tr>
        `;
  }).join('');

  return `
    <div style="
      margin:0 0 48px;
    ">

      <div style="
        color:#1260ff;
        font-size:12px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        margin-bottom:10px;
      ">
        Общая статистика
      </div>

      <div style="
        margin:0 0 18px;
        color:#666;
        font-size:12px;
        line-height:1.5;
      ">
        Основные показатели сайта
        по всем периодам.
      </div>

      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          width:100%;
          border-collapse:collapse;
          font-size:13px;
          background:#fff;
          border:1px solid #e2e0d9;
        "
      >
        <thead>
          <tr style="
            background:#111;
            color:#fff;
          ">
            <th style="
              padding:12px;
              text-align:left;
            ">
              Период
            </th>

            <th style="
              padding:12px;
              text-align:right;
            ">
              Посещения
            </th>

            <th style="
              padding:12px;
              text-align:right;
            ">
              Заявки
            </th>

            <th style="
              padding:12px;
              text-align:right;
            ">
              Конверсия
            </th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

    </div>
  `;
}

function buildPeriodHtml(period) {
  const activeRows = getActiveRows(period);

  return `
    <div style="
      margin:0 0 48px;
      padding:0;
    ">

      <div style="
        color:#1260ff;
        font-size:12px;
        font-weight:700;
        letter-spacing:.08em;
        text-transform:uppercase;
        margin-bottom:6px;
      ">
        ${escapeHtml(period.label)}
      </div>

      <div style="
        color:#777;
        font-size:12px;
        margin-bottom:14px;
      ">
        ${escapeHtml(periodRangeText(period))}
      </div>

      <div style="
        margin:0 0 14px;
        color:#666;
        font-size:11px;
        line-height:1.55;
      ">
        Федеральный сайт:
        <strong style="color:#111;">
          Россия
        </strong>.
        Показатели объединены по всему сайту
        без регионального разделения.
      </div>

      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          width:100%;
          border-collapse:collapse;
          font-size:13px;
          background:#fff;
        "
      >
        <thead>
          <tr style="
            background:#f2f0e9;
          ">
            <th style="
              padding:10px 12px;
              text-align:left;
            ">
              Сайт
            </th>

            <th style="
              padding:10px 12px;
              text-align:right;
            ">
              Посещения
            </th>

            <th style="
              padding:10px 12px;
              text-align:right;
            ">
              Заявки
            </th>

            <th style="
              padding:10px 12px;
              text-align:right;
            ">
              Конверсия
            </th>
          </tr>
        </thead>

        <tbody>
          ${buildRowsHtml(activeRows)}
        </tbody>
      </table>

    </div>
  `;
}

function buildText(statistics) {
  const lines = ['Статистика pasport-bezopasnosty.ru', '', 'ОБЩАЯ СТАТИСТИКА', ''];

  for (const definition of STAT_PERIODS) {
    const period = statistics.periods[definition.key];

    lines.push(
      `${period.label}: ` +
        `${formatNumber(period.totals.visits)} посещений, ` +
        `${formatNumber(period.totals.leads)} заявок, ` +
        `${formatPercent(period.totals.conversion, period.totals.visits)}`,
    );
  }

  lines.push('', '==============================', '', 'ФЕДЕРАЛЬНАЯ СТАТИСТИКА', '');

  for (const definition of STAT_PERIODS) {
    const period = statistics.periods[definition.key];

    const activeRows = getActiveRows(period);

    lines.push(period.label.toUpperCase(), periodRangeText(period), '');

    if (!activeRows.length) {
      lines.push('Россия: активности нет');
    } else {
      for (const row of activeRows) {
        lines.push(
          `${row.name}: ` +
            `${formatNumber(row.visits)} посещений, ` +
            `${formatNumber(row.leads)} заявок, ` +
            `${formatPercent(row.conversion, row.visits)}`,
        );
      }
    }

    lines.push('', '--------------------', '');
  }

  return lines.join('\n');
}

function csvCell(value) {
  const text = String(value ?? '');

  if (text.includes(';') || text.includes('"') || text.includes('\n')) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function buildCsv(statistics) {
  const rows = [['Период', 'Начало', 'Окончание', 'Сайт', 'Посещения', 'Заявки', 'Конверсия']];

  for (const definition of STAT_PERIODS) {
    const period = statistics.periods[definition.key];

    const federalRow = period.rows?.[0] || {
      name: 'Россия',
    };

    rows.push([
      period.label,
      formatDate(period.range.start),
      formatDate(getPeriodEndDate(period)),
      federalRow.name || 'Россия',
      period.totals.visits,
      period.totals.leads,
      formatPercent(period.totals.conversion, period.totals.visits),
    ]);
  }

  return '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
}

function buildHtml(statistics) {
  return `
    <!doctype html>

    <html lang="ru">
      <body style="
        margin:0;
        padding:0;
        background:#f1efe8;
        font-family:Arial,Helvetica,sans-serif;
        color:#111;
      ">

        <div style="
          max-width:760px;
          margin:0 auto;
          padding:34px 18px 50px;
        ">

          <div style="
            font-size:12px;
            font-weight:800;
            letter-spacing:.08em;
            margin-bottom:38px;
          ">
            БОЙКОВГРУПП
          </div>


          <h1 style="
            margin:0 0 12px;
            font-size:38px;
            line-height:1;
            letter-spacing:-.04em;
          ">
            Статистика сайта
          </h1>


          <p style="
            margin:0 0 12px;
            color:#666;
            font-size:13px;
            line-height:1.5;
          ">
            pasport-bezopasnosty.ru<br>
            Данные по полностью завершённым
            календарным дням.
            Часовой пояс — Москва.
          </p>


          <p style="
            margin:0 0 40px;
            color:#666;
            font-size:12px;
            line-height:1.5;
          ">
            Все показатели объединены
            на федеральном уровне.
            Регионального разделения нет.
            Полная статистика по периодам
            приложена к письму в CSV.
          </p>


          ${buildOverviewHtml(statistics)}


          <div style="
            margin:0 0 24px;
            padding-top:2px;
          ">

            <div style="
              color:#111;
              font-size:22px;
              font-weight:800;
              line-height:1.15;
              letter-spacing:-.02em;
              margin-bottom:8px;
            ">
              Федеральная статистика
            </div>

            <div style="
              color:#777;
              font-size:12px;
              line-height:1.5;
            ">
              Посещения, заявки и конверсия
              по федеральному сайту Россия.
            </div>

          </div>


          ${STAT_PERIODS.map(definition =>
            buildPeriodHtml(statistics.periods[definition.key]),
          ).join('')}


          <div style="
            margin-top:42px;
            padding-top:18px;
            border-top:1px solid #ccc;
            color:#777;
            font-size:11px;
            line-height:1.5;
          ">
            Отчёт сформирован автоматически.<br>
            Посещения и заявки рассчитаны
            тем же модулем, который используется
            в административной панели.
          </div>

        </div>
      </body>
    </html>
  `;
}

function createTransport() {
  const host = process.env.SMTP_HOST;

  const user = process.env.SMTP_USER;

  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP не настроен: проверьте SMTP_HOST, SMTP_USER и SMTP_PASS');
  }

  return nodemailer.createTransport({
    host,

    port: Number(process.env.SMTP_PORT || 465),

    secure: String(process.env.SMTP_SECURE ?? 'true').toLowerCase() === 'true',

    auth: {
      user,
      pass,
    },
  });
}

const statistics = await getStatistics();

const dayPeriod = statistics.periods.day;

const reportDate = formatDate(getPeriodEndDate(dayPeriod));

const fileDate = reportDate.split('.').reverse().join('-');

const transport = createTransport();

await transport.sendMail({
  from: FROM_EMAIL,
  to: REPORT_EMAIL,

  subject: `Статистика pasport-bezopasnosty.ru — ${reportDate}`,

  text: buildText(statistics),

  html: buildHtml(statistics),

  attachments: [
    {
      filename: `statistics-${fileDate}.csv`,

      content: buildCsv(statistics),

      contentType: 'text/csv; charset=utf-8',
    },
  ],
});

console.log(`✓ Отчёт отправлен: ${REPORT_EMAIL}`);

console.log(`✓ Отчётная дата: ${reportDate}`);

console.log('✓ Федеральный сайт: Россия');

console.log('✓ Полная статистика приложена в CSV');

for (const definition of STAT_PERIODS) {
  const period = statistics.periods[definition.key];

  console.log(
    `${period.label}: ` +
      `${period.totals.visits} посещений, ` +
      `${period.totals.leads} заявок, ` +
      `${formatPercent(period.totals.conversion, period.totals.visits)}`,
  );
}
