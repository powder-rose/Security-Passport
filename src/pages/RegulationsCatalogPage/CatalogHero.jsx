import Container from '../../components/ui/Container/Container.jsx';
import CatalogParagraphs from './CatalogParagraphs.jsx';

import './CatalogHero.css';

const GOVERNMENT_TITLE_SUFFIX = 'по постановлениям Правительства РФ';
const countForms = {
  one: 'направление',
  few: 'направления',
  many: 'направлений',
  other: 'направления',
};
const plurals = new Intl.PluralRules('ru');

function CatalogTitle({ title }) {
  if (!title.endsWith(GOVERNMENT_TITLE_SUFFIX)) return title;
  return (
    <>
      {title.slice(0, -GOVERNMENT_TITLE_SUFFIX.length)}
      <span className="catalog-hero__title-detail">
        по постановлениям <span className="catalog-hero__title-mark">Правительства РФ</span>
      </span>
    </>
  );
}

function RegulationPreview({ card }) {
  const number = card.regulation.match(/^ПП РФ №\s*(\d+)$/)?.[1];
  return (
    <li>
      <span className="catalog-register__reference">
        {number ? (
          <>
            <small>ПП РФ №</small>
            <span>{number}</span>
          </>
        ) : (
          card.regulation
        )}
      </span>
      <span className="catalog-register__object">{card.title}</span>
    </li>
  );
}

export default function CatalogHero({ settings, cards, status }) {
  const intro = settings.intro.split(/\n\s*\n/).filter(Boolean);
  const count = cards.length;
  const ready = status === 'ready';
  return (
    <section className="catalog-hero" aria-labelledby="catalog-title">
      <Container>
        <nav className="catalog-hero__breadcrumbs" aria-label="Хлебные крошки">
          <a href="/">Главная</a>
          <span aria-hidden="true">/</span>
          <span>Все постановления</span>
        </nav>
        <div className="catalog-hero__layout">
          <div className="catalog-hero__copy">
            <p className="catalog-hero__eyebrow">
              <span aria-hidden="true" />
              Паспорта безопасности · нормативные основания
            </p>
            <h1 id="catalog-title">
              <CatalogTitle title={settings.title} />
            </h1>
            <p className="catalog-hero__lead">{intro.at(-1)}</p>
            <a className="catalog-hero__consult" href="#contact">
              <span>Не знаете, какое постановление подходит?</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <a
            className="catalog-register"
            href="#catalog-list"
            aria-label="Перейти к перечню объектов и постановлений"
          >
            <div className="catalog-register__heading">
              <span>Каталог направлений</span>
              <span className="catalog-register__count">
                {ready ? `${count} ${countForms[plurals.select(count)]}` : 'Выбор по типу объекта'}
              </span>
            </div>
            <ul className="catalog-register__preview" aria-hidden="true">
              {cards.slice(0, 3).map(card => (
                <RegulationPreview key={card.id} card={card} />
              ))}
              {!ready && (
                <li className="catalog-register__placeholder">
                  Нормативное основание зависит от назначения и статуса объекта.
                </li>
              )}
            </ul>
            <div className="catalog-register__action">
              <span>Выбрать направление</span>
              <span aria-hidden="true">↓</span>
            </div>
          </a>
        </div>
        <div className="catalog-hero__context">
          {intro.length > 1 && (
            <div className="catalog-hero__explanation">
              <CatalogParagraphs text={intro.slice(0, -1).join('\n\n')} />
            </div>
          )}
          <div className="catalog-hero__scope">
            <span>Область применения</span>
            <p>{settings.notice}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
