import {
  applyRegulationSyncWorkspace,
  createRegulationSyncWorkspace,
} from './regulation-sync-workspace.mjs';

/*
 * Резервный список файлов.
 * occurrences из regulations.json используется
 * в первую очередь, а этот список страхует старые записи.
 */
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

function getFiles(number, occurrences = []) {
  const occurrenceFiles = occurrences
    .map(item => item?.file)
    .filter(file => typeof file === 'string' && file.startsWith('src/'));

  const fallbackFiles = FILES_BY_NUMBER[String(number)] || [];

  return [...new Set([...occurrenceFiles, ...fallbackFiles])];
}

export function replaceRegulationNumber(value, oldNumber, newNumber) {
  let text = String(value || '');

  const oldValue = escapeRegExp(oldNumber);

  const newValue = String(newNumber);

  /*
   * Текстовые варианты:
   *
   * №447
   * № 447
   * ПП РФ №447
   * Постановление ... №447
   *
   * Меняем именно число после символа №.
   */
  text = text.replace(new RegExp(`(№\\s*)${oldValue}\\b`, 'g'), `$1${newValue}`);

  /*
   * getRegulationClaim('447', ...)
   */
  text = text.replace(
    new RegExp(`(getRegulationClaim\\(\\s*['"])${oldValue}(['"]\\s*,)`, 'g'),
    `$1${newValue}$2`,
  );

  /*
   * registry.items.find(
   *   item => String(item.number) === '447'
   * )
   */
  text = text.replace(
    new RegExp(`(String\\(\\s*item\\.number\\s*\\)\\s*===\\s*['"])${oldValue}(['"])`, 'g'),
    `$1${newValue}$2`,
  );

  /*
   * На случай повторного появления:
   *
   * <RegulationReviewInfo number="447" />
   */
  text = text.replace(
    new RegExp(`(RegulationReviewInfo[^>]*\\bnumber=['"])${oldValue}(['"])`, 'g'),
    `$1${newValue}$2`,
  );

  return text;
}

export async function planRegulationNumberSync(workspace, oldNumber, newNumber, occurrences = []) {
  const files = getFiles(oldNumber, occurrences);

  let changedFiles = 0;
  let changedOccurrences = 0;

  for (const relative of files) {
    const result = await workspace.transform(
      relative,
      source => replaceRegulationNumber(source, oldNumber, newNumber),
      {
        ignoreMissing: true,
      },
    );

    if (!result?.changed) {
      continue;
    }

    const oldMatches =
      result.before.match(new RegExp(`№\\s*${escapeRegExp(oldNumber)}\\b`, 'g')) || [];

    const claimMatches =
      result.before.match(
        new RegExp(`getRegulationClaim\\(\\s*['"]${escapeRegExp(oldNumber)}['"]`, 'g'),
      ) || [];

    changedOccurrences += oldMatches.length + claimMatches.length;
    changedFiles += 1;
  }

  return {
    changedFiles,
    changedOccurrences,
    files,
  };
}

export async function syncRegulationNumber(oldNumber, newNumber, occurrences = []) {
  const workspace = createRegulationSyncWorkspace();

  const result = await planRegulationNumberSync(workspace, oldNumber, newNumber, occurrences);

  await applyRegulationSyncWorkspace(workspace);

  return result;
}
