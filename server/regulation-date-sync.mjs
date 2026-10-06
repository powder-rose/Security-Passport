import fs from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);

const FILES_BY_NUMBER = {
  8: [
    'src/pages/HealthPage/HealthPage.jsx',
    'src/data/objectTypeLegalContent.js',
    'src/data/objectTypes.js',
  ],

  176: [
    'src/pages/CulturePage/CulturePage.jsx',
    'src/data/objectTypeLegalContent.js',
    'src/data/objectTypes.js',
  ],

  202: [
    'src/pages/SportPage/SportPage.jsx',
    'src/data/objectTypeLegalContent.js',
    'src/data/objectTypes.js',
  ],

  229: ['src/pages/TradePage/TradePage.jsx', 'src/data/objectTypes.js'],

  272: [
    'src/pages/CrowdPage/CrowdPage.jsx',
    'src/data/objectTypeLegalContent.js',
    'src/data/objectTypes.js',
  ],

  410: ['src/data/objectTypeLegalContent.js', 'src/data/objectTypes.js'],

  447: [
    'src/pages/HotelPage/HotelPage.jsx',
    'src/data/objectTypeLegalContent.js',
    'src/data/objectTypes.js',
  ],

  1006: [
    'src/pages/EducationPage/EducationPage.jsx',
    'src/data/objectTypeLegalContent.js',
    'src/data/objectTypes.js',
  ],

  1273: [
    'src/pages/TradePage/TradePage.jsx',
    'src/data/objectTypeLegalContent.js',
    'src/data/objectTypes.js',
  ],

  1421: [
    'src/pages/EducationPage/EducationPage.jsx',
    'src/data/objectTypeLegalContent.js',
    'src/data/objectTypes.js',
  ],
};

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatRegulationDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return '';
  }

  return `${match[3]}.${match[2]}.${match[1]}`;
}

export function replaceRegulationDate(value, number, newDate) {
  const text = String(value || '');

  const date = formatRegulationDate(newDate);

  if (!date) {
    return text;
  }

  const escapedNumber = escapeRegExp(number);

  /*
   * Меняем только дату в конструкции:
   *
   * от DD.MM.YYYY №447
   *
   * Даты редакций, проверок и другие
   * даты документа не затрагиваются.
   */
  const pattern = new RegExp(
    `(от\\s+)` + `\\d{2}\\.\\d{2}\\.\\d{4}` + `(\\s+№\\s*${escapedNumber}\\b)`,
    'gi',
  );

  return text.replace(pattern, `$1${date}$2`);
}

function getFiles(number, occurrences) {
  const occurrenceFiles = [
    ...new Set(
      (occurrences || [])
        .map(item => item?.file)
        .filter(file => typeof file === 'string' && file.startsWith('src/')),
    ),
  ];

  return occurrenceFiles.length ? occurrenceFiles : FILES_BY_NUMBER[String(number)] || [];
}

export async function syncRegulationDate(number, newDate, occurrences = []) {
  const files = getFiles(number, occurrences);

  let changedFiles = 0;

  let changedOccurrences = 0;

  for (const relative of [...new Set(files)]) {
    const url = new URL(relative, ROOT);

    const original = await fs.readFile(url, 'utf8');

    const updated = replaceRegulationDate(original, number, newDate);

    if (updated !== original) {
      changedFiles += 1;

      const newDateRu = formatRegulationDate(newDate);

      changedOccurrences += Math.max(
        1,
        updated.split(newDateRu).length - original.split(newDateRu).length,
      );

      await fs.writeFile(url, updated, 'utf8');
    }
  }

  return {
    changedFiles,
    changedOccurrences,
  };
}
