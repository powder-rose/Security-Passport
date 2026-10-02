import './HotelPage.css';

import {
  getRegionalWorkText,
} from './hotelRegion';

import {
  hotelUpdatePeriod,
  hotelUpdateDeadline,
  hotelWhyItems,
  hotelFaqItems,
  hotelFormStructure,
  hotelActualizationReasons,
  hotelAccommodationTypes,
} from './hotelPageData';

import HotelHeroAndApplicability
from './components/HotelHeroAndApplicability';

import HotelRegulation
from './components/HotelRegulation';


import HotelCategories
from './components/HotelCategories';

import HotelPassportProcess
from './components/HotelPassportProcess';

import HotelApproval
from './components/HotelApproval';


import HotelServiceScope
from './components/HotelServiceScope';

import HotelPricing
from './components/HotelPricing';

import HotelRequiredDocuments
from './components/HotelRequiredDocuments';
import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';

export default function HotelPage({
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
      className="hotel-page"
    >
      <HotelHeroAndApplicability
        objectType={objectType}
        regionalWorkText={regionalWorkText}
      />

      <HotelRegulation />


      <HotelCategories />

      <HotelPassportProcess />

      <HotelApproval />


      <HotelServiceScope />

      <HotelPricing />

      <HotelRequiredDocuments />


      <section
        className="hotel-form"
        id="hotel-form"
      >
        <Container>
          <div className="hotel-form__layout">
            <div className="hotel-form__copy">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Форма документа
                </p>

                <h2>
                  Форма и образец паспорта
                  безопасности гостиницы
                </h2>
              </div>

              <p className="hotel-form__lead">
                Форма паспорта безопасности гостиницы
                или иного средства размещения утверждена
                Постановлением Правительства РФ от 13.04.2017 №447.
              </p>

              <p>
                На странице мы показываем структуру
                документа без публикации заполненного
                паспорта действующего объекта.
              </p>

              <a
                className="hotel-form__action"
                href="#contact"
              >
                Получить образец формы

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>

            <div
              className="hotel-form__document"
              aria-label="Структура паспорта безопасности гостиницы"
            >
              <div className="hotel-form__document-top">
                <span>
                  Постановление Правительства РФ от 13.04.2017 №447
                </span>

                <strong>
                  Паспорт безопасности
                </strong>
              </div>

              <ol className="hotel-form__structure">
                {hotelFormStructure.map(
                  (item, index) => (
                    <li key={item}>
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <p>
                        {item}
                      </p>
                    </li>
                  ),
                )}
              </ol>

              <div className="hotel-form__document-note">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  Конкретное содержание оформляется
                  по официальной форме и исходным
                  сведениям конкретной гостиницы.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="hotel-actualization"
        id="hotel-actualization"
      >
        <Container>
          <div className="hotel-actualization__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">
                Действующий паспорт
              </p>

              <h2>
                Когда нужно актуализировать
                паспорт гостиницы
              </h2>
            </div>

            <div className="hotel-actualization__deadline">
              <strong>
                {hotelUpdateDeadline}
              </strong>

              <p>
                со дня возникновения обстоятельства,
                являющегося основанием для актуализации
              </p>
            </div>
          </div>

          <div className="hotel-actualization__grid">
            {hotelActualizationReasons.map(
              (item, index) => (
                <article
                  className="hotel-actualization__item"
                  key={item.title}
                >
                  <span>
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      '0',
                    )}
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

          <div className="hotel-actualization__footer">
            <p>
              Постановление Правительства РФ от 13.04.2017 №447 также предусматривает
              периодическую актуализацию паспорта
              безопасности гостиницы не реже
              одного раза в {hotelUpdatePeriod}.
            </p>

            <a
              className="hotel-inline-link"
              href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
            >
              Подробнее об актуализации
              паспорта безопасности

              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </Container>
      </section>


      <section
        className="hotel-accommodation"
        id="hotel-accommodation"
      >
        <Container>
          <div className="hotel-accommodation__layout">
            <div className="hotel-accommodation__copy">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Средства размещения
                </p>

                <h2>
                  Для каких средств размещения
                  разрабатываем паспорта
                </h2>
              </div>

              <p>
                Проверяем применимость требований
                для гостиниц и иных средств размещения
                с учётом фактического назначения
                объекта и его нормативного статуса.
              </p>
            </div>

            <div className="hotel-accommodation__types">
              {hotelAccommodationTypes.map(
                (item) => (
                  <div
                    className="hotel-accommodation__type"
                    key={item.title}
                  >
                    <span>
                      {item.number}
                    </span>

                    <strong>
                      {item.title}
                    </strong>

                    <span
                      className="hotel-accommodation__mark"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <aside className="hotel-accommodation__note">
            <span aria-hidden="true">
              ✓
            </span>

            <p>
              Название объекта само по себе
              не определяет нормативный режим.
              Перед разработкой документации
              проверяем применимые требования.
            </p>
          </aside>
        </Container>
      </section>


      <section
        className="hotel-standard"
        id="hotel-standard"
      >
        <Container>
          <div className="hotel-standard__panel">
            <div className="hotel-standard__number">
              <span>
                Действует с
              </span>

              <strong>
                01.05.2026
              </strong>
            </div>

            <div className="hotel-standard__content">
              <p className="hotel-kicker">
                Требования 2026 года
              </p>

              <h2>
                ГОСТ Р 72551-2026
              </h2>

              <p className="hotel-standard__lead">
                Национальный стандарт устанавливает
                общие требования к услугам
                по категорированию объектов
                и разработке паспортов безопасности
                объектов, для которых установлены
                обязательные требования
                к антитеррористической защищённости.
              </p>

              <div className="hotel-standard__distinction">
                <span>
                  Важно
                </span>

                <p>
                  ГОСТ устанавливает общие требования
                  к оказанию услуги. Порядок
                  категорирования конкретной гостиницы
                  и форма её паспорта определяются
                  применимыми обязательными
                  требованиями, включая Постановление Правительства РФ от 13.04.2017 №447.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="hotel-why"
        id="hotel-why"
      >
        <Container>
          <div className="hotel-why__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">
                Подход к работе
              </p>

              <h2>
                Почему БОЙКОВГРУПП
              </h2>
            </div>

            <p>
              Для гостиницы важно не просто заполнить
              форму, а правильно пройти всю
              последовательность: определить
              применимые требования, провести
              категорирование и подготовить паспорт
              к предусмотренному согласованию.
            </p>
          </div>

          <div className="hotel-why__grid">
            {hotelWhyItems.map(
              (item) => (
                <article
                  className="hotel-why__item"
                  key={item.number}
                >
                  <span className="hotel-why__number">
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
                </article>
              ),
            )}
          </div>
        </Container>
      </section>


      <section
        className="hotel-faq"
        id="hotel-faq"
      >
        <Container>
          <div className="hotel-faq__layout">
            <div className="hotel-faq__heading">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Вопросы и ответы
                </p>

                <h2>
                  Частые вопросы
                  о паспорте безопасности гостиницы
                </h2>
              </div>

              <p>
                Коротко отвечаем на вопросы
                о Постановлении Правительства РФ от 13.04.2017 №447, категорировании,
                согласовании, стоимости, форме
                и актуализации паспорта.
              </p>
            </div>

            <div className="hotel-faq__list">
              {hotelFaqItems.map(
                (item, index) => (
                  <details
                    className="hotel-faq__item"
                    key={item.question}
                  >
                    <summary>
                      <span className="hotel-faq__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="hotel-faq__question">
                        {item.question}
                      </span>

                      <span
                        className="hotel-faq__toggle"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>

                    <div className="hotel-faq__answer">
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
