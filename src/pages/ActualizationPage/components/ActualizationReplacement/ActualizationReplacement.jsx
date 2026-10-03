import Container from "../../../../components/ui/Container/Container";

export default function ActualizationReplacement() {
  return (
    <>
      <section className="actualization-replacement">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">Старый паспорт</p>

            <h2>Нужно ли менять паспорт полностью</h2>

            <p>
              Не всегда. Способ оформления зависит от нормативного основания и
              характера изменений на объекте.
            </p>
          </div>

          <div className="actualization-replacement__options">
            <article>
              <span>Вариант 01</span>

              <h3>Внести изменения</h3>

              <p>
                Если применимые требования позволяют актуализировать сведения в
                существующем документе.
              </p>
            </article>

            <article>
              <span>Вариант 02</span>

              <h3>Подготовить новую редакцию</h3>

              <p>
                Если характер изменений или установленный порядок требуют
                переработки паспорта.
              </p>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
