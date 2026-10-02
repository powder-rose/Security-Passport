import Container
from '../../../components/ui/Container/Container';


import {
  hotelAccommodationTypes,
} from '../hotelPageData';



export default function HotelAccommodationTypes() {
  return (
    <>
      <section
        className="hotel-accommodation"
        id="hotel-accommodation"
      >
        <Container>
          <div className="hotel-accommodation__layout">
            <div className="hotel-accommodation__copy">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Средства размещения
                </p>

                <h2>
                  Для каких средств размещения
                  разрабатываем паспорта
                </h2>
              </div>

              <p>
                Проверяем применимость требований
                для гостиниц и иных средств размещения
                с учётом фактического назначения
                объекта и его нормативного статуса.
              </p>
            </div>

            <div className="hotel-accommodation__types">
              {hotelAccommodationTypes.map(
                (item) => (
                  <div
                    className="hotel-accommodation__type"
                    key={item.title}
                  >
                    <span>
                      {item.number}
                    </span>

                    <strong>
                      {item.title}
                    </strong>

                    <span
                      className="hotel-accommodation__mark"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <aside className="hotel-accommodation__note">
            <span aria-hidden="true">
              ✓
            </span>

            <p>
              Название объекта само по себе
              не определяет нормативный режим.
              Перед разработкой документации
              проверяем применимые требования.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
