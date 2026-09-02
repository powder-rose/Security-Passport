import { getAttribution } from './attribution';

const REQUEST_TIMEOUT_MS = 15000;

export function getLeadEndpoint() {
  return import.meta.env.VITE_LEAD_ENDPOINT?.trim() || '/api/leads';
}

function createRequestId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function submitLead({ source, data }) {
  const endpoint = getLeadEndpoint();
  if (!endpoint) {
    throw new Error('LEAD_ENDPOINT_NOT_CONFIGURED');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const payload = {
    source,
    requestId: createRequestId(),
    submittedAt: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    attribution: getAttribution(),
    data,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`LEAD_REQUEST_FAILED_${response.status}`);
    }

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
