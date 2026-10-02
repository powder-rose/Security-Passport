import './SportPage.css';

import {
  sportFaqItems,
} from './sportPageData';

import SportHeroAndObjects
from './components/SportHeroAndObjects';

import SportRegulation
from './components/SportRegulation';


import SportCategories
from './components/SportCategories';

import SportCategorizationAct
from './components/SportCategorizationAct';


import SportPassportProcess
from './components/SportPassportProcess';

import SportApproval
from './components/SportApproval';


import SportRestrictedDocuments
from './components/SportRestrictedDocuments';

import SportServiceScope
from './components/SportServiceScope';

import SportPricing
from './components/SportPricing';


import SportRequiredDocuments
from './components/SportRequiredDocuments';

import SportPassportForm
from './components/SportPassportForm';

import SportPassportActualization
from './components/SportPassportActualization';
import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


export default function SportPage() {
  const city =
    useCity();

  return (
    <main
      id="main-content"
      className="sport-page"
      data-sport-stage="1"
    >
      {/* SPORT_STAGE_1_V1:start */}

      <SportHeroAndObjects
        city={city}
      />

      <SportRegulation />


      {/* SPORT_STAGE_2_V1:start */}

      <SportCategories />

      <SportCategorizationAct />

      {/* SPORT_STAGE_2_V1:end */}


      {/* SPORT_STAGE_3_V1:start */}

      <SportPassportProcess />

      <SportApproval />

      {/* SPORT_STAGE_3_V1:end */}


      {/* SPORT_STAGE_4_V1:start */}

      <SportRestrictedDocuments />

      <SportServiceScope />

      <SportPricing />

      {/* SPORT_STAGE_4_V1:end */}


      {/* SPORT_STAGE_5_V1:start */}

      <SportRequiredDocuments />

      <SportPassportForm />

      <SportPassportActualization />

      {/* SPORT_STAGE_5_V1:end */}


      {/* SPORT_STAGE_6_V1:start */}

      <section
        className="sport-why"
        id="expert"
      >
        <Container>
          <div className="sport-why__heading">
            <div>
              <p className="sport-kicker">
                Подход к работе
              </p>

              <h2>
                Почему БОЙКОВГРУПП
              </h2>
            </div>

            <p>
              Работа строится вокруг фактического
              состояния конкретного объекта
              и применимых к нему требований,
              а не только вокруг названия объекта.
            </p>
          </div>


          <div className="sport-why__list">
            <article>
              <span>
                01
              </span>

              <h3>
                Сначала проверяем применимость №202
              </h3>

              <p>
                Определяем фактическое назначение
                и статус объекта до подготовки
                паспорта.
              </p>
            </article>


            <article>
              <span>
                02
              </span>

              <h3>
                Разделяем этапы работы
              </h3>

              <p>
                Категорирование, акт, паспорт
                и сопровождение согласования
                рассматриваем как отдельные этапы
                одного процесса.
              </p>
            </article>


            <article>
              <span>
                03
              </span>

              <h3>
                Учитываем имеющиеся документы
              </h3>

              <p>
                Если действующий акт уже есть
                и соответствует фактическому
                состоянию объекта, не включаем
                повторное категорирование
                автоматически.
              </p>
            </article>


            <article>
              <span>
                04
              </span>

              <h3>
                Работаем с актуальной редакцией
              </h3>

              <p>
                Перед подготовкой документа
                проверяем действующую редакцию
                требований для конкретного объекта.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section className="sport-related">
        <Container>
          <div className="sport-related__heading">
            <p className="sport-kicker">
              Связанные материалы
            </p>

            <h2>
              Документы и этапы,
              связанные с паспортом
            </h2>
          </div>


          <nav
            className="sport-related__links"
            aria-label="Связанные страницы"
          >
            <a href="/">
              <div>
                <span>
                  01
                </span>

                <strong>
                  Паспорт безопасности объекта
                </strong>
              </div>

              <span aria-hidden="true">
                ↗
              </span>
            </a>


            <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
              <div>
                <span>
                  02
                </span>

                <strong>
                  Акт обследования и категорирования
                </strong>
              </div>

              <span aria-hidden="true">
                ↗
              </span>
            </a>


            <a href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
              <div>
                <span>
                  03
                </span>

                <strong>
                  Актуализация паспорта безопасности
                </strong>
              </div>

              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </nav>
        </Container>
      </section>


      <section
        className="sport-faq"
        id="faq"
      >
        <Container>
          <div className="sport-faq__layout">
            <div className="sport-faq__heading">
              <div>
                <p className="sport-kicker">
                  Вопросы и ответы
                </p>

                <h2>
                  Частые вопросы
                  о паспорте безопасности
                  объекта спорта
                </h2>
              </div>

              <p>
                Ответы о применимости ПП РФ №202,
                категорировании, акте, сроках,
                согласовании, форме, стоимости
                и актуализации.
              </p>
            </div>


            <div className="sport-faq__list">
              {sportFaqItems.map(
                (item, index) => (
                  <details
                    className="sport-faq__item"
                    key={item.question}
                  >
                    <summary>
                      <span className="sport-faq__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="sport-faq__question">
                        {item.question}
                      </span>

                      <span
                        className="sport-faq__toggle"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>

                    <div className="sport-faq__answer">
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

      {/* SPORT_STAGE_6_V1:end */}


      <FinalCTA />

      {/* SPORT_STAGE_1_V1:end */}
</main>
  );
}
