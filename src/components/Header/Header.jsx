import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Container from '../ui/Container/Container';

import {
  SITE,
} from '../../config/site';

import {
  objectTypes,
} from '../../data/objectTypes';

import {
  servicePages,
} from '../../data/servicePages';

import './Header.css';


const MOBILE_BREAKPOINT = 1180;


const quickNavLinks = [
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


function normalizePathname(
  pathname
) {

  if (
    !pathname
    ||
    pathname === '/'
  ) {
    return '/';
  }

  return (
    '/'
    +
    String(pathname)
      .split('?')[0]
      .split('#')[0]
      .replace(/^\/+|\/+$/g, '')
  );

}


function isPathActive(
  href,
  pathname,
) {

  const target =
    normalizePathname(
      href
    );

  if (
    target === '/blog'
  ) {
    return (
      pathname === '/blog'
      ||
      pathname.startsWith(
        '/blog/'
      )
    );
  }

  return (
    target === pathname
  );

}


function getNavigationTarget(
  hash
) {

  if (
    typeof window === 'undefined'
    ||
    typeof document === 'undefined'
  ) {
    return null;
  }

  const directTarget =
    document.querySelector(
      hash
    );

  if (directTarget) {
    return directTarget;
  }

  const pathname =
    normalizePathname(
      window.location.pathname
    );

  const selector =
    pageNavAliases[
      pathname
    ]?.[hash];

  if (!selector) {
    return null;
  }

  return document.querySelector(
    selector
  );

}


function scrollToNavigationTarget(
  target,
  behavior = 'smooth',
) {

  if (!target) {
    return;
  }

  const header =
    document.querySelector(
      '.site-header'
    );

  const headerHeight =
    header
      ?.getBoundingClientRect()
      ?.height
    || 0;

  const heading =
    target.querySelector?.(
      'h1, h2'
    );

  const headingLead =
    heading
      ?.previousElementSibling;

  const scrollTarget =
    headingLead
    ||
    heading
    ||
    target;

  const top =
    scrollTarget
      .getBoundingClientRect()
      .top
    +
    window.scrollY
    -
    headerHeight
    -
    18;

  window.scrollTo({
    top:
      Math.max(
        0,
        top
      ),
    behavior,
  });

}


function DirectoryLink({
  href,
  label,
  currentPathname,
  onNavigate,
}) {

  const active =
    isPathActive(
      href,
      currentPathname
    );

  return (
    <a
      href={href}
      className={
        `site-directory__link${
          active
            ? ' is-current'
            : ''
        }`
      }
      aria-current={
        active
          ? 'page'
          : undefined
      }
      onClick={onNavigate}
    >
      <span>
        {label}
      </span>

      <span
        className="site-directory__link-arrow"
        aria-hidden="true"
      >
        ↗
      </span>
    </a>
  );

}


function DirectoryContent({
  currentPathname,
  onNavigate,
  mobile = false,
}) {

  return (
    <div
      className={
        `site-directory__grid${
          mobile
            ? ' site-directory__grid--mobile'
            : ''
        }`
      }
    >

      <section className="site-directory__group">

        <div className="site-directory__eyebrow">
          Услуги
        </div>

        <div className="site-directory__links">

          <DirectoryLink
            href="/"
            label="Паспорт безопасности объекта"
            currentPathname={
              currentPathname
            }
            onNavigate={
              onNavigate
            }
          />

          {
            servicePages.map(
              page => (
                <DirectoryLink
                  key={
                    page.path
                  }
                  href={
                    page.path
                  }
                  label={
                    page.title
                  }
                  currentPathname={
                    currentPathname
                  }
                  onNavigate={
                    onNavigate
                  }
                />
              )
            )
          }

        </div>

      </section>


      <section
        className="
          site-directory__group
          site-directory__group--objects
        "
      >

        <div className="site-directory__eyebrow">
          По типу объекта
        </div>

        <div
          className="
            site-directory__links
            site-directory__links--objects
          "
        >

          {
            objectTypes.map(
              item => (
                <DirectoryLink
                  key={
                    item.path
                  }
                  href={
                    item.path
                  }
                  label={
                    item.title
                  }
                  currentPathname={
                    currentPathname
                  }
                  onNavigate={
                    onNavigate
                  }
                />
              )
            )
          }

        </div>

      </section>


      <section className="site-directory__group">

        <div className="site-directory__eyebrow">
          Материалы
        </div>

        <div className="site-directory__links">

          <DirectoryLink
            href="/blog/"
            label="Блог"
            currentPathname={
              currentPathname
            }
            onNavigate={
              onNavigate
            }
          />

        </div>


        <div className="site-directory__help">

          <span>
            Не уверены, какой документ нужен?
          </span>

          <a
            href="/#contact"
            onClick={onNavigate}
          >
            Обсудить объект
            <span aria-hidden="true">
              →
            </span>
          </a>

        </div>

      </section>

    </div>
  );

}


export default function Header({
  pathname = '/',
}) {

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] =
    useState(false);


  const [
    directoryOpen,
    setDirectoryOpen,
  ] =
    useState(false);


  const [
    currentPathname,
    setCurrentPathname,
  ] =
    useState(
      () =>
        normalizePathname(
          pathname
        )
    );


  const headerRef =
    useRef(null);

  const mobileButtonRef =
    useRef(null);

  const directoryButtonRef =
    useRef(null);


  const closeMenus = () => {

    setMobileMenuOpen(false);
    setDirectoryOpen(false);

  };


  useEffect(() => {

    if (
      typeof window === 'undefined'
    ) {
      return undefined;
    }

    setCurrentPathname(
      normalizePathname(
        window.location.pathname
      )
    );

    const handleKeyDown =
      event => {

        if (
          event.key !== 'Escape'
        ) {
          return;
        }

        if (directoryOpen) {

          setDirectoryOpen(false);

          directoryButtonRef
            .current
            ?.focus();

        }

        if (mobileMenuOpen) {

          setMobileMenuOpen(false);

          mobileButtonRef
            .current
            ?.focus();

        }

      };


    const handleResize = () => {

      if (
        window.innerWidth
        >
        MOBILE_BREAKPOINT
      ) {
        setMobileMenuOpen(false);
      }
      else {
        setDirectoryOpen(false);
      }

    };


    const handlePointerDown =
      event => {

        if (
          headerRef.current
          ?.contains(
            event.target
          )
        ) {
          return;
        }

        closeMenus();

      };


    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    window.addEventListener(
      'resize',
      handleResize
    );

    document.addEventListener(
      'pointerdown',
      handlePointerDown
    );


    return () => {

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );

      window.removeEventListener(
        'resize',
        handleResize
      );

      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      );

    };

  }, [
    directoryOpen,
    mobileMenuOpen,
  ]);


  useEffect(() => {

    if (
      !mobileMenuOpen
      ||
      typeof window === 'undefined'
      ||
      window.innerWidth
      >
      MOBILE_BREAKPOINT
    ) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    return () => {

      document.body.style.overflow =
        previousOverflow;

    };

  }, [
    mobileMenuOpen,
  ]);


  useEffect(() => {

    if (
      typeof window === 'undefined'
      ||
      !window.location.hash
    ) {
      return undefined;
    }

    const hash =
      window.location.hash;

    const directTarget =
      document.querySelector(
        hash
      );

    if (directTarget) {
      return undefined;
    }

    const target =
      getNavigationTarget(
        hash
      );

    if (!target) {
      return undefined;
    }

    const frame =
      window.requestAnimationFrame(
        () => {

          scrollToNavigationTarget(
            target,
            'auto'
          );

        }
      );

    return () =>
      window.cancelAnimationFrame(
        frame
      );

  }, []);


  function handleNavigation(
    event,
    hash,
  ) {

    closeMenus();

    if (
      typeof window === 'undefined'
    ) {
      return;
    }

    const target =
      getNavigationTarget(
        hash
      );

    if (target) {

      event.preventDefault();

      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}${hash}`
      );

      scrollToNavigationTarget(
        target
      );

      return;
    }

    const pathname =
      normalizePathname(
        window.location.pathname
      );

    if (
      pathname !== '/'
    ) {

      event.preventDefault();

      window.location.assign(
        `/${hash}`
      );

    }

  }


  const blogActive =
    currentPathname === '/blog'
    ||
    currentPathname.startsWith(
      '/blog/'
    );


  const directoryActive =
    servicePages.some(
      page =>
        isPathActive(
          page.path,
          currentPathname
        )
    )
    ||
    objectTypes.some(
      item =>
        isPathActive(
          item.path,
          currentPathname
        )
    );


  return (
    <header
      id="top"
      ref={headerRef}
      className="site-header"
    >

      <Container className="site-header__inner">

        <a
          className="brand"
          href="/"
          aria-label={`${SITE.brand}: на главную`}
          onClick={closeMenus}
        >
          {SITE.brand}
        </a>


        <button
          ref={mobileButtonRef}
          className="site-header__menu-toggle"
          type="button"
          aria-expanded={
            mobileMenuOpen
          }
          aria-controls="site-navigation"
          aria-label={
            mobileMenuOpen
              ? 'Закрыть меню'
              : 'Открыть меню'
          }
          onClick={() => {

            setDirectoryOpen(false);

            setMobileMenuOpen(
              value => !value
            );

          }}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>


        <nav
          id="site-navigation"
          className={
            `site-nav${
              mobileMenuOpen
                ? ' site-nav--open'
                : ''
            }`
          }
          aria-label="Основная навигация"
        >

          {
            quickNavLinks.map(
              ([
                href,
                label,
              ]) => (
                <a
                  key={href}
                  className="site-nav__quick-link"
                  href={
                    currentPathname === '/'
                      ? href
                      : `/${href}`
                  }
                  onClick={
                    event =>
                      handleNavigation(
                        event,
                        href
                      )
                  }
                >
                  {label}
                </a>
              )
            )
          }


          <a
            className={
              `site-nav__quick-link site-nav__blog${
                blogActive
                  ? ' is-current'
                  : ''
              }`
            }
            href="/blog/"
            aria-current={
              blogActive
                ? 'page'
                : undefined
            }
            onClick={closeMenus}
          >
            Блог
          </a>


          <button
            ref={directoryButtonRef}
            className={
              `site-nav__directory-toggle${
                directoryActive
                  ? ' is-current'
                  : ''
              }`
            }
            type="button"
            aria-expanded={
              directoryOpen
            }
            aria-controls="site-directory"
            onClick={() => {

              setMobileMenuOpen(false);

              setDirectoryOpen(
                value => !value
              );

            }}
          >
            <span>
              Все разделы
            </span>

            <span
              className="site-nav__directory-chevron"
              aria-hidden="true"
            />
          </button>


          <div className="site-nav__mobile-directory">

            <div className="site-nav__mobile-title">
              Все разделы
            </div>

            <DirectoryContent
              currentPathname={
                currentPathname
              }
              onNavigate={
                closeMenus
              }
              mobile
            />

          </div>


          <a
            className="site-nav__mobile-cta"
            href="/#contact"
            onClick={closeMenus}
          >
            Обсудить объект
          </a>

        </nav>


        <div className="site-header__actions">

          <a
            className="site-header__phone"
            href={SITE.phoneHref}
          >
            {SITE.phone}
          </a>

          <a
            className="header-contact"
            href={
              currentPathname === '/'
                ? '#contact'
                : '/#contact'
            }
            onClick={
              event =>
                handleNavigation(
                  event,
                  '#contact'
                )
            }
          >
            Обсудить объект
          </a>

        </div>


        <div
          id="site-directory"
          className={
            `site-directory${
              directoryOpen
                ? ' site-directory--open'
                : ''
            }`
          }
          aria-hidden={
            !directoryOpen
          }
        >

          <div className="site-directory__panel">

            <div className="site-directory__top">

              <div>
                <span>
                  Навигация по сайту
                </span>

                <strong>
                  Все направления
                </strong>
              </div>

              <button
                className="site-directory__close"
                type="button"
                aria-label="Закрыть меню"
                onClick={() =>
                  setDirectoryOpen(false)
                }
              >
                ×
              </button>

            </div>

            <DirectoryContent
              currentPathname={
                currentPathname
              }
              onNavigate={
                closeMenus
              }
            />

          </div>

        </div>

      </Container>

    </header>
  );

}
