import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { syncRegulationTitle } from './regulation-title-sync.mjs';

import { syncRegulationNumber, replaceRegulationNumber } from './regulation-number-sync.mjs';

import { syncRegulationDate, replaceRegulationDate } from './regulation-date-sync.mjs';

const FILE = fileURLToPath(new URL('../data/regulations.json', import.meta.url));

const TOPICS = new Set([
  'hotel',
  'education',
  'culture',
  'trade',
  'sport',
  'health',
  'crowd',
  'social',
]);

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

  if (Object.hasOwn(input, 'topic')) {
    const topic = String(input.topic || '').trim();

    if (!TOPICS.has(topic)) {
      throw new TypeError('Выберите тематику постановления');
    }

    result.topic = topic;
  }

  const number = String(input.number ?? '').trim();

  if (!/^\d{1,6}$/.test(number)) {
    throw new TypeError('Укажите корректный номер постановления');
  }

  result.number = number;

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

  const documentDate = input.documentDate || null;

  if (
    documentDate !== null &&
    (typeof documentDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(documentDate) ||
      Number.isNaN(Date.parse(`${documentDate}T00:00:00Z`)) ||
      new Date(`${documentDate}T00:00:00Z`).toISOString().slice(0, 10) !== documentDate)
  ) {
    throw new TypeError('Неверная дата постановления');
  }

  result.documentDate = documentDate;

  const status = input.reviewStatus;
  if (!['needs_review', 'reviewed', 'outdated'].includes(status)) {
    throw new TypeError('Неверный статус проверки');
  }
  result.reviewStatus = status;

  const date = input.reviewedAt || null;
  if (date !== null) {
    if (
      typeof date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
    ) {
      throw new TypeError('Неверная дата проверки');
    }
  }
  if (status === 'reviewed' && !date) {
    throw new TypeError('Укажите дату проверки');
  }
  result.reviewedAt = date;

  if (Object.hasOwn(input, 'reviewDueDate')) {
    const dueDate = input.reviewDueDate || null;
    if (
      dueDate !== null &&
      (typeof dueDate !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
        Number.isNaN(Date.parse(`${dueDate}T00:00:00Z`)) ||
        new Date(`${dueDate}T00:00:00Z`).toISOString().slice(0, 10) !== dueDate)
    ) {
      throw new TypeError('Укажите корректную дату окончания срока');
    }
    result.reviewDueDate = dueDate;
  }

  if (!Array.isArray(input.claims) || input.claims.length > 60) {
    throw new TypeError('Неверный список нормативных полей');
  }
  result.claims = input.claims.map(claim => {
    if (
      !claim ||
      typeof claim.id !== 'string' ||
      typeof claim.text !== 'string' ||
      !claim.text.trim() ||
      claim.text.length > 1000
    ) {
      throw new TypeError('Неверное нормативное поле');
    }
    const resultClaim = {
      id: claim.id,
      text: claim.text.trim(),
    };

    if (typeof claim.label === 'string' && claim.label.trim()) {
      resultClaim.label = claim.label.trim().slice(0, 500);
    }

    return resultClaim;
  });

  return result;
}

export async function listRegulations() {
  return (await readRegistry()).items;
}

export function createRegulation(input) {
  const change = validate(input);

  if (!change.topic) {
    throw new TypeError('Выберите тематику постановления');
  }

  const operation = writes.then(async () => {
    const data = await readRegistry();

    if (data.items.some(item => String(item.number) === String(change.number))) {
      throw new TypeError('Постановление с таким номером уже существует');
    }

    const now = new Date().toISOString();

    const created = {
      ...change,
      occurrences: [],
      claims: [],
      contentUpdatedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    data.items.push(created);

    const temporary = `${FILE}.${process.pid}.${Date.now()}.tmp`;

    try {
      await fs.writeFile(temporary, JSON.stringify(data, null, 2) + '\n', {
        encoding: 'utf8',
        mode: 0o600,
      });

      await fs.rename(temporary, FILE);
    } catch (error) {
      await fs.rm(temporary, {
        force: true,
      });

      throw error;
    }

    return {
      ...created,
      publicationNeeded: false,
    };
  });

  writes = operation.catch(() => {});

  return operation;
}

function hasRegulationChanges(previous, change) {
  const stringFields = ['title', 'edition', 'officialUrl', 'reviewNote'];

  if (String(previous.number ?? '') !== change.number) {
    return true;
  }

  if (stringFields.some(field => String(previous[field] || '') !== change[field])) {
    return true;
  }

  if ((previous.documentDate || null) !== change.documentDate) {
    return true;
  }

  if ((previous.reviewStatus || 'needs_review') !== change.reviewStatus) {
    return true;
  }

  if ((previous.reviewedAt || null) !== change.reviewedAt) {
    return true;
  }

  if (Object.hasOwn(change, 'topic') && (previous.topic || '') !== change.topic) {
    return true;
  }

  if (
    Object.hasOwn(change, 'reviewDueDate') &&
    (previous.reviewDueDate || null) !== change.reviewDueDate
  ) {
    return true;
  }

  const previousClaims = previous.claims || [];

  return previousClaims.some((claim, index) => claim.text !== change.claims[index]?.text);
}

export function updateRegulation(number, input) {
  const change = validate(input);
  const operation = writes.then(async () => {
    const data = await readRegistry();
    const index = data.items.findIndex(item => String(item.number) === String(number));
    if (index < 0) return null;

    const existingClaims = data.items[index].claims || [];
    if (
      change.claims.length !== existingClaims.length ||
      change.claims.some(claim => !existingClaims.some(existing => existing.id === claim.id))
    ) {
      throw new TypeError('Состав нормативных полей изменён');
    }
    change.claims = existingClaims.map(existing => ({
      ...existing,
      text: change.claims.find(claim => claim.id === existing.id).text,
    }));

    const previous = data.items[index];

    if (change.topic && previous.topic && change.topic !== previous.topic) {
      throw new TypeError(
        'Тематика существующего постановления привязана к контенту сайта и не может быть изменена автоматически',
      );
    }

    if (!hasRegulationChanges(previous, change)) {
      return {
        ...previous,
        publicationNeeded: false,
      };
    }

    const oldNumber = String(previous.number);

    const newNumber = String(change.number);

    const numberChanged = oldNumber !== newNumber;

    if (
      numberChanged &&
      data.items.some((item, itemIndex) => itemIndex !== index && String(item.number) === newNumber)
    ) {
      throw new TypeError('Постановление с таким номером уже существует');
    }

    let previousTitleForSync = previous.title;

    if (numberChanged) {
      await syncRegulationNumber(oldNumber, newNumber, previous.occurrences);

      previousTitleForSync = replaceRegulationNumber(previous.title, oldNumber, newNumber);

      change.title = replaceRegulationNumber(change.title, oldNumber, newNumber);

      change.edition = replaceRegulationNumber(change.edition, oldNumber, newNumber);

      change.reviewNote = replaceRegulationNumber(change.reviewNote, oldNumber, newNumber);

      change.claims = change.claims.map(claim => ({
        ...claim,

        text: replaceRegulationNumber(claim.text, oldNumber, newNumber),
      }));
    }

    if (previousTitleForSync !== change.title) {
      await syncRegulationTitle(
        newNumber,
        previousTitleForSync,
        change.title,
        previous.occurrences,
      );
    }

    const documentDateChanged = previous.documentDate !== change.documentDate;

    if (documentDateChanged && change.documentDate) {
      await syncRegulationDate(newNumber, change.documentDate, previous.occurrences);

      change.title = replaceRegulationDate(change.title, newNumber, change.documentDate);

      change.claims = change.claims.map(claim => ({
        ...claim,

        text: replaceRegulationDate(claim.text, newNumber, change.documentDate),
      }));
    }

    const contentChanged =
      previous.edition !== change.edition ||
      existingClaims.some(
        existing => existing.text !== change.claims.find(claim => claim.id === existing.id).text,
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
      contentUpdatedAt: contentChanged ? now : previous.contentUpdatedAt || null,
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
function validateTopicClaimUpdates(topic, input) {
  const normalizedTopic = String(topic || '').trim();

  if (!TOPICS.has(normalizedTopic)) {
    throw new TypeError('Неизвестная тематика постановления');
  }

  if (!input || typeof input !== 'object' || Array.isArray(input) || !Array.isArray(input.claims)) {
    throw new TypeError('Неверный список тематических вопросов');
  }

  if (input.claims.length > 100) {
    throw new TypeError('Слишком много тематических вопросов');
  }

  const seen = new Set();

  const claims = input.claims.map(item => {
    const number = String(item?.number ?? '').trim();

    const id = String(item?.id ?? '').trim();

    const text = String(item?.text ?? '').trim();

    if (!number || !id || !text || text.length > 1000) {
      throw new TypeError('Неверный тематический вопрос');
    }

    const key = `${number}:${id}`;

    if (seen.has(key)) {
      throw new TypeError('Тематический вопрос продублирован');
    }

    seen.add(key);

    return {
      number,
      id,
      text,
    };
  });

  return {
    topic: normalizedTopic,
    claims,
  };
}

export function updateTopicClaims(topic, input) {
  const change = validateTopicClaimUpdates(topic, input);

  const operation = writes.then(async () => {
    const data = await readRegistry();

    const expected = new Map();

    for (const item of data.items) {
      if (item.topic !== change.topic) {
        continue;
      }

      for (const claim of item.claims || []) {
        expected.set(`${item.number}:${claim.id}`, {
          item,
          claim,
        });
      }
    }

    if (change.claims.length !== expected.size) {
      throw new TypeError('Состав тематических вопросов изменён. Обновите страницу.');
    }

    for (const claim of change.claims) {
      const key = `${claim.number}:${claim.id}`;

      if (!expected.has(key)) {
        throw new TypeError('Неизвестный тематический вопрос. Обновите страницу.');
      }
    }

    let changedClaims = 0;

    const changedNumbers = new Set();

    for (const update of change.claims) {
      const regulation = data.items.find(
        item => String(item.number) === update.number && item.topic === change.topic,
      );

      if (!regulation) {
        throw new TypeError(`Не найдено постановление №${update.number}`);
      }

      const claim = (regulation.claims || []).find(item => item.id === update.id);

      if (!claim) {
        throw new TypeError(`Не найден вопрос ${update.id}`);
      }

      if (claim.text !== update.text) {
        claim.text = update.text;

        changedClaims += 1;

        changedNumbers.add(String(regulation.number));
      }
    }

    if (changedClaims > 0) {
      const now = new Date().toISOString();

      for (const item of data.items) {
        if (changedNumbers.has(String(item.number))) {
          item.contentUpdatedAt = now;

          item.updatedAt = now;
        }
      }

      const temporary = `${FILE}.${process.pid}.${Date.now()}.tmp`;

      try {
        await fs.writeFile(temporary, JSON.stringify(data, null, 2) + '\n', {
          encoding: 'utf8',
          mode: 0o600,
        });

        await fs.rename(temporary, FILE);
      } catch (error) {
        await fs.rm(temporary, {
          force: true,
        });

        throw error;
      }
    }

    return {
      topic: change.topic,
      changedClaims,
      publicationNeeded: changedClaims > 0,
    };
  });

  writes = operation.catch(() => {});

  return operation;
}
