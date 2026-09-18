const env = import.meta.env;

const rawMetricaId = env.VITE_YANDEX_METRICA_ID?.trim();
const METRICA_ID = rawMetricaId && /^\d+$/.test(rawMetricaId) ? Number(rawMetricaId) : null;
const METRICA_ENABLED = env.VITE_YANDEX_METRICA_ENABLED !== 'false';
const WEBVISOR_ENABLED = env.VITE_YANDEX_METRICA_WEBVISOR === 'true';

const SECONDARY_METRICA_ID = 112564818;

const METRICA_IDS = [
  ...new Set(
    [
      METRICA_ID,
      SECONDARY_METRICA_ID,
    ].filter(Boolean),
  ),
];

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
  return (
    typeof window !== 'undefined' &&
    METRICA_ENABLED &&
    METRICA_IDS.length > 0
  );
}

function ensureMetricaScript(id) {
  const src =
    `https://mc.yandex.ru/metrika/tag.js?id=${id}`;

  const alreadyExists =
    Array.from(document.scripts).some(
      (script) => script.src === src,
    );

  if (alreadyExists) return;

  const script =
    document.createElement('script');

  script.async = true;
  script.src = src;
  script.dataset.boykovMetrica =
    String(id);

  document.head.appendChild(
    script,
  );
}

export function initYandexMetrica() {
  if (!canUseMetrica()) return false;
  if (window.__boykovMetricaInitialized) return true;

  window.ym =
    window.ym ||
    function ym(...args) {
      (
        window.ym.a =
          window.ym.a || []
      ).push(args);
    };

  window.ym.l =
    window.ym.l || Date.now();

  for (const id of METRICA_IDS) {
    ensureMetricaScript(id);
  }

  /*
   * Основной существующий счётчик.
   * Его настройки не меняем.
   */
  if (
    METRICA_ID &&
    METRICA_ID !== SECONDARY_METRICA_ID
  ) {
    window.ym(
      METRICA_ID,
      'init',
      {
        ssr: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: WEBVISOR_ENABLED,
        referrer: document.referrer,
        url: window.location.href,
      },
    );
  }

  /*
   * Второй счётчик Яндекс Метрики.
   * ID: 112564818
   */
  window.ym(
    SECONDARY_METRICA_ID,
    'init',
    {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: window.location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    },
  );

  window.__boykovMetricaInitialized = true;

  return true;
}

export function reachGoal(goal, params = undefined) {
  if (
    !canUseMetrica() ||
    typeof window.ym !== 'function'
  ) {
    return false;
  }

  let sent = false;

  for (const id of METRICA_IDS) {
    try {
      window.ym(
        id,
        'reachGoal',
        goal,
        params,
      );

      sent = true;
    } catch {
      // Ошибка одного счётчика
      // не должна мешать другому.
    }
  }

  return sent;
}

export function trackNavigationClick(event) {
  if (typeof window === 'undefined') return;

  const link = event.target.closest?.('a[href]');
  if (!link) return;

  const href = link.getAttribute('href') || '';
  const label = link.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) || undefined;

  if (
    href === '#contact' ||
    href === '#lead-form'
  ) {
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
