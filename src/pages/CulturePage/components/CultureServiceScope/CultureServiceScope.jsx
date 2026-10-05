import Container from "../../../../components/ui/Container/Container";

import { cultureServiceItems } from "../../culturePageData";

export default function CultureServiceScope() {
  return (
    <>
      <section className="culture-service" id="culture-service">
        <Container>
          <div className="culture-service__header">
            <div>
              <p className="culture-kicker">Состав работ</p>

              <h2>Что входит в услугу</h2>
            </div>

            <div className="culture-service__intro">
              <p>
                Состав работ зависит от того, категорирован ли объект, есть ли
                действующий акт и требуется ли только разработка паспорта или
                прохождение предыдущих этапов.
              </p>

              <strong>
                Точный состав определяем после первичной проверки объекта и
                имеющихся документов.
              </strong>
            </div>
          </div>

          <div className="culture-service__grid">
            {cultureServiceItems.map((item) => (
              <article className="culture-service__item" key={item.number}>
                <div className="culture-service__item-head">
                  <span>{item.number}</span>

                  <span className="culture-service__check" aria-hidden="true">
                    ✓
                  </span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <p className="culture-service__note">
            Перечень выше описывает возможный состав работы по объекту и не
            означает, что все этапы автоматически входят в базовую стоимость
            разработки паспорта.
          </p>
        </Container>
      </section>
    </>
  );
}
