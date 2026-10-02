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

      <section className="health-restricted">
        <Container>
          <div className="health-restricted__layout">
            <div className="health-restricted__identity">
              <p className="health-kicker">
                Режим документа
              </p>

              <strong>
                ДСП
              </strong>

              <span>
                Для служебного пользования
              </span>
            </div>


            <div className="health-restricted__content">
              <h2>
                Можно ли публиковать
                паспорт медицинского объекта
              </h2>

              <p className="health-restricted__lead">
                Паспорт безопасности содержит
                служебную информацию ограниченного
                распространения и имеет пометку
                «Для служебного пользования»,
                если ему не присвоен
                гриф секретности.
              </p>


              <div className="health-restricted__rules">
                <div className="health-restricted__rule">
                  <span className="health-restricted__sign">
                    +
                  </span>

                  <div>
                    <strong>
                      Можно показывать
                    </strong>

                    <ul>
                      <li>
                        официальную форму паспорта
                      </li>

                      <li>
                        структуру документа
                      </li>

                      <li>
                        обезличенный пример
                        можно подготовить
                      </li>
                    </ul>
                  </div>
                </div>


                <div
                  className="
                    health-restricted__rule
                    health-restricted__rule--private
                  "
                >
                  <span className="health-restricted__sign">
                    —
                  </span>

                  <div>
                    <strong>
                      Не публикуем
                    </strong>

                    <p>
                      Реальный заполненный паспорт
                      больницы, поликлиники
                      или иного медицинского объекта,
                      содержащий сведения
                      о его защищённости.
                    </p>
                  </div>
                </div>
              </div>


              <aside className="health-restricted__act-note">
                <span>
                  Акт
                </span>

                <p>
                  Сведения о состоянии
                  антитеррористической защищённости
                  и принимаемых мерах,
                  содержащиеся в материалах
                  акта обследования
                  и категорирования, также
                  относятся к служебной информации
                  ограниченного распространения.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


      <section className="health-service">
        <Container>
          <div className="health-service__heading">
            <p className="health-kicker">
              Состав работы
            </p>

            <h2>
              Что входит в услугу
            </h2>

            <p>
              Состав работы соответствует
              этапам подготовки документов
              для объекта здравоохранения:
              от категорирования до сопровождения
              предусмотренного согласования.
            </p>
          </div>


          <div className="health-service__rows">
            <article className="health-service__row">
              <span>
                01
              </span>

              <h3>
                Документация
                для категорирования
              </h3>

              <p>
                Подготовка документации
                для работы комиссии
                по обследованию
                и категорированию.
              </p>
            </article>

            <article className="health-service__row">
              <span>
                02
              </span>

              <h3>
                Акт обследования
                и категорирования
              </h3>

              <p>
                Подготовка акта
                по результатам работы
                комиссии.
              </p>
            </article>

            <article className="health-service__row">
              <span>
                03
              </span>

              <h3>
                Паспорт безопасности
              </h3>

              <p>
                Разработка паспорта
                безопасности объекта
                в соответствии
                с актом категорирования.
              </p>
            </article>

            <article className="health-service__row">
              <span>
                04
              </span>

              <h3>
                Сопровождение согласования
              </h3>

              <p>
                Сопровождение предусмотренного
                Постановление Правительства РФ №8 согласования
                подготовленного паспорта.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section
        className="health-prices"
        id="prices"
      >
        <Container>
          <div className="health-prices__heading">
            <div>
              <p className="health-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость паспорта
                безопасности объекта
                здравоохранения
              </h2>
            </div>

            <p>
              Можно заказать разработку
              паспорта отдельно либо выбрать
              работы, необходимые
              с учётом текущего состояния
              документов по объекту.
            </p>
          </div>


          <div className="health-prices__layout">
            <article className="health-price-primary">
              <span>
                Паспорт безопасности
              </span>

              <strong>
                9 500 ₽
              </strong>

              <p>
                Разработка паспорта
                безопасности объекта
                здравоохранения.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Заказать паспорт
              </a>
            </article>


            <div className="health-prices__list">
              <article>
                <div>
                  <span>
                    01
                  </span>

                  <h3>
                    Акт обследования
                    и категорирования
                  </h3>
                </div>

                <strong>
                  9 500 ₽
                </strong>
              </article>

              <article>
                <div>
                  <span>
                    02
                  </span>

                  <h3>
                    Сопровождение
                    согласования
                  </h3>
                </div>

                <strong>
                  от 9 500 ₽
                </strong>
              </article>

              <article>
                <div>
                  <span>
                    03
                  </span>

                  <h3>
                    Комплекс под ключ
                  </h3>
                </div>

                <strong>
                  от 35 000 ₽
                </strong>
              </article>
            </div>
          </div>


          <aside className="health-prices__note">
            <span>
              Если акт уже есть
            </span>

            <p>
              Если имеется действующий
              акт обследования
              и категорирования,
              можно заказать разработку
              паспорта отдельно.
              Если объект ещё не категорирован,
              работа начинается с подготовки
              процедуры обследования
              и категорирования.
            </p>
          </aside>
        </Container>
      </section>


      <section
        className="health-documents"
        id="documents"
      >
        <Container>
          <div className="health-documents__layout">
            <div className="health-documents__heading">
              <p className="health-kicker">
                Исходные данные
              </p>

              <h2>
                Какие данные нужны
                для подготовки документов
              </h2>

              <p>
                На старте собираются
                основные сведения
                об организации, объекте,
                людях, защите
                и имеющейся документации.
              </p>
            </div>


            <div className="health-documents__register">
              <article>
                <span>
                  01
                </span>

                <strong>
                  Организация
                </strong>

                <p>
                  реквизиты, правообладатель
                </p>
              </article>

              <article>
                <span>
                  02
                </span>

                <strong>
                  Объект
                </strong>

                <p>
                  наименование, адрес, назначение
                </p>
              </article>

              <article>
                <span>
                  03
                </span>

                <strong>
                  Характеристики
                </strong>

                <p>
                  площадь, этажность, периметр
                </p>
              </article>

              <article>
                <span>
                  04
                </span>

                <strong>
                  Люди
                </strong>

                <p>
                  работники, посетители, пациенты
                </p>
              </article>

              <article>
                <span>
                  05
                </span>

                <strong>
                  Планы
                </strong>

                <p>
                  планы помещений и территории
                </p>
              </article>

              <article>
                <span>
                  06
                </span>

                <strong>
                  Опасные участки
                </strong>

                <p>
                  при наличии
                </p>
              </article>

              <article>
                <span>
                  07
                </span>

                <strong>
                  Критические элементы
                </strong>

                <p>
                  при наличии
                </p>
              </article>

              <article>
                <span>
                  08
                </span>

                <strong>
                  Охрана
                </strong>

                <p>
                  силы и организация охраны
                </p>
              </article>

              <article>
                <span>
                  09
                </span>

                <strong>
                  Техническая защита
                </strong>

                <p>
                  сигнализация,
                  видеонаблюдение и др.
                </p>
              </article>

              <article>
                <span>
                  10
                </span>

                <strong>
                  Документы
                </strong>

                <p>
                  предыдущий акт и паспорт
                </p>
              </article>
            </div>
          </div>


          <aside className="health-documents__note">
            <span>
              Состав уточняется
            </span>

            <p>
              Окончательный состав
              исходных данных определяется
              после проверки объекта
              и применимых требований.
            </p>
          </aside>
        </Container>
      </section>

      {/* HEALTH_STAGE_5_V1:end */}


      {/* HEALTH_STAGE_6_V1:start */}

      <section className="health-form">
        <Container>
          <div className="health-form__layout">
            <div className="health-form__heading">
              <p className="health-kicker">
                Форма и содержание
              </p>

              <h2>
                Форма паспорта безопасности
                объекта здравоохранения
              </h2>

              <p>
                Официальная форма паспорта
                утверждена непосредственно
                Постановлением Правительства
                РФ №8.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Получить форму паспорта
              </a>
            </div>


            <div className="health-form__document">
              <div className="health-form__document-head">
                <span>
                  Постановление Правительства РФ №8
                </span>

                <strong>
                  Форма паспорта
                </strong>
              </div>


              <ol className="health-form__contents">
                <li>
                  <span>
                    01
                  </span>

                  <p>
                    Общие сведения
                    об объекте
                  </p>
                </li>

                <li>
                  <span>
                    02
                  </span>

                  <p>
                    Сведения о работниках
                    и арендаторах
                  </p>
                </li>

                <li>
                  <span>
                    03
                  </span>

                  <p>
                    Потенциально опасные
                    участки и критические
                    элементы
                  </p>
                </li>

                <li>
                  <span>
                    04
                  </span>

                  <p>
                    Возможные последствия
                    террористического акта
                  </p>
                </li>

                <li>
                  <span>
                    05
                  </span>

                  <p>
                    Силы и средства
                    обеспечения защищённости
                  </p>
                </li>

                <li>
                  <span>
                    06
                  </span>

                  <p>
                    Инженерно-техническая
                    и физическая защита
                  </p>
                </li>

                <li>
                  <span>
                    07
                  </span>

                  <p>
                    Меры пожарной
                    безопасности
                  </p>
                </li>

                <li>
                  <span>
                    08
                  </span>

                  <p>
                    Выводы,
                    рекомендации
                    и дополнительная информация
                  </p>
                </li>
              </ol>


              <aside className="health-form__attachments">
                <span>
                  В приложениях
                </span>

                <p>
                  В том числе планы объекта,
                  схема охраны и акт обследования
                  и категорирования.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


      <section className="health-actualization">
        <Container>
          <div className="health-actualization__heading">
            <div>
              <p className="health-kicker">
                Актуализация
              </p>

              <h2>
                Как часто актуализируется
                паспорт объекта здравоохранения
              </h2>
            </div>

            <p>
              Постановление Правительства РФ №8 устанавливает
              периодическую актуализацию,
              а также случаи, когда документ
              необходимо актуализировать
              из-за изменений на объекте.
            </p>
          </div>


          <div className="health-actualization__layout">
            <aside className="health-actualization__period">
              <span>
                Не реже
              </span>

              <strong>
                одного раза
              </strong>

              <p>
                в 5 лет
              </p>

              <small>
                Это правило об актуализации,
                а не формулировка
                «паспорт автоматически
                сгорает через пять лет».
              </small>
            </aside>


            <div className="health-actualization__reasons">
              <p className="health-actualization__label">
                Также при изменении
              </p>

              <article>
                <span>
                  01
                </span>

                <div>
                  <strong>
                    Площадь и периметр
                  </strong>

                  <p>
                    Изменение общей площади
                    и периметра объекта
                    или территории.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  02
                </span>

                <div>
                  <strong>
                    Опасные участки
                    и критические элементы
                  </strong>

                  <p>
                    Изменение количества
                    потенциально опасных
                    и критических элементов.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  03
                </span>

                <div>
                  <strong>
                    Силы и средства
                  </strong>

                  <p>
                    Изменение сил
                    и средств, привлекаемых
                    для обеспечения
                    антитеррористической
                    защищённости.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  04
                </span>

                <div>
                  <strong>
                    Инженерно-техническая защита
                  </strong>

                  <p>
                    Изменение мер
                    по инженерно-технической
                    защите объекта.
                  </p>
                </div>
              </article>
            </div>
          </div>


          <a
            className="health-actualization__link"
            href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
          >
            Подробнее об актуализации
            паспорта безопасности

            <span aria-hidden="true">
              →
            </span>
          </a>
        </Container>
      </section>


      <section className="health-medical">
        <Container>
          <div className="health-medical__layout">
            <div className="health-medical__heading">
              <p className="health-kicker">
                Медицинские организации
              </p>

              <h2>
                Паспорт безопасности
                медицинской организации
              </h2>

              <p>
                При проверке применимости
                требований учитываются
                статус организации,
                назначение и фактические
                характеристики конкретного
                объекта.
              </p>
            </div>


            <div className="health-medical__types">
              <div>
                <span>
                  01
                </span>

                <strong>
                  Больница
                </strong>
              </div>

              <div>
                <span>
                  02
                </span>

                <strong>
                  Поликлиника
                </strong>
              </div>

              <div>
                <span>
                  03
                </span>

                <strong>
                  Медицинский центр
                </strong>
              </div>

              <div>
                <span>
                  04
                </span>

                <strong>
                  Стоматология
                </strong>
              </div>

              <div>
                <span>
                  05
                </span>

                <strong>
                  Частная клиника
                </strong>
              </div>

              <div>
                <span>
                  06
                </span>

                <strong>
                  Медицинская организация
                </strong>
              </div>
            </div>
          </div>


          <aside className="health-medical__pharma">
            <div className="health-medical__pharma-label">
              <span>
                Фармацевтическая деятельность
              </span>

              <strong>
                Аптеки и другие
                фармацевтические объекты
              </strong>
            </div>

            <p>
              Для объектов организаций,
              осуществляющих фармацевтическую
              деятельность, применимость
              требований определяется
              с учётом статуса организации
              и конкретного объекта.
            </p>
          </aside>
        </Container>
      </section>


      <section className="health-current">
        <Container>
          <div className="health-current__layout">
            <div className="health-current__year">
              <span>
                Требования
              </span>

              <strong>
                2026
              </strong>
            </div>


            <div className="health-current__content">
              <p className="health-kicker">
                Актуальная нормативная база
              </p>

              <h2>
                Требования к объектам
                здравоохранения в 2026 году
              </h2>

              <p className="health-current__lead">
                На сентябрь 2026 года
                Постановление Правительства РФ №8 действует
                в редакции от 15.08.2025.
                Перед разработкой документов
                проверяем актуальную редакцию
                нормативных требований
                и фактические характеристики
                объекта.
              </p>


              <div className="health-current__sources">
                <article>
                  <span>
                    Специальные требования
                  </span>

                  <strong>
                    Постановление Правительства РФ №8
                  </strong>

                  <p>
                    Конкретные требования
                    к объектам здравоохранения
                    определяются Постановлением
                    Правительства РФ №8.
                  </p>
                </article>

                <article>
                  <span>
                    Общий стандарт услуг
                  </span>

                  <strong>
                    ГОСТ Р 72551-2026
                  </strong>

                  <p>
                    Стандарт действует
                    с 1 мая 2026 года
                    и устанавливает общие требования
                    к услугам по категорированию
                    и разработке паспортов
                    безопасности.
                  </p>
                </article>
              </div>


              <aside className="health-current__note">
                <span>
                  Приоритет
                </span>

                <p>
                  ГОСТ задаёт общие требования
                  к оказанию услуг,
                  а специальные требования
                  для объектов здравоохранения
                  берём из Постановление Правительства РФ №8.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>

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
