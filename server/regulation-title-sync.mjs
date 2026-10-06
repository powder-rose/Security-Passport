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

function variants(number, oldTitle) {
  return [
    oldTitle,
    `Постановление №${number}`,
    `Постановление № ${number}`,
    `ПП РФ №${number}`,
    `ПП РФ № ${number}`,
    `Постановление Правительства РФ №${number}`,
    `Постановление Правительства РФ № ${number}`,
  ].filter(Boolean);
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

export async function syncRegulationTitle(number, oldTitle, newTitle, occurrences = []) {
  const files = getFiles(number, occurrences);
  let changedFiles = 0;
  let changedOccurrences = 0;

  for (const relative of [...new Set(files)]) {
    const url = new URL(relative, ROOT);
    const file = await fs.readFile(url, 'utf8');
    let updated = file;

    for (const oldValue of variants(number, oldTitle)) {
      if (oldValue === newTitle) continue;
      const count = updated.split(oldValue).length - 1;
      if (count > 0) {
        updated = updated.split(oldValue).join(newTitle);
        changedOccurrences += count;
      }
    }

    if (updated !== file) {
      await fs.writeFile(url, updated, 'utf8');
      changedFiles += 1;
    }
  }

  return {
    changedFiles,
    changedOccurrences,
  };
}
