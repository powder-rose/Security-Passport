import Container from "../../../../components/ui/Container/Container";

export default function SportApproval() {
  return (
    <>
      <section className="sport-approval">
        <Container>
          <div className="sport-approval__layout">
            <div className="sport-approval__intro">
              <p className="sport-kicker">Согласование</p>

              <h2>С кем согласовывается паспорт объекта спорта</h2>

              <p>
                По действующей редакции ПП РФ №202 паспорт проходит
                предусмотренное согласование, после чего утверждается
                ответственным лицом.
              </p>
            </div>

            <div className="sport-approval__route">
              <article className="sport-approval__authority">
                <span className="sport-approval__authority-number">01</span>

                <div>
                  <h3>Территориальный орган безопасности</h3>

                  <p>
                    Паспорт согласовывается с руководителем территориального
                    органа безопасности либо уполномоченным им лицом.
                  </p>
                </div>
              </article>

              <div className="sport-approval__connector" aria-hidden="true">
                <span />
              </div>

              <article className="sport-approval__authority">
                <span className="sport-approval__authority-number">02</span>

                <div>
                  <h3>Росгвардия</h3>

                  <p>
                    Паспорт согласовывается с руководителем территориального
                    органа Росгвардии либо подразделения вневедомственной охраны
                    Росгвардии по месту нахождения объекта.
                  </p>
                </div>
              </article>

              <div className="sport-approval__connector" aria-hidden="true">
                <span />
              </div>

              <article className="sport-approval__authority sport-approval__authority--final">
                <span className="sport-approval__authority-number">03</span>

                <div>
                  <h3>Утверждение</h3>

                  <p>
                    После предусмотренного согласования паспорт утверждается
                    ответственным лицом.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="sport-approval__deadline">
            <div className="sport-approval__deadline-main">
              <span>Срок согласования</span>

              <strong>до 30 дней</strong>
            </div>

            <p>
              Не более 30 дней со дня представления паспорта в соответствующие
              органы.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
