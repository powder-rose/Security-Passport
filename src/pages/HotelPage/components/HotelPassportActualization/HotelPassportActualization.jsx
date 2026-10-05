import Container from "../../../../components/ui/Container/Container";

import {
  hotelUpdatePeriod,
  hotelUpdateDeadline,
  hotelActualizationReasons,
} from "../../hotelPageData";

export default function HotelPassportActualization() {
  return (
    <>
      <section className="hotel-actualization" id="hotel-actualization">
        <Container>
          <div className="hotel-actualization__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">Действующий паспорт</p>

              <h2>Когда нужно актуализировать паспорт гостиницы</h2>
            </div>

            <div className="hotel-actualization__deadline">
              <strong>{hotelUpdateDeadline}</strong>

              <p>
                со дня возникновения обстоятельства, являющегося основанием для
                актуализации
              </p>
            </div>
          </div>

          <div className="hotel-actualization__grid">
            {hotelActualizationReasons.map((item, index) => (
              <article className="hotel-actualization__item" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="hotel-actualization__footer">
            <p>
              Постановление Правительства РФ от 13.04.2017 №447 также
              предусматривает периодическую актуализацию паспорта безопасности
              гостиницы не реже одного раза в {hotelUpdatePeriod}.
            </p>

            <a
              className="hotel-inline-link"
              href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
            >
              Подробнее об актуализации паспорта безопасности
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
