import Container from "../../../../components/ui/Container/Container";

export default function SportPassportActualization() {
  return (
    <>
      <section className="sport-actualization">
        <Container>
          <div className="sport-actualization__heading">
            <div>
              <p className="sport-kicker">Актуализация</p>

              <h2>Когда актуализируется паспорт объекта спорта</h2>
            </div>

            <div className="sport-actualization__deadline">
              <strong>30</strong>

              <span>дней</span>

              <p>после возникновения соответствующих обстоятельств</p>
            </div>
          </div>

          <div className="sport-actualization__reasons">
            <article>
              <span>01</span>

              <p>Изменение нормативных требований</p>
            </article>

            <article>
              <span>02</span>

              <p>Изменение застройки или завершение реконструкции</p>
            </article>

            <article>
              <span>03</span>

              <p>Изменение профиля деятельности объекта</p>
            </article>

            <article>
              <span>04</span>

              <p>Изменение схемы охраны либо технического оснащения</p>
            </article>

            <article>
              <span>05</span>

              <p>
                Смена собственника, наименования или организационно-правовой
                формы
              </p>
            </article>

            <article>
              <span>06</span>

              <p>
                Изменение сведений о должностных лицах и способов связи с ними
              </p>
            </article>
          </div>

          <div className="sport-actualization__footer">
            <p>
              ПП РФ №202 предусматривает актуализацию при наступлении
              соответствующих изменений.
            </p>

            <a
              href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
              className="sport-actualization__link"
            >
              <span>Подробнее об актуализации паспорта безопасности</span>

              <span aria-hidden="true">→</span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
