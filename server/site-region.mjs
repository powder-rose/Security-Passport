import {
  DEFAULT_LOCATION,
  getLocationBySlug,
} from '../config/geography/index.mjs';


const BASE_DOMAIN =
  String(
    process.env.BASE_DOMAIN ||
    'pasport-bezopasnosty.ru',
  )
    .trim()
    .toLowerCase();


function unknownSite({
  slug = 'unknown',
  host = '',
} = {}) {
  return {
    slug,
    name:
      slug === 'unknown'
        ? 'Не определён'
        : slug,

    host,
    isDefault: false,
  };
}


export function resolveSiteFromHost(
  rawHost = '',
) {
  const host =
    String(rawHost)
      .trim()
      .toLowerCase()
      .replace(/:\d+$/, '');


  // Федеральный домен.
  if (
    !host ||
    host === BASE_DOMAIN ||
    host === `www.${BASE_DOMAIN}`
  ) {
    return {
      // Сохраняем старый slug,
      // чтобы не ломать историческую статистику.
      slug: 'russia',

      name:
        DEFAULT_LOCATION.name,

      host:
        BASE_DOMAIN,

      isDefault: true,
    };
  }


  const suffix =
    `.${BASE_DOMAIN}`;


  // Чужой домен.
  if (
    !host.endsWith(suffix)
  ) {
    return unknownSite({
      host,
    });
  }


  const slug =
    host.slice(
      0,
      -suffix.length,
    );


  if (!slug) {
    return unknownSite({
      host,
    });
  }


  // Мы используем одноуровневые поддомены.
  // Не принимаем foo.bar.domain как slug.
  if (
    slug.includes('.')
  ) {
    return unknownSite({
      slug,
      host,
    });
  }


  // ВАЖНО:
  // getLocationBySlug ищет по ВСЕЙ базе,
  // а не только среди active.
  //
  // Поэтому backend уже способен
  // распознавать будущие 9997 географий,
  // хотя страницы пока не опубликованы.
  const location =
    getLocationBySlug(slug);


  if (!location) {
    return unknownSite({
      slug,
      host,
    });
  }


  return {
    slug:
      location.slug,

    name:
      location.name,

    host,

    isDefault: false,
  };
}
