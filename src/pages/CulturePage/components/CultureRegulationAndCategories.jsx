import Container
from '../../../components/ui/Container/Container';

import {
  cultureCategories,
  regulationScope,
} from '../culturePageData';


export default function CultureRegulationAndCategories() {
  return (
    <>
      <section
        className="culture-regulation"
        id="culture-regulation"
      >
        <Container>
          <div className="culture-regulation__layout">
            <div className="culture-regulation__identity">
              <p className="culture-kicker">
                Нормативная основа
              </p>

              <span className="culture-regulation__number">
                176
              </span>

              <div className="culture-regulation__dates">
                <div>
                  <span>
                    Действующая редакция
                  </span>

                  <strong>
                    08.05.2025
                  </strong>
                </div>

                <div>
                  <span>
                    Обновлённая форма
                  </span>

                  <strong>
                    с 16.05.2025
                  </strong>
                </div>
              </div>
            </div>

            <div className="culture-regulation__content">
              <div className="culture-regulation__heading">
                <h2>
                  Постановление
                  Правительства РФ №176
                </h2>

                <p>
                  Требования к антитеррористической
                  защищённости объектов и территорий
                  в сфере культуры и форма паспорта
                  безопасности утверждены
                  Постановлением Правительства РФ
                  от 11.02.2017 №176.
                </p>
              </div>

              <div className="culture-regulation__scope">
                {regulationScope.map(
                  (item) => (
                    <article
                      key={item.number}
                    >
                      <span>
                        {item.number}
                      </span>

                      <div>
                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          {item.text}
                        </p>
                      </div>
                    </article>
                  ),
                )}
              </div>

              <aside className="culture-regulation__notice">
                <span>
                  2026
                </span>

                <p>
                  При разработке нового паспорта
                  используем действующую форму.
                  Старый шаблон учреждения необходимо
                  проверить на соответствие редакции
                  ПП РФ №176, действующей после
                  изменений 2025 года.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="culture-categories"
        id="culture-categories"
      >
        <Container>
          <div className="culture-categories__header">
            <div>
              <p className="culture-kicker">
                Категорирование
              </p>

              <h2>
                Категории объектов культуры
              </h2>
            </div>

            <div className="culture-categories__intro">
              <p>
                ПП РФ №176 устанавливает три
                категории опасности. Критерием
                является прогнозируемое количество
                людей, которые могут погибнуть
                или получить вред здоровью
                в результате террористического акта.
              </p>

              <strong>
                Категорию определяет комиссия,
                а не исполнитель документа
                единолично.
              </strong>
            </div>
          </div>

          <div className="culture-categories__scale">
            {cultureCategories.map(
              (item) => (
                <article
                  className="culture-categories__item"
                  key={item.number}
                >
                  <span className="culture-categories__roman">
                    {item.number}
                  </span>

                  <div className="culture-categories__item-copy">
                    <span>
                      {item.note}
                    </span>

                    <strong>
                      {item.value}
                    </strong>

                    <h3>
                      {item.title}
                    </h3>
                  </div>
                </article>
              ),
            )}
          </div>

          <div className="culture-categories__note">
            <span aria-hidden="true">
              i
            </span>

            <p>
              Прогнозный показатель определяется
              с учётом пропускной способности,
              количества людей, которые могут
              одновременно находиться на объекте,
              либо количества зрительских мест
              в предусмотренных случаях.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
