import Container from "../../../../components/ui/Container/Container";

export default function SportCategorizationAct() {
  return (
    <>
      <section className="sport-act" id="sport-categorization-act">
        <Container>
          <div className="sport-act__layout">
            <div className="sport-act__index">
              <span>Следующий документ</span>

              <strong>АКТ</strong>
            </div>

            <div className="sport-act__content">
              <p className="sport-kicker">Результат работы комиссии</p>

              <h2>Акт обследования и категорирования объекта спорта</h2>

              <p className="sport-act__lead">
                Результаты работы комиссии оформляются актом обследования и
                категорирования объекта спорта.
              </p>

              <div className="sport-act__facts">
                <article>
                  <span>01</span>

                  <div>
                    <strong>Один экземпляр</strong>

                    <p>
                      По действующей редакции ПП РФ №202 акт составляется в
                      одном экземпляре.
                    </p>
                  </div>
                </article>

                <article>
                  <span>02</span>

                  <div>
                    <strong>Подписи комиссии</strong>

                    <p>Акт подписывается всеми членами комиссии.</p>
                  </div>
                </article>

                <article>
                  <span>03</span>

                  <div>
                    <strong>Хранение с паспортом</strong>

                    <p>
                      Акт хранится вместе с паспортом безопасности объекта
                      спорта.
                    </p>
                  </div>
                </article>
              </div>

              <div className="sport-act__action">
                <a
                  href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
                  className="sport-act__link"
                >
                  <span>
                    Подробнее об акте обследования и категорирования объекта
                  </span>

                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
