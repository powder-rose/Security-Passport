const API = '/api/admin';

export const ADMIN_AUTH_REQUIRED_EVENT = 'passport-admin-auth-required';

export class AdminApiError extends Error {
  constructor(message, { code = 'ADMIN_API_ERROR', status = 0, cause = null } = {}) {
    super(message);

    this.name = 'AdminApiError';
    this.code = code;
    this.status = status;

    if (cause) {
      this.cause = cause;
    }
  }
}

function notifyAdminAuthRequired() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(ADMIN_AUTH_REQUIRED_EVENT));
}

async function parseResponseJson(response) {
  const text = await response.text();

  if (!text) {
    throw new AdminApiError('Сервер вернул пустой ответ.', {
      code: 'EMPTY_RESPONSE',
      status: response.status,
    });
  }

  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new AdminApiError('Сервер вернул некорректный JSON.', {
      code: 'INVALID_JSON_RESPONSE',
      status: response.status,
      cause,
    });
  }
}

async function request(url, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = new Headers(options.headers || {});

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response;

  try {
    response = await fetch(API + url, {
      credentials: 'include',
      ...options,
      headers,
    });
  } catch (cause) {
    throw new AdminApiError('Не удалось связаться с сервером.', {
      code: 'NETWORK_ERROR',
      cause,
    });
  }

  const data = await parseResponseJson(response);

  if (response.status === 401 && data?.error === 'ADMIN_AUTH_REQUIRED') {
    notifyAdminAuthRequired();
  }

  if (!response.ok && (!data || typeof data !== 'object')) {
    throw new AdminApiError('Сервер вернул ошибку без корректного описания.', {
      code: 'HTTP_ERROR',
      status: response.status,
    });
  }

  return data;
}

export function login(password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({
      password,
    }),
  });
}

export function logout() {
  return request('/logout', {
    method: 'POST',
  });
}

export function getSession() {
  return request('/session');
}

export function getArticles() {
  return request('/articles');
}

export function createArticle(data) {
  return request('/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getArticle(id) {
  return request(`/articles/${id}`);
}

export function deleteArticle(id) {
  return request(`/articles/${id}`, {
    method: 'DELETE',
  });
}

export function updateArticle(id, data) {
  return request(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function uploadArticleImage(file) {
  const formData = new FormData();

  formData.append('image', file);

  return request('/upload/article-image', {
    method: 'POST',
    body: formData,
  });
}

export function getStatistics() {
  return request('/statistics');
}

export function getDocumentation() {
  return request('/documentation');
}

export function getLeads({ page = 1, limit = 50, search = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.set('search', search);
  }

  return request(`/leads?${params.toString()}`);
}

export function deleteLead(id) {
  return request(`/leads/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function getRegulations() {
  return request('/regulations');
}

export function saveRegulationBundle(data) {
  return request('/regulations/save', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getRegulationPublication() {
  return request('/regulations/publication');
}

export function retryRegulationPublication() {
  return request('/regulations/publication', {
    method: 'POST',
  });
}

export function updateArticlesYear() {
  return request('/articles/update-year', {
    method: 'POST',
  });
}
