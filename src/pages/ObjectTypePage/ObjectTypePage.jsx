import Container from '../../components/ui/Container/Container';

import ObjectQuiz from '../../sections/ObjectQuiz/ObjectQuiz';
import Process from '../../sections/Process/Process';
import Advantages from '../../sections/Advantages/Advantages';
import Prices from '../../sections/Prices/Prices';
import RequiredDocuments from '../../sections/RequiredDocuments/RequiredDocuments';
import Expert from '../../sections/Expert/Expert';
import FAQ from '../../sections/FAQ/FAQ';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

import {
  getObjectTypeLegalContent,
} from '../../data/objectTypeLegalContent';

import {
  useCity,
} from '../../context/GeoContext';



function getLocationText(city) {
  if (
    city.isDefault ||
    city.type === 'country'
  ) {
    return 'по России';
  }

  if (
    city.hasTrustedInflection &&
    !city.seoNeedsSubject
  ) {
    return city.locationPhrase;
  }

  return `в регионе: ${city.locationSeo}`;
}


function LegalGuide({
  content,
}) {
  if (!content) {
    return null;
  }

  return (
    <section
      className="object-legal"
      aria-labelledby="object-legal-title"
    >
      <Container>
        <div className="object-legal__head">
          <p className="object-legal__kicker">
            Нормативная база и практика
          </p>

          <h2 id="object-legal-title">
            {content.heading}
          </h2>

          <p className="object-legal__intro">
            {content.intro}
          </p>
        </div>


        <div className="object-legal__sources">
          {content.sources.map(
            (source) => (
              <div
                className="object-legal__source"
                key={source.title}
              >
                <span className="object-legal__source-label">
                  Нормативная основа
                </span>

                <strong>
                  {source.title}
                </strong>

                {source.subtitle ? (
                  <span className="object-legal__source-description">
                    {source.subtitle}
                  </span>
                ) : null}

                <small>
                  {source.edition}
                </small>
              </div>
            ),
          )}
        </div>


        <div className="object-legal__details">
          {content.details.map(
            (item) => (
              <article
                className="object-legal__detail"
                key={item.title}
              >
                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>
              </article>
            ),
          )}
        </div>


        <aside className="object-legal__important">
          <div className="object-legal__important-mark">
            Важно
          </div>

          <div>
            <h3>
              {content.importantTitle}
            </h3>

            <p>
              {content.importantText}
            </p>
          </div>
        </aside>


        <div className="object-legal__checklist">
          <div className="object-legal__checklist-head">
            <p className="object-legal__kicker">
              Подготовка исходных данных
            </p>

            <h2>
              {content.checklistTitle}
            </h2>

            <p>
              Не нужно собирать всё подряд.
              На старте достаточно основных сведений,
              чтобы определить применимые требования
              и дальнейший порядок работы.
            </p>

            <div className="object-legal__checklist-note">
              <span aria-hidden="true">✓</span>

              <p>
                Точный перечень уточняем после
                идентификации конкретного объекта.
              </p>
            </div>
          </div>

          <ol className="object-legal__checklist-list">
            {content.checklist.map(
              (item, index) => (
                <li key={item}>
                  <span className="object-legal__checklist-number">
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </span>

                  <p>
                    {item}
                  </p>
                </li>
              ),
            )}
          </ol>
        </div>


        <p className="object-legal__public-note">
          На этой странице приведена открытая
          нормативная и организационная информация.
          Сведения ограниченного распространения,
          содержащиеся в конкретном паспорте
          безопасности объекта, публично
          не размещаются.
        </p>
      </Container>
    </section>
  );
}


export default function ObjectTypePage({
  objectType,
}) {
  const city =
    useCity();

  const locationText =
    getLocationText(city);

  const legalContent =
    getObjectTypeLegalContent(
      objectType.id,
    );


  return (
    <main
      id="main-content"
      className="object-service-page"
    >
      <section className="object-service-hero">
        <Container>
          <nav
            className="object-service-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              {objectType.title}
            </span>
          </nav>


          <div className="object-service-hero__grid">
            <div className="object-service-hero__copy">
              <p className="object-service-hero__kicker">
                Паспорт безопасности объекта
              </p>

              <h1>
                {objectType.h1}
              </h1>

              <p className="object-service-hero__lead">
                {objectType.pageLead}{' '}
                Работаем {locationText}.
              </p>

              <p className="object-service-hero__price">
                Разработка паспорта — от 9 500 ₽
              </p>

              <div className="object-service-hero__actions">
                <a
                  className="button button--primary"
                  href="#quiz"
                >
                  Проверить, нужен ли паспорт вашему объекту
                </a>

                <a
                  className="object-service-hero__back"
                  href="#lead-form"
                >
                  Рассчитать стоимость
                  <span aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>


            <aside className="object-service-hero__card">
              <p className="object-service-hero__card-label">
                Для каких объектов
              </p>

              <h2>
                {objectType.title}
              </h2>

              <p>
                {objectType.description}
              </p>
            </aside>
          </div>
        </Container>
      </section>


      <section className="object-service-scope">
        <Container>
          <div className="object-service-scope__head">
            <p className="object-service-scope__kicker">
              Что входит в работу
            </p>

            <h2>
              От правовой идентификации объекта
              до сопровождения согласования
            </h2>

            <p>
              Сначала определяем, какие именно
              требования Правительства РФ применяются
              к объекту. Затем анализируем исходные
              данные, участвуем в подготовке материалов
              для категорирования и разрабатываем
              паспорт по действующей форме.
            </p>
          </div>


          <div className="object-service-scope__grid">
            <article>
              <span>
                01
              </span>

              <h3>
                Определяем нормативный акт
              </h3>

              <p>
                Проверяем назначение объекта,
                правообладателя, ведомственную
                принадлежность и специальные
                исключения.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Категорирование объекта
              </h3>

              <p>
                Готовим исходные сведения для
                обследования и оформления результатов
                работы комиссии.
              </p>
            </article>

            <article>
              <span>
                03
              </span>

              <h3>
                Разработка паспорта
              </h3>

              <p>
                Формируем документ по форме именно
                того постановления, которое
                распространяется на объект.
              </p>
            </article>

            <article>
              <span>
                04
              </span>

              <h3>
                Сопровождение согласования
              </h3>

              <p>
                Помогаем пройти предусмотренный
                для конкретного вида объекта
                порядок согласования документа.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <ObjectQuiz
        presetObjectType={
          objectType.quizOption
        }
      />


      <LegalGuide
        content={legalContent}
      />

      <Process />
      <Advantages />
      <Prices />
      <RequiredDocuments />
      <Expert />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
