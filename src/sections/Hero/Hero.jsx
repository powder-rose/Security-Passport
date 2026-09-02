import Container from '../../components/ui/Container/Container';
import { CITY } from '../../config/city';
import './Hero.css';

export default function Hero() {
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
            <span>паспорта безопасности</span>
            <span className="hero__title-location">в {CITY.namePrepositional}</span>
          </h1>

          <p className="hero__lead">
            Разработаем паспорт безопасности объекта и сопроводим его согласование.
          </p>

          <ul className="hero__benefits" aria-label="Преимущества услуги">
            <li>Под ключ</li>
            <li>Для объектов разных категорий</li>
            <li>С сопровождением согласования</li>
          </ul>

          <div className="hero__actions" aria-label="Основные действия">
            <a className="button button--primary hero__primary-action" href="#contact">
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
              alt="Николай Бойков, руководитель БОЙКОВГРУПП"
              width="930"
              height="1400"
              fetchPriority="high"
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
