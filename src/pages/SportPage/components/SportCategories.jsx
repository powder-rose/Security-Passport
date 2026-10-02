import Container
from '../../../components/ui/Container/Container';


export default function SportCategories() {
  return (
    <>
      <section className="sport-categories">
        <Container>
          <div className="sport-categories__heading">
            <div>
              <p className="sport-kicker">
                Категорирование объекта спорта
              </p>

              <h2>
                Четыре категории опасности
              </h2>
            </div>

            <div className="sport-categories__intro">
              <p>
                Действующая редакция ПП РФ №202
                предусматривает 4 категории опасности.
                Категория определяется исходя
                из прогнозируемого количества
                пострадавших.
              </p>

              <p>
                Решение об отнесении объекта
                к категории принимает комиссия
                по результатам обследования
                и категорирования.
              </p>
            </div>
          </div>


          <div
            className="sport-categories__scale"
            aria-label="Категории опасности объектов спорта"
          >
            <article className="sport-category sport-category--one">
              <div className="sport-category__code">
                <span>
                  I
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="sport-category__value">
                <strong>
                  более 500
                </strong>

                <span>
                  человек
                </span>
              </div>

              <p>
                Прогнозируемое количество
                пострадавших.
              </p>
            </article>


            <article className="sport-category sport-category--two">
              <div className="sport-category__code">
                <span>
                  II
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="sport-category__value">
                <strong>
                  101–500
                </strong>

                <span>
                  человек
                </span>
              </div>

              <p>
                Прогнозируемое количество
                пострадавших.
              </p>
            </article>


            <article className="sport-category sport-category--three">
              <div className="sport-category__code">
                <span>
                  III
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="sport-category__value">
                <strong>
                  31–100
                </strong>

                <span>
                  человек
                </span>
              </div>

              <p>
                Прогнозируемое количество
                пострадавших.
              </p>
            </article>


            <article className="sport-category sport-category--four">
              <div className="sport-category__code">
                <span>
                  IV
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="sport-category__value">
                <strong>
                  менее 30
                </strong>

                <span>
                  человек
                </span>
              </div>

              <p>
                Прогнозируемое количество
                пострадавших.
              </p>
            </article>
          </div>


          <div className="sport-categories__bottom">
            <aside className="sport-categories__special">
              <span className="sport-categories__special-mark">
                IV
              </span>

              <div>
                <h3>
                  Открытые плоскостные сооружения
                </h3>

                <p>
                  Для открытых плоскостных сооружений
                  установлено отдельное правило —
                  им присваивается IV категория
                  опасности.
                </p>
              </div>
            </aside>


            <aside className="sport-categories__commission">
              <span>
                Комиссия
              </span>

              <p>
                Категория объекта определяется
                комиссией по результатам обследования
                и категорирования. Исполнитель
                документации не присваивает категорию
                единолично.
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
