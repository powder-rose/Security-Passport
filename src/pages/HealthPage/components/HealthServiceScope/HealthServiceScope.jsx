import Container from "../../../../components/ui/Container/Container";

export default function HealthServiceScope() {
  return (
    <>
      <section className="health-service">
        <Container>
          <div className="health-service__heading">
            <p className="health-kicker">Состав работы</p>

            <h2>Что входит в услугу</h2>

            <p>
              Состав работы соответствует этапам подготовки документов для
              объекта здравоохранения: от категорирования до сопровождения
              предусмотренного согласования.
            </p>
          </div>

          <div className="health-service__rows">
            <article className="health-service__row">
              <span>01</span>

              <h3>Документация для категорирования</h3>

              <p>
                Подготовка документации для работы комиссии по обследованию и
                категорированию.
              </p>
            </article>

            <article className="health-service__row">
              <span>02</span>

              <h3>Акт обследования и категорирования</h3>

              <p>Подготовка акта по результатам работы комиссии.</p>
            </article>

            <article className="health-service__row">
              <span>03</span>

              <h3>Паспорт безопасности</h3>

              <p>
                Разработка паспорта безопасности объекта в соответствии с актом
                категорирования.
              </p>
            </article>

            <article className="health-service__row">
              <span>04</span>

              <h3>Сопровождение согласования</h3>

              <p>
                Сопровождение предусмотренного Постановление Правительства РФ №8
                согласования подготовленного паспорта.
              </p>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
