import {
  getStatistics,
  STAT_PERIODS,
} from '../server/statistics.mjs';

const statistics = await getStatistics();

console.log();
console.log('Статистика');
console.log('Часовой пояс:', statistics.timezone);
console.log('Сформировано:', statistics.generatedAt);

for (const periodDefinition of STAT_PERIODS) {
  const period =
    statistics.periods[periodDefinition.key];

  console.log();
  console.log('================================');
  console.log(period.label);
  console.log(
    `${period.range.start} — ${period.range.end}`,
  );
  console.log('================================');

  for (const row of period.rows) {
    console.log(
      [
        row.name.padEnd(20),
        `посещения: ${String(row.visits).padStart(4)}`,
        `заявки: ${String(row.leads).padStart(3)}`,
        `конверсия: ${row.conversion.toFixed(2)}%`,
      ].join(' | '),
    );
  }

  console.log('--------------------------------');
  console.log(
    `ИТОГО: ${period.totals.visits} посещений | `
    + `${period.totals.leads} заявок | `
    + `${period.totals.conversion.toFixed(2)}%`,
  );
}
