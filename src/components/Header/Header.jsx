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

  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <a className="brand" href="#top" aria-label={`${SITE.brand}: к началу страницы`} onClick={closeMenu}>
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
            <a key={href} href={href} onClick={closeMenu}>{label}</a>
          ))}
          <a className="site-nav__mobile-cta" href="#contact" onClick={closeMenu}>
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

          <a className="header-contact" href="#contact">
            Обсудить объект
          </a>
        </div>
      </Container>
    </header>
  );
}
