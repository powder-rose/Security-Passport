import Container from '../../../../components/ui/Container/Container';

export default function CrowdPassportProcess() {
  return (
    <>
      <section className="crowd-process" id="process">
        <Container>
          <div className="crowd-process__heading">
            <div>
              <p className="crowd-kicker">Порядок разработки</p>

              <h2>От обследования до паспорта безопасности</h2>
            </div>

            <p>
              После обследования объекта проводится категорирование, оформляется акт и
              разрабатывается паспорт безопасности.
            </p>
          </div>

          <div className="crowd-process__list">
            <article>
              <span>01</span>

              <div>
                <h3>Формирование комиссии</h3>

                <p>
                  Комиссия проводит обследование места массового пребывания людей и рассматривает
                  необходимые материалы по объекту.
                </p>
              </div>
            </article>

            <article>
              <span>02</span>

              <div>
                <h3>Обследование и категорирование</h3>

                <p>
                  По результатам обследования определяется категория объекта и оформляются
                  необходимые документы.
                </p>

                <strong>Срок — до 30 дней</strong>
              </div>
            </article>

            <article>
              <span>03</span>

              <div>
                <h3>Оформление акта обследования</h3>

                <p>
                  Результаты работы комиссии оформляются в виде акта обследования и категорирования.
                </p>

                <strong>Срок — до 10 дней</strong>
              </div>
            </article>

            <article>
              <span>04</span>

              <div>
                <h3>Разработка паспорта безопасности</h3>

                <p>
                  После завершения процедуры подготавливается паспорт безопасности объекта в
                  установленной форме.
                </p>

                <strong>До 6 экземпляров</strong>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
