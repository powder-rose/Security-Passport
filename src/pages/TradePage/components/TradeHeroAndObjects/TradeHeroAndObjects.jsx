import Container from "../../../../components/ui/Container/Container";

import { tradeObjects } from "../../tradePageData";

export default function TradeHeroAndObjects() {
  return (
    <>
      <section className="trade-hero" id="top">
        <Container>
          <nav className="trade-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">Паспорт безопасности</a>

            <span aria-hidden="true">/</span>

            <span>Торговые объекты</span>
          </nav>

          <div className="trade-hero__layout">
            <div className="trade-hero__content">
              <p className="trade-kicker">Торговые объекты</p>

              <h1>
                Паспорт безопасности торгового объекта — разработка и
                согласование
              </h1>

              <p className="trade-hero__lead">
                Подготовим паспорт безопасности торгового объекта (территории)
                по действующей редакции Постановления Правительства РФ №1273.
                Определим применимость требований, подготовим документы для
                категорирования, акт и паспорт, сопроводим согласование.{" "}
                <span className="coverage-emphasis">
                  Работаем по всей России
                </span>
                .
              </p>

              <div className="trade-hero__commercial">
                <div className="trade-hero__price">
                  <span>Стоимость разработки</span>

                  <strong>от 9 500 ₽</strong>
                </div>

                <div className="trade-hero__facts">
                  <span>ПП РФ №1273, редакция 2026 года</span>

                  <span>Категорирование + акт + паспорт</span>

                  <span>Сопровождение согласования</span>
                </div>
              </div>

              <div className="trade-hero__actions">
                <a className="button button--primary" href="#lead-form">
                  Заказать паспорт
                </a>

                <a className="trade-text-action" href="#objects">
                  Проверить, нужен ли паспорт объекту
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <aside className="trade-hero__edition">
              <div className="trade-hero__edition-top">
                <span>Действующая редакция</span>

                <span>2026</span>
              </div>

              <div className="trade-hero__number">
                <small>ПП РФ №</small>

                <strong>1273</strong>
              </div>

              <h2>
                Требования к антитеррористической защищённости торговых объектов
              </h2>

              <div className="trade-hero__update">
                <span>Изменения №229</span>

                <strong>с 13.03.2026</strong>
              </div>

              <p>
                На странице учитываем действующую редакцию требований, включая
                изменения порядка формирования перечней, категорирования,
                согласования, актуализации и формы паспорта.
              </p>

            </aside>
          </div>
        </Container>
      </section>

      <section className="trade-applicability" id="objects">
        <Container>
          <div className="trade-applicability__heading">
            <div>
              <p className="trade-kicker">Применимость ПП РФ №1273</p>

              <h2>Кому нужен паспорт безопасности торгового объекта</h2>
            </div>

            <p>
              Требования распространяются не на любой магазин автоматически. Для
              применения ПП РФ №1273 имеет значение нормативный статус
              конкретного торгового объекта.
            </p>
          </div>

          <div className="trade-applicability__core">
            <article className="trade-applicability__rule">
              <span className="trade-applicability__index">01</span>

              <h3>Объект должен быть включён в соответствующий перечень</h3>

              <p>
                Требования №1273 распространяются на торговые объекты,
                включённые в специальный перечень объектов, подлежащих
                категорированию, который формируется уполномоченным органом
                субъекта РФ.
              </p>
            </article>

            <article className="trade-applicability__rule">
              <span className="trade-applicability__index">02</span>

              <h3>Сначала определяем нормативный статус объекта</h3>

              <p>
                Объекты, регулируемые другими специальными требованиями
                Правительства РФ, а также торговые объекты, не включённые в
                соответствующий перечень, под №1273 не подпадают.
              </p>
            </article>

            <aside className="trade-applicability__check">
              <p>Не уверены, включён ли ваш объект в перечень?</p>

              <h3>Проверим применимость ПП №1273 до заказа документов</h3>

              <a className="button button--primary" href="#lead-form">
                Проверить торговый объект
              </a>
            </aside>
          </div>

          <div className="trade-objects">
            <div className="trade-objects__intro">
              <p className="trade-kicker">Виды объектов</p>

              <h2>Для каких торговых объектов разрабатываем документацию</h2>
            </div>

            <ol className="trade-objects__list">
              {tradeObjects.map((item) => (
                <li className="trade-object" key={item.number}>
                  <span className="trade-object__number">{item.number}</span>

                  <h3>{item.title}</h3>
                </li>
              ))}
            </ol>

            <div className="trade-objects__notice">
              <span>Важно</span>

              <p>
                Применимость ПП РФ №1273 определяется не названием бизнеса само
                по себе, а нормативным статусом объекта и его включением в
                соответствующий перечень. Особенно это важно для небольших
                магазинов и арендаторов внутри торговых центров.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
