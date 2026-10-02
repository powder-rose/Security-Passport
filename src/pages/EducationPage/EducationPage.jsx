import './EducationPage.css';

import {
  getRegionalWorkText,
} from './educationRegion';

import {
  educationSourceData,
  educationPassportStructure,
  educationActualizationReasons,
  educationAudienceItems,
  educationFaqItems,
} from './educationPageData';

import EducationHeroAndObjects
from './components/EducationHeroAndObjects';

import EducationRegulation
from './components/EducationRegulation';


import EducationCategories
from './components/EducationCategories';

import EducationPassportProcess
from './components/EducationPassportProcess';

import EducationApproval
from './components/EducationApproval';


import EducationPassportCopies
from './components/EducationPassportCopies';

import EducationRestrictedDocuments
from './components/EducationRestrictedDocuments';

import EducationServiceScope
from './components/EducationServiceScope';

import EducationPricing
from './components/EducationPricing';
import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


// EDUCATION_STAGE_2_V1:start


// EDUCATION_STAGE_2_V1:end


// EDUCATION_STAGE_3_V1:start


// EDUCATION_STAGE_3_V1:end


// EDUCATION_STAGE_4_V1:start


// EDUCATION_STAGE_4_V1:end


// EDUCATION_STAGE_5_V1:start


// EDUCATION_STAGE_5_V1:end


export default function EducationPage({
  objectType,
}) {
  const city =
    useCity();

  const regionalWorkText =
    getRegionalWorkText(
      city,
    );


  return (
    <main
      id="main-content"
      className="education-page"
    >
      <EducationHeroAndObjects
        objectType={objectType}
        regionalWorkText={regionalWorkText}
      />

      <EducationRegulation />


      {/* EDUCATION_STAGE_2_V1:sections */}

      <EducationCategories />

      <EducationPassportProcess />

      <EducationApproval />

      {/* EDUCATION_STAGE_3_V1:sections */}

      <EducationPassportCopies />

      <EducationRestrictedDocuments />

      <EducationServiceScope />

      <EducationPricing />

      {/* EDUCATION_STAGE_4_V1:sections */}

      <section className="education-source-data">
        <Container>
          <div className="education-source-data__layout">
            <div className="education-source-data__heading">
              <p className="education-kicker">
                Исходные данные
              </p>

              <h2>
                Что желательно подготовить
                образовательной организации
              </h2>

              <p>
                На старте нужны основные сведения,
                позволяющие определить применимые
                требования и понять текущее состояние
                документов по объекту.
              </p>


              <aside className="education-source-data__note">
                <span aria-hidden="true">
                  ✓
                </span>

                <p>
                  Точный перечень уточняем после
                  идентификации конкретного объекта
                  и его нормативного режима.
                </p>
              </aside>
            </div>


            <ol className="education-source-data__list">
              {educationSourceData.map(
                (item) => (
                  <li
                    className="education-source-data__item"
                    key={item.number}
                  >
                    <span>
                      {item.number}
                    </span>

                    <div>
                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.text}
                      </p>
                    </div>
                  </li>
                ),
              )}
            </ol>
          </div>
        </Container>
      </section>


      <section className="education-form">
        <Container>
          <div className="education-form__header">
            <div>
              <p className="education-kicker">
                Форма и образец
              </p>

              <h2>
                Форма паспорта безопасности
                образовательной организации
              </h2>
            </div>

            <p>
              ПП РФ №1006 содержит утверждённую
              форму паспорта для объектов,
              подпадающих под этот нормативный режим.
            </p>
          </div>


          <div className="education-form__layout">
            <div className="education-form__intro">
              <span className="education-form__index">
                08
              </span>

              <h3>
                Основные разделы
                формы паспорта
              </h3>

              <p>
                Показываем структуру документа
                и поясняем состав сведений.
                Заполненный паспорт конкретного
                клиента публично не размещаем.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Получить форму паспорта
              </a>
            </div>


            <ol className="education-form__structure">
              {educationPassportStructure.map(
                (item, index) => (
                  <li key={item}>
                    <span>
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
        </Container>
      </section>


      <section className="education-actualization">
        <Container>
          <div className="education-actualization__header">
            <div>
              <p className="education-kicker">
                Актуализация по №1006
              </p>

              <h2>
                Как часто актуализируется
                паспорт образовательной организации
              </h2>
            </div>


            <div className="education-actualization__period">
              <span>
                Не реже
              </span>

              <strong>
                1 раз
                <small>
                  в 5 лет
                </small>
              </strong>
            </div>
          </div>


          <div className="education-actualization__body">
            <div>
              <h3>
                Также актуализация проводится
                при изменении
              </h3>

              <div className="education-actualization__reasons">
                {educationActualizationReasons.map(
                  (item) => (
                    <article
                      className="education-actualization__reason"
                      key={item.number}
                    >
                      <span>
                        {item.number}
                      </span>

                      <p>
                        {item.title}
                      </p>
                    </article>
                  ),
                )}
              </div>
            </div>


            <aside className="education-actualization__aside">
              <p className="education-actualization__aside-kicker">
                После актуализации
              </p>

              <h3>
                Изменения должны быть отражены
                во всех экземплярах
              </h3>

              <p>
                Изменения прилагаются ко всем
                экземплярам паспорта с указанием
                причины и даты их внесения.
              </p>

              <div className="education-actualization__storage">
                <strong>
                  Ещё 5 лет
                </strong>

                <p>
                  хранится на объекте паспорт,
                  который был заменён
                  по результатам актуализации.
                </p>
              </div>
            </aside>
          </div>


          <div className="education-actualization__footer">
            <p>
              Для объекта, подпадающего под другой
              нормативный режим, основания и порядок
              актуализации проверяются отдельно.
            </p>

            <a
              className="education-text-link"
              href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
            >
              Подробнее об актуализации
              паспорта безопасности

              <span aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </Container>
      </section>


      {/* EDUCATION_STAGE_5_V1:sections */}

      <section className="education-audience">
        <Container>
          <div className="education-audience__header">
            <div>
              <p className="education-kicker">
                Образовательные объекты
              </p>

              <h2>
                Паспорт безопасности
                школы и детского сада
              </h2>
            </div>

            <p>
              Для школы, детского сада, колледжа
              и иной образовательной организации
              сначала определяется нормативный режим
              конкретного объекта, после чего проводится
              категорирование и оформляется
              предусмотренный комплект документов.
            </p>
          </div>


          <div className="education-audience__list">
            {educationAudienceItems.map(
              (item) => (
                <article
                  className="education-audience__item"
                  key={item.number}
                >
                  <span>
                    {item.number}
                  </span>

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
        </Container>
      </section>


      <section className="education-current">
        <Container>
          <div className="education-current__layout">
            <div className="education-current__year">
              <span>
                Актуально
              </span>

              <strong>
                2026
              </strong>
            </div>


            <div className="education-current__content">
              <p className="education-kicker">
                Действующие требования
              </p>

              <h2>
                Что учитываем
                при разработке в 2026 году
              </h2>

              <p className="education-current__lead">
                Информация на странице актуальна
                на 2026 год. Перед началом работы
                проверяем действующую редакцию
                требований для конкретного
                образовательного объекта.
              </p>


              <div className="education-current__standard">
                <div>
                  <span>
                    С 1 мая 2026 года
                  </span>

                  <h3>
                    ГОСТ Р 72551-2026
                  </h3>
                </div>

                <p>
                  Стандарт устанавливает общие требования
                  к услугам по категорированию объектов
                  и разработке паспортов безопасности.
                  При этом обязательный нормативный режим
                  образовательного объекта определяется
                  соответствующим применимым актом —
                  №1006, №1421 либо иным требованием.
                </p>
              </div>


              <aside className="education-current__notice">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  Проекты будущих изменений
                  не используем как действующие нормы.
                  Перед подготовкой документов
                  проверяется актуальная редакция
                  обязательных требований.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


      <section className="education-related">
        <Container>
          <div className="education-related__header">
            <p className="education-kicker">
              Связанные материалы
            </p>

            <h2>
              Документы и этапы,
              связанные с паспортом
            </h2>
          </div>


          <nav
            className="education-related__links"
            aria-label="Связанные услуги"
          >
            <a href="/">
              <span>
                Паспорт безопасности объекта
              </span>

              <span aria-hidden="true">
                ↗
              </span>
            </a>

            <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
              <span>
                Акт обследования и категорирования
              </span>

              <span aria-hidden="true">
                ↗
              </span>
            </a>

            <a href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
              <span>
                Актуализация паспорта безопасности
              </span>

              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </nav>
        </Container>
      </section>


      <section
        className="education-faq"
        id="education-faq"
      >
        <Container>
          <div className="education-faq__layout">
            <div className="education-faq__heading">
              <div>
                <p className="education-kicker">
                  Вопросы и ответы
                </p>

                <h2>
                  Частые вопросы
                  о паспорте безопасности
                  образовательной организации
                </h2>
              </div>

              <p>
                Ответы о применимом постановлении,
                категорировании, согласовании,
                экземплярах, стоимости,
                форме и актуализации.
              </p>
            </div>


            <div className="education-faq__list">
              {educationFaqItems.map(
                (item, index) => (
                  <details
                    className="education-faq__item"
                    key={item.question}
                  >
                    <summary>
                      <span className="education-faq__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="education-faq__question">
                        {item.question}
                      </span>

                      <span
                        className="education-faq__toggle"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>

                    <div className="education-faq__answer">
                      <p>
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>


      <FinalCTA />
</main>
  );
}
