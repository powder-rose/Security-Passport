import Container from "../../../../components/ui/Container/Container";

import { hotelSourceData } from "../../hotelPageData";

export default function HotelRequiredDocuments() {
  return (
    <>
      <section className="hotel-source" id="hotel-source">
        <Container>
          <div className="hotel-source__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">Исходные данные</p>

              <h2>Что потребуется от гостиницы</h2>
            </div>

            <div className="hotel-source__intro">
              <p>
                Для начала не требуется собирать большой комплект документов.
                Достаточно основных сведений, чтобы проверить объект и
                определить дальнейший порядок работы.
              </p>

              <strong>
                Точный перечень определяем после первичной проверки объекта.
              </strong>
            </div>
          </div>

          <div className="hotel-source__grid">
            {hotelSourceData.map((item, index) => (
              <article className="hotel-source__item" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>

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
