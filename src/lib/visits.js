import { getAttribution } from './attribution';

const VISIT_ENDPOINT = '/api/visits';
const STORAGE_KEY = 'passport-security-visit-session';
const SESSION_TTL_MS = 30 * 60 * 1000;

function createSessionId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `visit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Посещение всё равно отправится, даже если localStorage недоступен.
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function trackVisit() {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const host = window.location.hostname;
  const previous = readSession();

  if (
    previous?.host === host &&
    previous?.id &&
    Number.isFinite(previous?.lastSeen) &&
    now - previous.lastSeen < SESSION_TTL_MS
  ) {
    writeSession({
      ...previous,
      lastSeen: now,
    });

    return;
  }

  const sessionId = createSessionId();

  writeSession({
    id: sessionId,
    host,
    startedAt: now,
    lastSeen: now,
  });

  try {
    const response = await fetch(VISIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        path: `${window.location.pathname}${window.location.search}`,
        referrer: document.referrer || '',
        attribution: getAttribution(),
      }),
      keepalive: true,
    });

    if (!response.ok) {
      clearSession();
    }
  } catch {
    clearSession();
  }
}
