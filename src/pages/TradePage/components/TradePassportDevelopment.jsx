import Container from "../../../components/ui/Container/Container";

export default function TradePassportDevelopment() {
  return (
    <>
      <section className="trade-passport">
        <Container>
          <div className="trade-passport__heading">
            <div>
              <p className="trade-kicker">После категорирования</p>

              <h2>
                Как разрабатывается паспорт безопасности торгового объекта
              </h2>
            </div>

            <p>
              После подписания акта обследования и категорирования начинается
              подготовка паспорта безопасности по действующей форме ПП РФ №1273.
            </p>
          </div>

          <div className="trade-passport__facts">
            <article className="trade-passport__deadline">
              <span>Срок разработки</span>

              <strong>30 дней</strong>

              <p>
                Паспорт безопасности должен быть разработан в течение 30 дней
                после подписания акта обследования и категорирования.
              </p>
            </article>

            <article className="trade-passport__lifetime">
              <span>Срок действия</span>

              <h3>Документ постоянного действия</h3>

              <p>
                Для торгового объекта паспорт определяется как
                информационно-справочный документ постоянного действия,
                отражающий состояние антитеррористической защищённости объекта и
                необходимые мероприятия.
              </p>

              <strong>Это не означает, что документ никогда не меняется</strong>

              <p>
                При наступлении установленных обстоятельств паспорт подлежит
                актуализации.
              </p>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
