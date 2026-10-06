import { SITE } from '../../config/site';

export default function HeaderBrand({ onNavigate }) {
  return (
    <a className="brand" href="/" aria-label={`${SITE.brand}: на главную`} onClick={onNavigate}>
      {SITE.brand}
    </a>
  );
}
