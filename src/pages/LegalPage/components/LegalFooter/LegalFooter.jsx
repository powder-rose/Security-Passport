import Container from '../../../../components/ui/Container/Container';

import { SITE } from '../../../../config/site';

import { legalDocuments } from '../../../../content/legalDocuments';

const CURRENT_YEAR = new Date().getFullYear();

export default function LegalFooter() {
  const allDocuments = Object.values(legalDocuments);

  return (
    <footer className="legal-footer">
      <Container>
        <div className="legal-footer__top">
          <div>
            <strong>{SITE.brand}</strong>

            <span>{SITE.legalName}</span>
          </div>

          <div className="legal-footer__contacts">
            <a href={SITE.phoneHref}>{SITE.phone}</a>

            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>

        <nav className="legal-footer__links" aria-label="Юридическая информация">
          {allDocuments.map(item => (
            <a
              key={item.slug}
              href={`${SITE.federalUrl}/${item.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.title}
            </a>
          ))}
        </nav>

        <div className="legal-footer__bottom">
          © {CURRENT_YEAR} {SITE.brand}
        </div>
      </Container>
    </footer>
  );
}
