import {
  SITE,
} from '../../config/site';


export default function HeaderActions({
  currentPathname,
  onNavigate,
}) {
  return (
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
            onNavigate(
              event,
              '#contact',
            )
        }
      >
        Обсудить объект
      </a>

    </div>
  );
}
