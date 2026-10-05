import Container from "../../../../components/ui/Container/Container";

import { hotelProcess } from "../../hotelPageData";

export default function HotelPassportProcess() {
  return (
    <>
      <section className="hotel-process" id="hotel-process">
        <Container>
          <div className="hotel-process__layout">
            <div className="hotel-process__intro">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">Порядок работы</p>

                <h2>Как оформить паспорт безопасности гостиницы</h2>
              </div>

              <div className="hotel-process__note">
                <span aria-hidden="true">!</span>

                <p>Категорию определяет комиссия, а не подрядчик единолично.</p>
              </div>
            </div>

            <ol className="hotel-process__steps">
              {hotelProcess.map((item, index) => (
                <li key={item.title}>
                  <span className="hotel-process__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <span className="hotel-process__label">Этап</span>

                    <h3>{item.title}</h3>
                  </div>

                  <span className="hotel-process__arrow" aria-hidden="true">
                    ↓
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
