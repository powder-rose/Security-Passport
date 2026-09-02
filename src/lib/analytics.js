const env = import.meta.env;

const rawMetricaId = env.VITE_YANDEX_METRICA_ID?.trim();
const METRICA_ID = rawMetricaId && /^\d+$/.test(rawMetricaId) ? Number(rawMetricaId) : null;
const METRICA_ENABLED = env.VITE_YANDEX_METRICA_ENABLED !== 'false';
const WEBVISOR_ENABLED = env.VITE_YANDEX_METRICA_WEBVISOR === 'true';

export const METRICA_GOALS = Object.freeze({
  contactCtaClick: 'contact_cta_click',
  phoneClick: 'phone_click',
  emailClick: 'email_click',
  quizStart: 'quiz_start',
  quizStepCompleted: 'quiz_step_completed',
  quizSubmitSuccess: 'quiz_submit_success',
  quizSubmitError: 'quiz_submit_error',
  leadSubmitSuccess: 'lead_submit_success',
  leadSubmitError: 'lead_submit_error',
});

function canUseMetrica() {
  return typeof window !== 'undefined' && METRICA_ENABLED && Boolean(METRICA_ID);
}

export function initYandexMetrica() {
  if (!canUseMetrica()) return false;
  if (window.__boykovMetricaInitialized) return true;

  window.ym = window.ym || function ym(...args) {
    (window.ym.a = window.ym.a || []).push(args);
  };
  window.ym.l = window.ym.l || Date.now();

  if (!document.querySelector('script[data-boykov-metrica]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    script.dataset.boykovMetrica = 'true';
    document.head.appendChild(script);
  }

  window.ym(METRICA_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: WEBVISOR_ENABLED,
  });

  window.__boykovMetricaInitialized = true;
  return true;
}

export function reachGoal(goal, params = undefined) {
  if (!canUseMetrica() || typeof window.ym !== 'function') return false;

  try {
    window.ym(METRICA_ID, 'reachGoal', goal, params);
    return true;
  } catch {
    return false;
  }
}

export function trackNavigationClick(event) {
  if (typeof window === 'undefined') return;

  const link = event.target.closest?.('a[href]');
  if (!link) return;

  const href = link.getAttribute('href') || '';
  const label = link.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) || undefined;

  if (href === '#contact') {
    reachGoal(METRICA_GOALS.contactCtaClick, { label });
    return;
  }

  if (href.startsWith('tel:')) {
    reachGoal(METRICA_GOALS.phoneClick, { label });
    return;
  }

  if (href.startsWith('mailto:')) {
    reachGoal(METRICA_GOALS.emailClick, { label });
  }
}
