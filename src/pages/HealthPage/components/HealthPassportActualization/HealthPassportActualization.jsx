import Container from "../../../../components/ui/Container/Container";

export default function HealthPassportActualization() {
  return (
    <>
      <section className="health-actualization">
        <Container>
          <div className="health-actualization__heading">
            <div>
              <p className="health-kicker">Актуализация</p>

              <h2>Как часто актуализируется паспорт объекта здравоохранения</h2>
            </div>

            <p>
              Постановление Правительства РФ №8 устанавливает периодическую
              актуализацию, а также случаи, когда документ необходимо
              актуализировать из-за изменений на объекте.
            </p>
          </div>

          <div className="health-actualization__layout">
            <aside className="health-actualization__period">
              <span>Не реже</span>

              <strong>одного раза</strong>

              <p>в 5 лет</p>

              <small>
                Это правило об актуализации, а не формулировка «паспорт
                автоматически сгорает через пять лет».
              </small>
            </aside>

            <div className="health-actualization__reasons">
              <p className="health-actualization__label">Также при изменении</p>

              <article>
                <span>01</span>

                <div>
                  <strong>Площадь и периметр</strong>

                  <p>
                    Изменение общей площади и периметра объекта или территории.
                  </p>
                </div>
              </article>

              <article>
                <span>02</span>

                <div>
                  <strong>Опасные участки и критические элементы</strong>

                  <p>
                    Изменение количества потенциально опасных и критических
                    элементов.
                  </p>
                </div>
              </article>

              <article>
                <span>03</span>

                <div>
                  <strong>Силы и средства</strong>

                  <p>
                    Изменение сил и средств, привлекаемых для обеспечения
                    антитеррористической защищённости.
                  </p>
                </div>
              </article>

              <article>
                <span>04</span>

                <div>
                  <strong>Инженерно-техническая защита</strong>

                  <p>Изменение мер по инженерно-технической защите объекта.</p>
                </div>
              </article>
            </div>
          </div>

          <a
            className="health-actualization__link"
            href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
          >
            Подробнее об актуализации паспорта безопасности
            <span aria-hidden="true">→</span>
          </a>
        </Container>
      </section>
    </>
  );
}
