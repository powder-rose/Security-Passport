import Container from "../../../../components/ui/Container/Container";

import { SITE } from "../../../../config/site";

function RichText({ text }) {
  const parts = String(text).split(
    /(https:\/\/[^\s]+|mail@pasport-bezopasnosty\.ru)/g,
  );

  return parts.map((part, index) => {
    if (part.startsWith("https://")) {
      const cleanUrl = part.replace(/[.,;]+$/, "");

      const suffix = part.slice(cleanUrl.length);

      return (
        <span key={`${part}-${index}`}>
          <a href={cleanUrl} target="_blank" rel="noopener noreferrer">
            {cleanUrl}
          </a>
          {suffix}
        </span>
      );
    }

    if (part === "mail@pasport-bezopasnosty.ru") {
      return (
        <a key={`${part}-${index}`} href={`mailto:${part}`}>
          {part}
        </a>
      );
    }

    return part;
  });
}

function LegalLine({ line, index, document }) {
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

  const separator = line.indexOf(";");

  const isDefinition = !/^\d/.test(line) && separator > 0 && separator < 70;

  if (isDefinition) {
    const label = line.slice(0, separator).trim();

    const value = line.slice(separator + 1).trim();

    return (
      <div className="legal-document__detail">
        <span>{label}</span>
        <strong>
          <RichText text={value} />
        </strong>
      </div>
    );
  }

  if (line.startsWith("—")) {
    return (
      <p className="legal-document__bullet">
        <RichText text={line} />
      </p>
    );
  }

  return (
    <p className={index === 0 ? "legal-document__lead" : undefined}>
      <RichText text={line} />
    </p>
  );
}

export default function LegalContent({ document }) {
  return (
    <main id="main-content" className="legal-main">
      <Container>
        <div className="legal-hero">
          <p className="legal-hero__eyebrow">Юридическая информация</p>

          <h1>{document.title}</h1>

          <p className="legal-hero__intro">
            {SITE.legalName}
            {" · "}
            ИНН {SITE.taxId}
          </p>
        </div>

        <article className="legal-document">
          {document.lines.map((line, index) => (
            <LegalLine
              key={`${index}-${line.slice(0, 40)}`}
              line={line}
              index={index}
              document={document}
            />
          ))}
        </article>

        <div className="legal-page__after">
          <span>{SITE.legalName}</span>

          <a href={SITE.federalUrl}>
            На главную
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Container>
    </main>
  );
}
