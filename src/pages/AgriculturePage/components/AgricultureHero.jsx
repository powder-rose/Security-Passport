import Container from '../../../components/ui/Container/Container';
import ServiceAction from '../../../components/commercial/ServiceAction';
import './AgricultureHero.css';

export default function AgricultureHero({ objectType, facts, actions, onServiceSelect }) {
  return (
    <section className="agriculture-hero" aria-labelledby="agriculture-hero-title">
      <Container>
        <nav className="agriculture-breadcrumbs" aria-label="Хлебные крошки">
          <a href="/">Разработка паспорта безопасности объекта</a>
          <span aria-hidden="true">/</span>
          <span>{objectType.title}</span>
        </nav>

        <div className="agriculture-hero__layout">
          <div className="agriculture-hero__content" data-scroll-reveal>
            <p className="agriculture-kicker">Объекты Минсельхоза</p>
            <h1 id="agriculture-hero-title">{objectType.h1}</h1>

            <div className="agriculture-hero__commercial">
              <div className="agriculture-hero__price">
                <span>Стоимость разработки:</span>
                <strong>от 9 500 ₽</strong>
              </div>
              <ul className="agriculture-hero__facts">
                {facts.map(fact => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>

            <div className="agriculture-hero__actions">
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

            <p className="agriculture-hero__lead">{objectType.pageLead}</p>
          </div>

          <aside
            className="agriculture-hero__regulation"
            aria-label="Постановление Правительства РФ № 1270"
            data-scroll-reveal
          >
            <p className="agriculture-hero__regulation-label">Постановление Правительства РФ</p>
            <div className="agriculture-hero__regulation-identity">
              <div className="agriculture-hero__regulation-number">
                <span>№</span>
                <strong>1270</strong>
              </div>
              <p className="agriculture-hero__regulation-date">
                от <time dateTime="2025-08-25">25.08.2025</time>
              </p>
            </div>
            <ul className="agriculture-hero__departments">
              <li>Минсельхоз России</li>
              <li>Россельхознадзор</li>
              <li>Росрыболовство</li>
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}
