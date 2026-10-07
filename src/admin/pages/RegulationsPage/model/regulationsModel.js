export const generalSteps = [
  {
    key: 'number',
    label: 'Номер постановления',
    type: 'number',
  },
  {
    key: 'title',
    label: 'Название',
    type: 'text',
  },
  {
    key: 'documentDate',
    label: 'Дата постановления',
    type: 'date',
  },
  {
    key: 'reviewStatus',
    label: 'Статус проверки',
    type: 'status',
  },
  {
    key: 'reviewedAt',
    label: 'Дата проверки постановления',
    type: 'date',
  },
  {
    key: 'reviewDueDate',
    label: 'Дата окончания срока постановления',
    type: 'date',
  },
  {
    key: 'topic',
    label: 'На какую тематику это постановление?',
    type: 'topic',
  },
];

export function createEmptyRegulation() {
  return {
    number: '',
    title: '',
    topic: '',
    documentDate: null,
    edition: '',
    officialUrl: '',
    reviewStatus: 'needs_review',
    reviewedAt: null,
    reviewDueDate: null,
    reviewNote: '',
    claims: [],
    occurrences: [],
  };
}

function cleanClaimLabel(label, fallback) {
  return (
    String(label || fallback || '')
      .replace(/^FAQ:\s*/i, '')
      .trim() || 'Нормативный вопрос'
  );
}

export function getTopicQuestions(items, topic) {
  if (!topic) {
    return [];
  }

  const questions = [];
  const seen = new Set();

  for (const regulation of items) {
    if (regulation.topic !== topic) {
      continue;
    }

    for (const claim of regulation.claims || []) {
      if (!claim?.id) {
        continue;
      }

      const ownerNumber = String(regulation.number);

      const key = `${ownerNumber}:${claim.id}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);

      questions.push({
        key,
        ownerNumber,
        id: claim.id,
        label: cleanClaimLabel(claim.label, claim.id),
        text: claim.text || '',
      });
    }
  }

  return questions;
}

export function reviewReminder(item) {
  if (item.reviewStatus !== 'reviewed' || !item.reviewedAt) {
    return 'Нужна проверка';
  }

  const next = new Date(`${item.reviewedAt}T00:00:00Z`);

  next.setUTCDate(next.getUTCDate() + 90);

  const due = next.toISOString().slice(0, 10);

  const today = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Moscow',
  });

  const display = due.split('-').reverse().join('.');

  return today > due ? `Проверка просрочена с ${display}` : `Следующая проверка — до ${display}`;
}

export function buildPayload(form, claims) {
  return {
    number: String(form.number || '').trim(),

    title: form.title || '',

    topic: form.topic || '',

    documentDate: form.documentDate || null,

    edition: form.edition || '',

    officialUrl: form.officialUrl || '',

    reviewStatus: form.reviewStatus || 'needs_review',

    reviewedAt: form.reviewedAt || null,

    reviewDueDate: form.reviewDueDate || null,

    reviewNote: form.reviewNote || '',

    claims,
  };
}
