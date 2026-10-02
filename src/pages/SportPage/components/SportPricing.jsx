import Container
from '../../../components/ui/Container/Container';


export default function SportPricing() {
  return (
    <>
      <section
        className="sport-prices"
        id="prices"
      >
        <Container>
          <div className="sport-prices__heading">
            <div>
              <p className="sport-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость паспорта безопасности
                объекта спорта
              </h2>
            </div>

            <p>
              Цена зависит от текущего состояния
              документации объекта и необходимого
              состава работ.
            </p>
          </div>


          <div className="sport-prices__list">
            <article className="sport-price">
              <div className="sport-price__name">
                <span>
                  01
                </span>

                <h3>
                  Паспорт безопасности
                </h3>
              </div>

              <strong>
                9 500 ₽
              </strong>
            </article>


            <article className="sport-price">
              <div className="sport-price__name">
                <span>
                  02
                </span>

                <h3>
                  Акт обследования
                  и категорирования
                </h3>
              </div>

              <strong>
                9 500 ₽
              </strong>
            </article>


            <article className="sport-price">
              <div className="sport-price__name">
                <span>
                  03
                </span>

                <h3>
                  Сопровождение согласования
                </h3>
              </div>

              <strong>
                от 9 500 ₽
              </strong>
            </article>


            <article className="sport-price sport-price--complex">
              <div className="sport-price__name">
                <span>
                  04
                </span>

                <h3>
                  Комплекс под ключ
                </h3>
              </div>

              <strong>
                от 35 000 ₽
              </strong>
            </article>
          </div>


          <div className="sport-prices__logic">
            <div className="sport-prices__logic-item">
              <span>
                Есть действующий акт
              </span>

              <p>
                Если действующий акт категорирования
                уже есть и соответствует фактическому
                состоянию объекта, можно заказать
                только подготовку паспорта.
              </p>
            </div>


            <div className="sport-prices__logic-arrow">
              <span aria-hidden="true">
                ↔
              </span>
            </div>


            <div className="sport-prices__logic-item">
              <span>
                Акта нет
              </span>

              <p>
                Если объект не категорирован,
                сначала проводится процедура
                обследования и категорирования.
              </p>
            </div>
          </div>


          <div className="sport-prices__action">
            <a
              className="button button--primary"
              href="#lead-form"
            >
              Заказать паспорт
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
