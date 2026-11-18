import { useEffect, useState } from 'react';
import { objectTypes } from '../../data/objectTypes.js';
import Container from '../ui/Container/Container';

import HeaderActions from './HeaderActions';

import HeaderBrand from './HeaderBrand';

import SiteDirectory from './SiteDirectory';

import SiteNavigation from './SiteNavigation';

import useHeaderNavigation from './useHeaderNavigation';

import './Header.css';

export default function Header({ pathname = '/', initialItems = null }) {
  const [directoryItems, setDirectoryItems] = useState(initialItems || objectTypes);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/directions/menu', { signal: controller.signal })
      .then(async response => (response.ok ? response.json() : null))
      .then(data => {
        if (data?.ok && Array.isArray(data.menuItems)) setDirectoryItems(data.menuItems);
      })
      .catch(() => {
        /* Preserve the prerendered navigation when the API is unavailable. */
      });
    return () => controller.abort();
  }, []);
  const {
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
  } = useHeaderNavigation({
    pathname,
  });

  return (
    <header id="top" ref={headerRef} className="site-header">
      <Container className="site-header__inner">
        <HeaderBrand onNavigate={closeMenus} />

        <button
          ref={mobileButtonRef}
          className="site-header__menu-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="site-navigation"
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={toggleMobileMenu}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <SiteNavigation
          directoryItems={directoryItems}
          mobileMenuOpen={mobileMenuOpen}
          mobileNavRef={mobileNavRef}
          currentPathname={currentPathname}
          blogActive={blogActive}
          directoryActive={directoryActive}
          directoryOpen={directoryOpen}
          directoryButtonRef={directoryButtonRef}
          onNavigate={handleNavigation}
          onCloseMenus={closeMenus}
          onToggleDirectory={toggleDirectory}
        />

        <HeaderActions currentPathname={currentPathname} onNavigate={handleNavigation} />

        <SiteDirectory
          directoryItems={directoryItems}
          open={directoryOpen}
          currentPathname={currentPathname}
          onClose={closeDirectory}
          onNavigate={closeMenus}
        />
      </Container>
    </header>
  );
}
