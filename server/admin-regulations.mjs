import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { syncRegulationTitle } from './regulation-title-sync.mjs';

import {
  syncRegulationNumber,
  replaceRegulationNumber,
} from './regulation-number-sync.mjs';

import {
  syncRegulationDate,
  replaceRegulationDate,
} from './regulation-date-sync.mjs';

const FILE = fileURLToPath(new URL('../data/regulations.json', import.meta.url));
let writes = Promise.resolve();

async function readRegistry() {
  const data = JSON.parse(await fs.readFile(FILE, 'utf8'));
  if (!Array.isArray(data.items)) throw new Error('INVALID_REGISTRY');
  return data;
}

function validate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('Неверные данные');
  }

  const fields = ['title', 'edition', 'officialUrl', 'reviewNote'];
  const result = {};


  const number =
    String(
      input.number ?? ''
    ).trim();


  if (
    !/^\d{1,6}$/.test(number)
  ) {
    throw new TypeError(
      'Укажите корректный номер постановления'
    );
  }


  result.number =
    number;

  for (const field of fields) {
    const value = input[field] ?? '';
    if (typeof value !== 'string' || value.length > 3000) {
      throw new TypeError(`Неверное поле: ${field}`);
    }
    result[field] = value.trim();
  }

  if (!result.title) throw new TypeError('Укажите название');
  if (result.officialUrl && !/^https:\/\//i.test(result.officialUrl)) {
    throw new TypeError('Ссылка должна начинаться с https://');
  }

  const documentDate =
    input.documentDate || null;

  if (
    documentDate !== null
    &&
    (
      typeof documentDate !== 'string'
      ||
      !/^\d{4}-\d{2}-\d{2}$/.test(documentDate)
      ||
      Number.isNaN(
        Date.parse(`${documentDate}T00:00:00Z`)
      )
      ||
      new Date(`${documentDate}T00:00:00Z`)
        .toISOString()
        .slice(0, 10) !== documentDate
    )
  ) {
    throw new TypeError(
      'Неверная дата постановления'
    );
  }

  result.documentDate =
    documentDate;


  const status = input.reviewStatus;
  if (!['needs_review', 'reviewed', 'outdated'].includes(status)) {
    throw new TypeError('Неверный статус проверки');
  }
  result.reviewStatus = status;

  const date = input.reviewedAt || null;
  if (date !== null) {
    if (typeof date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
        new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
      throw new TypeError('Неверная дата проверки');
    }
  }
  if (status === 'reviewed' && !date) {
    throw new TypeError('Укажите дату проверки');
  }
  result.reviewedAt = date;

  if (Object.hasOwn(input, 'reviewDueDate')) {
    const dueDate = input.reviewDueDate || null;
    if (dueDate !== null &&
        (typeof dueDate !== 'string' ||
         !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
         Number.isNaN(Date.parse(`${dueDate}T00:00:00Z`)) ||
         new Date(`${dueDate}T00:00:00Z`).toISOString().slice(0, 10) !== dueDate)) {
      throw new TypeError('Укажите корректную дату окончания срока');
    }
    result.reviewDueDate = dueDate;
  }

  if (!Array.isArray(input.claims) || input.claims.length > 60) {
    throw new TypeError('Неверный список нормативных полей');
  }
  result.claims = input.claims.map(claim => {
    if (!claim || typeof claim.id !== 'string' ||
        typeof claim.text !== 'string' ||
        !claim.text.trim() || claim.text.length > 1000) {
      throw new TypeError('Неверное нормативное поле');
    }
    return { id: claim.id, text: claim.text.trim() };
  });

  return result;
}

export async function listRegulations() {
  return (await readRegistry()).items;
}

export function updateRegulation(number, input) {
  const change = validate(input);
  const operation = writes.then(async () => {
    const data = await readRegistry();
    const index = data.items.findIndex(item => String(item.number) === String(number));
    if (index < 0) return null;

    const existingClaims = data.items[index].claims || [];
    if (change.claims.length !== existingClaims.length ||
        change.claims.some(claim =>
          !existingClaims.some(existing => existing.id === claim.id))) {
      throw new TypeError('Состав нормативных полей изменён');
    }
    change.claims = existingClaims.map(existing => ({
      ...existing,
      text: change.claims.find(claim => claim.id === existing.id).text,
    }));

    const previous = data.items[index];

    const oldNumber =
      String(previous.number);

    const newNumber =
      String(change.number);

    const numberChanged =
      oldNumber !== newNumber;


    if (
      numberChanged
      &&
      data.items.some(
        (item, itemIndex) =>
          itemIndex !== index
          &&
          String(item.number) === newNumber
      )
    ) {
      throw new TypeError(
        'Постановление с таким номером уже существует'
      );
    }


    let previousTitleForSync =
      previous.title;


    if (numberChanged) {

      await syncRegulationNumber(
        oldNumber,
        newNumber,
        previous.occurrences,
      );


      previousTitleForSync =
        replaceRegulationNumber(
          previous.title,
          oldNumber,
          newNumber
        );


      change.title =
        replaceRegulationNumber(
          change.title,
          oldNumber,
          newNumber
        );


      change.edition =
        replaceRegulationNumber(
          change.edition,
          oldNumber,
          newNumber
        );


      change.reviewNote =
        replaceRegulationNumber(
          change.reviewNote,
          oldNumber,
          newNumber
        );


      change.claims =
        change.claims.map(
          claim => ({

            ...claim,

            text:
              replaceRegulationNumber(
                claim.text,
                oldNumber,
                newNumber
              ),

          })
        );

    }


    if (
      previousTitleForSync !==
      change.title
    ) {

      await syncRegulationTitle(
        newNumber,
        previousTitleForSync,
        change.title,
        previous.occurrences,
      );

    }


    const documentDateChanged =
      previous.documentDate
      !==
      change.documentDate;


    if (
      documentDateChanged
      &&
      change.documentDate
    ) {

      await syncRegulationDate(
        newNumber,
        change.documentDate,
        previous.occurrences,
      );


      change.title =
        replaceRegulationDate(
          change.title,
          newNumber,
          change.documentDate,
        );


      change.claims =
        change.claims.map(
          claim => ({

            ...claim,

            text:
              replaceRegulationDate(
                claim.text,
                newNumber,
                change.documentDate,
              ),

          })
        );

    }


    const contentChanged =
      previous.edition !== change.edition ||
      existingClaims.some(existing =>
        existing.text !== change.claims.find(
          claim => claim.id === existing.id
        ).text
      );

    const publicationNeeded =
      contentChanged ||
      previous.title !== change.title ||
      previous.reviewStatus !== change.reviewStatus ||
      previous.reviewedAt !== change.reviewedAt ||
      previous.documentDate !== change.documentDate ||
      String(previous.number) !== String(change.number);

    const now = new Date().toISOString();
    const updated = {
      ...previous,
      ...change,
      contentUpdatedAt: contentChanged
        ? now
        : (previous.contentUpdatedAt || null),
      updatedAt: now,
    };
    data.items[index] = updated;

    const temporary = `${FILE}.${process.pid}.${Date.now()}.tmp`;
    try {
      await fs.writeFile(temporary, JSON.stringify(data, null, 2) + '\n', {
        encoding: 'utf8',
        mode: 0o600,
      });
      await fs.rename(temporary, FILE);
    } catch (error) {
      await fs.rm(temporary, { force: true });
      throw error;
    }
    return { ...updated, publicationNeeded };
  });

  writes = operation.catch(() => {});
  return operation;
}
