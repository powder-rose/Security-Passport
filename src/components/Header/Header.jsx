import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Container from '../ui/Container/Container';

import HeaderBrand
from './HeaderBrand';

import HeaderActions
from './HeaderActions';

import SiteDirectory
from './SiteDirectory';

import SiteNavigation
from './SiteNavigation';

import {
  MOBILE_BREAKPOINT,
  getNavigationTarget,
  isDirectoryActive,
  normalizePathname,
  scrollToNavigationTarget,
} from './headerNavigation';

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

        <HeaderBrand
          onNavigate={
            closeMenus
          }
        />


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


        <SiteNavigation
          mobileMenuOpen={
            mobileMenuOpen
          }
          mobileNavRef={
            mobileNavRef
          }
          currentPathname={
            currentPathname
          }
          blogActive={
            blogActive
          }
          directoryActive={
            directoryActive
          }
          directoryOpen={
            directoryOpen
          }
          directoryButtonRef={
            directoryButtonRef
          }
          onNavigate={
            handleNavigation
          }
          onCloseMenus={
            closeMenus
          }
          onToggleDirectory={() => {
            setMobileMenuOpen(false);

            setDirectoryOpen(
              value => !value,
            );
          }}
        />


        <HeaderActions
          currentPathname={
            currentPathname
          }
          onNavigate={
            handleNavigation
          }
        />


        <SiteDirectory
          open={
            directoryOpen
          }
          currentPathname={
            currentPathname
          }
          onClose={() =>
            setDirectoryOpen(false)
          }
          onNavigate={
            closeMenus
          }
        />


      </Container>

    </header>
  );

}
