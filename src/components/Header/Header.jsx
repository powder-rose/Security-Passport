import { useEffect, useRef, useState } from 'react';
import Container from '../ui/Container/Container';
import { SITE } from '../../config/site';
import './Header.css';

const navLinks = [
  ['#about-passport', 'О документе'],
  ['#objects', 'Кому нужен паспорт'],
  ['#process', 'Как работаем'],
  ['#prices', 'Стоимость'],
  ['#faq', 'FAQ'],
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


function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '');
}


function getNavigationTarget(hash) {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return null;
  }

  const directTarget =
    document.querySelector(hash);

  if (directTarget) {
    return directTarget;
  }

  const pathname =
    normalizePathname(
      window.location.pathname,
    );

  const selector =
    pageNavAliases[pathname]?.[hash];

  if (!selector) {
    return null;
  }

  return document.querySelector(
    selector,
  );
}


function scrollToNavigationTarget(
  target,
  behavior = 'smooth',
) {
  if (!target) return;

  const header =
    document.querySelector(
      '.site-header',
    );

  const headerHeight =
    header?.getBoundingClientRect()
      ?.height || 0;

  const heading =
    target.querySelector?.(
      'h1, h2',
    );

  const headingLead =
    heading?.previousElementSibling;

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
    top: Math.max(0, top),
    behavior,
  });
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 1080) setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || window.innerWidth > 1080) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);


  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.location.hash
    ) {
      return undefined;
    }

    const hash =
      window.location.hash;

    const directTarget =
      document.querySelector(hash);

    if (directTarget) {
      return undefined;
    }

    const target =
      getNavigationTarget(hash);

    if (!target) {
      return undefined;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          scrollToNavigationTarget(
            target,
            'auto',
          );
        },
      );

    return () =>
      window.cancelAnimationFrame(
        frame,
      );
  }, []);


  function handleNavigation(
    event,
    hash,
  ) {
    closeMenu();

    if (
      typeof window === 'undefined'
    ) {
      return;
    }

    const target =
      getNavigationTarget(hash);

    if (target) {
      event.preventDefault();

      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}${hash}`,
      );

      scrollToNavigationTarget(
        target,
      );

      return;
    }

    const pathname =
      normalizePathname(
        window.location.pathname,
      );

    if (pathname !== '/') {
      event.preventDefault();

      window.location.assign(
        `/${hash}`,
      );
    }
  }


  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <a className="brand" href="#top" aria-label={`${SITE.brand}: к началу страницы`} onClick={(event) => handleNavigation(event, '#top')}>
          {SITE.brand}
        </a>

        <button
          ref={menuButtonRef}
          className="site-header__menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav
          id="site-navigation"
          className={`site-nav${menuOpen ? ' site-nav--open' : ''}`}
          aria-label="Основная навигация"
        >
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} onClick={(event) => handleNavigation(event, href)}>{label}</a>
          ))}
          <a className="site-nav__mobile-cta" href="#contact" onClick={(event) => handleNavigation(event, '#contact')}>
            Обсудить объект
          </a>
        </nav>

        <div className="site-header__actions">
          <div className="site-header__contacts" aria-label="Контакты">
            <a
              className="site-header__phone"
              href={SITE.phoneHref}
            >
              {SITE.phone}
            </a>

            <a
              className="site-header__email"
              href={`mailto:${SITE.email}`}
            >
              {SITE.email}
            </a>
          </div>

          <a className="header-contact" href="#contact" onClick={(event) => handleNavigation(event, '#contact')}>
            Обсудить объект
          </a>
        </div>
      </Container>
    </header>
  );
}
