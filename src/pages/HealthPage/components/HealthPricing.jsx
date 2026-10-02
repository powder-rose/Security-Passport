import Container
from '../../../components/ui/Container/Container';


export default function HealthPricing() {
  return (
    <>
<section
        className="health-prices"
        id="prices"
      >
        <Container>
          <div className="health-prices__heading">
            <div>
              <p className="health-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость паспорта
                безопасности объекта
                здравоохранения
              </h2>
            </div>

            <p>
              Можно заказать разработку
              паспорта отдельно либо выбрать
              работы, необходимые
              с учётом текущего состояния
              документов по объекту.
            </p>
          </div>


          <div className="health-prices__layout">
            <article className="health-price-primary">
              <span>
                Паспорт безопасности
              </span>

              <strong>
                9 500 ₽
              </strong>

              <p>
                Разработка паспорта
                безопасности объекта
                здравоохранения.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Заказать паспорт
              </a>
            </article>


            <div className="health-prices__list">
              <article>
                <div>
                  <span>
                    01
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

              <article>
                <div>
                  <span>
                    02
                  </span>

                  <h3>
                    Сопровождение
                    согласования
                  </h3>
                </div>

                <strong>
                  от 9 500 ₽
                </strong>
              </article>

              <article>
                <div>
                  <span>
                    03
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
          </div>


          <aside className="health-prices__note">
            <span>
              Если акт уже есть
            </span>

            <p>
              Если имеется действующий
              акт обследования
              и категорирования,
              можно заказать разработку
              паспорта отдельно.
              Если объект ещё не категорирован,
              работа начинается с подготовки
              процедуры обследования
              и категорирования.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
