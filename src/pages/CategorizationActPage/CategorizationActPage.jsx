import './CategorizationActPage.css';

import {
  processItems,
  serviceItems,
  sourceDataItems,
  sampleStructure,
  faqItems,
} from './categorizationActPageData';

import CategorizationActHeroAndIntro
from './components/CategorizationActHeroAndIntro';

import CategorizationActObjectTypes
from './components/CategorizationActObjectTypes';

import CategorizationActRequirements
from './components/CategorizationActRequirements';
import Container from '../../components/ui/Container/Container';

import Expert from '../../sections/Expert/Expert';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';


export default function CategorizationActPage() {


  return (
    <main
      id="main-content"
      className="categorization-act-page"
    >
      <CategorizationActHeroAndIntro />

      <CategorizationActObjectTypes />

      <CategorizationActRequirements />


      <section className="categorization-act-process">
        <Container>
          <div className="categorization-act-process__heading">
            <div>
              <p className="categorization-act-kicker">
                Логика процедуры
              </p>

              <h2>
                От объекта
                до оформленного акта
              </h2>
            </div>

            <p>
              Категорию не «назначает специалист».
              Решение принимается комиссией,
              а мы готовим документацию и сопровождаем
              процедуру в рамках применимых требований.
            </p>
          </div>


          <div className="categorization-act-flow">
            {[
              'Объект',
              'Комиссия',
              'Обследование',
              'Категория',
              'Акт',
              'Паспорт',
            ].map((item, index) => (
              <div
                className="categorization-act-flow__item"
                key={item}
              >
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <strong>
                  {item}
                </strong>
              </div>
            ))}
          </div>


          <div className="categorization-act-process__details">
            {processItems.map((item, index) => (
              <article key={item.title}>
                <span>
                  {String(index + 1).padStart(2, '0')}
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
            ))}
          </div>
        </Container>
      </section>


      <section className="categorization-act-service">
        <Container>
          <div className="categorization-act-service__grid">
            <div>
              <p className="categorization-act-kicker">
                Состав услуги
              </p>

              <h2>
                Что мы подготовим
              </h2>

              <p>
                Состав документов уточняется после
                определения требований, применимых
                к конкретному объекту.
              </p>
            </div>

            <ol>
              {serviceItems.map((item, index) => (
                <li key={item}>
                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p>
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>


      <section className="categorization-act-cost">
        <Container>
          <div className="categorization-act-cost__card">
            <div>
              <p className="categorization-act-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость акта обследования и категорирования
              </h2>

              <p>
                Стоимость подготовки документации
                для категорирования одного объекта.
                При нестандартном составе работ
                или необходимости дополнительных
                выездных мероприятий стоимость
                согласовывается до начала работ.
              </p>
            </div>

            <div className="categorization-act-cost__price">
              <strong>
                9 500 ₽
              </strong>

              <span>
                за объект
              </span>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Заказать подготовку акта
              </a>
            </div>
          </div>

          <div className="categorization-act-passport-link">
            <div>
              <span>
                Следующий этап
              </span>

              <h3>
                После категорирования может потребоваться паспорт безопасности
              </h3>

              <p>
                Необходимость паспорта определяется
                требованиями, распространяющимися
                на конкретный объект.
              </p>
            </div>

            <a href="/">
              Разработка паспорта безопасности объекта →
            </a>
          </div>
        </Container>
      </section>


      <section className="categorization-act-source-data">
        <Container>
          <div className="categorization-act-source-data__grid">
            <div>
              <p className="categorization-act-kicker">
                До начала работ
              </p>

              <h2>
                Какие данные потребуются
              </h2>

              <p>
                Окончательный перечень исходных данных
                зависит от требований, распространяющихся
                на конкретный объект.
              </p>
            </div>

            <ul>
              {sourceDataItems.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>


      <section className="categorization-act-sample">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Форма и образец
            </p>

            <h2>
              Образец акта обследования и категорирования объекта
            </h2>

            <p>
              Универсального образца, который подходит
              всем объектам, нет. Ниже показана
              демонстрационная структура документа —
              конкретные разделы зависят от применимых
              требований.
            </p>
          </div>

          <div className="categorization-act-sample__grid">
            {sampleStructure.map((item, index) => (
              <article key={item}>
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p>
                  {item}
                </p>
              </article>
            ))}
          </div>

          <a
            className="button button--secondary"
            href="#lead-form"
          >
            Получить форму для вашего типа объекта
          </a>
        </Container>
      </section>


      <section className="categorization-act-standard">
        <Container>
          <div className="categorization-act-standard__grid">
            <div>
              <span className="categorization-act-standard__badge">
                ГОСТ Р 72551-2026
              </span>

              <h2>
                Профильный стандарт действует с 1 мая 2026 года
              </h2>
            </div>

            <div>
              <p>
                ГОСТ Р 72551-2026 устанавливает общие
                требования к услугам по категорированию
                объекта или территории и разработке
                паспорта безопасности объектов,
                в отношении которых установлены
                обязательные требования к
                антитеррористической защищённости.
              </p>

              <p>
                При этом конкретный порядок
                категорирования, состав комиссии,
                критерии и форма документов
                по-прежнему определяются обязательными
                требованиями, применимыми
                к соответствующему объекту.
              </p>
            </div>
          </div>
        </Container>
      </section>


      <section className="categorization-act-difference">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Не одно и то же
            </p>

            <h2>
              Акт категорирования и паспорт безопасности — в чём разница
            </h2>
          </div>

          <div className="categorization-act-difference__grid">
            <article>
              <span>
                01
              </span>

              <h3>
                Акт категорирования
              </h3>

              <p>
                Фиксирует результаты обследования
                и работы комиссии, включая решение
                по категорированию и другие сведения,
                предусмотренные применимыми требованиями.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Паспорт безопасности
              </h3>

              <p>
                Содержит сведения об объекте,
                состоянии его антитеррористической
                защищённости и предусмотренных
                мерах обеспечения безопасности.
              </p>
            </article>
          </div>

          <p className="categorization-act-difference__sequence">
            <strong>
              Типовая последовательность:
            </strong>{' '}
            обследование → категорирование → акт →
            паспорт безопасности. Конкретная процедура
            определяется требованиями для соответствующего
            объекта.
          </p>
        </Container>
      </section>


      <Expert />


      <section className="categorization-act-faq">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Вопросы и ответы
            </p>

            <h2>
              Частые вопросы об акте категорирования
            </h2>
          </div>

          <div className="categorization-act-faq__list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                </summary>

                <p>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>


      <FinalCTA />
    </main>
  );
}
