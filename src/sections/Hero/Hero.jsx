import Container from '../../components/ui/Container/Container';
import { useCity } from '../../context/GeoContext';
import './Hero.css';

export default function Hero() {
  const city = useCity();

  const heroLocationPhrase =
    city.isDefault
      ? ''
      : (
          city.seoNeedsSubject &&
          city.subject &&
          city.subject !== city.name
        )
        ? (
            `— ${city.name}, ${city.subject}`
          )
        : city.hasTrustedInflection
          ? city.locationPhrase
          : `— ${city.locationSeo}`;

  const handlePortraitError = (event) => {
    event.currentTarget.hidden = true;
    event.currentTarget.parentElement?.classList.add('hero-portrait__media--fallback');
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <Container className="hero__layout">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            Паспорт безопасности объекта
          </p>

          <h1 id="hero-title" className="hero__title">
            <span>Разработка и согласование</span>
            <span>
              {heroLocationPhrase
                ? 'паспорта безопасности'
                : 'паспорта безопасности объекта'}
            </span>
            {heroLocationPhrase ? (
              <span className="hero__title-location">
                {heroLocationPhrase}
              </span>
            ) : null}
          </h1>

          <p className="hero__lead">
            {heroLocationPhrase
              ? 'Разработаем паспорт безопасности объекта и сопроводим его согласование.'
              : 'Категорирование, разработка паспорта и сопровождение согласования по России.'}
          </p>

          <div
            className="hero__price-card"
            aria-label="Стоимость разработки паспорта безопасности"
          >
            <span className="hero__price-label">
              Разработка паспорта
            </span>

            <strong className="hero__price-value">
              9 500 ₽
            </strong>
          </div>

          <ul className="hero__benefits" aria-label="Преимущества услуги">
            <li>Под ключ</li>
            <li>Для объектов разных категорий</li>
            <li>С сопровождением согласования</li>
          </ul>

          <div className="hero__actions" aria-label="Основные действия">
            <a className="button button--primary hero__primary-action" href="#lead-form">
              Рассчитать стоимость
              <span aria-hidden="true">↗</span>
            </a>
            <a className="button button--ghost hero__secondary-action" href="#quiz">
              Пройти экспресс-проверку
              <span className="hero__quiz-count" aria-hidden="true">6 шагов</span>
            </a>
          </div>
        </div>

        <figure className="hero-portrait">
          <div className="hero-portrait__frame" aria-hidden="true" />
          <div className="hero-portrait__orb hero-portrait__orb--large" aria-hidden="true" />
          <div className="hero-portrait__orb hero-portrait__orb--outline" aria-hidden="true" />
          <div className="hero-portrait__dots" aria-hidden="true" />

          <div className="hero-portrait__media">
            <span className="hero-portrait__fallback" aria-hidden="true">
              НБ
            </span>
            <img
              src="/images/nikolay-boykov-hero.webp"
              srcSet="/images/nikolay-boykov-hero-560.webp 560w, /images/nikolay-boykov-hero-800.webp 800w, /images/nikolay-boykov-hero.webp 930w"
              sizes="(max-width: 620px) 90vw, (max-width: 900px) 82vw, 470px"
              alt="Николай Бойков, руководитель БОЙКОВГРУПП"
              width="930"
              height="1400"
              decoding="async"
              onError={handlePortraitError}
            />
          </div>

          <figcaption className="hero-portrait__caption">
            <span className="hero-portrait__accent" aria-hidden="true" />
            <span className="hero-portrait__caption-copy">
              <span className="hero-portrait__name">Николай Бойков</span>
              <span className="hero-portrait__role">Руководитель БОЙКОВГРУПП</span>
              <span className="hero-portrait__meta">Эксперт по комплексной безопасности</span>
            </span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
