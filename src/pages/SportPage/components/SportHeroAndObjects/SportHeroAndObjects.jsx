import Container from "../../../../components/ui/Container/Container";

import { sportObjects } from "../../sportPageData";

export default function SportHeroAndObjects() {
  return (
    <>
      <section className="sport-hero" id="top">
        <Container>
          <nav className="sport-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">Паспорт безопасности</a>

            <span aria-hidden="true">/</span>

            <span>Объекты спорта</span>
          </nav>

          <div className="sport-hero__layout">
            <div className="sport-hero__content">
              <p className="sport-kicker">Объекты спорта</p>

              <h1>
                Паспорт безопасности объекта спорта — разработка и согласование
              </h1>

              <p className="sport-hero__lead">
                Подготовим паспорт безопасности объекта спорта в соответствии с
                требованиями к антитеррористической защищённости. Подготовим
                документы для категорирования, акт, паспорт и сопроводим
                предусмотренное согласование.{" "}
                <span className="coverage-emphasis">
                  Работаем по всей России
                </span>
                .
              </p>

              <div className="sport-hero__commercial">
                <div className="sport-hero__price">
                  <span>Стоимость разработки</span>

                  <strong>от 9 500 ₽</strong>
                </div>

                <div className="sport-hero__facts">
                  <span>По ПП РФ №202</span>

                  <span>4 категории опасности</span>

                  <span>Категорирование + паспорт</span>
                </div>
              </div>

              <div className="sport-hero__actions">
                <a className="button button--primary" href="#lead-form">
                  Заказать паспорт
                </a>

                <a className="sport-text-action" href="#objects">
                  Проверить требования для объекта
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <aside className="sport-hero__legal">
              <div className="sport-hero__legal-top">
                <span>Нормативная основа</span>

                <span>06.03.2015</span>
              </div>

              <div className="sport-hero__legal-number">
                <small>№</small>

                <strong>202</strong>
              </div>

              <h2>
                Требования к антитеррористической защищённости объектов спорта
              </h2>

              <p>
                Постановлением утверждены требования к защищённости объектов
                спорта и форма паспорта безопасности.
              </p>

              <div className="sport-hero__legal-footer">
                <div>
                  <strong>4</strong>

                  <span>категории</span>
                </div>

                <div>
                  <strong>2026</strong>

                  <span>актуальная страница</span>
                </div>
              </div>

            </aside>
          </div>
        </Container>
      </section>

      <section className="sport-objects" id="objects">
        <Container>
          <div className="sport-objects__heading">
            <div>
              <p className="sport-kicker">Применимость требований</p>

              <h2>Каким объектам спорта нужен паспорт безопасности</h2>
            </div>

            <p>
              Требования распространяются на объекты недвижимости и комплексы
              недвижимости, специально предназначенные для проведения
              физкультурных и/или спортивных мероприятий.
            </p>
          </div>

          <div className="sport-objects__layout">
            <ol className="sport-objects__list">
              {sportObjects.map((item) => (
                <li className="sport-object" key={item.number}>
                  <span className="sport-object__number">{item.number}</span>

                  <h3>{item.title}</h3>

                  <span className="sport-object__mark" aria-hidden="true">
                    ↗
                  </span>
                </li>
              ))}
            </ol>

            <aside className="sport-objects__note">
              <span className="sport-objects__note-index">Важно</span>

              <h3>
                Название объекта само по себе не определяет нормативный режим
              </h3>

              <p>
                Применимость ПП РФ №202 определяем по фактическому назначению и
                статусу конкретного объекта.
              </p>

              <p>
                Поэтому не предполагаем автоматически, что любой фитнес-клуб или
                площадка подпадает под один и тот же порядок.
              </p>

              <a className="sport-inline-link" href="#lead-form">
                Проверить конкретный объект
                <span aria-hidden="true">→</span>
              </a>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
