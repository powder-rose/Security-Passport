import { createRegulation, saveRegulation, saveRegulationTopicClaims } from '../../../api/adminApi';

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

  const payload = buildPayload(form, ownClaims);

  const baseResult = isCreating
    ? await createRegulation(payload)
    : await saveRegulation(selected, payload);

  if (!baseResult?.ok || !baseResult.regulation) {
    throw new Error(baseResult?.message || 'Не удалось сохранить постановление');
  }

  const newNumber = String(baseResult.regulation.number);

  const topicPayload = topicQuestions.map(question => ({
    number: !isCreating && question.ownerNumber === selected ? newNumber : question.ownerNumber,

    id: question.id,

    text: question.text,
  }));

  const topicResult = await saveRegulationTopicClaims(form.topic, topicPayload);

  if (!topicResult?.ok) {
    throw new Error(topicResult?.message || 'Не удалось сохранить тематические вопросы');
  }

  return {
    publication: topicResult.publication || baseResult.publication || null,
  };
}
