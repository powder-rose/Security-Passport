import Container
from '../../../components/ui/Container/Container';

import {
  educationObjects,
} from '../educationPageData';


export default function EducationHeroAndObjects({
  objectType,
  regionalWorkText,
}) {
  return (
    <>
      <section className="education-hero">
        <Container>
          <nav
            className="education-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Образовательные организации
            </span>
          </nav>


          <div className="education-hero__layout">
            <div className="education-hero__content">
              <p className="education-kicker">
                Образовательные организации
              </p>

              <h1>
                {objectType.h1}
              </h1>

              <p className="education-hero__lead">
                {objectType.pageLead}

                {regionalWorkText ? (
                  <>
                    {' '}
                    {regionalWorkText}
                  </>
                ) : null}
                {' '}
                <span className="coverage-emphasis">Работаем по всей России</span>.
              </p>


              <div className="education-hero__commercial">
                <div className="education-hero__price">
                  <span>
                    Стоимость разработки
                  </span>

                  <strong>
                    от 9 500 ₽
                  </strong>
                </div>

                <div className="education-hero__facts">
                  <span>
                    Категорирование + паспорт
                  </span>

                  <span>
                    Определяем применимый нормативный акт
                  </span>

                  <span>
                    Сопровождение согласования
                  </span>
                </div>
              </div>


              <div className="education-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Заказать паспорт
                </a>

                <a
                  className="education-button-secondary"
                  href="#education-requirements"
                >
                  Проверить требования для моей организации

                  <span aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>


            <aside className="education-hero__panel">
              <p className="education-hero__panel-label">
                Нормативный режим
              </p>

              <div className="education-hero__panel-number">
                1006
                <span>/</span>
                1421
              </div>

              <h2>
                Сначала определяем,
                какие требования применяются к объекту
              </h2>

              <p>
                Для образовательных организаций нет
                одного универсального нормативного
                режима на все случаи.
              </p>

              <div className="education-hero__panel-footer">
                Вид организации
                <span>+</span>
                ведомственная принадлежность
              </div>
            </aside>
          </div>
        </Container>
      </section>


      <section className="education-objects">
        <Container>
          <div className="education-section-heading">
            <p className="education-kicker">
              Объекты образования
            </p>

            <h2>
              Для каких образовательных объектов
              разрабатываем паспорта
            </h2>

            <p>
              Разрабатываем документацию для объектов
              образовательных организаций после
              определения применимых к конкретному
              объекту требований.
            </p>
          </div>


          <div className="education-objects__layout">
            <div className="education-objects__list">
              {educationObjects.map(
                (item) => (
                  <article
                    className={
                      item.note
                        ? 'education-object education-object--important'
                        : 'education-object'
                    }
                    key={item.number}
                  >
                    <span className="education-object__number">
                      {item.number}
                    </span>

                    <div>
                      <h3>
                        {item.title}
                      </h3>

                      {item.note ? (
                        <p>
                          {item.note}
                        </p>
                      ) : null}
                    </div>

                    <span
                      className="education-object__mark"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </article>
                ),
              )}
            </div>


            <aside className="education-objects__note">
              <span>
                Важно
              </span>

              <h3>
                Название учреждения само по себе
                не определяет форму паспорта
              </h3>

              <p>
                Сначала проверяем вид организации,
                сферу деятельности и ведомственную
                принадлежность конкретного объекта.
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
