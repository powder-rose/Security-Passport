import './CulturePage.css';

import {
  cultureActualizationReasons,
  cultureWhyItems,
  cultureFaqItems,
  cultureServiceItems,
  cultureSourceData,
  cultureFormStructure,
  cultureApprovalItems,
} from './culturePageData';

import CultureHeroAndObjects
from './components/CultureHeroAndObjects';

import CultureRegulationAndCategories
from './components/CultureRegulationAndCategories';

import CultureCategorization
from './components/CultureCategorization';

import CultureActAndPassport
from './components/CultureActAndPassport';
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
      <CultureHeroAndObjects
        objectType={objectType}
        regionalWorkText={regionalWorkText}
      />


      <CultureRegulationAndCategories />


      <CultureCategorization />


      <CultureActAndPassport />


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
