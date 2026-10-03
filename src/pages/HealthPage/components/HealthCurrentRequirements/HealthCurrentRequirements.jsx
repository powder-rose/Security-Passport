import Container from "../../../../components/ui/Container/Container";

export default function HealthCurrentRequirements() {
  return (
    <>
      <section className="health-current">
        <Container>
          <div className="health-current__layout">
            <div className="health-current__year">
              <span>Требования</span>

              <strong>2026</strong>
            </div>

            <div className="health-current__content">
              <p className="health-kicker">Актуальная нормативная база</p>

              <h2>Требования к объектам здравоохранения в 2026 году</h2>

              <p className="health-current__lead">
                На сентябрь 2026 года Постановление Правительства РФ №8
                действует в редакции от 15.08.2025. Перед разработкой документов
                проверяем актуальную редакцию нормативных требований и
                фактические характеристики объекта.
              </p>

              <div className="health-current__sources">
                <article>
                  <span>Специальные требования</span>

                  <strong>Постановление Правительства РФ №8</strong>

                  <p>
                    Конкретные требования к объектам здравоохранения
                    определяются Постановлением Правительства РФ №8.
                  </p>
                </article>

                <article>
                  <span>Общий стандарт услуг</span>

                  <strong>ГОСТ Р 72551-2026</strong>

                  <p>
                    Стандарт действует с 1 мая 2026 года и устанавливает общие
                    требования к услугам по категорированию и разработке
                    паспортов безопасности.
                  </p>
                </article>
              </div>

              <aside className="health-current__note">
                <span>Приоритет</span>

                <p>
                  ГОСТ задаёт общие требования к оказанию услуг, а специальные
                  требования для объектов здравоохранения берём из Постановление
                  Правительства РФ №8.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
