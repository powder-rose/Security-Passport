import Container from "../../../../components/ui/Container/Container";

import { hotelServiceItems } from "../../hotelPageData";

export default function HotelServiceScope() {
  return (
    <>
      <section className="hotel-service" id="hotel-service">
        <Container>
          <div className="hotel-service__layout">
            <div className="hotel-service__heading">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">Состав услуги</p>

                <h2>Что входит в разработку паспорта безопасности гостиницы</h2>
              </div>

              <p>
                Работа строится вокруг конкретного объекта: сначала определяем
                применимые требования, затем готовим документы для
                категорирования, паспорта и предусмотренного согласования.
              </p>
            </div>

            <ol className="hotel-service__list">
              {hotelServiceItems.map((item, index) => (
                <li key={item}>
                  <span className="hotel-service__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <strong>{item}</strong>

                  <span className="hotel-service__check" aria-hidden="true">
                    ✓
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
