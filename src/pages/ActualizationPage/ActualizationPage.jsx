import './ActualizationPage.css';

import {
  getLocationText,
} from './actualizationRegion';

import useActualizationTimeline
from './useActualizationTimeline';

import {
  periodicityItems,
  objectTypes,
  faqItems,
} from './actualizationPageData';

import ActualizationHeroAndDefinition
from './components/ActualizationHeroAndDefinition';

import ActualizationReasons
from './components/ActualizationReasons';

import ActualizationChecklist
from './components/ActualizationChecklist';

import ActualizationCategorization
from './components/ActualizationCategorization';


import ActualizationWorkProcess
from './components/ActualizationWorkProcess';

import ActualizationServiceScope
from './components/ActualizationServiceScope';

import ActualizationPricing
from './components/ActualizationPricing';

import ActualizationRequiredDocuments
from './components/ActualizationRequiredDocuments';

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
      <ActualizationHeroAndDefinition />

      <ActualizationReasons />

      <ActualizationChecklist />

      <ActualizationCategorization />


      <ActualizationWorkProcess />

      <ActualizationServiceScope />

      <ActualizationPricing />

      <ActualizationRequiredDocuments />


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
