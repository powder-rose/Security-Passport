import Container
from '../../../components/ui/Container/Container';


export default function HealthStageTwo() {
  return (
    <>
      <section
        className="health-regulation"
        id="about-passport"
      >
        <Container>
          <div className="health-regulation__layout">
            <aside className="health-regulation__identity">
              <div className="health-regulation__eyebrow">
                <span>
                  Нормативное основание
                </span>

                <strong>
                  действует
                </strong>
              </div>

              <div className="health-regulation__number">
                <small>
                  Постановление Правительства РФ
                </small>

                <strong>
                  №8
                </strong>
              </div>

              <div className="health-regulation__date">
                <span>
                  13.01.2017
                </span>

                <span>
                  редакция 15.08.2025
                </span>
              </div>
            </aside>


            <div className="health-regulation__content">
              <p className="health-kicker">
                Постановление Правительства РФ №8
              </p>

              <h2>
                Требования к объектам
                здравоохранения
              </h2>

              <p className="health-regulation__lead">
                Требования к антитеррористической
                защищённости объектов Минздрава России
                и объектов, относящихся к сфере
                деятельности Минздрава, а также
                официальная форма паспорта безопасности
                установлены Постановлением Правительства
                РФ от 14.01.2017 №8.
              </p>

              <div className="health-regulation__status">
                <span aria-hidden="true">
                  2026
                </span>

                <p>
                  На сентябрь 2026 года
                  постановление применяется
                  в редакции от 15 августа 2025 года.
                </p>
              </div>


              <div className="health-regulation__points">
                <article>
                  <span>
                    01
                  </span>

                  <h3>
                    Категорирование
                  </h3>

                  <p>
                    Требования предусматривают
                    определение категории
                    конкретного объекта.
                  </p>
                </article>

                <article>
                  <span>
                    02
                  </span>

                  <h3>
                    Защищённость
                  </h3>

                  <p>
                    Категория используется
                    при применении требований
                    к антитеррористической
                    защищённости.
                  </p>
                </article>

                <article>
                  <span>
                    03
                  </span>

                  <h3>
                    Паспорт
                  </h3>

                  <p>
                    Постановлением утверждена
                    форма паспорта безопасности
                    объекта.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section className="health-categories">
        <Container>
          <div className="health-categories__heading">
            <div>
              <p className="health-kicker">
                Категорирование
              </p>

              <h2>
                Четыре категории
                объектов здравоохранения
              </h2>
            </div>

            <div className="health-categories__intro">
              <p>
                Постановление Правительства РФ №8 предусматривает
                четыре категории объектов.
              </p>

              <strong>
                Категория не определяется
                только по числу людей.
              </strong>
            </div>
          </div>


          <div className="health-categories__criteria">
            <div>
              <span className="health-categories__dot" />

              <p>
                Прогнозируемое количество
                пострадавших
              </p>
            </div>

            <div>
              <span className="health-categories__dot" />

              <p>
                Возможный материальный
                ущерб
              </p>
            </div>
          </div>


          <ol
            className="health-categories__matrix"
            aria-label="Категории объектов здравоохранения"
          >
            <li>
              <div className="health-category__identity">
                <span>
                  I
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="health-category__metric">
                <small>
                  Пострадавшие
                </small>

                <strong>
                  более 1 000 чел.
                </strong>
              </div>

              <div className="health-category__metric">
                <small>
                  Материальный ущерб
                </small>

                <strong>
                  более 100 млн ₽
                </strong>
              </div>
            </li>


            <li>
              <div className="health-category__identity">
                <span>
                  II
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="health-category__metric">
                <small>
                  Пострадавшие
                </small>

                <strong>
                  500–1 000 чел.
                </strong>
              </div>

              <div className="health-category__metric">
                <small>
                  Материальный ущерб
                </small>

                <strong>
                  50–100 млн ₽
                </strong>
              </div>
            </li>


            <li>
              <div className="health-category__identity">
                <span>
                  III
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="health-category__metric">
                <small>
                  Пострадавшие
                </small>

                <strong>
                  50–500 чел.
                </strong>
              </div>

              <div className="health-category__metric">
                <small>
                  Материальный ущерб
                </small>

                <strong>
                  30–50 млн ₽
                </strong>
              </div>
            </li>


            <li>
              <div className="health-category__identity">
                <span>
                  IV
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="health-category__metric">
                <small>
                  Пострадавшие
                </small>

                <strong>
                  менее 50 чел.
                </strong>
              </div>

              <div className="health-category__metric">
                <small>
                  Материальный ущерб
                </small>

                <strong>
                  менее 30 млн ₽
                </strong>
              </div>
            </li>
          </ol>


          <aside className="health-categories__note">
            <span className="health-categories__note-mark">
              !
            </span>

            <div>
              <strong>
                Учитываются оба критерия
              </strong>

              <p>
                При категорировании учитываются
                прогнозируемое количество
                пострадавших и возможный
                материальный ущерб. Поэтому
                упрощённо определять категорию
                только по количеству людей
                некорректно.
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
