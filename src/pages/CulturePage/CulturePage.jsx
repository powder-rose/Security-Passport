import './CulturePage.css';

import {
  cultureObjects,
  cultureActualizationReasons,
  cultureWhyItems,
  cultureFaqItems,
  cultureServiceItems,
  cultureSourceData,
  cultureFormStructure,
  culturePassportProcess,
  cultureApprovalItems,
  cultureCategories,
  cultureCategorizationSteps,
  regulationScope,
} from './culturePageData';
import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


// CULTURE_REGIONAL_WORK_TEXT_V1:start

function getNeutralCultureRegionPrepositional(
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
    head = head
      .replace(
        /ский край$/,
        'ском крае',
      )
      .replace(
        /цкий край$/,
        'цком крае',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' автономный округ',
    )
  ) {
    head = head
      .replace(
        /ский автономный округ$/,
        'ском автономном округе',
      )
      .replace(
        /цкий автономный округ$/,
        'цком автономном округе',
      );

    return `${head}${tail}`;
  }

  return '';
}


function getCultureRegionalWorkText(
  currentCity,
) {
  if (
    !currentCity ||
    currentCity.isDefault
  ) {
    return '';
  }

  if (
    currentCity.prepositional
  ) {
    return (
      `Работаем в ` +
      `${currentCity.prepositional}.`
    );
  }

  if (
    currentCity.type === 'region'
  ) {
    const regionName =
      getNeutralCultureRegionPrepositional(
        currentCity.name,
      );

    if (regionName) {
      return (
        `Работаем в ${regionName}.`
      );
    }

    return (
      `Работаем в регионе ` +
      `«${currentCity.name}».`
    );
  }

  if (
    currentCity.type === 'city'
  ) {
    return (
      `Работаем в городе ` +
      `«${currentCity.name}».`
    );
  }

  return (
    `Работаем в населённом пункте ` +
    `«${currentCity.name}».`
  );
}

// CULTURE_REGIONAL_WORK_TEXT_V1:end


export default function CulturePage({
  objectType,
}) {
  const city =
    useCity();

  const regionalWorkText =
    getCultureRegionalWorkText(
      city,
    );

  return (
    <main
      id="main-content"
      className="culture-page"
    >
      <section className="culture-hero">
        <Container>
          <nav
            className="culture-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Паспорт безопасности объекта культуры
            </span>
          </nav>

          <div className="culture-hero__layout">
            <div className="culture-hero__content">
              <p className="culture-kicker">
                Объекты и территории
                в сфере культуры
              </p>

              <h1>
                {objectType.h1}
              </h1>

              <p className="culture-hero__lead">
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

              <div className="culture-hero__offer">
                <div className="culture-hero__price">
                  <span>
                    Стоимость
                  </span>

                  <strong>
                    от 9 500 ₽
                  </strong>
                </div>

              </div>

              <div className="culture-hero__actions">
                <a
                  className="button button--primary"
                  href="#contact"
                >
                  Заказать паспорт
                </a>

                <a
                  className="culture-hero__secondary"
                  href="#culture-scope"
                >
                  Проверить, относится ли объект
                  к ПП №176

                  <span aria-hidden="true">
                    ↓
                  </span>
                </a>
              </div>
            </div>

            <aside
              className="culture-hero__regulation"
              aria-label="Ключевые сведения о нормативном режиме"
            >
              <div className="culture-hero__regulation-top">
                <span>
                  Нормативный режим
                </span>

                <strong>
                  №176
                </strong>
              </div>

              <div className="culture-hero__regulation-title">
                <p>
                  Постановление
                  Правительства РФ
                </p>
              </div>

              <div className="culture-hero__facts">
                <div>
                  <span>
                    01
                  </span>

                  <p>
                    По ПП РФ №176
                  </p>
                </div>

                <div>
                  <span>
                    02
                  </span>

                  <p>
                    Категорирование + паспорт
                  </p>
                </div>

                <div>
                  <span>
                    03
                  </span>

                  <p>
                    Сопровождение согласования
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="culture-scope"
        id="culture-scope"
      >
        <Container>
          <div className="culture-scope__heading">
            <div>
              <p className="culture-kicker">
                Область применения
              </p>

              <h2>
                Каким объектам культуры
                нужен паспорт безопасности
              </h2>
            </div>

            <p className="culture-scope__intro">
              ПП РФ №176 применяется к объектам
              и территориям в сфере культуры
              с учётом их правообладателя
              и характера деятельности организации.
            </p>
          </div>

          <div className="culture-scope__body">
            <div className="culture-scope__directory">
              <p className="culture-scope__directory-label">
                Примеры объектов, для которых
                проверяем применимость требований
              </p>

              <div className="culture-scope__list">
                {cultureObjects.map(
                  (item, index) => (
                    <div
                      className="culture-scope__item"
                      key={item}
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <strong>
                        {item}
                      </strong>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="culture-scope__explanation">
              <div className="culture-scope__important">
                <span>
                  Важно
                </span>

                <p>
                  Применимость ПП РФ №176
                  определяется не только названием
                  объекта, но и его правовым статусом,
                  правообладателем и характером
                  деятельности организации.
                </p>
              </div>

              <div className="culture-scope__legal">
                <h3>
                  На какие организации
                  ориентированы требования
                </h3>

                <p>
                  В сферу требований входят,
                  в частности, объекты Минкультуры,
                  его территориальных органов
                  и подведомственных организаций,
                  детских школ искусств
                  с предусмотренными постановлением
                  учредителями, а также иных
                  организаций, для которых деятельность
                  в сфере культуры является
                  основным видом деятельности.
                </p>
              </div>

              <div className="culture-scope__exception">
                <span className="culture-scope__exception-mark">
                  Исключения
                </span>

                <div>
                  <h3>
                    Не каждый связанный
                    с культурой объект подпадает
                    под №176
                  </h3>

                  <p>
                    Требования №176, в частности,
                    не распространяются на объекты
                    туристской индустрии, включающие
                    гостиницы и иные средства
                    размещения, горнолыжные трассы
                    и пляжи.
                  </p>
                </div>
              </div>

              <a
                className="culture-inline-link"
                href="#contact"
              >
                Проверить объект

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="culture-regulation"
        id="culture-regulation"
      >
        <Container>
          <div className="culture-regulation__layout">
            <div className="culture-regulation__identity">
              <p className="culture-kicker">
                Нормативная основа
              </p>

              <span className="culture-regulation__number">
                176
              </span>

              <div className="culture-regulation__dates">
                <div>
                  <span>
                    Действующая редакция
                  </span>

                  <strong>
                    08.05.2025
                  </strong>
                </div>

                <div>
                  <span>
                    Обновлённая форма
                  </span>

                  <strong>
                    с 16.05.2025
                  </strong>
                </div>
              </div>
            </div>

            <div className="culture-regulation__content">
              <div className="culture-regulation__heading">
                <h2>
                  Постановление
                  Правительства РФ №176
                </h2>

                <p>
                  Требования к антитеррористической
                  защищённости объектов и территорий
                  в сфере культуры и форма паспорта
                  безопасности утверждены
                  Постановлением Правительства РФ
                  от 11.02.2017 №176.
                </p>
              </div>

              <div className="culture-regulation__scope">
                {regulationScope.map(
                  (item) => (
                    <article
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
                    </article>
                  ),
                )}
              </div>

              <aside className="culture-regulation__notice">
                <span>
                  2026
                </span>

                <p>
                  При разработке нового паспорта
                  используем действующую форму.
                  Старый шаблон учреждения необходимо
                  проверить на соответствие редакции
                  ПП РФ №176, действующей после
                  изменений 2025 года.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="culture-categories"
        id="culture-categories"
      >
        <Container>
          <div className="culture-categories__header">
            <div>
              <p className="culture-kicker">
                Категорирование
              </p>

              <h2>
                Категории объектов культуры
              </h2>
            </div>

            <div className="culture-categories__intro">
              <p>
                ПП РФ №176 устанавливает три
                категории опасности. Критерием
                является прогнозируемое количество
                людей, которые могут погибнуть
                или получить вред здоровью
                в результате террористического акта.
              </p>

              <strong>
                Категорию определяет комиссия,
                а не исполнитель документа
                единолично.
              </strong>
            </div>
          </div>

          <div className="culture-categories__scale">
            {cultureCategories.map(
              (item) => (
                <article
                  className="culture-categories__item"
                  key={item.number}
                >
                  <span className="culture-categories__roman">
                    {item.number}
                  </span>

                  <div className="culture-categories__item-copy">
                    <span>
                      {item.note}
                    </span>

                    <strong>
                      {item.value}
                    </strong>

                    <h3>
                      {item.title}
                    </h3>
                  </div>
                </article>
              ),
            )}
          </div>

          <div className="culture-categories__note">
            <span aria-hidden="true">
              i
            </span>

            <p>
              Прогнозный показатель определяется
              с учётом пропускной способности,
              количества людей, которые могут
              одновременно находиться на объекте,
              либо количества зрительских мест
              в предусмотренных случаях.
            </p>
          </div>
        </Container>
      </section>


      <section
        className="culture-categorization"
        id="culture-categorization"
      >
        <Container>
          <div className="culture-categorization__layout">
            <div className="culture-categorization__heading">
              <div>
                <p className="culture-kicker">
                  Обследование
                </p>

                <h2>
                  Как проходит категорирование
                  объекта культуры
                </h2>
              </div>

              <div className="culture-categorization__deadline">
                <span>
                  Срок работы комиссии
                </span>

                <strong>
                  до 30
                </strong>

                <p>
                  рабочих дней
                </p>
              </div>

              <p className="culture-categorization__caption">
                Конкретный срок устанавливает
                руководитель организации-правообладателя
                с учётом сложности объекта,
                но он не должен превышать
                30 рабочих дней.
              </p>
            </div>

            <ol className="culture-categorization__steps">
              {cultureCategorizationSteps.map(
                (item, index) => (
                  <li
                    className="culture-categorization__step"
                    key={item.number}
                  >
                    <div className="culture-categorization__step-head">
                      <span>
                        {item.number}
                      </span>

                      {index < cultureCategorizationSteps.length - 1 && (
                        <span
                          className="culture-categorization__connector"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="culture-categorization__step-copy">
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

          <div className="culture-categorization__footer">
            <p>
              Категорирование — это работа комиссии.
              Мы можем подготовить исходные материалы,
              документы и проект акта для прохождения
              установленной процедуры.
            </p>

            <a
              className="culture-inline-link"
              href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
            >
              Подробнее об акте обследования
              и категорирования объекта

              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </Container>
      </section>


      <section
        className="culture-act"
        id="culture-act"
      >
        <Container>
          <div className="culture-act__panel">
            <div className="culture-act__identity">
              <p className="culture-kicker">
                Результат категорирования
              </p>

              <span className="culture-act__big-number">
                2
              </span>

              <strong>
                экземпляра акта
              </strong>
            </div>

            <div className="culture-act__content">
              <div className="culture-act__heading">
                <h2>
                  Акт обследования
                  и категорирования
                  объекта культуры
                </h2>

                <p>
                  Результаты работы комиссии
                  оформляются актом обследования
                  и категорирования объекта
                  или территории.
                </p>
              </div>

              <div className="culture-act__facts">
                <div>
                  <span>
                    01
                  </span>

                  <p>
                    Акт является неотъемлемой
                    частью паспорта безопасности.
                  </p>
                </div>

                <div>
                  <span>
                    02
                  </span>

                  <p>
                    Документ составляется
                    в двух экземплярах.
                  </p>
                </div>

                <div>
                  <span>
                    03
                  </span>

                  <p>
                    Акт подписывается
                    всеми членами комиссии.
                  </p>
                </div>
              </div>

              <div className="culture-act__actions">
                <a
                  className="button button--primary"
                  href="#contact"
                >
                  Заказать акт категорирования
                </a>

                <a
                  className="culture-act__link"
                  href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
                >
                  Страница услуги

                  <span aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="culture-passport"
        id="culture-passport"
      >
        <Container>
          <div className="culture-passport__header">
            <div>
              <p className="culture-kicker">
                Разработка документа
              </p>

              <h2>
                Порядок разработки паспорта
                безопасности объекта культуры
              </h2>
            </div>

            <div className="culture-passport__summary">
              <p>
                На каждый объект или территорию,
                подпадающие под требования ПП РФ №176,
                составляется паспорт безопасности.
              </p>

              <div className="culture-passport__copies">
                <strong>
                  2
                </strong>

                <span>
                  экземпляра
                  паспорта
                </span>
              </div>
            </div>
          </div>

          <div className="culture-passport__process">
            <div className="culture-passport__process-head">
              <span>
                Этап
              </span>

              <span>
                Что происходит
              </span>

              <span>
                Результат
              </span>
            </div>

            <ol>
              {culturePassportProcess.map(
                (item) => (
                  <li key={item.number}>
                    <span className="culture-passport__number">
                      {item.number}
                    </span>

                    <strong>
                      {item.stage}
                    </strong>

                    <p>
                      {item.result}
                    </p>
                  </li>
                ),
              )}
            </ol>
          </div>

          <div className="culture-passport__legal-note">
            <span aria-hidden="true">
              ✓
            </span>

            <p>
              Паспорт составляется комиссией
              в двух экземплярах, подписывается
              членами комиссии и утверждается
              руководителем организации
              в сфере культуры — правообладателем
              объекта.
            </p>
          </div>
        </Container>
      </section>


      <section
        className="culture-approval"
        id="culture-approval"
      >
        <Container>
          <div className="culture-approval__panel">
            <div className="culture-approval__heading">
              <p className="culture-kicker">
                Согласование
              </p>

              <h2>
                С кем согласовывается
                паспорт безопасности
                объекта культуры
              </h2>

              <p>
                ПП РФ №176 устанавливает
                конкретный порядок согласования
                после составления паспорта.
              </p>
            </div>

            <div className="culture-approval__deadline">
              <span>
                Срок
              </span>

              <strong>
                30
              </strong>

              <p>
                дней со дня
                составления паспорта
              </p>
            </div>

            <div className="culture-approval__items">
              {cultureApprovalItems.map(
                (item) => (
                  <article
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
                  </article>
                ),
              )}
            </div>

            <div className="culture-approval__distribution">
              <div>
                <span>
                  Экз. 01
                </span>

                <strong>
                  Хранится на объекте
                </strong>

                <p>
                  Первый экземпляр паспорта
                  безопасности хранится
                  на объекте или территории.
                </p>
              </div>

              <div>
                <span>
                  Экз. 02
                </span>

                <strong>
                  Вышестоящая организация
                </strong>

                <p>
                  Второй экземпляр направляется
                  в вышестоящую организацию
                  в сфере культуры.
                </p>
              </div>

              <div>
                <span>
                  Копия
                </span>

                <strong>
                  Предусмотренные органы
                </strong>

                <p>
                  Копия или электронная копия
                  направляется в предусмотренные
                  ПП РФ №176 территориальные органы.
                </p>
              </div>
            </div>

            <div className="culture-approval__action">
              <p>
                Можем подготовить документ
                к установленной процедуре
                и сопровождать работу
                по обоснованным замечаниям.
              </p>

              <a
                className="button button--primary"
                href="#contact"
              >
                Заказать сопровождение согласования
              </a>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="culture-restricted"
        id="culture-restricted"
      >
        <Container>
          <div className="culture-restricted__layout">
            <div className="culture-restricted__mark">
              <span>
                ДСП
              </span>

              <p>
                Для служебного
                пользования
              </p>
            </div>

            <div className="culture-restricted__content">
              <p className="culture-kicker">
                Ограниченное распространение
              </p>

              <h2>
                Паспорт безопасности объекта
                культуры — не публичный документ
              </h2>

              <p className="culture-restricted__lead">
                ПП РФ №176 устанавливает,
                что паспорт безопасности содержит
                служебную информацию ограниченного
                распространения и имеет пометку
                «Для служебного пользования»,
                если ему не присваивается
                гриф секретности.
              </p>

              <div className="culture-restricted__warning">
                <span>
                  Не размещаем в открытом доступе
                </span>

                <ul>
                  <li>
                    заполненный паспорт
                    действующего объекта;
                  </li>

                  <li>
                    схемы и конкретные сведения
                    о системе защиты;
                  </li>

                  <li>
                    сведения о потенциально опасных
                    участках и критических элементах;
                  </li>

                  <li>
                    иные чувствительные сведения
                    об антитеррористической
                    защищённости объекта.
                  </li>
                </ul>
              </div>

              <p className="culture-restricted__sample">
                Поэтому в блоке с образцом
                на этой странице будем использовать
                официальную форму и обезличенную
                структуру документа, а не заполненный
                паспорт реального учреждения.
              </p>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="culture-service"
        id="culture-service"
      >
        <Container>
          <div className="culture-service__header">
            <div>
              <p className="culture-kicker">
                Состав работ
              </p>

              <h2>
                Что входит в услугу
              </h2>
            </div>

            <div className="culture-service__intro">
              <p>
                Состав работ зависит от того,
                категорирован ли объект,
                есть ли действующий акт
                и требуется ли только разработка
                паспорта или прохождение
                предыдущих этапов.
              </p>

              <strong>
                Точный состав определяем
                после первичной проверки объекта
                и имеющихся документов.
              </strong>
            </div>
          </div>

          <div className="culture-service__grid">
            {cultureServiceItems.map(
              (item) => (
                <article
                  className="culture-service__item"
                  key={item.number}
                >
                  <div className="culture-service__item-head">
                    <span>
                      {item.number}
                    </span>

                    <span
                      className="culture-service__check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </div>

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

          <p className="culture-service__note">
            Перечень выше описывает возможный
            состав работы по объекту и не означает,
            что все этапы автоматически входят
            в базовую стоимость разработки паспорта.
          </p>
        </Container>
      </section>


      <section
        className="culture-price"
        id="culture-price"
      >
        <Container>
          <div className="culture-price__panel">
            <div className="culture-price__main">
              <p className="culture-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость разработки
                паспорта объекта культуры
              </h2>

              <div className="culture-price__value">
                <span>
                  от
                </span>

                <strong>
                  9 500 ₽
                </strong>
              </div>

              <p className="culture-price__description">
                Итоговый объём работ зависит
                от исходного состояния документации
                и того, прошёл ли объект
                обследование и категорирование.
              </p>

              <a
                className="button button--primary"
                href="#contact"
              >
                Получить точную стоимость
              </a>
            </div>

            <div className="culture-price__scenarios">
              <article>
                <span>
                  Сценарий 01
                </span>

                <h3>
                  Акт уже есть
                  и остаётся актуальным
                </h3>

                <p>
                  Если обследование и категорирование
                  уже проведены, можно рассматривать
                  отдельную разработку паспорта
                  по действующей форме.
                </p>
              </article>

              <article>
                <span>
                  Сценарий 02
                </span>

                <h3>
                  Объект ещё
                  не категорирован
                </h3>

                <p>
                  Если действующего акта нет,
                  работу начинаем с подготовки
                  к обследованию и категорированию,
                  после чего оформляется паспорт.
                </p>
              </article>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="culture-source"
        id="culture-source"
      >
        <Container>
          <div className="culture-source__layout">
            <div className="culture-source__heading">
              <p className="culture-kicker">
                Подготовка
              </p>

              <h2>
                Какие данные нужны
                для разработки
              </h2>

              <p>
                Для начала работы собираем
                основные сведения об организации,
                объекте, людях, режимах,
                защите и существующей документации.
              </p>

              <aside className="culture-source__notice">
                Точный перечень определяем
                после первичной проверки объекта
                и имеющихся документов.
              </aside>
            </div>

            <div className="culture-source__list">
              {cultureSourceData.map(
                (item) => (
                  <article
                    className="culture-source__item"
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
                  </article>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>


      <section
        className="culture-form"
        id="culture-form"
      >
        <Container>
          <div className="culture-form__header">
            <div>
              <p className="culture-kicker">
                Форма и образец
              </p>

              <h2>
                Форма паспорта безопасности
                объекта культуры
              </h2>
            </div>

            <div className="culture-form__intro">
              <p>
                Официальная форма паспорта
                утверждена ПП РФ №176.
                После изменений 2025 года
                для нового документа необходимо
                использовать актуальную форму.
              </p>

              <p>
                Заполненный паспорт действующего
                объекта в открытом доступе
                не публикуем из-за ограниченного
                характера содержащихся в нём сведений.
              </p>
            </div>
          </div>

          <div className="culture-form__layout">
            <div className="culture-form__document">
              <div className="culture-form__document-head">
                <span>
                  Паспорт безопасности
                </span>

                <strong>
                  №176
                </strong>
              </div>

              <div className="culture-form__document-body">
                <span>
                  Обезличенная структура
                </span>

                <p>
                  Показываем состав разделов,
                  а не сведения конкретного
                  учреждения культуры.
                </p>
              </div>

              <div className="culture-form__document-footer">
                <span>
                  ДСП
                </span>

                <span>
                  актуальная форма
                </span>
              </div>
            </div>

            <div className="culture-form__structure">
              <p className="culture-form__structure-label">
                Основные разделы формы
              </p>

              <ol>
                {cultureFormStructure.map(
                  (item, index) => (
                    <li key={item}>
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <strong>
                        {item}
                      </strong>
                    </li>
                  ),
                )}
              </ol>

              <a
                className="button button--primary"
                href="#contact"
              >
                Получить форму для объекта культуры
              </a>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="culture-actualization"
        id="culture-actualization"
      >
        <Container>
          <div className="culture-actualization__header">
            <div>
              <p className="culture-kicker">
                Актуализация
              </p>

              <h2>
                Как часто актуализировать
                паспорт объекта культуры
              </h2>
            </div>

            <div className="culture-actualization__periods">
              <div>
                <span>
                  Периодически
                </span>

                <strong>
                  3 года
                </strong>

                <p>
                  не реже одного раза
                </p>
              </div>

              <div>
                <span>
                  При изменениях
                </span>

                <strong>
                  5 дней
                </strong>

                <p>
                  рабочих дней
                  на актуализацию
                </p>
              </div>
            </div>
          </div>

          <div className="culture-actualization__layout">
            <div className="culture-actualization__reasons">
              <p className="culture-actualization__label">
                Актуализация требуется также
                при изменении
              </p>

              {cultureActualizationReasons.map(
                (item) => (
                  <article
                    className="culture-actualization__reason"
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
                  </article>
                ),
              )}
            </div>

            <aside className="culture-actualization__aside">
              <div>
                <span className="culture-actualization__aside-kicker">
                  После актуализации
                </span>

                <p>
                  Изменения заверяются подписью
                  руководителя организации
                  в сфере культуры —
                  правообладателя объекта.
                </p>

                <p>
                  После завершения актуализации
                  паспорт снова направляется
                  на предусмотренное согласование.
                </p>
              </div>

              <a
                className="culture-inline-link"
                href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
              >
                Подробнее об актуализации
                паспорта безопасности

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="culture-standard"
        id="culture-standard"
      >
        <Container>
          <div className="culture-standard__panel">
            <div className="culture-standard__identity">
              <p className="culture-kicker">
                Требования 2026 года
              </p>

              <span>
                ГОСТ
              </span>

              <strong>
                Р 72551-2026
              </strong>
            </div>

            <div className="culture-standard__content">
              <div className="culture-standard__date">
                <span>
                  Действует с
                </span>

                <strong>
                  01.05.2026
                </strong>
              </div>

              <h2>
                Что учитывать
                при разработке в 2026 году
              </h2>

              <p className="culture-standard__lead">
                ГОСТ Р 72551-2026 устанавливает
                общие требования к услугам
                по категорированию объектов
                и разработке паспортов безопасности.
              </p>

              <div className="culture-standard__important">
                <span>
                  Важно
                </span>

                <p>
                  ГОСТ Р 72551-2026 не заменяет
                  специальные требования
                  ПП РФ №176. Для объекта культуры
                  конкретный порядок категорирования
                  и форма паспорта определяются
                  прежде всего применимыми
                  обязательными требованиями №176.
                </p>
              </div>

              <div className="culture-standard__facts">
                <div>
                  <span>
                    ПП РФ №176
                  </span>

                  <p>
                    Действующая редакция —
                    от 08.05.2025.
                  </p>
                </div>

                <div>
                  <span>
                    Форма паспорта
                  </span>

                  <p>
                    Изменённая форма применяется
                    после изменений мая 2025 года.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="culture-why"
        id="culture-why"
      >
        <Container>
          <div className="culture-why__header">
            <div>
              <p className="culture-kicker">
                Подход к работе
              </p>

              <h2>
                Почему БОЙКОВГРУПП
              </h2>
            </div>

            <p>
              Для объекта культуры важно
              правильно определить нормативный
              режим и последовательно пройти
              категорирование, оформление акта,
              разработку паспорта
              и предусмотренное согласование.
            </p>
          </div>

          <div className="culture-why__grid">
            {cultureWhyItems.map(
              (item) => (
                <article
                  className="culture-why__item"
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
                </article>
              ),
            )}
          </div>

          <nav
            className="culture-why__links"
            aria-label="Связанные услуги"
          >
            <a href="/">
              Паспорт безопасности объекта
              <span aria-hidden="true">
                ↗
              </span>
            </a>

            <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
              Акт обследования и категорирования
              <span aria-hidden="true">
                ↗
              </span>
            </a>

            <a href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
              Актуализация паспорта безопасности
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </nav>
        </Container>
      </section>


      <section
        className="culture-faq"
        id="culture-faq"
      >
        <Container>
          <div className="culture-faq__layout">
            <div className="culture-faq__heading">
              <div>
                <p className="culture-kicker">
                  Вопросы и ответы
                </p>

                <h2>
                  Частые вопросы
                  о паспорте безопасности
                  объекта культуры
                </h2>
              </div>

              <p>
                Ответы по ПП РФ №176,
                категорированию, актуализации,
                форме паспорта, ДСП
                и согласованию.
              </p>
            </div>

            <div className="culture-faq__list">
              {cultureFaqItems.map(
                (item, index) => (
                  <details
                    className="culture-faq__item"
                    key={item.question}
                  >
                    <summary>
                      <span className="culture-faq__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="culture-faq__question">
                        {item.question}
                      </span>

                      <span
                        className="culture-faq__toggle"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>

                    <div className="culture-faq__answer">
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
