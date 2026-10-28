import Container from '../../../components/ui/Container/Container';
import ServiceAction from '../../../components/commercial/ServiceAction';
import { marketHeroActions, marketHeroFacts, marketLinks } from '../marketPageData';
import getMarketSection from '../getMarketSection';
import './MarketHero.css';

const offer = getMarketSection('prices').items[0];

export default function MarketHero({ objectType, onServiceSelect }) {
  return (
    <section className="market-hero" aria-labelledby="market-title">
      <Container>
        <nav className="market-breadcrumbs" aria-label="Хлебные крошки">
          <a href={marketLinks.home.href}>{marketLinks.home.label}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{objectType.title}</span>
        </nav>
        <div className="market-hero__layout">
          <div className="market-hero__content">
            <p className="market-kicker">{objectType.title}</p>
            <h1 id="market-title">{objectType.h1}</h1>
            <div className="market-hero__price">
              <span>{offer.pricePrefix}</span>
              <strong>{offer.price}</strong>
            </div>
            <p className="market-hero__lead">{objectType.pageLead}</p>
            <div className="market-hero__actions">
              {marketHeroActions.map((action, index) => (
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
            <p className="market-hero__coverage">{objectType.pageCoverage}</p>
          </div>
          <aside className="market-hero__panel" aria-label="Особенности паспорта рынка">
            <p className="market-hero__panel-label">{objectType.regulationAct}</p>
            <p className="market-hero__panel-title">{objectType.seoName}</p>
            <div className="market-hero__mark" aria-hidden="true">
              <span>4</span>
              <span className="market-hero__sheets">
                <span />
                <span />
                <span />
                <span />
              </span>
            </div>
            <ul className="market-hero__facts">
              {marketHeroFacts.map(fact => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}
