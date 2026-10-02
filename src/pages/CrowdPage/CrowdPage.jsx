import './CrowdPage.css';
import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';


import CrowdHero
from './components/CrowdHero';

import CrowdApplicability
from './components/CrowdApplicability';

import CrowdRegime
from './components/CrowdRegime';


import CrowdRegulation
from './components/CrowdRegulation';

import CrowdListing
from './components/CrowdListing';

import CrowdCategories
from './components/CrowdCategories';

import CrowdPeopleCount
from './components/CrowdPeopleCount';
import { getRegulationClaim } from '../../data/regulationClaims';


export default function CrowdPage() {
  return (
    <main
      id="main-content"
      className="crowd-page"
      data-crowd-stage="2"
    >
      {/* CROWD_STAGE_1_V1:start */}

      <CrowdHero />

      <CrowdApplicability />

      <CrowdRegime />


      {/* CROWD_STAGE_1_V1:end */}


      {/* CROWD_STAGE_2_V1:start */}

      <CrowdRegulation />

      <CrowdListing />

      <CrowdCategories />

      <CrowdPeopleCount />


      {/* CROWD_STAGE_2_V1:end */}


      {/* CROWD_STAGE_3_V1:start */}

      <section
        className="crowd-process"
        id="process"
      >

        <Container>

          <div className="crowd-process__heading">

            <div>

              <p className="crowd-kicker">
                Порядок разработки
              </p>

              <h2>
                От обследования
                до паспорта безопасности
              </h2>

            </div>


            <p>
              После обследования объекта
              проводится категорирование,
              оформляется акт и разрабатывается
              паспорт безопасности.
            </p>

          </div>


          <div className="crowd-process__list">


            <article>

              <span>
                01
              </span>

              <div>

                <h3>
                  Формирование комиссии
                </h3>

                <p>
                  Комиссия проводит обследование
                  места массового пребывания людей
                  и рассматривает необходимые
                  материалы по объекту.
                </p>

              </div>

            </article>


            <article>

              <span>
                02
              </span>

              <div>

                <h3>
                  Обследование и категорирование
                </h3>

                <p>
                  По результатам обследования
                  определяется категория объекта
                  и оформляются необходимые документы.
                </p>

                <strong>
                  Срок — до 30 дней
                </strong>

              </div>

            </article>


            <article>

              <span>
                03
              </span>

              <div>

                <h3>
                  Оформление акта обследования
                </h3>

                <p>
                  Результаты работы комиссии
                  оформляются в виде акта
                  обследования и категорирования.
                </p>

                <strong>
                  Срок — до 10 дней
                </strong>

              </div>

            </article>


            <article>

              <span>
                04
              </span>

              <div>

                <h3>
                  Разработка паспорта безопасности
                </h3>

                <p>
                  После завершения процедуры
                  подготавливается паспорт безопасности
                  объекта в установленной форме.
                </p>

                <strong>
                  До 6 экземпляров
                </strong>

              </div>

            </article>


          </div>


        </Container>

      </section>


      {/* CROWD_STAGE_3_V1:end */}


<section
  className="crowd-faq"
  id="faq"
>
  <Container>

    <div className="crowd-faq__layout">

      <div className="crowd-faq__heading">

        <h2>
          Частые вопросы о паспорте безопасности
          места массового пребывания людей
        </h2>

      </div>


      <div className="crowd-faq__list">


        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              01
            </span>

            <span className="crowd-faq__question">
              Для каких объектов требуется паспорт безопасности?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              {getRegulationClaim(
                '272',
                'crowd.faq.00',
              )}
            </p>

          </div>

        </details>


        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              02
            </span>

            <span className="crowd-faq__question">
              Что входит в разработку паспорта безопасности?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              {getRegulationClaim(
                '272',
                'crowd.faq.01',
              )}
            </p>

          </div>

        </details>


        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              03
            </span>

            <span className="crowd-faq__question">
              Нужно ли актуализировать ранее разработанный паспорт?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              {getRegulationClaim(
                '272',
                'crowd.faq.02',
              )}
            </p>

          </div>

        </details>


      </div>

    </div>

  </Container>
</section>


      <FinalCTA />
    </main>
  );
}
