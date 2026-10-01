import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Container from '../ui/Container/Container';

import DirectoryContent
from './DirectoryContent';

import MobileMenuPortal
from './MobileMenuPortal';

import {
  MOBILE_BREAKPOINT,
  getNavigationTarget,
  isDirectoryActive,
  normalizePathname,
  quickNavLinks,
  scrollToNavigationTarget,
} from './headerNavigation';

import {
  SITE,
} from '../../config/site';

import './Header.css';


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

  const mobileNavRef =
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
          ||
          mobileNavRef.current
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
    isDirectoryActive(
      currentPathname,
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


        <MobileMenuPortal
          active={mobileMenuOpen}
        >
          <nav
            ref={mobileNavRef}
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
        </MobileMenuPortal>


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
