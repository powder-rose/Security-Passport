import './HealthPage.css';

import Container
from '../../components/ui/Container/Container';

import FinalCTA
from '../../sections/FinalCTA/FinalCTA';

import {
  useCity,
} from '../../context/GeoContext';

import {
  healthFaqItems,
} from './healthPageData';

import HealthHeroAndObjects
from './components/HealthHeroAndObjects';

import HealthRegulationAndCategories
from './components/HealthRegulationAndCategories';

import HealthCommissionAndAct
from './components/HealthCommissionAndAct';

import HealthPassportProcess
from './components/HealthPassportProcess';

import HealthRestrictedDocuments
from './components/HealthRestrictedDocuments';

import HealthServiceScope
from './components/HealthServiceScope';

import HealthPricing
from './components/HealthPricing';

import HealthRequiredDocuments
from './components/HealthRequiredDocuments';

import HealthPassportStructure
from './components/HealthPassportStructure';

import HealthPassportActualization
from './components/HealthPassportActualization';

import HealthMedicalOrganizations
from './components/HealthMedicalOrganizations';

import HealthCurrentRequirements
from './components/HealthCurrentRequirements';


export default function HealthPage() {
  const city =
    useCity();

  return (
    <main
      id="main-content"
      className="health-page"
      data-health-stage="1"
    >
      {/* HEALTH_STAGE_1_V1:start */}

      <HealthHeroAndObjects
        city={city}
      />

      {/* HEALTH_STAGE_1_V1:end */}


      {/* HEALTH_STAGE_2_V1:start */}

      <HealthRegulationAndCategories />

      {/* HEALTH_STAGE_2_V1:end */}


      {/* HEALTH_STAGE_3_V1:start */}

      <HealthCommissionAndAct />

      {/* HEALTH_STAGE_3_V1:end */}


      {/* HEALTH_STAGE_4_V1:start */}

      <HealthPassportProcess />

      {/* HEALTH_STAGE_4_V1:end */}


      {/* HEALTH_STAGE_5_V1:start */}

      <HealthRestrictedDocuments />

      <HealthServiceScope />

      <HealthPricing />

      <HealthRequiredDocuments />

      {/* HEALTH_STAGE_5_V1:end */}


      {/* HEALTH_STAGE_6_V1:start */}

      <HealthPassportStructure />

      <HealthPassportActualization />

      <HealthMedicalOrganizations />

      <HealthCurrentRequirements />

      {/* HEALTH_STAGE_6_V1:end */}


      {/* HEALTH_STAGE_7_V1:start */}

      <section
        className="health-why"
        id="expert"
      >
        <Container>
          <div className="health-why__layout">
            <div className="health-why__heading">
              <p className="health-kicker">
                Подход к работе
              </p>

              <h2>
                Почему БОЙКОВГРУПП
              </h2>

              <p>
                Начинаем не с заполнения шаблона,
                а с проверки нормативного режима,
                фактического состояния объекта
                и уже имеющихся документов.
              </p>
            </div>


            <div className="health-why__list">
              <article>
                <span>
                  01
                </span>

                <div>
                  <h3>
                    Проверяем применимость
                    Постановление Правительства РФ №8
                  </h3>

                  <p>
                    До подготовки документов
                    определяем статус,
                    назначение и фактические
                    характеристики конкретного
                    объекта.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  02
                </span>

                <div>
                  <h3>
                    Работаем с актуальной
                    редакцией требований
                  </h3>

                  <p>
                    Перед подготовкой документов
                    проверяем действующую
                    нормативную редакцию,
                    применимую к объекту.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  03
                </span>

                <div>
                  <h3>
                    Разделяем этапы работы
                  </h3>

                  <p>
                    Категорирование, акт,
                    паспорт и сопровождение
                    согласования рассматриваем
                    как отдельные этапы
                    одного процесса.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  04
                </span>

                <div>
                  <h3>
                    Учитываем уже имеющиеся
                    документы
                  </h3>

                  <p>
                    Если действующий акт
                    обследования и категорирования
                    уже имеется, разработку
                    паспорта можно рассматривать
                    отдельно.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="health-faq"
        id="faq"
      >
        <Container>
          <div className="health-faq__layout">
            <div className="health-faq__heading">
              <div>
                <p className="health-kicker">
                  Вопросы и ответы
                </p>

                <h2>
                  Частые вопросы
                  о паспорте безопасности
                  объекта здравоохранения
                </h2>
              </div>

              <p>
                Применимость Постановление Правительства РФ №8,
                категорирование, комиссия,
                акт, согласование, экземпляры,
                форма, актуализация
                и стоимость разработки.
              </p>
            </div>


            <div className="health-faq__list">
              {healthFaqItems.map(
                (item, index) => (
                  <details
                    className="health-faq__item"
                    key={item.question}
                  >
                    <summary>
                      <span className="health-faq__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="health-faq__question">
                        {item.question}
                      </span>

                      <span
                        className="health-faq__toggle"
                        aria-hidden="true"
                      />
                    </summary>

                    <div className="health-faq__answer">
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

      {/* HEALTH_STAGE_7_V1:end */}


      <FinalCTA />
</main>
  );
}
