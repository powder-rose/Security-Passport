import './EducationPage.css';

import {
  getRegionalWorkText,
} from './educationRegion';

import {
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


import EducationRequiredDocuments
from './components/EducationRequiredDocuments';

import EducationPassportForm
from './components/EducationPassportForm';

import EducationPassportActualization
from './components/EducationPassportActualization';
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

      <EducationRequiredDocuments />

      <EducationPassportForm />

      <EducationPassportActualization />

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
