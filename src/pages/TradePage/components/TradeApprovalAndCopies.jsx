import Container from "../../../components/ui/Container/Container";

export default function TradeApprovalAndCopies() {
  return (
    <>
      <section className="trade-approval">
        <Container>
          <div className="trade-approval__heading">
            <div>
              <p className="trade-kicker">Порядок после разработки</p>

              <h2>Сроки согласования паспорта торгового объекта</h2>
            </div>

            <p>
              После изменений марта 2026 года в ПП РФ №1273 закреплены
              конкретные сроки согласования, доработки и последующего
              утверждения паспорта.
            </p>
          </div>

          <div className="trade-approval__timeline">
            <article>
              <span className="trade-approval__number">01</span>

              <div>
                <small>Согласование</small>

                <strong>до 10 рабочих дней</strong>

                <p>
                  Срок исчисляется с момента поступления паспорта
                  соответствующим органам.
                </p>
              </div>
            </article>

            <article>
              <span className="trade-approval__number">02</span>

              <div>
                <small>Если есть замечания</small>

                <strong>5 рабочих дней</strong>

                <p>Паспорт направляется председателю комиссии на доработку.</p>
              </div>
            </article>

            <article>
              <span className="trade-approval__number">03</span>

              <div>
                <small>После согласования</small>

                <strong>до 5 рабочих дней</strong>

                <p>
                  После согласования всеми предусмотренными должностными лицами
                  паспорт утверждается не позднее этого срока.
                </p>
              </div>
            </article>
          </div>

          <div className="trade-approval__summary">
            <span>2026</span>

            <p>
              Конкретные сроки согласования, доработки и утверждения закреплены
              в действующей редакции после изменений марта 2026 года.
            </p>
          </div>
        </Container>
      </section>

      <section className="trade-copies">
        <Container>
          <div className="trade-copies__layout">
            <div className="trade-copies__heading">
              <p className="trade-kicker">Действующая редакция</p>

              <h2>Сколько экземпляров паспорта оформляется</h2>

              <p>
                С 13 марта 2026 года паспорт безопасности торгового объекта
                составляется в двух экземплярах.
              </p>
            </div>

            <div className="trade-copies__visual">
              <article>
                <span>01</span>

                <strong>Уполномоченный орган субъекта РФ</strong>

                <p>
                  Один экземпляр передаётся в уполномоченный орган субъекта
                  Российской Федерации.
                </p>
              </article>

              <article>
                <span>02</span>

                <strong>Торговый объект</strong>

                <p>
                  Второй экземпляр хранится непосредственно на торговом объекте.
                </p>
              </article>
            </div>
          </div>

          <div className="trade-copies__note">
            <span aria-hidden="true">+</span>

            <p>
              Заверенные бумажные или электронные копии направляются
              предусмотренным территориальным органам.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
