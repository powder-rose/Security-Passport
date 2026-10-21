import Container from '../../../components/ui/Container/Container';
import ServiceAction from '../../../components/commercial/ServiceAction';
import './EnergyHero.css';

export default function EnergyHero({ objectType, facts, actions, onServiceSelect }) {
  const separatorIndex = objectType.h1.indexOf(' — ');
  const title = objectType.h1.slice(0, separatorIndex);
  const purpose = objectType.h1.slice(separatorIndex);

  return (
    <section className="energy-hero" aria-labelledby="energy-hero-title">
      <Container>
        <nav className="energy-hero__breadcrumbs" aria-label="Хлебные крошки">
          <a href="/">Разработка паспорта безопасности объекта</a>
          <span aria-hidden="true">/</span>
          <span>{objectType.title}</span>
        </nav>

        <div className="energy-hero__layout">
          <div className="energy-hero__copy" data-scroll-reveal>
            <p className="energy-hero__kicker">Топливно-энергетический комплекс</p>
            <h1 className="energy-hero__title" id="energy-hero-title">
              {title}
              <span className="energy-hero__purpose">{purpose}</span>
            </h1>

            <p className="energy-hero__price">
              <span>Стоимость разработки паспорта:</span>
              <strong>от 9 500 ₽</strong>
            </p>

            <p className="energy-hero__lead">{objectType.pageLead}</p>
            <div className="energy-hero__actions">
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
          </div>

          <aside className="energy-hero__regulation" data-scroll-reveal>
            <p className="energy-hero__regulation-label">Федеральный закон</p>
            <p className="energy-hero__regulation-number">
              <span>№</span> 256<span>-ФЗ</span>
            </p>
            <p className="energy-hero__regulation-date">от 21.07.2011</p>
            <p className="energy-hero__regulation-focus">{objectType.regulationFocus}</p>
            <dl className="energy-hero__documents">
              <div>
                <dt>Категорирование</dt>
                <dd>ПП РФ № 459</dd>
              </div>
              <div>
                <dt>Форма паспорта</dt>
                <dd>№ 3722-р</dd>
              </div>
            </dl>
          </aside>
        </div>

        <ul className="energy-hero__facts">
          {facts.map(fact => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
