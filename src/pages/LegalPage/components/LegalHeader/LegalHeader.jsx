import Container from '../../../../components/ui/Container/Container';

import { SITE } from '../../../../config/site';

export default function LegalHeader() {
  return (
    <header className="legal-header">
      <Container className="legal-header__inner">
        <a
          className="legal-header__brand"
          href={SITE.federalUrl}
          aria-label={`${SITE.brand}: перейти на главную`}
        >
          <span className="legal-header__mark" aria-hidden="true">
            Б
          </span>

          <span>{SITE.brand}</span>
        </a>

        <a className="legal-header__back" href={SITE.federalUrl}>
          Вернуться на сайт
          <span aria-hidden="true">↗</span>
        </a>
      </Container>
    </header>
  );
}
