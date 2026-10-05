import Container from "../../../../components/ui/Container/Container";

import { educationPrices } from "../../educationPageData";

export default function EducationPricing() {
  return (
    <>
      <section className="education-price">
        <Container>
          <div className="education-price__layout">
            <div className="education-price__heading">
              <p className="education-kicker">Стоимость</p>

              <h2>Стоимость разработки паспорта образовательной организации</h2>

              <p>
                Можно заказать отдельный документ или комплекс работ в
                зависимости от текущего состояния объекта и имеющейся
                документации.
              </p>
            </div>

            <div className="education-price__content">
              <div className="education-price__list">
                {educationPrices.map((item) => (
                  <article className="education-price__item" key={item.title}>
                    <div>
                      <h3>{item.title}</h3>

                      <p>{item.note}</p>
                    </div>

                    <strong>{item.price}</strong>
                  </article>
                ))}
              </div>

              <div className="education-price__note">
                <span aria-hidden="true">✓</span>

                <p>
                  Если у образовательной организации уже имеется актуальный акт
                  категорирования, можно заказать только разработку паспорта.
                  Если объект ещё не категорирован, сначала проводится
                  соответствующая процедура.
                </p>
              </div>

              <a className="button button--primary" href="#lead-form">
                Рассчитать стоимость
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
