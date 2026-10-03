import Container from "../../../../components/ui/Container/Container";

export default function ActualizationPricing() {
  return (
    <>
      <section className="actualization-price" id="actualization-price">
        <Container>
          <div className="actualization-price__panel">
            <div className="actualization-price__heading">
              <p className="actualization-kicker">Стоимость</p>

              <h2>Стоимость актуализации паспорта безопасности</h2>

              <p className="actualization-price__intro">
                Состав работ определяем после проверки действующего паспорта и
                изменений на объекте.
              </p>
            </div>

            <aside className="actualization-price__card">
              <p className="actualization-price__card-label">
                На расчёт влияют
              </p>

              <div className="actualization-price__factor">
                <span>01</span>

                <div>
                  <strong>Объём необходимых изменений</strong>

                  <p>
                    Проверяем, какие сведения действующего паспорта требуется
                    актуализировать.
                  </p>
                </div>
              </div>

              <div className="actualization-price__factor">
                <span>02</span>

                <div>
                  <strong>Повторное категорирование</strong>

                  <p>
                    Отдельно определяем, требуется ли оно для конкретного
                    объекта.
                  </p>
                </div>
              </div>

              <a className="actualization-price__action" href="#lead-form">
                Уточнить стоимость
                <span aria-hidden="true">↗</span>
              </a>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
