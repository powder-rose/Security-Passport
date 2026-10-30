import { adminRequest, AdminApiError } from '../../api/adminApi.js';

export async function questionRequest(path = '', { method = 'GET', body } = {}) {
  const result = await adminRequest(`/questions${path}`, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!result?.ok)
    throw new AdminApiError(result?.message || 'Не удалось выполнить действие.', {
      code: result?.error,
    });
  return result;
}

export const QUESTION_STATUS_LABELS = Object.freeze({
  draft: 'Черновик',
  review: 'На проверке',
  published: 'Опубликован',
  scheduled: 'Запланирован',
  archived: 'В архиве',
});
