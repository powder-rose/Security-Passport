import { Helmet } from 'react-helmet-async';

import Container from '../../components/ui/Container/Container';
import { SITE } from '../../config/site';
import { legalDocuments } from '../../content/legalDocuments';



function RichText({
  text,
}) {
  const parts =
    String(text).split(
      /(https:\/\/[^\s]+|mail@pasport-bezopasnosty\.ru)/g,
    );

  return parts.map(
    (part, index) => {
      if (
        part.startsWith('https://')
      ) {
        const cleanUrl =
          part.replace(
            /[.,;]+$/,
            '',
          );

        const suffix =
          part.slice(
            cleanUrl.length,
          );

        return (
          <span key={`${part}-${index}`}>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cleanUrl}
            </a>
            {suffix}
          </span>
        );
      }

      if (
        part ===
        'mail@pasport-bezopasnosty.ru'
      ) {
        return (
          <a
            key={`${part}-${index}`}
            href={`mailto:${part}`}
          >
            {part}
          </a>
        );
      }

      return part;
    },
  );
}


function LegalLine({
  line,
  index,
  document,
}) {
  const isSectionHeading =
    document.sectioned === true &&
    /^\d+\.\s+\S/.test(line) &&
    !/^\d+\.\d+\./.test(line);

  if (isSectionHeading) {
    return (
      <h2>
        <RichText text={line} />
      </h2>
    );
  }

  const separator =
    line.indexOf(';');

  const isDefinition =
    !/^\d/.test(line) &&
    separator > 0 &&
    separator < 70;

  if (isDefinition) {
    const label =
      line.slice(
        0,
        separator,
      ).trim();

    const value =
      line.slice(
        separator + 1,
      ).trim();

    return (
      <div className="legal-document__detail">
        <span>{label}</span>
        <strong>
          <RichText text={value} />
        </strong>
      </div>
    );
  }

  if (
    line.startsWith('—')
  ) {
    return (
      <p className="legal-document__bullet">
        <RichText text={line} />
      </p>
    );
  }

  return (
    <p
      className={
        index === 0
          ? 'legal-document__lead'
          : undefined
      }
    >
      <RichText text={line} />
    </p>
  );
}


export default function LegalPage({
  document,
}) {
  const canonical =
    `${SITE.federalUrl}/${document.slug}/`;

  const image =
    `${SITE.federalUrl}/images/og-passport-security.png`;

  const allDocuments =
    Object.values(
      legalDocuments,
    );

  return (
    <>
      <Helmet>
        <title>
          {document.title} — {SITE.brand}
        </title>

        <meta
          name="description"
          content={document.description}
        />

        <meta
          name="robots"
          content="noindex,follow,max-image-preview:large,max-snippet:-1"
        />

        <link
          rel="canonical"
          href={canonical}
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:locale"
          content="ru_RU"
        />

        <meta
          property="og:site_name"
          content={SITE.brand}
        />

        <meta
          property="og:title"
          content={`${document.title} — ${SITE.brand}`}
        />

        <meta
          property="og:description"
          content={document.description}
        />

        <meta
          property="og:url"
          content={canonical}
        />

        <meta
          property="og:image"
          content={image}
        />

        <meta
          property="og:image:type"
          content="image/png"
        />

        <meta
          property="og:image:width"
          content="1200"
        />

        <meta
          property="og:image:height"
          content="630"
        />
      </Helmet>

      <div className="legal-page">
        <header className="legal-header">
          <Container className="legal-header__inner">
            <a
              className="legal-header__brand"
              href={SITE.federalUrl}
              aria-label={`${SITE.brand}: перейти на главную`}
            >
              <span
                className="legal-header__mark"
                aria-hidden="true"
              >
                Б
              </span>

              <span>
                {SITE.brand}
              </span>
            </a>

            <a
              className="legal-header__back"
              href={SITE.federalUrl}
            >
              Вернуться на сайт
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </Container>
        </header>

        <main className="legal-main">
          <Container>
            <div className="legal-hero">
              <p className="legal-hero__eyebrow">
                Юридическая информация
              </p>

              <h1>
                {document.title}
              </h1>

              <p className="legal-hero__intro">
                {SITE.legalName}
                {' · '}
                ИНН {SITE.taxId}
              </p>
            </div>

            <article className="legal-document">
              {document.lines.map(
                (line, index) => (
                  <LegalLine
                    key={`${index}-${line.slice(0, 40)}`}
                    line={line}
                    index={index}
                    document={document}
                  />
                ),
              )}
            </article>

            <div className="legal-page__after">
              <span>
                {SITE.legalName}
              </span>

              <a
                href={SITE.federalUrl}
              >
                На главную
                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </Container>
        </main>

        <footer className="legal-footer">
          <Container>
            <div className="legal-footer__top">
              <div>
                <strong>
                  {SITE.brand}
                </strong>

                <span>
                  {SITE.legalName}
                </span>
              </div>

              <div className="legal-footer__contacts">
                <a href={SITE.phoneHref}>
                  {SITE.phone}
                </a>

                <a href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </div>
            </div>

            <nav
              className="legal-footer__links"
              aria-label="Юридическая информация"
            >
              {allDocuments.map(
                (item) => (
                  <a
                    key={item.slug}
                    href={`${SITE.federalUrl}/${item.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                ),
              )}
            </nav>

            <div className="legal-footer__bottom">
              © {new Date().getFullYear()}
              {' '}
              {SITE.brand}
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}
