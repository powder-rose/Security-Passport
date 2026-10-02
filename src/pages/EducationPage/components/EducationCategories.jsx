import Container
from '../../../components/ui/Container/Container';

import {
  educationCategories,
} from '../educationPageData';


export default function EducationCategories() {
  return (
    <>
      <section className="education-categories">
        <Container>
          <div className="education-categories__heading">
            <div>
              <p className="education-kicker">
                Категорирование
              </p>

              <h2>
                Категорирование образовательной организации
              </h2>
            </div>

            <p className="education-categories__lead">
              Для объектов, подпадающих под ПП РФ №1006,
              предусмотрены четыре категории опасности.
              Категория определяется с учётом
              прогнозируемого количества пострадавших
              и численности населения населённого пункта.
            </p>
          </div>


          <div className="education-categories__notice">
            <span
              className="education-categories__notice-mark"
              aria-hidden="true"
            >
              !
            </span>

            <div>
              <strong>
                Категорию определяет комиссия
                по обследованию и категорированию
              </strong>

              <p>
                Подрядчик может готовить исходные
                материалы, расчёты и проекты документов,
                но не присваивает категорию объекту
                единолично.
              </p>
            </div>
          </div>


          <div className="education-categories__list">
            {educationCategories.map(
              (category) => (
                <details
                  className="education-category"
                  key={category.id}
                >
                  <summary>
                    <span className="education-category__title">
                      {category.title}
                    </span>

                    <span className="education-category__summary">
                      {category.summary}
                    </span>

                    <span
                      className="education-category__toggle"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>

                  <div className="education-category__body">
                    <ul>
                      {category.criteria.map(
                        (criterion) => (
                          <li key={criterion}>
                            {criterion}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </details>
              ),
            )}
          </div>


          <a
            className="education-text-link"
            href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
          >
            Акт обследования и категорирования объекта

            <span aria-hidden="true">
              →
            </span>
          </a>
        </Container>
      </section>
    </>
  );
}
