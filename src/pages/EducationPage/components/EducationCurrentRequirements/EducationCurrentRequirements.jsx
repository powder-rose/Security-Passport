import Container from '../../../../components/ui/Container/Container';

export default function EducationCurrentRequirements() {
  return (
    <>
      <section className="education-current">
        <Container>
          <div className="education-current__layout">
            <div className="education-current__year">
              <span>Актуально</span>

              <strong>2026</strong>
            </div>

            <div className="education-current__content">
              <p className="education-kicker">Действующие требования</p>

              <h2>Что учитываем при разработке в 2026 году</h2>

              <p className="education-current__lead">
                Информация на странице актуальна на 2026 год. Перед началом работы проверяем
                действующую редакцию требований для конкретного образовательного объекта.
              </p>

              <div className="education-current__standard">
                <div>
                  <span>С 1 мая 2026 года</span>

                  <h3>ГОСТ Р 72551-2026</h3>
                </div>

                <p>
                  Стандарт устанавливает общие требования к услугам по категорированию объектов и
                  разработке паспортов безопасности. При этом обязательный нормативный режим
                  образовательного объекта определяется соответствующим применимым актом — №1006,
                  №1421 либо иным требованием.
                </p>
              </div>

              <aside className="education-current__notice">
                <span aria-hidden="true">!</span>

                <p>
                  Проекты будущих изменений не используем как действующие нормы. Перед подготовкой
                  документов проверяется актуальная редакция обязательных требований.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
