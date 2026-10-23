import Container from '../../../components/ui/Container/Container';
import ServiceAction from '../../../components/commercial/ServiceAction';
import './ReligiousHero.css';

export default function ReligiousHero({ objectType, facts, actions, onServiceSelect }) {
  return (
    <section className="religious-hero">
      <Container>
        <nav className="religious-breadcrumbs" aria-label="Хлебные крошки">
          <a href="/">Главная</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{objectType.seoName}</span>
        </nav>

        <div className="religious-hero__layout">
          <div className="religious-hero__content">
            <p className="religious-kicker">{objectType.title}</p>
            <h1>{objectType.h1}</h1>
            <p className="religious-hero__lead">{objectType.pageLead}</p>

            <div className="religious-hero__price">
              <span>Стоимость разработки</span>
              <strong>от 9 500 ₽</strong>
            </div>

            <div className="religious-hero__actions">
              {actions.map((action, index) => (
                <ServiceAction
                  key={action.label}
                  service={action.service}
                  onSelect={onServiceSelect}
                  secondary={index > 0}
                >
                  {action.label}
                </ServiceAction>
              ))}
            </div>
          </div>

          <aside
            className="religious-hero__panel"
            aria-label="Преимущества услуги"
            data-scroll-reveal
          >
            <p className="religious-hero__panel-label">Подготовка документации</p>
            <ol className="religious-hero__facts">
              {facts.map((fact, index) => (
                <li key={fact}>
                  <span className="religious-hero__number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p>{fact}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </Container>
    </section>
  );
}
