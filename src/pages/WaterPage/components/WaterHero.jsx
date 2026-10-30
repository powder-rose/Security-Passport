import Container from '../../../components/ui/Container/Container';
import {
  waterHeroActions,
  waterHeroFacts,
  waterHeroPrice,
  waterLinks,
  waterRegulationSummary,
} from '../waterPageData';
import { WaterAction } from './WaterContent';
import './WaterHero.css';

export default function WaterHero({ objectType, onServiceSelect }) {
  const coverageEnd = objectType.pageCoverage.indexOf('.') + 1;
  const coverage = coverageEnd
    ? objectType.pageCoverage.slice(0, coverageEnd)
    : objectType.pageCoverage;
  const edition = coverageEnd ? objectType.pageCoverage.slice(coverageEnd).trim() : '';

  return (
    <>
      <section className="water-hero" aria-labelledby="water-hero-title">
        <Container>
          <nav className="water-breadcrumbs" aria-label="Хлебные крошки">
            <a href={waterLinks.home.href}>{waterLinks.home.label}</a>
            <span aria-hidden="true">/</span>
            <span>{objectType.quizOption}</span>
          </nav>
          <div className="water-hero__layout">
            <div className="water-hero__content">
              <p className="water-kicker">{objectType.accent}</p>
              <h1 id="water-hero-title">{objectType.h1}</h1>
              <div className="water-hero__commercial">
                <div className="water-hero__price">
                  <span>{waterHeroPrice.label}</span>
                  <p>
                    <span>{waterHeroPrice.pricePrefix}</span>{' '}
                    <strong>{waterHeroPrice.price}</strong>
                  </p>
                </div>
                <div className="water-hero__actions">
                  {waterHeroActions.map((action, index) => (
                    <WaterAction
                      key={action.service}
                      action={action}
                      onServiceSelect={onServiceSelect}
                      secondary={index === 1}
                    />
                  ))}
                </div>
              </div>
              <p className="water-hero__lead">{objectType.pageLead}</p>
              <p className="water-hero__coverage">
                <span className="water-hero__coverage-main">{coverage}</span>
                {edition ? (
                  <>
                    {' '}
                    <span className="water-hero__edition">{edition}</span>
                  </>
                ) : null}
              </p>
            </div>
            <aside className="water-hero__panel" aria-label={objectType.regulationFocus}>
              <div className="water-hero__panel-top">
                <span>ПП РФ №</span>
                <span>2026</span>
              </div>
              <p className="water-hero__number">1467</p>
              <ul className="water-hero__facts">
                {waterHeroFacts.map(fact => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
              <span className="water-hero__accent" aria-hidden="true" />
            </aside>
          </div>
        </Container>
      </section>
      <section
        className="water-regulation-summary"
        id={waterRegulationSummary.id}
        aria-label={waterRegulationSummary.title}
      >
        <Container className="water-regulation-summary__layout">
          <p className="water-regulation-summary__title">{waterRegulationSummary.title}</p>
          <p>{waterRegulationSummary.description}</p>
          <p className="water-regulation-summary__edition">{waterRegulationSummary.edition}</p>
        </Container>
      </section>
    </>
  );
}
