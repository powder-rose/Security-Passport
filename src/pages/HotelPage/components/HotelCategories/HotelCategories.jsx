import Container from "../../../../components/ui/Container/Container";

import { hotelCategories } from "../../hotelPageData";

export default function HotelCategories() {
  return (
    <>
      <section className="hotel-categories" id="hotel-categories">
        <Container>
          <div className="hotel-categories__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">Категорирование</p>

              <h2>Категории опасности гостиниц</h2>
            </div>

            <p className="hotel-categories__lead">
              Категория гостиницы определяется комиссией по результатам
              обследования с учётом возможных последствий террористического
              акта.
            </p>
          </div>

          <div className="hotel-categories__table">
            <div className="hotel-categories__table-head">
              <span>Категория</span>

              <span>Прогнозируемое количество пострадавших</span>
            </div>

            {hotelCategories.map((item, index) => (
              <div className="hotel-categories__row" key={item.category}>
                <span className="hotel-categories__index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{item.category}</strong>

                <p>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="hotel-categories__footer">
            <p>
              Комиссия изучает характеристики объекта, существующие меры защиты,
              потенциально опасные участки и критические элементы.
            </p>

            <a
              className="hotel-inline-link"
              href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
            >
              Подробнее об акте обследования и категорирования
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
