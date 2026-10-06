import { objectTypes } from '../../data/objectTypes';

import { servicePages } from '../../data/servicePages';

import { isPathActive } from './headerNavigation';

function DirectoryLink({ href, label, currentPathname, onNavigate }) {
  const active = isPathActive(href, currentPathname);

  return (
    <a
      href={href}
      className={`site-directory__link${active ? ' is-current' : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
    >
      <span>{label}</span>

      <span className="site-directory__link-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

export default function DirectoryContent({ currentPathname, onNavigate, mobile = false }) {
  return (
    <div className={`site-directory__grid${mobile ? ' site-directory__grid--mobile' : ''}`}>
      <section className="site-directory__group">
        <div className="site-directory__eyebrow">Услуги</div>

        <div className="site-directory__links">
          <DirectoryLink
            href="/"
            label="Паспорт безопасности объекта"
            currentPathname={currentPathname}
            onNavigate={onNavigate}
          />

          {servicePages.map(page => (
            <DirectoryLink
              key={page.path}
              href={page.path}
              label={page.title}
              currentPathname={currentPathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      <section
        className="
          site-directory__group
          site-directory__group--objects
        "
      >
        <div className="site-directory__eyebrow">По типу объекта</div>

        <div
          className="
            site-directory__links
            site-directory__links--objects
          "
        >
          {objectTypes.map(item => (
            <DirectoryLink
              key={item.path}
              href={item.path}
              label={item.title}
              currentPathname={currentPathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      <section className="site-directory__group">
        <div className="site-directory__eyebrow">Материалы</div>

        <div className="site-directory__links">
          <DirectoryLink
            href="/blog/"
            label="Блог"
            currentPathname={currentPathname}
            onNavigate={onNavigate}
          />
        </div>

        <div className="site-directory__help">
          <span>Не уверены, какой документ нужен?</span>

          <a href="/#contact" onClick={onNavigate}>
            Обсудить объект
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
