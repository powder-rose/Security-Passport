import Container from '../../../components/ui/Container/Container';
import ServiceAction from '../../../components/commercial/ServiceAction';
import './RosgvardiaHero.css';

export default function RosgvardiaHero({ objectType, facts, actions, offer, onServiceSelect }) {
  return (
    <section className="rosgvardia-hero" aria-labelledby="rosgvardia-hero-title">
      <Container>
        <nav className="rosgvardia-breadcrumbs" aria-label="Хлебные крошки">
          <a href="/">Главная</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{objectType.seoName}</span>
        </nav>

        <div className="rosgvardia-hero__layout">
          <div className="rosgvardia-hero__content">
            <p className="rosgvardia-kicker">{objectType.accent}</p>
            <h1 id="rosgvardia-hero-title">{objectType.h1}</h1>
            <div className="rosgvardia-hero__offer">
              <p className="rosgvardia-hero__price-label">Стоимость разработки</p>
              <p className="rosgvardia-hero__price">
                <span>{offer.pricePrefix}</span> <strong>{offer.price}</strong>
              </p>
            </div>
            <div className="rosgvardia-hero__actions">
              {actions.map((action, index) => (
                <ServiceAction
                  key={action.service}
                  service={action.service}
                  onSelect={onServiceSelect}
                  secondary={index > 0}
                >
                  {action.label}
                </ServiceAction>
              ))}
            </div>
            <p className="rosgvardia-hero__lead">{objectType.pageLead}</p>
          </div>

          <aside className="rosgvardia-hero__panel" aria-label="Преимущества услуги">
            <div className="rosgvardia-hero__panel-head">
              <span className="rosgvardia-hero__marker" aria-hidden="true" />
              <p>{objectType.regulationFocus}</p>
            </div>
            <p className="rosgvardia-hero__regulation">{objectType.regulationAct}</p>
            <ul className="rosgvardia-hero__facts">
              {facts.map(fact => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}
