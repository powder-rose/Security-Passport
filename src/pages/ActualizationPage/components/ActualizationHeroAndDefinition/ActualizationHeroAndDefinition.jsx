import Container from "../../../../components/ui/Container/Container";

export default function ActualizationHeroAndDefinition() {
  return (
    <>
      <section className="actualization-hero">
        <Container>
          <nav
            className="actualization-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">Главная</a>

            <span aria-hidden="true">/</span>

            <span>Актуализация паспорта</span>
          </nav>

          <div className="actualization-hero__grid">
            <div className="actualization-hero__copy">
              <p className="actualization-kicker">
                Проверка действующего документа
              </p>

              <h1>Актуализация паспорта безопасности объекта</h1>

              <p className="actualization-hero__lead">
                Проверим действующий паспорт безопасности, определим основания и
                порядок его актуализации по требованиям, применимым к вашему
                объекту. Подготовим изменения либо новую редакцию документа.{" "}
                <span className="coverage-emphasis">
                  Работаем по всей России
                </span>
                .
              </p>

              <ul className="actualization-hero__benefits">
                <li>Определим, действительно ли требуется актуализация</li>

                <li>Проверим необходимость повторного категорирования</li>

                <li>Учтём требования именно для вашего типа объекта</li>
              </ul>

              <div className="actualization-hero__actions">
                <a className="button button--primary" href="#lead-form">
                  Проверить паспорт
                </a>

                <a className="actualization-hero__secondary" href="#lead-form">
                  Заказать актуализацию
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <aside className="actualization-hero__note">
              <span>Важно</span>

              <h2>Актуализация — не просто замена даты</h2>

              <p>
                Сначала определяем нормативный режим объекта, проверяем
                действующий паспорт и выясняем, какой порядок внесения изменений
                применяется именно в вашем случае.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      <section className="actualization-definition">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">Что это значит</p>

            <h2>Что такое актуализация паспорта безопасности</h2>

            <p>
              Актуализация — это приведение действующего паспорта безопасности в
              соответствие с текущими характеристиками объекта и применимыми
              требованиями.
            </p>
          </div>

          <div className="actualization-definition__paths">
            <article>
              <span>01</span>

              <h3>Внесение изменений</h3>

              <p>
                В предусмотренных случаях необходимые сведения могут быть
                изменены в существующем документе.
              </p>
            </article>

            <div className="actualization-definition__or" aria-hidden="true">
              или
            </div>

            <article>
              <span>02</span>

              <h3>Новая редакция паспорта</h3>

              <p>
                Если применимый порядок этого требует, может потребоваться
                переработка документа или подготовка новой редакции.
              </p>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
