import Container from "../../../../components/ui/Container/Container";

import { hotelWhyItems } from "../../hotelPageData";

export default function HotelWorkApproach() {
  return (
    <>
      <section className="hotel-why" id="hotel-why">
        <Container>
          <div className="hotel-why__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">Подход к работе</p>

              <h2>Почему БОЙКОВГРУПП</h2>
            </div>

            <p>
              Для гостиницы важно не просто заполнить форму, а правильно пройти
              всю последовательность: определить применимые требования, провести
              категорирование и подготовить паспорт к предусмотренному
              согласованию.
            </p>
          </div>

          <div className="hotel-why__grid">
            {hotelWhyItems.map((item) => (
              <article className="hotel-why__item" key={item.number}>
                <span className="hotel-why__number">{item.number}</span>

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
