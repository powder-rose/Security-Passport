import Container
from '../../../components/ui/Container/Container';

import {
  hotelFormStructure,
} from '../hotelPageData';


export default function HotelPassportForm() {
  return (
    <>
      <section
        className="hotel-form"
        id="hotel-form"
      >
        <Container>
          <div className="hotel-form__layout">
            <div className="hotel-form__copy">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Форма документа
                </p>

                <h2>
                  Форма и образец паспорта
                  безопасности гостиницы
                </h2>
              </div>

              <p className="hotel-form__lead">
                Форма паспорта безопасности гостиницы
                или иного средства размещения утверждена
                Постановлением Правительства РФ от 13.04.2017 №447.
              </p>

              <p>
                На странице мы показываем структуру
                документа без публикации заполненного
                паспорта действующего объекта.
              </p>

              <a
                className="hotel-form__action"
                href="#contact"
              >
                Получить образец формы

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>

            <div
              className="hotel-form__document"
              aria-label="Структура паспорта безопасности гостиницы"
            >
              <div className="hotel-form__document-top">
                <span>
                  Постановление Правительства РФ от 13.04.2017 №447
                </span>

                <strong>
                  Паспорт безопасности
                </strong>
              </div>

              <ol className="hotel-form__structure">
                {hotelFormStructure.map(
                  (item, index) => (
                    <li key={item}>
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <p>
                        {item}
                      </p>
                    </li>
                  ),
                )}
              </ol>

              <div className="hotel-form__document-note">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  Конкретное содержание оформляется
                  по официальной форме и исходным
                  сведениям конкретной гостиницы.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
