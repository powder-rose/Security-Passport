import Container from '../../../../components/ui/Container/Container';
import './ObjectTypeHero.css';
import '../../ObjectTypePageHeroResponsive.css';

export default function ObjectTypeHero({
  objectType,
  breadcrumbLabel = 'Главная',
  actions,
  aside,
  facts = [],
  showCoverage = true,
}) {
  return (
    <>
      <section className="object-service-hero">
        <Container>
          <nav className="object-service-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">{breadcrumbLabel}</a>

            <span aria-hidden="true">/</span>

            <span>{objectType.title}</span>
          </nav>

          <div className="object-service-hero__grid">
            <div className="object-service-hero__copy">
              <p className="object-service-hero__kicker">Паспорт безопасности объекта</p>

              <h1>{objectType.h1}</h1>

              <p className="object-service-hero__lead">
                {objectType.pageLead}
                {showCoverage ? (
                  <>
                    {' '}
                    <span className="coverage-emphasis">Работаем по всей России</span>.
                  </>
                ) : null}
              </p>

              <p className="object-service-hero__price">Разработка паспорта — от 9 500 ₽</p>

              {facts.length ? (
                <ul className="object-service-hero__facts">
                  {facts.map(fact => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              ) : null}

              <div className="object-service-hero__actions">
                {actions ?? (
                  <>
                    <a className="button button--primary" href="#quiz">
                      Проверить, нужен ли паспорт вашему объекту
                    </a>

                    <a className="object-service-hero__back" href="#lead-form">
                      Рассчитать стоимость
                      <span aria-hidden="true">→</span>
                    </a>
                  </>
                )}
              </div>
            </div>

            <aside className="object-service-hero__card">
              {aside ?? (
                <>
                  <p className="object-service-hero__card-label">Для каких объектов</p>

                  <h2>{objectType.title}</h2>

                  <p>{objectType.description}</p>
                </>
              )}
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
