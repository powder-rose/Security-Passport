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

      <section
        className="sport-source-data"
        id="documents"
      >
        <Container>
          <div className="sport-source-data__heading">
            <div>
              <p className="sport-kicker">
                Исходные данные
              </p>

              <h2>
                Что потребуется для разработки
              </h2>
            </div>

            <p>
              Для подготовки документов используются
              сведения об объекте, его характеристиках,
              посетителях, персонале, охране
              и технических средствах защиты.
            </p>
          </div>


          <div className="sport-source-data__layout">
            <div className="sport-source-data__list">
              <article>
                <span>
                  01
                </span>

                <div>
                  <h3>
                    Объект и правообладатель
                  </h3>

                  <p>
                    Наименование и адрес объекта,
                    вид спортивного объекта,
                    сведения о правообладателе.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  02
                </span>

                <div>
                  <h3>
                    Планы и характеристики
                  </h3>

                  <p>
                    Планы и схемы, площадь
                    и основные характеристики объекта.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  03
                </span>

                <div>
                  <h3>
                    Посетители и вместимость
                  </h3>

                  <p>
                    Среднее число посетителей
                    и зрительская вместимость.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  04
                </span>

                <div>
                  <h3>
                    Персонал
                  </h3>

                  <p>
                    Данные о персонале объекта.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  05
                </span>

                <div>
                  <h3>
                    Охрана и техническая защита
                  </h3>

                  <p>
                    Сведения об охране
                    и технических средствах защиты.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  06
                </span>

                <div>
                  <h3>
                    Критические элементы
                  </h3>

                  <p>
                    Сведения о критических элементах
                    и потенциально опасных участках.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  07
                </span>

                <div>
                  <h3>
                    Действующие документы
                  </h3>

                  <p>
                    Действующий акт обследования
                    и категорирования и паспорт
                    безопасности — при наличии.
                  </p>
                </div>
              </article>
            </div>


            <aside className="sport-source-data__note">
              <span>
                Перечень
              </span>

              <strong>
                Не собираем лишние документы заранее
              </strong>

              <p>
                Точный перечень исходных данных
                определяется после проверки
                конкретного объекта.
              </p>

              <a
                href="#lead-form"
                className="sport-inline-link"
              >
                Проверить исходные данные

                <span aria-hidden="true">
                  →
                </span>
              </a>
            </aside>
          </div>
        </Container>
      </section>


      <section className="sport-form">
        <Container>
          <div className="sport-form__layout">
            <div className="sport-form__content">
              <p className="sport-kicker">
                Форма и образец
              </p>

              <h2>
                Форма паспорта безопасности
                объекта спорта
              </h2>

              <p className="sport-form__lead">
                ПП РФ №202 непосредственно
                утверждает официальную форму
                паспорта безопасности объекта спорта.
              </p>


              <div className="sport-form__structure">
                <div>
                  <span>
                    01
                  </span>

                  <p>
                    Общие сведения об объекте
                  </p>
                </div>

                <div>
                  <span>
                    02
                  </span>

                  <p>
                    Вид объекта спорта
                  </p>
                </div>

                <div>
                  <span>
                    03
                  </span>

                  <p>
                    Категория опасности
                  </p>
                </div>

                <div>
                  <span>
                    04
                  </span>

                  <p>
                    Сведения о собственнике
                    или законном пользователе
                  </p>
                </div>

                <div>
                  <span>
                    05
                  </span>

                  <p>
                    Количество посетителей
                  </p>
                </div>

                <div>
                  <span>
                    06
                  </span>

                  <p>
                    Количество зрительских мест
                  </p>
                </div>
              </div>


              <p className="sport-form__after">
                Далее форма предусматривает сведения,
                необходимые для оценки
                антитеррористической защищённости
                объекта.
              </p>


              <a
                className="button button--primary"
                href="#lead-form"
              >
                Получить форму паспорта объекта спорта
              </a>
            </div>


            <aside className="sport-form__document">
              <div className="sport-form__document-top">
                <span>
                  ПП РФ №202
                </span>

                <span>
                  Форма
                </span>
              </div>

              <div className="sport-form__document-title">
                <small>
                  Паспорт безопасности
                </small>

                <strong>
                  объекта спорта
                </strong>
              </div>


              <div className="sport-form__document-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>


              <div className="sport-form__document-note">
                <span>
                  ДСП
                </span>

                <p>
                  На сайте используем официальную
                  форму или обезличенную структуру,
                  а не заполненный паспорт
                  действующего объекта.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>


      <section className="sport-actualization">
        <Container>
          <div className="sport-actualization__heading">
            <div>
              <p className="sport-kicker">
                Актуализация
              </p>

              <h2>
                Когда актуализируется паспорт
                объекта спорта
              </h2>
            </div>

            <div className="sport-actualization__deadline">
              <strong>
                30
              </strong>

              <span>
                дней
              </span>

              <p>
                после возникновения
                соответствующих обстоятельств
              </p>
            </div>
          </div>


          <div className="sport-actualization__reasons">
            <article>
              <span>
                01
              </span>

              <p>
                Изменение нормативных требований
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <p>
                Изменение застройки
                или завершение реконструкции
              </p>
            </article>

            <article>
              <span>
                03
              </span>

              <p>
                Изменение профиля деятельности
                объекта
              </p>
            </article>

            <article>
              <span>
                04
              </span>

              <p>
                Изменение схемы охраны
                либо технического оснащения
              </p>
            </article>

            <article>
              <span>
                05
              </span>

              <p>
                Смена собственника, наименования
                или организационно-правовой формы
              </p>
            </article>

            <article>
              <span>
                06
              </span>

              <p>
                Изменение сведений о должностных
                лицах и способов связи с ними
              </p>
            </article>
          </div>


          <div className="sport-actualization__footer">
            <p>
              ПП РФ №202 предусматривает
              актуализацию при наступлении
              соответствующих изменений.
            </p>

            <a
              href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
              className="sport-actualization__link"
            >
              <span>
                Подробнее об актуализации
                паспорта безопасности
              </span>

              <span aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </Container>
      </section>

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
