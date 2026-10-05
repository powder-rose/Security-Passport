import Container from "../../../../components/ui/Container/Container";

export default function SportPassportProcess() {
  return (
    <>
      <section className="sport-process" id="process">
        <Container>
          <div className="sport-process__heading">
            <div>
              <p className="sport-kicker">Порядок разработки</p>

              <h2>Как оформить паспорт безопасности объекта спорта</h2>
            </div>

            <p>
              Паспорт разрабатывается после обследования и категорирования
              объекта. Процесс последовательно проходит от проверки применимых
              требований до предусмотренного согласования.
            </p>
          </div>

          <ol
            className="sport-process__steps"
            aria-label="Этапы разработки паспорта безопасности объекта спорта"
          >
            <li className="sport-process__step">
              <span className="sport-process__number">01</span>

              <div>
                <h3>Определяем применимость ПП РФ №202</h3>

                <p>
                  Проверяем фактическое назначение и статус конкретного объекта
                  спорта.
                </p>
              </div>
            </li>

            <li className="sport-process__step">
              <span className="sport-process__number">02</span>

              <div>
                <h3>Собираем исходные сведения</h3>

                <p>
                  Формируем сведения, необходимые для дальнейшего обследования,
                  категорирования и подготовки документов.
                </p>
              </div>
            </li>

            <li className="sport-process__step">
              <span className="sport-process__number">03</span>

              <div>
                <h3>Подготавливается работа комиссии</h3>

                <p>
                  Организуется следующий этап — обследование и категорирование
                  объекта спорта.
                </p>
              </div>
            </li>

            <li className="sport-process__step">
              <span className="sport-process__number">04</span>

              <div>
                <h3>Проводится обследование объекта</h3>

                <p>
                  Комиссия обследует объект для последующего определения
                  категории опасности.
                </p>
              </div>
            </li>

            <li className="sport-process__step">
              <span className="sport-process__number">05</span>

              <div>
                <h3>Определяется категория</h3>

                <p>
                  Решение об отнесении объекта к категории принимает комиссия.
                </p>
              </div>
            </li>

            <li className="sport-process__step">
              <span className="sport-process__number">06</span>

              <div>
                <h3>Оформляется акт обследования и категорирования</h3>

                <p>Результаты работы комиссии закрепляются в акте.</p>
              </div>
            </li>

            <li className="sport-process__step">
              <span className="sport-process__number">07</span>

              <div>
                <h3>Разрабатывается паспорт безопасности</h3>

                <p>
                  Документ оформляется по форме и требованиям, установленным для
                  объектов спорта.
                </p>
              </div>
            </li>

            <li className="sport-process__step">
              <span className="sport-process__number">08</span>

              <div>
                <h3>Проходит предусмотренное согласование</h3>

                <p>
                  Подготовленный паспорт направляется на предусмотренное ПП РФ
                  №202 согласование.
                </p>
              </div>
            </li>
          </ol>

          <aside className="sport-process__deadline">
            <div className="sport-process__deadline-value">
              <strong>3</strong>

              <span>месяца</span>
            </div>

            <div>
              <h3>Срок разработки паспорта</h3>

              <p>
                Паспорт безопасности составляется в течение 3 месяцев после
                проведения обследования и категорирования объекта.
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
