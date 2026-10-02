import './EducationPage.css';

import {
  educationObjects,
  regulationTracks,
  educationCategories,
  educationProcess,
  approvalAuthorities,
  educationServiceItems,
  educationPrices,
  educationSourceData,
  educationPassportStructure,
  educationActualizationReasons,
  educationAudienceItems,
  educationFaqItems,
} from './educationPageData';
import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';



function getNeutralRegionPrepositional(
  name,
) {
  const value =
    String(name || '').trim();

  if (!value) {
    return '';
  }

  const parts =
    value.split(' — ');

  let head =
    parts[0];

  const tail =
    parts.length > 1
      ? ` — ${parts.slice(1).join(' — ')}`
      : '';

  if (
    head.startsWith(
      'Республика ',
    )
  ) {
    return (
      `Республике ${head.slice(
        'Республика '.length,
      )}${tail}`
    );
  }

  if (
    head.endsWith(
      ' Республика',
    )
  ) {
    head = head
      .replace(
        /ская Республика$/,
        'ской Республике',
      )
      .replace(
        /цкая Республика$/,
        'цкой Республике',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' область',
    )
  ) {
    head = head
      .replace(
        /ская /g,
        'ской ',
      )
      .replace(
        /цкая /g,
        'цкой ',
      )
      .replace(
        /ная /g,
        'ной ',
      )
      .replace(
        /яя /g,
        'ей ',
      )
      .replace(
        / область$/,
        ' области',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' край',
    )
  ) {
    return (
      `${head
        .replace(
          /ский край$/,
          'ском крае',
        )
        .replace(
          /цкий край$/,
          'цком крае',
        )}${tail}`
    );
  }

  if (
    head.endsWith(
      ' автономный округ',
    )
  ) {
    return (
      `${head
        .replace(
          /ский автономный округ$/,
          'ском автономном округе',
        )
        .replace(
          /цкий автономный округ$/,
          'цком автономном округе',
        )}${tail}`
    );
  }

  return '';
}


function getRegionalWorkText(
  city,
) {
  if (
    !city ||
    city.isDefault
  ) {
    return '';
  }

  if (city.prepositional) {
    return (
      `Работаем в ${city.prepositional}.`
    );
  }

  if (
    city.type === 'region'
  ) {
    const name =
      getNeutralRegionPrepositional(
        city.name,
      );

    if (name) {
      return `Работаем в ${name}.`;
    }

    return (
      `Работаем в регионе ` +
      `«${city.name}».`
    );
  }

  if (
    city.type === 'city'
  ) {
    return (
      `Работаем в городе ` +
      `«${city.name}».`
    );
  }

  return (
    `Работаем в населённом пункте ` +
    `«${city.name}».`
  );
}



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
      <section className="education-hero">
        <Container>
          <nav
            className="education-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Образовательные организации
            </span>
          </nav>


          <div className="education-hero__layout">
            <div className="education-hero__content">
              <p className="education-kicker">
                Образовательные организации
              </p>

              <h1>
                {objectType.h1}
              </h1>

              <p className="education-hero__lead">
                {objectType.pageLead}

                {regionalWorkText ? (
                  <>
                    {' '}
                    {regionalWorkText}
                  </>
                ) : null}
                {' '}
                <span className="coverage-emphasis">Работаем по всей России</span>.
              </p>


              <div className="education-hero__commercial">
                <div className="education-hero__price">
                  <span>
                    Стоимость разработки
                  </span>

                  <strong>
                    от 9 500 ₽
                  </strong>
                </div>

                <div className="education-hero__facts">
                  <span>
                    Категорирование + паспорт
                  </span>

                  <span>
                    Определяем применимый нормативный акт
                  </span>

                  <span>
                    Сопровождение согласования
                  </span>
                </div>
              </div>


              <div className="education-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Заказать паспорт
                </a>

                <a
                  className="education-button-secondary"
                  href="#education-requirements"
                >
                  Проверить требования для моей организации

                  <span aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>


            <aside className="education-hero__panel">
              <p className="education-hero__panel-label">
                Нормативный режим
              </p>

              <div className="education-hero__panel-number">
                1006
                <span>/</span>
                1421
              </div>

              <h2>
                Сначала определяем,
                какие требования применяются к объекту
              </h2>

              <p>
                Для образовательных организаций нет
                одного универсального нормативного
                режима на все случаи.
              </p>

              <div className="education-hero__panel-footer">
                Вид организации
                <span>+</span>
                ведомственная принадлежность
              </div>
            </aside>
          </div>
        </Container>
      </section>


      <section className="education-objects">
        <Container>
          <div className="education-section-heading">
            <p className="education-kicker">
              Объекты образования
            </p>

            <h2>
              Для каких образовательных объектов
              разрабатываем паспорта
            </h2>

            <p>
              Разрабатываем документацию для объектов
              образовательных организаций после
              определения применимых к конкретному
              объекту требований.
            </p>
          </div>


          <div className="education-objects__layout">
            <div className="education-objects__list">
              {educationObjects.map(
                (item) => (
                  <article
                    className={
                      item.note
                        ? 'education-object education-object--important'
                        : 'education-object'
                    }
                    key={item.number}
                  >
                    <span className="education-object__number">
                      {item.number}
                    </span>

                    <div>
                      <h3>
                        {item.title}
                      </h3>

                      {item.note ? (
                        <p>
                          {item.note}
                        </p>
                      ) : null}
                    </div>

                    <span
                      className="education-object__mark"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </article>
                ),
              )}
            </div>


            <aside className="education-objects__note">
              <span>
                Важно
              </span>

              <h3>
                Название учреждения само по себе
                не определяет форму паспорта
              </h3>

              <p>
                Сначала проверяем вид организации,
                сферу деятельности и ведомственную
                принадлежность конкретного объекта.
              </p>
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="education-regulation"
        id="education-requirements"
      >
        <Container>
          <div className="education-regulation__intro">
            <p className="education-kicker">
              Нормативный режим
            </p>

            <h2>
              Какое постановление применяется
              к образовательной организации
            </h2>

            <p>
              Для образовательных организаций нет
              одного универсального нормативного режима
              на все случаи. Требования определяются
              в том числе ведомственной принадлежностью
              и сферой деятельности объекта.
            </p>
          </div>


          <div className="education-regulation__tracks">
            {regulationTracks.map(
              (item) => (
                <article
                  className="education-regulation__track"
                  key={item.number}
                >
                  <div className="education-regulation__track-top">
                    <span>
                      {item.number}
                    </span>

                    <strong>
                      {item.act}
                    </strong>
                  </div>

                  <h3>
                    {item.audience}
                  </h3>

                  <p>
                    {item.date}
                  </p>
                </article>
              ),
            )}
          </div>


          <div className="education-regulation__action">
            <div>
              <strong>
                Не уверены, какое постановление
                относится к вашей организации?
              </strong>

              <p>
                Определим применимые требования
                до начала подготовки документов.
              </p>
            </div>

            <a
              className="button button--primary"
              href="#lead-form"
            >
              Определить требования для моего объекта
            </a>
          </div>
        </Container>
      </section>



      {/* EDUCATION_STAGE_2_V1:sections */}

      <section className="education-categories">
        <Container>
          <div className="education-categories__heading">
            <div>
              <p className="education-kicker">
                Категорирование
              </p>

              <h2>
                Категорирование образовательной организации
              </h2>
            </div>

            <p className="education-categories__lead">
              Для объектов, подпадающих под ПП РФ №1006,
              предусмотрены четыре категории опасности.
              Категория определяется с учётом
              прогнозируемого количества пострадавших
              и численности населения населённого пункта.
            </p>
          </div>


          <div className="education-categories__notice">
            <span
              className="education-categories__notice-mark"
              aria-hidden="true"
            >
              !
            </span>

            <div>
              <strong>
                Категорию определяет комиссия
                по обследованию и категорированию
              </strong>

              <p>
                Подрядчик может готовить исходные
                материалы, расчёты и проекты документов,
                но не присваивает категорию объекту
                единолично.
              </p>
            </div>
          </div>


          <div className="education-categories__list">
            {educationCategories.map(
              (category) => (
                <details
                  className="education-category"
                  key={category.id}
                >
                  <summary>
                    <span className="education-category__title">
                      {category.title}
                    </span>

                    <span className="education-category__summary">
                      {category.summary}
                    </span>

                    <span
                      className="education-category__toggle"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>

                  <div className="education-category__body">
                    <ul>
                      {category.criteria.map(
                        (criterion) => (
                          <li key={criterion}>
                            {criterion}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </details>
              ),
            )}
          </div>


          <a
            className="education-text-link"
            href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
          >
            Акт обследования и категорирования объекта

            <span aria-hidden="true">
              →
            </span>
          </a>
        </Container>
      </section>


      <section className="education-process">
        <Container>
          <div className="education-process__heading">
            <p className="education-kicker">
              Порядок работы
            </p>

            <h2>
              Как оформить паспорт безопасности
              образовательной организации
            </h2>

            <p>
              Сначала определяем нормативный режим
              конкретного объекта. После этого
              последовательно проходим этапы
              категорирования и подготовки паспорта.
            </p>
          </div>


          <ol className="education-process__list">
            {educationProcess.map(
              (item, index) => (
                <li
                  className="education-process__step"
                  key={item}
                >
                  <span className="education-process__number">
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


          <aside className="education-process__term">
            <span>
              Для объектов по ПП РФ №1006
            </span>

            <strong>
              Паспорт составляется
              в течение 30 дней
            </strong>

            <p>
              Срок отсчитывается после проведения
              обследования и категорирования объекта.
            </p>
          </aside>
        </Container>
      </section>


      <section className="education-approval">
        <Container>
          <div className="education-approval__layout">
            <div className="education-approval__heading">
              <p className="education-kicker">
                Согласование по №1006
              </p>

              <h2>
                С кем согласовывается паспорт
                образовательной организации
              </h2>

              <p>
                По ПП РФ №1006 паспорт подписывает
                лицо, непосредственно руководящее
                деятельностью работников на объекте.
                После этого документ проходит
                установленное согласование.
              </p>
            </div>


            <div className="education-approval__content">
              <div className="education-approval__authorities">
                {approvalAuthorities.map(
                  (item) => (
                    <article
                      className="education-approval__authority"
                      key={item.number}
                    >
                      <span>
                        {item.number}
                      </span>

                      <h3>
                        {item.title}
                      </h3>
                    </article>
                  ),
                )}
              </div>


              <div className="education-approval__timing">
                <div>
                  <span>
                    Общий срок согласования
                  </span>

                  <strong>
                    не более 45 рабочих дней
                  </strong>

                  <p>
                    Со дня подписания паспорта.
                  </p>
                </div>

                <div>
                  <span>
                    Рассмотрение каждым органом
                  </span>

                  <strong>
                    не более 10 дней
                  </strong>

                  <p>
                    С момента поступления документа.
                  </p>
                </div>
              </div>


              <div className="education-approval__finish">
                <span>
                  После согласования
                </span>

                <p>
                  Паспорт утверждает руководитель
                  организации-правообладателя
                  либо уполномоченное лицо.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>



      {/* EDUCATION_STAGE_3_V1:sections */}

      <section className="education-copies">
        <Container>
          <div className="education-copies__heading">
            <p className="education-kicker">
              Экземпляры и хранение
            </p>

            <h2>
              Сколько экземпляров паспорта оформляется
            </h2>

            <p>
              Порядок зависит от нормативного режима
              конкретного образовательного объекта.
            </p>
          </div>


          <div className="education-copies__comparison">
            <article className="education-copies__card education-copies__card--primary">
              <div className="education-copies__card-top">
                <span>
                  ПП РФ №1006
                </span>

                <strong>
                  2 экземпляра
                </strong>
              </div>

              <ol>
                <li>
                  <span>
                    01
                  </span>

                  <p>
                    Первый экземпляр хранится
                    непосредственно на объекте.
                  </p>
                </li>

                <li>
                  <span>
                    02
                  </span>

                  <p>
                    Второй направляется организации
                    или органу, являющемуся
                    правообладателем объекта.
                  </p>
                </li>
              </ol>

              <div className="education-copies__extra">
                <strong>
                  Дополнительно
                </strong>

                <p>
                  Копия паспорта направляется
                  в территориальный орган безопасности.
                </p>
              </div>
            </article>


            <article className="education-copies__card">
              <div className="education-copies__card-top">
                <span>
                  ПП РФ №1421
                </span>

                <strong>
                  1 экземпляр
                </strong>
              </div>

              <p className="education-copies__card-text">
                Для объекта, подпадающего под этот
                нормативный режим, порядок оформления
                отличается от правил ПП РФ №1006.
              </p>

              <div className="education-copies__warning">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  Количество экземпляров и порядок
                  хранения нельзя автоматически
                  переносить с одного вида
                  образовательного объекта на другой.
                </p>
              </div>
            </article>
          </div>
        </Container>
      </section>


      <section className="education-restricted">
        <Container>
          <div className="education-restricted__layout">
            <div className="education-restricted__marker">
              ДСП
            </div>

            <div className="education-restricted__content">
              <p className="education-kicker">
                Ограниченное распространение
              </p>

              <h2>
                Можно ли публиковать паспорт
                образовательной организации
              </h2>

              <p className="education-restricted__lead">
                Для объектов по ПП РФ №1006 паспорт
                является документом со служебной
                информацией ограниченного
                распространения и имеет пометку
                «Для служебного пользования».
              </p>


              <div className="education-restricted__rule">
                <strong>
                  Поэтому реальный заполненный
                  паспорт клиента не публикуем.
                </strong>

                <p>
                  Для ознакомления используем
                  официальную форму, обезличенную
                  структуру документа и пояснения
                  по заполнению.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section className="education-service">
        <Container>
          <div className="education-service__heading">
            <p className="education-kicker">
              Что входит в работу
            </p>

            <h2>
              Разработка документов
              для образовательной организации
            </h2>

            <p>
              Состав работ определяется после
              проверки применимых требований
              и текущего состояния документов
              конкретного объекта.
            </p>
          </div>


          <div className="education-service__list">
            {educationServiceItems.map(
              (item) => (
                <article
                  className="education-service__item"
                  key={item.number}
                >
                  <span className="education-service__number">
                    {item.number}
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
              ),
            )}
          </div>
        </Container>
      </section>


      <section className="education-price">
        <Container>
          <div className="education-price__layout">
            <div className="education-price__heading">
              <p className="education-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость разработки паспорта
                образовательной организации
              </h2>

              <p>
                Можно заказать отдельный документ
                или комплекс работ в зависимости
                от текущего состояния объекта
                и имеющейся документации.
              </p>
            </div>


            <div className="education-price__content">
              <div className="education-price__list">
                {educationPrices.map(
                  (item) => (
                    <article
                      className="education-price__item"
                      key={item.title}
                    >
                      <div>
                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          {item.note}
                        </p>
                      </div>

                      <strong>
                        {item.price}
                      </strong>
                    </article>
                  ),
                )}
              </div>


              <div className="education-price__note">
                <span aria-hidden="true">
                  ✓
                </span>

                <p>
                  Если у образовательной организации
                  уже имеется актуальный акт
                  категорирования, можно заказать
                  только разработку паспорта.
                  Если объект ещё не категорирован,
                  сначала проводится соответствующая
                  процедура.
                </p>
              </div>


              <a
                className="button button--primary"
                href="#lead-form"
              >
                Рассчитать стоимость
              </a>
            </div>
          </div>
        </Container>
      </section>



      {/* EDUCATION_STAGE_4_V1:sections */}

      <section className="education-source-data">
        <Container>
          <div className="education-source-data__layout">
            <div className="education-source-data__heading">
              <p className="education-kicker">
                Исходные данные
              </p>

              <h2>
                Что желательно подготовить
                образовательной организации
              </h2>

              <p>
                На старте нужны основные сведения,
                позволяющие определить применимые
                требования и понять текущее состояние
                документов по объекту.
              </p>


              <aside className="education-source-data__note">
                <span aria-hidden="true">
                  ✓
                </span>

                <p>
                  Точный перечень уточняем после
                  идентификации конкретного объекта
                  и его нормативного режима.
                </p>
              </aside>
            </div>


            <ol className="education-source-data__list">
              {educationSourceData.map(
                (item) => (
                  <li
                    className="education-source-data__item"
                    key={item.number}
                  >
                    <span>
                      {item.number}
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
          </div>
        </Container>
      </section>


      <section className="education-form">
        <Container>
          <div className="education-form__header">
            <div>
              <p className="education-kicker">
                Форма и образец
              </p>

              <h2>
                Форма паспорта безопасности
                образовательной организации
              </h2>
            </div>

            <p>
              ПП РФ №1006 содержит утверждённую
              форму паспорта для объектов,
              подпадающих под этот нормативный режим.
            </p>
          </div>


          <div className="education-form__layout">
            <div className="education-form__intro">
              <span className="education-form__index">
                08
              </span>

              <h3>
                Основные разделы
                формы паспорта
              </h3>

              <p>
                Показываем структуру документа
                и поясняем состав сведений.
                Заполненный паспорт конкретного
                клиента публично не размещаем.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Получить форму паспорта
              </a>
            </div>


            <ol className="education-form__structure">
              {educationPassportStructure.map(
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


      <section className="education-actualization">
        <Container>
          <div className="education-actualization__header">
            <div>
              <p className="education-kicker">
                Актуализация по №1006
              </p>

              <h2>
                Как часто актуализируется
                паспорт образовательной организации
              </h2>
            </div>


            <div className="education-actualization__period">
              <span>
                Не реже
              </span>

              <strong>
                1 раз
                <small>
                  в 5 лет
                </small>
              </strong>
            </div>
          </div>


          <div className="education-actualization__body">
            <div>
              <h3>
                Также актуализация проводится
                при изменении
              </h3>

              <div className="education-actualization__reasons">
                {educationActualizationReasons.map(
                  (item) => (
                    <article
                      className="education-actualization__reason"
                      key={item.number}
                    >
                      <span>
                        {item.number}
                      </span>

                      <p>
                        {item.title}
                      </p>
                    </article>
                  ),
                )}
              </div>
            </div>


            <aside className="education-actualization__aside">
              <p className="education-actualization__aside-kicker">
                После актуализации
              </p>

              <h3>
                Изменения должны быть отражены
                во всех экземплярах
              </h3>

              <p>
                Изменения прилагаются ко всем
                экземплярам паспорта с указанием
                причины и даты их внесения.
              </p>

              <div className="education-actualization__storage">
                <strong>
                  Ещё 5 лет
                </strong>

                <p>
                  хранится на объекте паспорт,
                  который был заменён
                  по результатам актуализации.
                </p>
              </div>
            </aside>
          </div>


          <div className="education-actualization__footer">
            <p>
              Для объекта, подпадающего под другой
              нормативный режим, основания и порядок
              актуализации проверяются отдельно.
            </p>

            <a
              className="education-text-link"
              href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
            >
              Подробнее об актуализации
              паспорта безопасности

              <span aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </Container>
      </section>



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
