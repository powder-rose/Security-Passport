import { SITE } from '../config/site';

import {
  isObjectTypePathname,
} from '../data/objectTypes';

import {
  isServicePagePathname,
} from '../data/servicePages';



const GEO_TEST_PARAM =
  'geo_test';

const FEDERAL_BYPASS_PARAM =
  'federal';

const GEO_TIMEOUT_MS =
  1800;


function isSearchRobot() {
  if (
    typeof navigator === 'undefined'
  ) {
    return false;
  }

  return /Googlebot|bingbot|YandexBot|YandexImages|DuckDuckBot|Baiduspider|PetalBot|Applebot/i
    .test(
      navigator.userAgent || '',
    );
}


function isFederalHost(hostname) {
  const host =
    String(hostname || '')
      .trim()
      .toLowerCase();

  return (
    host === SITE.baseDomain ||
    host === `www.${SITE.baseDomain}`
  );
}


function isEligiblePath(pathname) {
  return (
    pathname === '/' ||
    pathname === '/index.html' ||
    isObjectTypePathname(pathname) ||
    isServicePagePathname(pathname)
  );
}


async function fetchGeo() {
  const controller =
    new AbortController();

  const timeout =
    window.setTimeout(
      () => controller.abort(),
      GEO_TIMEOUT_MS,
    );

  try {
    const response =
      await fetch('/api/geo', {
        method: 'GET',

        headers: {
          Accept: 'application/json',
        },

        credentials: 'same-origin',
        cache: 'no-store',
        signal: controller.signal,
      });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  } finally {
    window.clearTimeout(
      timeout,
    );
  }
}


function buildTargetUrl(
  targetOrigin,
) {
  const url =
    new URL(
      window.location.href,
    );

  /*
   * geo_test нужен только для
   * безопасного тестового запуска.
   * На региональный домен его не переносим.
   */
  url.searchParams.delete(
    GEO_TEST_PARAM,
  );

  return (
    `${targetOrigin}` +
    `${url.pathname}` +
    `${url.search}` +
    `${url.hash}`
  );
}


export async function maybeRedirectByGeo() {
  if (
    typeof window === 'undefined'
  ) {
    return false;
  }

  const params =
    new URLSearchParams(
      window.location.search,
    );

  if (
    params.get(
      FEDERAL_BYPASS_PARAM,
    ) === '1'
  ) {
    return false;
  }

  if (
    !isFederalHost(
      window.location.hostname,
    )
  ) {
    return false;
  }

  if (
    !isEligiblePath(
      window.location.pathname,
    )
  ) {
    return false;
  }

  if (isSearchRobot()) {
    return false;
  }


  /*
   * Старый ручной выбор больше не используется.
   * Удаляем cookie, если она осталась
   * у посетителя от предыдущей версии сайта.
   */
  document.cookie =
    'passport_geo_choice=' +
    '; Path=/' +
    '; Max-Age=0' +
    '; SameSite=Lax' +
    '; Secure' +
    `; Domain=.${SITE.baseDomain}`;


  /*
   * Production mode:
   * федеральная главная автоматически
   * определяет подходящую географию.
   *
   * Региональные поддомены,
   * юридические страницы,
   * админка и поисковые роботы
   * сюда не попадают.
   */


  const result =
    await fetchGeo();

  if (
    !result?.ok ||
    result.kind === 'federal'
  ) {
    return false;
  }

  const targetOrigin =
    String(
      result.targetOrigin || '',
    )
      .trim()
      .replace(/\/$/, '');

  if (
    !targetOrigin ||
    !targetOrigin.startsWith(
      'https://',
    )
  ) {
    return false;
  }

  let target;

  try {
    target =
      new URL(
        targetOrigin,
      );
  } catch {
    return false;
  }

  /*
   * Разрешаем переход исключительно
   * на наш домен или его поддомены.
   */
  if (
    target.hostname !==
      SITE.baseDomain &&
    !target.hostname.endsWith(
      `.${SITE.baseDomain}`,
    )
  ) {
    return false;
  }

  if (
    target.hostname ===
    window.location.hostname
  ) {
    return false;
  }


  const destination =
    buildTargetUrl(
      targetOrigin,
    );

  /*
   * replace, а не assign:
   * кнопка "Назад" не должна создавать
   * цикл федеральный → региональный.
   */
  window.location.replace(
    destination,
  );

  return true;
}
