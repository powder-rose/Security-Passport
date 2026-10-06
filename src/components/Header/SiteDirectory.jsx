import DirectoryContent from './DirectoryContent';

export default function SiteDirectory({ open, currentPathname, onClose, onNavigate }) {
  return (
    <div
      id="site-directory"
      className={`site-directory${open ? ' site-directory--open' : ''}`}
      aria-hidden={!open}
    >
      <div className="site-directory__panel">
        <div className="site-directory__top">
          <div>
            <span>Навигация по сайту</span>

            <strong>Все направления</strong>
          </div>

          <button
            className="site-directory__close"
            type="button"
            aria-label="Закрыть меню"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <DirectoryContent currentPathname={currentPathname} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
