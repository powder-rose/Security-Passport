import Container from '../../../../components/ui/Container/Container';

export default function CrowdHero() {
  return (
    <>
      <section className="crowd-hero" id="top">
        <Container>
          <nav className="crowd-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">Паспорт безопасности</a>

            <span aria-hidden="true">/</span>

            <span>Места массового пребывания людей</span>
          </nav>

          <div className="crowd-hero__layout">
            <div className="crowd-hero__content">
              <p className="crowd-kicker">Места массового пребывания людей</p>

              <h1>
                Паспорт безопасности места массового пребывания людей — разработка и согласование
              </h1>

              <p className="crowd-hero__lead">
                Подготовим паспорт безопасности места массового пребывания людей по требованиям ПП
                РФ №272. Сопроводим обследование и категорирование, подготовим акт, паспорт и
                комплект для согласования.{' '}
                <span className="coverage-emphasis">Работаем по всей России</span>.
              </p>

              <div className="crowd-hero__commercial">
                <div className="crowd-hero__price">
                  <span>Стоимость разработки</span>

                  <strong>от 9 500 ₽</strong>
                </div>

                <div className="crowd-hero__facts">
                  <div>
                    <strong>3</strong>

                    <span>категории ММПЛ</span>
                  </div>

                  <div>
                    <strong>6</strong>

                    <span>экземпляров паспорта</span>
                  </div>
                </div>
              </div>

              <div className="crowd-hero__actions">
                <a className="button button--primary" href="#lead-form">
                  Заказать паспорт
                </a>

                <a className="crowd-text-action" href="#applicability">
                  Проверить, относится ли территория к ММПЛ
                </a>
              </div>
            </div>

            <aside className="crowd-hero__regulation">
              <div className="crowd-hero__regulation-top">
                <span>Нормативная база</span>

                <span>ММПЛ</span>
              </div>

              <div className="crowd-hero__number">№272</div>

              <h2>Постановление Правительства РФ</h2>

              <div className="crowd-hero__definition">
                <span>Базовый ориентир</span>

                <p>
                  Территория или место общего пользования, где при определённых условиях
                  одновременно может находиться более 50 человек.
                </p>
              </div>

              <p className="crowd-hero__note">
                Количество людей само по себе не означает автоматического применения ПП РФ №272.
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
