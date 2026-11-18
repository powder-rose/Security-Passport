import Container from '../../components/ui/Container/Container.jsx';
import FAQList from '../../sections/FAQ/FAQList.jsx';
import FinalCTA from '../../sections/FinalCTA/FinalCTA.jsx';
import { LEAD_SOURCE_CATALOG } from '../../../shared/contracts/lead.js';
import CatalogSeo from './CatalogSeo.jsx';
import CatalogHero from './CatalogHero.jsx';
import CatalogCard from './CatalogCard.jsx';
import CatalogParagraphs from './CatalogParagraphs.jsx';
import useRegulationsCatalog from './useRegulationsCatalog.js';

import './RegulationsCatalogPage.css';

export default function RegulationsCatalogPage({ initialData = null }) {
  const { settings, cards, status, retry } = useRegulationsCatalog(initialData);
  return (
    <>
      <CatalogSeo settings={settings} cards={cards} />
      <main className="regulations-catalog-page" id="main-content">
        <CatalogHero settings={settings} cards={cards} status={status} />
        <section
          className="regulations-catalog-list"
          id="catalog-list"
          aria-labelledby="catalog-list-title"
        >
          <Container>
            <div className="regulations-catalog-section-heading">
              <p className="regulations-catalog-eyebrow">Единый перечень направлений</p>
              <h2 id="catalog-list-title">{settings.catalogTitle}</h2>
              <p className="regulations-catalog-section-intro">
                {settings.catalogIntro.replace(/\n\s*\n/g, ' ')}
              </p>
            </div>
            <div className="regulations-catalog-results" aria-busy={status === 'loading'}>
              {status === 'loading' && (
                <p className="regulations-catalog-loading" role="status">
                  Загружаем перечень направлений…
                </p>
              )}
              {status === 'error' && (
                <div className="regulations-catalog-unavailable" role="alert">
                  <div>
                    <h3>Список направлений временно недоступен</h3>
                    <p>
                      Попробуйте загрузить его ещё раз или обратитесь к специалисту — поможем
                      определить требования к вашему объекту.
                    </p>
                  </div>
                  <div className="regulations-catalog-unavailable__actions">
                    <button type="button" onClick={retry}>
                      Повторить загрузку <span aria-hidden="true">↻</span>
                    </button>
                    <a href="#contact">Обратиться к специалисту ↗</a>
                  </div>
                </div>
              )}
              {status === 'ready' &&
                (cards.length ? (
                  <div className="regulations-catalog-grid">
                    {cards.map(card => (
                      <CatalogCard key={card.id} card={card} />
                    ))}
                  </div>
                ) : (
                  <div className="regulations-catalog-unavailable">
                    <h3>Уточните нужное направление у специалиста</h3>
                    <p>
                      Расскажите об объекте через форму ниже — поможем определить применимые
                      требования.
                    </p>
                    <a href="#contact">Обсудить объект ↗</a>
                  </div>
                ))}
            </div>
          </Container>
        </section>
        <section className="regulations-catalog-guide" aria-labelledby="catalog-guide-title">
          <Container className="regulations-catalog-guide__layout">
            <div className="regulations-catalog-guide__heading">
              <p className="regulations-catalog-eyebrow">Применимость требований</p>
              <h2 id="catalog-guide-title">{settings.infoTitle}</h2>
              <a className="regulations-catalog-guide__action" href="#contact">
                Проверить требования к объекту <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="regulations-catalog-guide__text">
              <CatalogParagraphs text={settings.infoText} />
            </div>
          </Container>
        </section>
        <section className="regulations-catalog-faq" aria-labelledby="catalog-faq-title">
          <Container>
            <p className="regulations-catalog-eyebrow">Вопрос — ответ</p>
            <h2 id="catalog-faq-title">{settings.faqTitle}</h2>
            <FAQList items={settings.faq} />
          </Container>
        </section>
        <FinalCTA
          title={settings.ctaTitle}
          description={settings.ctaText}
          source={LEAD_SOURCE_CATALOG}
          submitLabel={settings.ctaButton}
        />
      </main>
    </>
  );
}
