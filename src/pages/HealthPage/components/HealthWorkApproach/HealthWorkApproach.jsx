import Container from "../../../../components/ui/Container/Container";

export default function HealthWorkApproach() {
  return (
    <>
      <section className="health-why" id="expert">
        <Container>
          <div className="health-why__layout">
            <div className="health-why__heading">
              <p className="health-kicker">Подход к работе</p>

              <h2>Почему БОЙКОВГРУПП</h2>

              <p>
                Начинаем не с заполнения шаблона, а с проверки нормативного
                режима, фактического состояния объекта и уже имеющихся
                документов.
              </p>
            </div>

            <div className="health-why__list">
              <article>
                <span>01</span>

                <div>
                  <h3>
                    Проверяем применимость Постановление Правительства РФ №8
                  </h3>

                  <p>
                    До подготовки документов определяем статус, назначение и
                    фактические характеристики конкретного объекта.
                  </p>
                </div>
              </article>

              <article>
                <span>02</span>

                <div>
                  <h3>Работаем с актуальной редакцией требований</h3>

                  <p>
                    Перед подготовкой документов проверяем действующую
                    нормативную редакцию, применимую к объекту.
                  </p>
                </div>
              </article>

              <article>
                <span>03</span>

                <div>
                  <h3>Разделяем этапы работы</h3>

                  <p>
                    Категорирование, акт, паспорт и сопровождение согласования
                    рассматриваем как отдельные этапы одного процесса.
                  </p>
                </div>
              </article>

              <article>
                <span>04</span>

                <div>
                  <h3>Учитываем уже имеющиеся документы</h3>

                  <p>
                    Если действующий акт обследования и категорирования уже
                    имеется, разработку паспорта можно рассматривать отдельно.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
