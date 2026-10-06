import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const REGISTRY_FILE = path.join(ROOT, 'data/regulations.json');

const SRC_DIR = path.join(ROOT, 'src');

const errors = [];
const warnings = [];

function error(message) {
  errors.push(message);
}

function warning(message) {
  warnings.push(message);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isValidIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isoToRu(value) {
  if (!isValidIsoDate(value)) {
    return null;
  }

  const [year, month, day] = value.split('-');

  return `${day}.${month}.${year}`;
}

async function walk(dir) {
  const result = [];

  let entries;

  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return result;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') {
        continue;
      }

      result.push(...(await walk(full)));

      continue;
    }

    if (entry.isFile() && /\.(?:js|jsx|mjs|ts|tsx)$/.test(entry.name)) {
      result.push(full);
    }
  }

  return result;
}

function relative(file) {
  return path.relative(ROOT, file);
}

let registry;

try {
  registry = JSON.parse(await fs.readFile(REGISTRY_FILE, 'utf8'));
} catch (err) {
  console.error('QA regulations FAILED: cannot read data/regulations.json');

  console.error(err.message);

  process.exit(1);
}

if (!Array.isArray(registry.items)) {
  console.error('QA regulations FAILED: items must be an array');

  process.exit(1);
}

const byNumber = new Map();

const claimKeys = new Set();

for (const item of registry.items) {
  const number = String(item?.number ?? '').trim();

  if (!/^\d+$/.test(number)) {
    error(`Некорректный номер постановления: "${number}"`);

    continue;
  }

  if (byNumber.has(number)) {
    error(`Дублирующийся номер постановления №${number}`);
  } else {
    byNumber.set(number, item);
  }

  /*
   * TITLE
   */

  const title = String(item?.title ?? '').trim();

  if (!title) {
    error(`№${number}: отсутствует title`);
  } else {
    const titleNumber = title.match(/№\s*(\d+)/)?.[1];

    if (!titleNumber) {
      warning(`№${number}: title не содержит номер: "${title}"`);
    } else if (titleNumber !== number) {
      error(`№${number}: в title указан №${titleNumber}`);
    }
  }

  /*
   * DOCUMENT DATE
   */

  const documentDate = item?.documentDate;

  if (documentDate) {
    if (!isValidIsoDate(documentDate)) {
      error(`№${number}: некорректный documentDate "${documentDate}"`);
    } else {
      const expectedDate = isoToRu(documentDate);

      const datePattern = new RegExp(
        `от\\s+(\\d{2}\\.\\d{2}\\.\\d{4})` + `\\s+№\\s*${escapeRegExp(number)}(?!\\d)`,
        'gi',
      );

      const texts = [
        {
          where: 'title',
          text: title,
        },

        ...(Array.isArray(item.claims)
          ? item.claims.map(claim => ({
              where: `claim ${claim?.id ?? '?'}`,
              text: String(claim?.text ?? ''),
            }))
          : []),
      ];

      for (const entry of texts) {
        let match;

        while ((match = datePattern.exec(entry.text)) !== null) {
          if (match[1] !== expectedDate) {
            error(
              `№${number}: ${entry.where}: ` +
                `дата ${match[1]} не совпадает ` +
                `с documentDate ${expectedDate}`,
            );
          }
        }
      }
    }
  } else {
    warning(`№${number}: documentDate не заполнена`);
  }

  /*
   * REVIEW DATES
   */

  for (const field of ['reviewedAt', 'reviewDueDate']) {
    const value = item?.[field];

    if (value && !isValidIsoDate(value)) {
      error(`№${number}: некорректный ${field} "${value}"`);
    }
  }

  /*
   * CLAIMS
   */

  if (!Array.isArray(item.claims)) {
    error(`№${number}: claims должен быть массивом`);
  } else {
    const localClaimIds = new Set();

    for (const claim of item.claims) {
      const id = String(claim?.id ?? '').trim();

      const text = String(claim?.text ?? '').trim();

      if (!id) {
        error(`№${number}: claim без id`);

        continue;
      }

      if (!text) {
        error(`№${number}/${id}: пустой текст`);
      }

      if (localClaimIds.has(id)) {
        error(`№${number}: дублирующийся claim id "${id}"`);
      }

      localClaimIds.add(id);

      const compound = `${number}/${id}`;

      if (claimKeys.has(compound)) {
        error(`Дублирующийся claim ${compound}`);
      }

      claimKeys.add(compound);
    }
  }

  /*
   * OCCURRENCES
   */

  if (Array.isArray(item.occurrences)) {
    for (const occurrence of item.occurrences) {
      const file = occurrence?.file;

      if (typeof file !== 'string' || !file.trim()) {
        continue;
      }

      const absolute = path.join(ROOT, file);

      try {
        await fs.access(absolute);
      } catch {
        warning(`№${number}: occurrence указывает ` + `на отсутствующий файл ${file}`);
      }
    }
  }
}

/*
 * Проверяем все getRegulationClaim()
 * во всём src.
 */

const sourceFiles = await walk(SRC_DIR);

for (const file of sourceFiles) {
  const text = await fs.readFile(file, 'utf8');

  const pattern = /getRegulationClaim\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g;

  let match;

  while ((match = pattern.exec(text)) !== null) {
    const number = String(match[1]);

    const claimId = String(match[2]);

    const regulation = byNumber.get(number);

    if (!regulation) {
      error(
        `${relative(file)}: ` + `getRegulationClaim с отсутствующим ` + `постановлением №${number}`,
      );

      continue;
    }

    const claimExists =
      Array.isArray(regulation.claims) && regulation.claims.some(claim => claim?.id === claimId);

    if (!claimExists) {
      error(`${relative(file)}: отсутствует claim ` + `${number}/${claimId}`);
    }
  }
}

/*
 * Проверяем даты постановлений
 * непосредственно в исходниках.
 */

for (const [number, item] of byNumber.entries()) {
  if (!item.documentDate || !isValidIsoDate(item.documentDate)) {
    continue;
  }

  const expectedDate = isoToRu(item.documentDate);

  const pattern = new RegExp(
    `от\\s+(\\d{2}\\.\\d{2}\\.\\d{4})` + `\\s+№\\s*${escapeRegExp(number)}(?!\\d)`,
    'gi',
  );

  for (const file of sourceFiles) {
    const text = await fs.readFile(file, 'utf8');

    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match[1] !== expectedDate) {
        error(
          `${relative(file)}: №${number} ` +
            `имеет дату ${match[1]}, ` +
            `ожидалась ${expectedDate}`,
        );
      }
    }
  }
}

/*
 * Подозрительные номера постановлений
 * внутри claims.
 *
 * Это только WARNING, потому что текст
 * законно может ссылаться на документ,
 * которого нет в нашем реестре.
 */

const unknownReferences = new Set();

for (const item of registry.items) {
  for (const claim of item.claims || []) {
    const text = String(claim?.text ?? '');

    const pattern = /(?:ПП\s*РФ|Постановлен(?:ие|ия|ием|ию|ии)[^№]{0,60})\s*№\s*(\d+)/gi;

    let match;

    while ((match = pattern.exec(text)) !== null) {
      const referenced = String(match[1]);

      if (!byNumber.has(referenced)) {
        unknownReferences.add(
          `№${item.number}/${claim.id}: ` +
            `ссылка на №${referenced}, ` +
            `которого нет в regulations.json`,
        );
      }
    }
  }
}

for (const message of unknownReferences) {
  warning(message);
}

/*
 * OUTPUT
 */

console.log('');
console.log('=== REGULATIONS QA ===');
console.log(`Постановлений: ${registry.items.length}`);
console.log(`Исходных файлов проверено: ${sourceFiles.length}`);
console.log(`Ошибок: ${errors.length}`);
console.log(`Предупреждений: ${warnings.length}`);

if (warnings.length) {
  console.log('');
  console.log('--- WARNINGS ---');

  for (const message of warnings) {
    console.log(`WARN: ${message}`);
  }
}

if (errors.length) {
  console.log('');
  console.log('--- ERRORS ---');

  for (const message of errors) {
    console.log(`ERROR: ${message}`);
  }

  console.log('');
  console.log('QA regulations FAILED.');

  process.exit(1);
}

console.log('');
console.log('QA regulations passed.');
