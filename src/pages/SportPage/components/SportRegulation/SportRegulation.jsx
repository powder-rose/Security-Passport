import Container from "../../../../components/ui/Container/Container";

export default function SportRegulation() {
  return (
    <>
      <section className="sport-regulation" id="about-passport">
        <Container>
          <div className="sport-regulation__layout">
            <div className="sport-regulation__identity">
              <p className="sport-kicker">Нормативное основание</p>

              <span>ПП РФ</span>

              <strong>№202</strong>
            </div>

            <div className="sport-regulation__content">
              <h2>Постановление Правительства РФ №202</h2>

              <p className="sport-regulation__lead">
                Постановление Правительства Российской Федерации от 06.03.2015
                №202 «Об утверждении требований к антитеррористической
                защищённости объектов спорта и формы паспорта безопасности
                объектов спорта».
              </p>

              <div className="sport-regulation__points">
                <article>
                  <span>01</span>

                  <h3>Категорирование</h3>

                  <p>
                    Для объектов спорта предусмотрено категорирование с
                    определением категории опасности.
                  </p>
                </article>

                <article>
                  <span>02</span>

                  <h3>Паспорт безопасности</h3>

                  <p>
                    Постановление устанавливает специальную форму паспорта
                    безопасности объекта спорта.
                  </p>
                </article>

                <article>
                  <span>03</span>

                  <h3>Актуальная редакция</h3>

                  <p>
                    Перед началом работ проверяем действующую редакцию
                    требований применительно к конкретному объекту.
                  </p>
                </article>
              </div>

              <aside className="sport-regulation__notice">
                <span aria-hidden="true">!</span>

                <p>
                  На странице не подменяем специальный порядок для объектов
                  спорта общими требованиями к другим типам объектов.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
