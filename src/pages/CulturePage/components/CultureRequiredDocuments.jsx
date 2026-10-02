import Container
from '../../../components/ui/Container/Container';


import {
  cultureSourceData,
} from '../culturePageData';



export default function CultureRequiredDocuments() {
  return (
    <>
      <section
        className="culture-source"
        id="culture-source"
      >
        <Container>
          <div className="culture-source__layout">
            <div className="culture-source__heading">
              <p className="culture-kicker">
                Подготовка
              </p>

              <h2>
                Какие данные нужны
                для разработки
              </h2>

              <p>
                Для начала работы собираем
                основные сведения об организации,
                объекте, людях, режимах,
                защите и существующей документации.
              </p>

              <aside className="culture-source__notice">
                Точный перечень определяем
                после первичной проверки объекта
                и имеющихся документов.
              </aside>
            </div>

            <div className="culture-source__list">
              {cultureSourceData.map(
                (item) => (
                  <article
                    className="culture-source__item"
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
          </div>
        </Container>
      </section>
    </>
  );
}
