import Container from "../../../../components/ui/Container/Container";

import { getObjectTypeLegalContent } from "../../../../data/objectTypeLegalContent";

export default function ObjectTypeLegalGuide({ objectTypeId }) {
  const content = getObjectTypeLegalContent(objectTypeId);
  if (!content) {
    return null;
  }

  return (
    <section className="object-legal" aria-labelledby="object-legal-title">
      <Container>
        <div className="object-legal__head">
          <p className="object-legal__kicker">Нормативная база и практика</p>

          <h2 id="object-legal-title">{content.heading}</h2>

          <p className="object-legal__intro">{content.intro}</p>
        </div>

        <div className="object-legal__sources">
          {content.sources.map((source) => (
            <div className="object-legal__source" key={source.title}>
              <span className="object-legal__source-label">
                Нормативная основа
              </span>

              <strong>{source.title}</strong>

              {source.subtitle ? (
                <span className="object-legal__source-description">
                  {source.subtitle}
                </span>
              ) : null}

              <small>{source.edition}</small>
            </div>
          ))}
        </div>

        <div className="object-legal__details">
          {content.details.map((item) => (
            <article className="object-legal__detail" key={item.title}>
              <h3>{item.title}</h3>

              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <aside className="object-legal__important">
          <div className="object-legal__important-mark">Важно</div>

          <div>
            <h3>{content.importantTitle}</h3>

            <p>{content.importantText}</p>
          </div>
        </aside>

        <div className="object-legal__checklist">
          <div className="object-legal__checklist-head">
            <p className="object-legal__kicker">Подготовка исходных данных</p>

            <h2>{content.checklistTitle}</h2>

            <p>
              Не нужно собирать всё подряд. На старте достаточно основных
              сведений, чтобы определить применимые требования и дальнейший
              порядок работы.
            </p>

            <div className="object-legal__checklist-note">
              <span aria-hidden="true">✓</span>

              <p>
                Точный перечень уточняем после идентификации конкретного
                объекта.
              </p>
            </div>
          </div>

          <ol className="object-legal__checklist-list">
            {content.checklist.map((item, index) => (
              <li key={item}>
                <span className="object-legal__checklist-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="object-legal__public-note">
          На этой странице приведена открытая нормативная и организационная
          информация. Сведения ограниченного распространения, содержащиеся в
          конкретном паспорте безопасности объекта, публично не размещаются.
        </p>
      </Container>
    </section>
  );
}
