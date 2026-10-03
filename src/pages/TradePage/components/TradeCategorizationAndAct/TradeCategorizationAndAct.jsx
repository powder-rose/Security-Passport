import Container from "../../../../components/ui/Container/Container";

export default function TradeCategorizationAndAct() {
  return (
    <>
      <section className="trade-categorization" id="process">
        <Container>
          <div className="trade-categorization__layout">
            <div className="trade-categorization__heading">
              <p className="trade-kicker">Обследование объекта</p>

              <h2>Как проводится категорирование торгового объекта</h2>

              <p>
                После предусмотренного основания создаётся комиссия по
                обследованию и категорированию торгового объекта.
              </p>
            </div>

            <div className="trade-categorization__content">
              <article className="trade-categorization__deadline">
                <span>Срок создания комиссии</span>

                <strong>1 месяц</strong>

                <p>
                  С марта 2026 года срок её создания закреплён, в частности,
                  после получения уведомления о включении торгового объекта в
                  соответствующий перечень.
                </p>
              </article>

              <div className="trade-categorization__expert-note">
                <span aria-hidden="true">+</span>

                <p>
                  К работе комиссии могут привлекаться профильные специалисты и
                  эксперты специализированных организаций.
                </p>
              </div>
            </div>
          </div>

          <ol className="trade-categorization__steps">
            <li>
              <span>01</span>

              <strong>Включение объекта в перечень</strong>
            </li>

            <li>
              <span>02</span>

              <strong>Создание комиссии</strong>
            </li>

            <li>
              <span>03</span>

              <strong>Обследование объекта</strong>
            </li>

            <li>
              <span>04</span>

              <strong>Определение категории</strong>
            </li>

            <li>
              <span>05</span>

              <strong>Акт обследования и категорирования</strong>
            </li>

            <li>
              <span>06</span>

              <strong>Паспорт безопасности</strong>
            </li>
          </ol>
        </Container>
      </section>

      <section className="trade-act">
        <Container>
          <div className="trade-act__layout">
            <div className="trade-act__index">
              <span>Этап</span>

              <strong>05</strong>
            </div>

            <div className="trade-act__content">
              <p className="trade-kicker">Результат категорирования</p>

              <h2>Акт обследования и категорирования торгового объекта</h2>

              <p className="trade-act__lead">
                После обследования и определения категории результаты работы
                комиссии оформляются актом обследования и категорирования. На
                основании этого этапа далее разрабатывается паспорт
                безопасности.
              </p>

              <div className="trade-act__connection">
                <div>
                  <small>Категорирование</small>

                  <strong>комиссия</strong>
                </div>

                <span aria-hidden="true">→</span>

                <div>
                  <small>Результат</small>

                  <strong>акт</strong>
                </div>

                <span aria-hidden="true">→</span>

                <div>
                  <small>Следующий этап</small>

                  <strong>паспорт</strong>
                </div>
              </div>

              <a
                className="trade-inline-link"
                href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
              >
                Подробнее об акте обследования и категорирования
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
