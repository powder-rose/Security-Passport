import Container
from '../../../components/ui/Container/Container';

import {
  educationPassportStructure,
} from '../educationPageData';


export default function EducationPassportForm() {
  return (
    <>
      <section className="education-form">
        <Container>
          <div className="education-form__header">
            <div>
              <p className="education-kicker">
                Форма и образец
              </p>

              <h2>
                Форма паспорта безопасности
                образовательной организации
              </h2>
            </div>

            <p>
              ПП РФ №1006 содержит утверждённую
              форму паспорта для объектов,
              подпадающих под этот нормативный режим.
            </p>
          </div>


          <div className="education-form__layout">
            <div className="education-form__intro">
              <span className="education-form__index">
                08
              </span>

              <h3>
                Основные разделы
                формы паспорта
              </h3>

              <p>
                Показываем структуру документа
                и поясняем состав сведений.
                Заполненный паспорт конкретного
                клиента публично не размещаем.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Получить форму паспорта
              </a>
            </div>


            <ol className="education-form__structure">
              {educationPassportStructure.map(
                (item, index) => (
                  <li key={item}>
                    <span>
                      {String(
                        index + 1,
                      ).padStart(2, '0')}
                    </span>

                    <p>
                      {item}
                    </p>
                  </li>
                ),
              )}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
