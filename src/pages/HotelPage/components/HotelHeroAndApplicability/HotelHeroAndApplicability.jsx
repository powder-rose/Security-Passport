import Container from "../../../../components/ui/Container/Container";

import { heroFacts } from "../../hotelPageData";

export default function HotelHeroAndApplicability({
  objectType,
}) {
  return (
    <>
      <section className="hotel-hero">
        <Container>
          <nav className="hotel-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">Главная</a>

            <span aria-hidden="true">/</span>

            <span>Паспорт безопасности гостиницы</span>
          </nav>

          <div className="hotel-hero__layout">
            <div className="hotel-hero__content">
              <p className="hotel-kicker">
                Антитеррористическая защищённость средств размещения
              </p>

              <h1>{objectType.h1}</h1>

              <p className="hotel-hero__lead">
                {objectType.pageLead}
                {" "}
                <span className="coverage-emphasis">
                  Работаем по всей России
                </span>
                .
              </p>

              <div className="hotel-hero__commercial">
                <div className="hotel-hero__price">
                  <span>Стоимость</span>

                  <strong>от 9 500 ₽</strong>

                  <small>разработка паспорта</small>
                </div>
              </div>

              <div className="hotel-hero__actions">
                <a className="button button--primary" href="#contact">
                  Заказать паспорт
                </a>

                <a className="hotel-hero__check" href="#hotel-check">
                  Проверить, нужен ли паспорт гостинице
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <aside className="hotel-hero__panel" aria-label="Ключевые сведения">
              <p className="hotel-hero__panel-label">Для гостиниц</p>

              <h2>Сначала определяем требования, потом оформляем документы</h2>

              <div className="hotel-hero__panel-list">
                {heroFacts.map((item, index) => (
                  <div className="hotel-hero__panel-item" key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>

                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="hotel-check" id="hotel-check">
        <Container>
          <div className="hotel-check__layout">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">Применимость требований</p>

              <h2>Нужен ли паспорт безопасности гостинице</h2>
            </div>

            <div className="hotel-check__content">
              <p className="hotel-check__lead">
                Постановление Правительства РФ от 13.04.2017 №447 устанавливает
                требования к антитеррористической защищённости гостиниц и иных
                средств размещения, включая категорирование и разработку
                паспорта безопасности.
              </p>

              <p>
                Но применять требования только потому, что объект называется
                гостиницей, неправильно. Для части объектов может действовать
                иной нормативный режим.
              </p>

              <aside className="hotel-check__important">
                <span className="hotel-check__important-mark">!</span>

                <div>
                  <h3>Сначала проверяем статус объекта</h3>

                  <p>
                    Требования №447, в частности, не применяются к гостиницам,
                    включённым в перечни мест массового пребывания людей по
                    Постановлению Правительства РФ №272, а также к отдельным
                    объектам, для которых установлены специальные требования.
                  </p>
                </div>
              </aside>

              <a className="hotel-inline-link" href="#contact">
                Проверить гостиницу
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
