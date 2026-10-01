import DirectoryContent
from './DirectoryContent';

import MobileMenuPortal
from './MobileMenuPortal';

import {
  quickNavLinks,
} from './headerNavigation';


export default function SiteNavigation({
  mobileMenuOpen,
  mobileNavRef,
  currentPathname,
  blogActive,
  directoryActive,
  directoryOpen,
  directoryButtonRef,
  onNavigate,
  onCloseMenus,
  onToggleDirectory,
}) {
  return (
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
                    onNavigate(
                      event,
                      href,
                    )
                }
              >
                {label}
              </a>
            ),
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
          onClick={
            onCloseMenus
          }
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
          onClick={
            onToggleDirectory
          }
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
              onCloseMenus
            }
            mobile
          />

        </div>


        <a
          className="site-nav__mobile-cta"
          href="/#contact"
          onClick={
            onCloseMenus
          }
        >
          Обсудить объект
        </a>

      </nav>
    </MobileMenuPortal>
  );
}
