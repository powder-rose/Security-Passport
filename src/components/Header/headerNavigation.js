import {
  objectTypes,
} from '../../data/objectTypes';

import {
  servicePages,
} from '../../data/servicePages';


export const MOBILE_BREAKPOINT = 1180;


export const quickNavLinks = [
  [
    '#about-passport',
    'О документе',
  ],
  [
    '#process',
    'Как работаем',
  ],
  [
    '#prices',
    'Стоимость',
  ],
  [
    '#faq',
    'FAQ',
  ],
];


const pageNavAliases = {

  '/pasport-bezopasnosti-gostinicy': {
    '#top': '.hotel-hero',
    '#about-passport': '#hotel-regulation',
    '#objects': '#hotel-accommodation',
    '#process': '#hotel-process',
    '#prices': '#hotel-price',
    '#faq': '#hotel-faq',
  },

  '/pasport-bezopasnosti-obekta-kultury': {
    '#top': '.culture-hero',
    '#about-passport': '#culture-regulation',
    '#objects': '#culture-scope',
    '#process': '#culture-passport',
    '#prices': '#culture-price',
    '#faq': '#culture-faq',
  },

  '/pasport-bezopasnosti-obrazovatelnoj-organizacii': {
    '#top': '.education-hero',
    '#about-passport': '#education-requirements',
    '#objects': '.education-objects',
    '#process': '.education-process',
    '#prices': '.education-price',
    '#faq': '#education-faq',
  },

  '/pasport-bezopasnosti-mesta-massovogo-prebyvaniya-lyudej': {
    '#top': '#top',
    '#about-passport': '#regulation',
    '#objects': '#applicability',
    '#process': '#process',
    '#prices': '.crowd-hero__commercial',
    '#faq': '#faq',
  },

  '/aktualizaciya-pasporta-bezopasnosti-obekta': {
    '#top': '.actualization-hero',
    '#about-passport': '.actualization-definition',
    '#objects': '.actualization-objects',
    '#process': '.actualization-work',
    '#prices': '#actualization-price',
    '#faq': '.actualization-faq',
  },

  '/akt-obsledovaniya-i-kategorirovaniya-obekta': {
    '#top': '.categorization-act-hero',
    '#about-passport': '.categorization-act-intro',
    '#objects': '#who-needs-act',
    '#process': '.categorization-act-process',
    '#prices': '.categorization-act-cost',
    '#faq': '.categorization-act-faq',
  },

  '/pasport-bezopasnosti-obekta-socialnoj-zashchity': {
    '#top': '.object-service-hero',
    '#about-passport': '.object-service-scope',
    '#objects': '#quiz',
    '#prices': '.object-service-hero__price',
  },

};


export function normalizePathname(
  pathname,
) {
  if (
    !pathname ||
    pathname === '/'
  ) {
    return '/';
  }

  return (
    '/' +
    String(pathname)
      .split('?')[0]
      .split('#')[0]
      .replace(
        /^\/+|\/+$/g,
        '',
      )
  );
}


export function isPathActive(
  href,
  pathname,
) {
  const target =
    normalizePathname(
      href,
    );

  if (
    target === '/blog'
  ) {
    return (
      pathname === '/blog' ||
      pathname.startsWith(
        '/blog/',
      )
    );
  }

  return (
    target === pathname
  );
}


export function getNavigationTarget(
  hash,
) {
  if (
    typeof window ===
      'undefined' ||
    typeof document ===
      'undefined'
  ) {
    return null;
  }

  const directTarget =
    document.querySelector(
      hash,
    );

  if (directTarget) {
    return directTarget;
  }

  const pathname =
    normalizePathname(
      window.location.pathname,
    );

  const selector =
    pageNavAliases[
      pathname
    ]?.[hash];

  if (!selector) {
    return null;
  }

  return document.querySelector(
    selector,
  );
}


export function scrollToNavigationTarget(
  target,
  behavior = 'smooth',
) {
  if (!target) {
    return;
  }

  const header =
    document.querySelector(
      '.site-header',
    );

  const headerHeight =
    header
      ?.getBoundingClientRect()
      ?.height ||
    0;

  const heading =
    target.querySelector?.(
      'h1, h2',
    );

  const headingLead =
    heading
      ?.previousElementSibling;

  const scrollTarget =
    headingLead ||
    heading ||
    target;

  const top =
    scrollTarget
      .getBoundingClientRect()
      .top +
    window.scrollY -
    headerHeight -
    18;

  window.scrollTo({
    top:
      Math.max(
        0,
        top,
      ),
    behavior,
  });
}

export function isDirectoryActive(
  pathname,
) {
  return (
    servicePages.some(
      page =>
        isPathActive(
          page.path,
          pathname,
        ),
    ) ||
    objectTypes.some(
      item =>
        isPathActive(
          item.path,
          pathname,
        ),
    )
  );
}
