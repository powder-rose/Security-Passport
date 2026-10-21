import Container from '../../../components/ui/Container/Container';
import IndustryAction from './IndustryAction';
import './IndustryHero.css';

export default function IndustryHero({ objectType, facts, onServiceSelect }) {
  const separatorIndex = objectType.h1.indexOf(' — ');
  const title = separatorIndex === -1 ? objectType.h1 : objectType.h1.slice(0, separatorIndex);
  const purpose = separatorIndex === -1 ? '' : objectType.h1.slice(separatorIndex);

  return (
    <section className="industry-hero" aria-labelledby="industry-hero-title">
      <Container>
        <nav className="industry-hero__breadcrumbs" aria-label="Хлебные крошки">
          <a href="/">Разработка паспорта безопасности объекта</a>
          <span aria-hidden="true">/</span>
          <span>{objectType.title}</span>
        </nav>

        <div className="industry-hero__layout">
          <div className="industry-hero__copy" data-industry-reveal>
            <p className="industry-hero__kicker">Паспорт безопасности объекта</p>

            <h1 className="industry-hero__title" id="industry-hero-title">
              {title}
              {purpose ? <span className="industry-hero__purpose">{purpose}</span> : null}
            </h1>

            <p className="industry-hero__lead">{objectType.pageLead}</p>

            <div className="industry-hero__commercial">
              <p className="industry-hero__price">
                <span>Разработка паспорта —</span> <strong>от 9 500 ₽</strong>
              </p>

              <div className="industry-hero__actions">
                <IndustryAction service={objectType.seoName} onSelect={onServiceSelect}>
                  Заказать паспорт
                </IndustryAction>
                <IndustryAction
                  service="Проверить требования для объекта"
                  onSelect={onServiceSelect}
                  secondary
                >
                  Проверить требования для объекта
                </IndustryAction>
              </div>
            </div>
          </div>

          <aside className="industry-hero__regulation" data-industry-reveal>
            <p className="industry-hero__regulation-label">Нормативное основание</p>
            <div className="industry-hero__regulation-number">
              <span>ПП РФ</span>
              <strong>
                <span>№ </span>258
              </strong>
            </div>
            <p className="industry-hero__regulation-date">от 01.03.2024</p>
            <p className="industry-hero__regulation-focus">{objectType.regulationFocus}</p>
          </aside>
        </div>

        {facts.length ? (
          <ul className="industry-hero__facts">
            {facts.map(fact => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
