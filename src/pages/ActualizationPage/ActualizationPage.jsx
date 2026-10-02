import './ActualizationPage.css';

import {
  getLocationText,
} from './actualizationRegion';

import useActualizationTimeline
from './useActualizationTimeline';

import {
  triggerRows,
  checklistItems,
  processItems,
  scopeItems,
  documentItems,
  periodicityItems,
  objectTypes,
  faqItems,
} from './actualizationPageData';

import Container from '../../components/ui/Container/Container';

import Expert from '../../sections/Expert/Expert';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

import {
  useCity,
} from '../../context/GeoContext';


export default function ActualizationPage() {
  const city =
    useCity();

  const locationText =
    getLocationText(city);


  useActualizationTimeline();


  return (
    <main
      id="main-content"
      className="actualization-page"
    >
      <section className="actualization-hero">
        <Container>
          <nav
            className="actualization-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Актуализация паспорта
            </span>
          </nav>


          <div className="actualization-hero__grid">
            <div className="actualization-hero__copy">
              <p className="actualization-kicker">
                Проверка действующего документа
              </p>

              <h1>
                Актуализация паспорта безопасности объекта
              </h1>

              <p className="actualization-hero__lead">
                Проверим действующий паспорт безопасности,
                определим основания и порядок его
                актуализации по требованиям, применимым
                к вашему объекту. Подготовим изменения
                либо новую редакцию документа.
                {' '}
                <span className="coverage-emphasis">Работаем по всей России</span>.
              </p>


              <ul className="actualization-hero__benefits">
                <li>
                  Определим, действительно ли требуется актуализация
                </li>

                <li>
                  Проверим необходимость повторного категорирования
                </li>

                <li>
                  Учтём требования именно для вашего типа объекта
                </li>
              </ul>


              <div className="actualization-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Проверить паспорт
                </a>

                <a
                  className="actualization-hero__secondary"
                  href="#lead-form"
                >
                  Заказать актуализацию
                  <span aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </div>


            <aside className="actualization-hero__note">
              <span>
                Важно
              </span>

              <h2>
                Актуализация — не просто замена даты
              </h2>

              <p>
                Сначала определяем нормативный режим
                объекта, проверяем действующий паспорт
                и выясняем, какой порядок внесения
                изменений применяется именно в вашем
                случае.
              </p>
            </aside>
          </div>
        </Container>
      </section>


      <section className="actualization-definition">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Что это значит
            </p>

            <h2>
              Что такое актуализация паспорта безопасности
            </h2>

            <p>
              Актуализация — это приведение действующего
              паспорта безопасности в соответствие
              с текущими характеристиками объекта
              и применимыми требованиями.
            </p>
          </div>


          <div className="actualization-definition__paths">
            <article>
              <span>
                01
              </span>

              <h3>
                Внесение изменений
              </h3>

              <p>
                В предусмотренных случаях необходимые
                сведения могут быть изменены
                в существующем документе.
              </p>
            </article>

            <div
              className="actualization-definition__or"
              aria-hidden="true"
            >
              или
            </div>

            <article>
              <span>
                02
              </span>

              <h3>
                Новая редакция паспорта
              </h3>

              <p>
                Если применимый порядок этого требует,
                может потребоваться переработка
                документа или подготовка новой редакции.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section
        className="actualization-reasons"
        id="when-update"
      >
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Сроки, основания и причины
            </p>

            <h2>
              Когда требуется актуализация паспорта безопасности
            </h2>

            <p>
              Конкретные основания зависят от вида
              объекта и требований, по которым
              разработан его паспорт.
            </p>
          </div>


          <div
            className="actualization-reasons-table"
            role="table"
            aria-label="Основания для проверки актуальности паспорта"
          >
            <div
              className="actualization-reasons-table__head"
              role="row"
            >
              <span role="columnheader">
                Что изменилось
              </span>

              <span role="columnheader">
                Может потребоваться актуализация
              </span>
            </div>

            {triggerRows.map(
              (item) => (
                <div
                  className="actualization-reasons-table__row"
                  role="row"
                  key={item.change}
                >
                  <span role="cell">
                    {item.change}
                  </span>

                  <strong role="cell">
                    {item.result}
                  </strong>
                </div>
              ),
            )}
          </div>


          <aside className="actualization-reasons__notice">
            <strong>
              Основания и сроки актуализации зависят
              от вида объекта и нормативного акта,
              который устанавливает требования
              к его антитеррористической защищённости.
            </strong>

            <p>
              Поэтому мы не просто меняем дату
              в паспорте — сначала определяем
              применимые требования.
            </p>
          </aside>
        </Container>
      </section>


      <section className="actualization-checklist">
        <Container>
          <div className="actualization-checklist__layout">
            <div>
              <p className="actualization-kicker">
                Быстрая самопроверка
              </p>

              <h2>
                Как понять, нужно ли актуализировать ваш паспорт
              </h2>

              <p>
                Проверьте документ, если после
                его разработки произошло хотя бы
                одно из перечисленных изменений.
              </p>

              <a
                className="button button--primary actualization-check-button"
                href="#lead-form"
              >
              <span className="actualization-check-button__label">
                Отправить паспорт на проверку
              </span>

              <span
                className="actualization-check-button__arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
            </div>


            <ul className="actualization-checklist__items">
              {checklistItems.map(
                (item, index) => (
                  <li key={item}>
                    <span aria-hidden="true">
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
            </ul>
          </div>
        </Container>
      </section>


      <section className="actualization-category">
        <Container>
          <div className="actualization-category__panel">
            <div>
              <p className="actualization-kicker">
                Важный вопрос
              </p>

              <h2>
                Всегда ли нужно заново проводить категорирование?
              </h2>
            </div>

            <div className="actualization-category__answer">
              <strong>
                Нет, не всегда.
              </strong>

              <p>
                Это зависит от основания актуализации
                и требований для конкретного объекта.
                При одних изменениях может потребоваться
                подтверждение или изменение категории,
                при других — изменения могут оформляться
                без полной процедуры повторного
                категорирования.
              </p>

              <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
                Подробнее об обследовании и категорировании
                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>


      <section className="actualization-work">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Порядок работы
            </p>

            <h2>
              Как мы актуализируем паспорт безопасности
            </h2>
          </div>


          <ol className="actualization-work__timeline">
            {processItems.map(
              (item, index) => (
                <li key={item.title}>
                  <span className="actualization-work__number">
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
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
        </Container>
      </section>


      <section className="actualization-scope">
        <Container>
          <div className="actualization-scope__layout">
            <div>
              <p className="actualization-kicker">
                Состав работы
              </p>

              <h2>
                Что мы сделаем
              </h2>

              <p>
                Состав действий определяем после
                проверки паспорта и требований
                к конкретному виду объекта.
              </p>
            </div>


            <ul className="actualization-scope__list">
              {scopeItems.map(
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
            </ul>
          </div>
        </Container>
      </section>


      <section
        className="actualization-price"
        id="actualization-price"
      >
        <Container>
          <div className="actualization-price__panel">
            <div className="actualization-price__heading">
              <p className="actualization-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость актуализации паспорта безопасности
              </h2>

              <p className="actualization-price__intro">
                Состав работ определяем после проверки
                действующего паспорта и изменений
                на объекте.
              </p>
            </div>


            <aside className="actualization-price__card">
              <p className="actualization-price__card-label">
                На расчёт влияют
              </p>

              <div className="actualization-price__factor">
                <span>
                  01
                </span>

                <div>
                  <strong>
                    Объём необходимых изменений
                  </strong>

                  <p>
                    Проверяем, какие сведения
                    действующего паспорта требуется
                    актуализировать.
                  </p>
                </div>
              </div>


              <div className="actualization-price__factor">
                <span>
                  02
                </span>

                <div>
                  <strong>
                    Повторное категорирование
                  </strong>

                  <p>
                    Отдельно определяем, требуется ли
                    оно для конкретного объекта.
                  </p>
                </div>
              </div>


              <a
                className="actualization-price__action"
                href="#lead-form"
              >
                Уточнить стоимость

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </aside>
          </div>
        </Container>
      </section>


      <section className="actualization-documents">
        <Container>
          <div className="actualization-documents__grid">
            <div>
              <p className="actualization-kicker">
                Для первичной проверки
              </p>

              <h2>
                Что потребуется для актуализации
              </h2>

              <p>
                Сначала достаточно действующего
                паспорта и основных сведений.
                Дополнительный комплект определяем
                после проверки применимых требований.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Отправить паспорт на предварительную проверку
              </a>
            </div>


            <ol>
              {documentItems.map(
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


      <section className="actualization-periods">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Периодичность
            </p>

            <h2>
              Как часто нужно актуализировать паспорт безопасности
            </h2>

            <p>
              Единого срока для всех паспортов
              безопасности нет. Периодичность
              устанавливается требованиями
              для конкретного вида объекта.
            </p>
          </div>


          <div className="actualization-periods__summary">
            <article>
              <strong>
                3 года
              </strong>

              <p>
                Такой срок предусмотрен
                для отдельных видов объектов.
              </p>
            </article>

            <article>
              <strong>
                5 лет
              </strong>

              <p>
                Для других видов объектов
                действует иная периодичность.
              </p>
            </article>

            <article>
              <strong>
                Внепланово
              </strong>

              <p>
                Актуализация также может требоваться
                при предусмотренных нормативными
                требованиями изменениях.
              </p>
            </article>
          </div>


          <div className="actualization-periods__list">
            {periodicityItems.map(
              (item, index) => (
                <article
                  className="actualization-period"
                  key={item.type}
                >
                  <span className="actualization-period__number">
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </span>

                  <div className="actualization-period__name">
                    <h3>
                      {item.type}
                    </h3>

                    <p>
                      {item.regulation}
                    </p>
                  </div>

                  <strong>
                    {item.period}
                  </strong>

                  <p className="actualization-period__description">
                    {item.text}
                  </p>
                </article>
              ),
            )}
          </div>


          <p className="actualization-periods__note">
            Это не полный перечень видов объектов.
            Для гостиниц, объектов спорта,
            социальной защиты и других категорий
            применяются собственные требования,
            которые необходимо проверять отдельно.
          </p>
        </Container>
      </section>


      <section className="actualization-replacement">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Старый паспорт
            </p>

            <h2>
              Нужно ли менять паспорт полностью
            </h2>

            <p>
              Не всегда. Способ оформления зависит
              от нормативного основания и характера
              изменений на объекте.
            </p>
          </div>


          <div className="actualization-replacement__options">
            <article>
              <span>
                Вариант 01
              </span>

              <h3>
                Внести изменения
              </h3>

              <p>
                Если применимые требования позволяют
                актуализировать сведения
                в существующем документе.
              </p>
            </article>

            <article>
              <span>
                Вариант 02
              </span>

              <h3>
                Подготовить новую редакцию
              </h3>

              <p>
                Если характер изменений или
                установленный порядок требуют
                переработки паспорта.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section className="actualization-objects">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Типы объектов
            </p>

            <h2>
              Актуализируем паспорта безопасности для
            </h2>
          </div>


          <div className="actualization-objects__list">
            {objectTypes.map(
              (item, index) => (
                <article key={item}>
                  <span>
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </span>

                  <h3>
                    {item ===
                    'Образовательные организации' ? (
                      <a href="/pasport-bezopasnosti-obrazovatelnoj-organizacii/">
                        {item}
                      </a>
                    ) : item ===
                      'Объекты спорта' ? (
                      <a href="/pasport-bezopasnosti-obekta-sporta/">
                        {item}
                      </a>
                    ) : (
                      item
                    )}
                  </h3>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>


      <section className="actualization-standard">
        <Container>
          <div className="actualization-standard__panel">
            <div>
              <p className="actualization-kicker">
                Требования 2026 года
              </p>

              <h2>
                ГОСТ Р 72551-2026
              </h2>
            </div>

            <div>
              <p>
                С 1 мая 2026 года действует
                ГОСТ Р 72551-2026, устанавливающий
                общие требования к услугам
                по категорированию объектов
                и разработке паспортов безопасности
                объектов, для которых установлены
                обязательные требования
                к антитеррористической защищённости.
              </p>

              <strong>
                ГОСТ не устанавливает единый срок
                актуализации для всех объектов.
              </strong>

              <p>
                Конкретные основания, сроки
                и порядок определяются требованиями
                к соответствующему виду объекта.
              </p>
            </div>
          </div>
        </Container>
      </section>


      <Expert />


      <section className="actualization-faq">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Вопросы об актуализации
            </p>

            <h2>
              Что важно знать до внесения изменений
            </h2>
          </div>


          <div className="actualization-faq__list">
            {faqItems.map(
              (item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                  </summary>

                  <p>
                    {item.answer}
                  </p>
                </details>
              ),
            )}
          </div>
        </Container>
      </section>


      <FinalCTA />
    </main>
  );
}
