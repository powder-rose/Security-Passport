import { saveRegulationBundle } from '../../../api/adminApi';

import { buildPayload } from './regulationsModel.js';

function buildOwnClaims({ form, isCreating, selected, topicQuestions }) {
  if (isCreating) {
    return [];
  }

  const answers = new Map(topicQuestions.map(question => [question.key, question.text]));

  return (form.claims || []).map(claim => {
    const key = `${selected}:${claim.id}`;

    return {
      ...claim,
      text: answers.has(key) ? answers.get(key) : claim.text,
    };
  });
}

export default async function saveRegulationOperation({
  form,
  isCreating,
  selected,
  topicQuestions,
}) {
  const ownClaims = buildOwnClaims({
    form,
    isCreating,
    selected,
    topicQuestions,
  });

  const regulation = buildPayload(form, ownClaims);

  const topicClaims = topicQuestions.map(question => ({
    number: question.ownerNumber,
    id: question.id,
    text: question.text,
  }));

  const result = await saveRegulationBundle({
    mode: isCreating ? 'create' : 'update',
    selected,
    regulation,
    topicClaims,
  });

  if (!result?.ok || !result.regulation) {
    throw new Error(result?.message || 'Не удалось сохранить постановление');
  }

  return {
    publication: result.publication || null,
  };
}
