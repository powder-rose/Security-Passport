import Container from "../../../../components/ui/Container/Container";

import { cultureObjects } from "../../culturePageData";

export default function CultureHeroAndObjects({
  objectType,
}) {
  return (
    <>
      <section className="culture-hero">
        <Container>
          <nav className="culture-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">Главная</a>

            <span aria-hidden="true">/</span>

            <span>Паспорт безопасности объекта культуры</span>
          </nav>

          <div className="culture-hero__layout">
            <div className="culture-hero__content">
              <p className="culture-kicker">
                Объекты и территории в сфере культуры
              </p>

              <h1>{objectType.h1}</h1>

              <p className="culture-hero__lead">
                {objectType.pageLead}
                {" "}
                <span className="coverage-emphasis">
                  Работаем по всей России
                </span>
                .
              </p>

              <div className="culture-hero__offer">
                <div className="culture-hero__price">
                  <span>Стоимость</span>

                  <strong>от 9 500 ₽</strong>
                </div>
              </div>

              <div className="culture-hero__actions">
                <a className="button button--primary" href="#contact">
                  Заказать паспорт
                </a>

                <a className="culture-hero__secondary" href="#culture-scope">
                  Проверить, относится ли объект к ПП №176
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <aside
              className="culture-hero__regulation"
              aria-label="Ключевые сведения о нормативном режиме"
            >
              <div className="culture-hero__regulation-top">
                <span>Нормативный режим</span>

                <strong>№176</strong>
              </div>

              <div className="culture-hero__regulation-title">
                <p>Постановление Правительства РФ</p>
              </div>

              <div className="culture-hero__facts">
                <div>
                  <span>01</span>

                  <p>По ПП РФ №176</p>
                </div>

                <div>
                  <span>02</span>

                  <p>Категорирование + паспорт</p>
                </div>

                <div>
                  <span>03</span>

                  <p>Сопровождение согласования</p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="culture-scope" id="culture-scope">
        <Container>
          <div className="culture-scope__heading">
            <div>
              <p className="culture-kicker">Область применения</p>

              <h2>Каким объектам культуры нужен паспорт безопасности</h2>
            </div>

            <p className="culture-scope__intro">
              ПП РФ №176 применяется к объектам и территориям в сфере культуры с
              учётом их правообладателя и характера деятельности организации.
            </p>
          </div>

          <div className="culture-scope__body">
            <div className="culture-scope__directory">
              <p className="culture-scope__directory-label">
                Примеры объектов, для которых проверяем применимость требований
              </p>

              <div className="culture-scope__list">
                {cultureObjects.map((item, index) => (
                  <div className="culture-scope__item" key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>

                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="culture-scope__explanation">
              <div className="culture-scope__important">
                <span>Важно</span>

                <p>
                  Применимость ПП РФ №176 определяется не только названием
                  объекта, но и его правовым статусом, правообладателем и
                  характером деятельности организации.
                </p>
              </div>

              <div className="culture-scope__legal">
                <h3>На какие организации ориентированы требования</h3>

                <p>
                  В сферу требований входят, в частности, объекты Минкультуры,
                  его территориальных органов и подведомственных организаций,
                  детских школ искусств с предусмотренными постановлением
                  учредителями, а также иных организаций, для которых
                  деятельность в сфере культуры является основным видом
                  деятельности.
                </p>
              </div>

              <div className="culture-scope__exception">
                <span className="culture-scope__exception-mark">
                  Исключения
                </span>

                <div>
                  <h3>
                    Не каждый связанный с культурой объект подпадает под №176
                  </h3>

                  <p>
                    Требования №176, в частности, не распространяются на объекты
                    туристской индустрии, включающие гостиницы и иные средства
                    размещения, горнолыжные трассы и пляжи.
                  </p>
                </div>
              </div>

              <a className="culture-inline-link" href="#contact">
                Проверить объект
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
