import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  MOBILE_BREAKPOINT,
  getNavigationTarget,
  isDirectoryActive,
  normalizePathname,
  scrollToNavigationTarget,
} from './headerNavigation';


export default function useHeaderNavigation({
  pathname = '/',
} = {}) {
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
          pathname,
        ),
    );


  const headerRef =
    useRef(null);

  const mobileButtonRef =
    useRef(null);

  const mobileNavRef =
    useRef(null);

  const directoryButtonRef =
    useRef(null);


  function closeMenus() {
    setMobileMenuOpen(false);
    setDirectoryOpen(false);
  }


  function closeDirectory() {
    setDirectoryOpen(false);
  }


  function toggleMobileMenu() {
    setDirectoryOpen(false);

    setMobileMenuOpen(
      value => !value,
    );
  }


  function toggleDirectory() {
    setMobileMenuOpen(false);

    setDirectoryOpen(
      value => !value,
    );
  }


  useEffect(
    () => {
      if (
        typeof window ===
          'undefined'
      ) {
        return undefined;
      }

      setCurrentPathname(
        normalizePathname(
          window.location.pathname,
        ),
      );


      const handleKeyDown =
        event => {
          if (
            event.key !==
              'Escape'
          ) {
            return;
          }

          if (directoryOpen) {
            setDirectoryOpen(
              false,
            );

            directoryButtonRef
              .current
              ?.focus();
          }

          if (mobileMenuOpen) {
            setMobileMenuOpen(
              false,
            );

            mobileButtonRef
              .current
              ?.focus();
          }
        };


      const handleResize =
        () => {
          if (
            window.innerWidth >
            MOBILE_BREAKPOINT
          ) {
            setMobileMenuOpen(
              false,
            );
          } else {
            setDirectoryOpen(
              false,
            );
          }
        };


      const handlePointerDown =
        event => {
          if (
            headerRef.current
              ?.contains(
                event.target,
              ) ||
            mobileNavRef.current
              ?.contains(
                event.target,
              )
          ) {
            return;
          }

          closeMenus();
        };


      window.addEventListener(
        'keydown',
        handleKeyDown,
      );

      window.addEventListener(
        'resize',
        handleResize,
      );

      document.addEventListener(
        'pointerdown',
        handlePointerDown,
      );


      return () => {
        window.removeEventListener(
          'keydown',
          handleKeyDown,
        );

        window.removeEventListener(
          'resize',
          handleResize,
        );

        document.removeEventListener(
          'pointerdown',
          handlePointerDown,
        );
      };
    },
    [
      directoryOpen,
      mobileMenuOpen,
    ],
  );


  useEffect(
    () => {
      if (
        typeof window ===
          'undefined' ||
        !window.location.hash
      ) {
        return undefined;
      }

      const hash =
        window.location.hash;

      const directTarget =
        document.querySelector(
          hash,
        );

      if (directTarget) {
        return undefined;
      }

      const target =
        getNavigationTarget(
          hash,
        );

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
    },
    [],
  );


  function handleNavigation(
    event,
    hash,
  ) {
    closeMenus();

    if (
      typeof window ===
        'undefined'
    ) {
      return;
    }

    const target =
      getNavigationTarget(
        hash,
      );

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

    const currentPath =
      normalizePathname(
        window.location.pathname,
      );

    if (
      currentPath !== '/'
    ) {
      event.preventDefault();

      window.location.assign(
        `/${hash}`,
      );
    }
  }


  const blogActive =
    currentPathname ===
      '/blog' ||
    currentPathname.startsWith(
      '/blog/',
    );


  const directoryActive =
    isDirectoryActive(
      currentPathname,
    );


  return {
    mobileMenuOpen,
    directoryOpen,
    currentPathname,

    headerRef,
    mobileButtonRef,
    mobileNavRef,
    directoryButtonRef,

    blogActive,
    directoryActive,

    closeMenus,
    closeDirectory,
    toggleMobileMenu,
    toggleDirectory,
    handleNavigation,
  };
}
