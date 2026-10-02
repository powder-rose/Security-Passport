import './CategorizationActPage.css';

import {
  sampleStructure,
  faqItems,
} from './categorizationActPageData';

import CategorizationActHeroAndIntro
from './components/CategorizationActHeroAndIntro';

import CategorizationActObjectTypes
from './components/CategorizationActObjectTypes';

import CategorizationActRequirements
from './components/CategorizationActRequirements';


import CategorizationActProcess
from './components/CategorizationActProcess';

import CategorizationActServiceScope
from './components/CategorizationActServiceScope';

import CategorizationActPricing
from './components/CategorizationActPricing';

import CategorizationActSourceData
from './components/CategorizationActSourceData';
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


      <CategorizationActProcess />

      <CategorizationActServiceScope />

      <CategorizationActPricing />

      <CategorizationActSourceData />


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
