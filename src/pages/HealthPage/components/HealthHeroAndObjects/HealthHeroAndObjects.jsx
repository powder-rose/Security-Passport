import Container from "../../../../components/ui/Container/Container";

import { healthObjects } from "../../healthPageData";

export default function HealthHeroAndObjects() {
  return (
    <>
      <section className="health-hero" id="top">
        <Container>
          <nav className="health-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">Паспорт безопасности</a>

            <span aria-hidden="true">/</span>

            <span>Объекты здравоохранения</span>
          </nav>

          <div className="health-hero__layout">
            <div className="health-hero__content">
              <p className="health-kicker">Объекты здравоохранения</p>

              <h1>
                Паспорт безопасности объекта здравоохранения — разработка и
                согласование
              </h1>

              <p className="health-hero__lead">
                Подготовим паспорт безопасности медицинского или
                фармацевтического объекта с учётом требований к
                антитеррористической защищённости. Подготовим документацию для
                категорирования, акт, паспорт и сопровождение согласования.{" "}
                <span className="coverage-emphasis">
                  Работаем по всей России
                </span>
                .
              </p>

              <div className="health-hero__commercial">
                <div className="health-hero__price">
                  <span>Стоимость разработки</span>

                  <strong>от 9 500 ₽</strong>
                </div>

                <div className="health-hero__facts">
                  <span>Постановление Правительства РФ №8</span>

                  <span>4 категории объектов</span>

                  <span>Категорирование + паспорт</span>
                </div>
              </div>

              <div className="health-hero__actions">
                <a className="button button--primary" href="#lead-form">
                  Заказать паспорт
                </a>

                <a className="button button--secondary" href="#objects">
                  Проверить требования для моего объекта
                </a>
              </div>
            </div>

            <aside className="health-hero__legal">
              <div className="health-hero__legal-top">
                <span>Нормативное основание</span>

                <strong>редакция 15.08.2025</strong>
              </div>

              <div className="health-hero__legal-number">
                <span>ПП РФ</span>

                <strong>№8</strong>
              </div>

              <div className="health-hero__legal-title">
                <span>
                  Антитеррористическая защищённость объектов здравоохранения
                </span>
              </div>

              <div
                className="health-hero__categories"
                aria-label="Четыре категории объектов"
              >
                <span>I</span>

                <span>II</span>

                <span>III</span>

                <span>IV</span>
              </div>

              <p className="health-hero__legal-note">
                Категория определяется по результатам обследования и
                категорирования объекта.
              </p>

            </aside>
          </div>
        </Container>
      </section>

      <section className="health-objects" id="objects">
        <Container>
          <div className="health-objects__heading">
            <div>
              <p className="health-kicker">
                Применимость Постановление Правительства РФ №8
              </p>

              <h2>
                Каким объектам здравоохранения требуется паспорт безопасности
              </h2>
            </div>

            <p>
              Требования распространяются не только на объекты непосредственно
              Минздрава России. В сферу Постановление Правительства РФ №8 входят
              предусмотренные постановлением объекты в сфере здравоохранения,
              включая объекты организаций, осуществляющих медицинскую и
              фармацевтическую деятельность.
            </p>
          </div>

          <div className="health-objects__layout">
            <ol className="health-objects__list">
              {healthObjects.map((item) => (
                <li className="health-object" key={item.number}>
                  <span className="health-object__number">{item.number}</span>

                  <h3>{item.title}</h3>
                </li>
              ))}
            </ol>

            <aside className="health-objects__scope">
              <div className="health-objects__scope-mark">
                <span aria-hidden="true">!</span>

                <p>Важно</p>
              </div>

              <h3>Сначала определяем статус конкретного объекта</h3>

              <p>
                Применимость конкретных требований проверяется с учётом
                правообладателя, назначения и фактического статуса объекта.
              </p>

              <p>
                Само название «клиника», «стоматология» или «аптека» не заменяет
                проверку применимого нормативного режима.
              </p>

              <a className="health-inline-link" href="#lead-form">
                Проверить требования для моего объекта
                <span aria-hidden="true">→</span>
              </a>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
