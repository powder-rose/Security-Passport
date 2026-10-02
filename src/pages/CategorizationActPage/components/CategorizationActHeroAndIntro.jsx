import Container
from '../../../components/ui/Container/Container';


export default function CategorizationActHeroAndIntro() {
  return (
    <>
      <section className="categorization-act-hero">
        <Container>
          <nav
            className="categorization-act-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Акт обследования и категорирования объекта
            </span>
          </nav>


          <div className="categorization-act-hero__layout">
            <div className="categorization-act-hero__content">
              <p className="categorization-act-kicker">
                Документы по антитеррористической защищённости
              </p>

              <h1>
                Акт обследования и категорирования объекта
              </h1>

              <p className="categorization-act-hero__lead">
                Подготовим документы для работы комиссии,
                определим применимые требования и оформим
                проект акта по результатам обследования
                и категорирования.
                {' '}
                <span className="coverage-emphasis">Работаем по всей России</span>.
              </p>


              <div className="categorization-act-hero__price-row">
                <div>
                  <strong>
                    9 500 ₽
                  </strong>

                  <span>
                    подготовка документации
                    для одного объекта
                  </span>
                </div>

                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Заказать акт
                </a>
              </div>


              <a
                className="categorization-act-hero__check"
                href="#who-needs-act"
              >
                Проверить, нужно ли категорирование
                <span aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>


            <figure
              className="categorization-act-expert-visual"
              aria-label="Николай Бойков, эксперт БОЙКОВГРУПП"
            >
              <img
                src="/images/nikolay-boykov-hero.webp"
                srcSet="/images/nikolay-boykov-hero-560.webp 560w, /images/nikolay-boykov-hero-800.webp 800w, /images/nikolay-boykov-hero.webp 930w"
                sizes="(max-width: 760px) 88vw, (max-width: 1100px) 480px, 380px"
                alt="Николай Бойков, руководитель БОЙКОВГРУПП"
                width="930"
                height="1400"
                decoding="async"
              />

              <figcaption className="categorization-act-expert-visual__caption">
                <span
                  className="categorization-act-expert-visual__caption-dot"
                  aria-hidden="true"
                />

                <span>
                  <strong>
                    Николай Бойков
                  </strong>

                  <small>
                    Руководитель БОЙКОВГРУПП
                  </small>
                </span>
              </figcaption>
            </figure>
          </div>


          <div className="categorization-act-hero__facts">
            <div>
              <span>
                01
              </span>

              <p>
                Подготавливаем проект акта
              </p>
            </div>

            <div>
              <span>
                02
              </span>

              <p>
                Учитываем тип объекта
                и нормативный режим
              </p>
            </div>

            <div>
              <span>
                03
              </span>

              <p>
                Готовим материалы
                для работы комиссии
              </p>
            </div>
          </div>
        </Container>
      </section>


      <section className="categorization-act-intro">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Суть документа
            </p>

            <h2>
              Что такое акт обследования и категорирования объекта
            </h2>
          </div>

          <div className="categorization-act-intro__text">
            <p>
              Категорирование проводится для определения
              требований к антитеррористической
              защищённости конкретного объекта с учётом
              установленных критериев, возможных
              последствий террористического акта и
              фактического состояния защищённости.
            </p>

            <p>
              Результаты работы комиссии оформляются
              актом обследования и категорирования либо
              актом категорирования. Конкретное
              наименование, форма и содержание документа
              зависят от требований, распространяющихся
              на соответствующий тип объекта.
            </p>

            <p>
              В предусмотренных нормативными требованиями
              случаях результаты категорирования
              используются при последующей разработке
              паспорта безопасности объекта.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
