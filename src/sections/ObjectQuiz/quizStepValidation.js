export function isQuizStepValid(question, answer) {
  if (question.type === 'choice') return Boolean(answer);
  if (question.type === 'choice-with-other') {
    if (!answer?.selected) return false;
    if (answer.selected === 'Другой тип объекта') return Boolean(answer.other?.trim());
    return true;
  }
  if (question.type === 'location') return Boolean(answer?.region?.trim() && answer?.city?.trim());
  if (question.type === 'metrics') return Boolean(answer?.area?.trim() && answer?.people?.trim());
  if (question.type === 'contact') {
    return Boolean(answer?.name?.trim() && answer?.phone?.trim() && answer?.consent);
  }
  return false;
}
