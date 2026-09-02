const STORAGE_KEY = 'boykovgroup_lead_attribution';
const PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
  'gclid',
];

export function captureAttribution() {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const values = Object.fromEntries(
    PARAM_KEYS
      .map((key) => [key, params.get(key)])
      .filter(([, value]) => Boolean(value)),
  );

  let stored = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    stored = {};
  }

  const payload = {
    ...stored,
    ...values,
    landingPage: stored.landingPage || window.location.href,
    referrer: stored.referrer || document.referrer || '',
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage can be unavailable in strict privacy modes.
  }

  return payload;
}

export function getAttribution() {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
