import process from 'node:process';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.SERVER_ENV_FILE || '.env.server',
});

const {
  getStatistics,
  STAT_PERIODS,
} = await import('../server/statistics.mjs');


const REPORT_EMAIL =
  process.env.DAILY_REPORT_EMAIL ||
  'mail@pasport-bezopasnosty.ru';

const FROM_EMAIL =
  process.env.LEAD_EMAIL_FROM ||
  process.env.SMTP_USER ||
  '';

const TOP_REGIONS = Math.max(
  1,
  Number(
    process.env.DAILY_REPORT_TOP_REGIONS || 30,
  ) || 30,
);


function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function formatNumber(value) {
  return new Intl.NumberFormat('ru-RU').format(
    Number(value) || 0,
  );
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


function calculateConversion(leads, visits) {
  if (!visits) return 0;

  return Number(
    ((leads / visits) * 100).toFixed(2),
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
  return new Date(
    new Date(period.range.end).getTime() - 1,
  );
}


function periodRangeText(period) {
  const start =
    formatDate(period.range.start);

  const end =
    formatDate(
      getPeriodEndDate(period),
    );

  return start === end
    ? start
    : `${start} — ${end}`;
}


function pluralRegions(count) {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) {
    return `${count} регионов`;
  }

  if (n1 === 1) {
    return `${count} регион`;
  }

  if (n1 >= 2 && n1 <= 4) {
    return `${count} региона`;
  }

  return `${count} регионов`;
}


function getActiveRows(period) {
  return period.rows
    .filter(
      (row) =>
        Number(row.visits) > 0 ||
        Number(row.leads) > 0,
    )
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

      return a.name.localeCompare(
        b.name,
        'ru',
      );
    });
}


function compactPeriod(period) {
  const activeRows =
    getActiveRows(period);

  const topRows =
    activeRows.slice(0, TOP_REGIONS);

  const hiddenRows =
    activeRows.slice(TOP_REGIONS);

  const displayRows =
    topRows.map((row, index) => ({
      ...row,
      displayName:
        `${index + 1}. ${row.name}`,
      isOther: false,
    }));

  if (hiddenRows.length) {
    const otherTotals =
      hiddenRows.reduce(
        (totals, row) => {
          totals.visits += row.visits;
          totals.leads += row.leads;
          return totals;
        },
        {
          visits: 0,
          leads: 0,
        },
      );

    displayRows.push({
      slug: '__other__',

      name: 'Остальные регионы',

      displayName:
        `Остальные ${pluralRegions(
          hiddenRows.length,
        )}`,

      visits: otherTotals.visits,
      leads: otherTotals.leads,

      conversion:
        calculateConversion(
          otherTotals.leads,
          otherTotals.visits,
        ),

      isOther: true,
    });
  }

  return {
    activeRows,
    displayRows,

    activeCount:
      activeRows.length,

    shownCount:
      Math.min(
        TOP_REGIONS,
        activeRows.length,
      ),

    hiddenCount:
      hiddenRows.length,
  };
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

  return rows.map((row) => `
    <tr
      style="${
        row.isOther
          ? 'background:#f2f0e9;font-weight:700;'
          : ''
      }"
    >
      <td style="
        padding:10px 12px;
        border-bottom:1px solid #e7e7e7;
        text-align:left;
      ">
        ${escapeHtml(row.displayName)}
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
        ${formatPercent(
          row.conversion,
          row.visits,
        )}
      </td>
    </tr>
  `).join('');
}


function buildPeriodHtml(period) {
  const compact =
    compactPeriod(period);

  const compactNote =
    compact.hiddenCount > 0
      ? `Показан ТОП-${compact.shownCount}. Остальные ${pluralRegions(compact.hiddenCount)} объединены в одну строку.`
      : `Показаны все активные регионы.`;

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
        margin-bottom:18px;
      ">
        ${escapeHtml(periodRangeText(period))}
      </div>


      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          border-collapse:collapse;
          margin-bottom:16px;
        "
      >
        <tr>

          <td style="
            width:33.33%;
            padding:16px;
            background:#111;
            color:#fff;
          ">
            <div style="
              font-size:11px;
              opacity:.65;
              margin-bottom:8px;
            ">
              ПОСЕЩЕНИЯ
            </div>

            <div style="
              font-size:28px;
              font-weight:700;
            ">
              ${formatNumber(
                period.totals.visits,
              )}
            </div>
          </td>


          <td style="
            width:33.33%;
            padding:16px;
            background:#1260ff;
            color:#fff;
          ">
            <div style="
              font-size:11px;
              opacity:.75;
              margin-bottom:8px;
            ">
              ЗАЯВКИ
            </div>

            <div style="
              font-size:28px;
              font-weight:700;
            ">
              ${formatNumber(
                period.totals.leads,
              )}
            </div>
          </td>


          <td style="
            width:33.33%;
            padding:16px;
            background:#a9f04a;
            color:#111;
          ">
            <div style="
              font-size:11px;
              opacity:.65;
              margin-bottom:8px;
            ">
              КОНВЕРСИЯ
            </div>

            <div style="
              font-size:28px;
              font-weight:700;
            ">
              ${formatPercent(
                period.totals.conversion,
                period.totals.visits,
              )}
            </div>
          </td>

        </tr>
      </table>


      <div style="
        margin:0 0 14px;
        color:#666;
        font-size:11px;
        line-height:1.55;
      ">
        Активных регионов:
        <strong style="color:#111;">
          ${formatNumber(compact.activeCount)}
        </strong>.
        ${escapeHtml(compactNote)}
        Полный список — в CSV-файле.
      </div>


      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          width:100%;
          border-collapse:collapse;
          font-size:13px;
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
              Регион
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
          ${buildRowsHtml(
            compact.displayRows,
          )}

          <tr style="
            background:#111;
            color:#fff;
            font-weight:700;
          ">
            <td style="
              padding:12px;
              text-align:left;
            ">
              Итого
            </td>

            <td style="
              padding:12px;
              text-align:right;
            ">
              ${formatNumber(
                period.totals.visits,
              )}
            </td>

            <td style="
              padding:12px;
              text-align:right;
            ">
              ${formatNumber(
                period.totals.leads,
              )}
            </td>

            <td style="
              padding:12px;
              text-align:right;
            ">
              ${formatPercent(
                period.totals.conversion,
                period.totals.visits,
              )}
            </td>
          </tr>

        </tbody>
      </table>

    </div>
  `;
}


function buildText(statistics) {
  const lines = [
    'Статистика pasport-bezopasnosty.ru',
    '',
  ];

  for (const definition of STAT_PERIODS) {
    const period =
      statistics.periods[
        definition.key
      ];

    const compact =
      compactPeriod(period);

    lines.push(
      period.label.toUpperCase(),
      periodRangeText(period),

      `Посещения: ${
        formatNumber(
          period.totals.visits,
        )
      }`,

      `Заявки: ${
        formatNumber(
          period.totals.leads,
        )
      }`,

      `Конверсия: ${
        formatPercent(
          period.totals.conversion,
          period.totals.visits,
        )
      }`,

      `Активных регионов: ${
        compact.activeCount
      }`,

      '',
    );

    for (
      const row
      of compact.displayRows
    ) {
      lines.push(
        `${row.displayName}: `
        + `${formatNumber(row.visits)} посещений, `
        + `${formatNumber(row.leads)} заявок, `
        + `${formatPercent(
          row.conversion,
          row.visits,
        )}`,
      );
    }

    lines.push(
      '',
      '--------------------',
      '',
    );
  }

  return lines.join('\n');
}


function csvCell(value) {
  const text =
    String(value ?? '');

  if (
    text.includes(';') ||
    text.includes('"') ||
    text.includes('\n')
  ) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}


function buildCsv(statistics) {
  const rows = [
    [
      'Период',
      'Начало',
      'Окончание',
      'Регион',
      'Посещения',
      'Заявки',
      'Конверсия',
    ],
  ];

  for (const definition of STAT_PERIODS) {
    const period =
      statistics.periods[
        definition.key
      ];

    const activeRows =
      getActiveRows(period);

    for (const row of activeRows) {
      rows.push([
        period.label,
        formatDate(period.range.start),
        formatDate(
          getPeriodEndDate(period),
        ),
        row.name,
        row.visits,
        row.leads,
        formatPercent(
          row.conversion,
          row.visits,
        ),
      ]);
    }

    rows.push([
      period.label,
      formatDate(period.range.start),
      formatDate(
        getPeriodEndDate(period),
      ),
      'Итого',
      period.totals.visits,
      period.totals.leads,
      formatPercent(
        period.totals.conversion,
        period.totals.visits,
      ),
    ]);
  }

  return (
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map(csvCell)
          .join(';')
      )
      .join('\r\n')
  );
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
            В каждой таблице показано не более
            ${TOP_REGIONS} регионов.
            Регионы без посещений и заявок скрыты.
            Полная статистика активных регионов
            приложена к письму в CSV.
          </p>


          ${
            STAT_PERIODS
              .map(
                (definition) =>
                  buildPeriodHtml(
                    statistics.periods[
                      definition.key
                    ],
                  ),
              )
              .join('')
          }


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
  const host =
    process.env.SMTP_HOST;

  const user =
    process.env.SMTP_USER;

  const pass =
    process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP не настроен: проверьте SMTP_HOST, SMTP_USER и SMTP_PASS',
    );
  }

  return nodemailer.createTransport({
    host,

    port: Number(
      process.env.SMTP_PORT || 465,
    ),

    secure:
      String(
        process.env.SMTP_SECURE ??
        'true',
      ).toLowerCase() === 'true',

    auth: {
      user,
      pass,
    },
  });
}


const statistics =
  await getStatistics();

const dayPeriod =
  statistics.periods.day;

const reportDate =
  formatDate(
    getPeriodEndDate(dayPeriod),
  );

const fileDate =
  reportDate
    .split('.')
    .reverse()
    .join('-');

const transport =
  createTransport();


await transport.sendMail({
  from: FROM_EMAIL,
  to: REPORT_EMAIL,

  subject:
    `Статистика pasport-bezopasnosty.ru — ${reportDate}`,

  text:
    buildText(statistics),

  html:
    buildHtml(statistics),

  attachments: [
    {
      filename:
        `statistics-${fileDate}.csv`,

      content:
        buildCsv(statistics),

      contentType:
        'text/csv; charset=utf-8',
    },
  ],
});


console.log(
  `✓ Отчёт отправлен: ${REPORT_EMAIL}`,
);

console.log(
  `✓ Отчётная дата: ${reportDate}`,
);

console.log(
  `✓ Максимум регионов в таблице: ${TOP_REGIONS}`,
);

console.log(
  '✓ Полная статистика приложена в CSV',
);


for (const definition of STAT_PERIODS) {
  const period =
    statistics.periods[
      definition.key
    ];

  const compact =
    compactPeriod(period);

  console.log(
    `${period.label}: `
    + `${period.totals.visits} посещений, `
    + `${period.totals.leads} заявок, `
    + `${formatPercent(
      period.totals.conversion,
      period.totals.visits,
    )}; `
    + `активных регионов: ${compact.activeCount}`,
  );
}
