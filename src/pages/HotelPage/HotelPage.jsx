import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


const heroFacts = [
  'Постановление Правительства РФ №447',
  '4 категории опасности',
  'Категорирование + паспорт + согласование',
];


const hotelWhyItems = [
  {
    number: '01',
    title:
      'Сначала определяем нормативный режим',
    text:
      'Не используем форму паспорта только по названию объекта. Проверяем, применяется ли к гостинице ПП РФ №447 или для неё действует другой режим.',
  },
  {
    number: '02',
    title:
      'Учитываем работу комиссии',
    text:
      'Категорию определяет комиссия по результатам обследования. Мы готовим документы и материалы для прохождения установленной процедуры.',
  },
  {
    number: '03',
    title:
      'Связываем этапы в один процесс',
    text:
      'Категорирование, проект акта, разработка паспорта и подготовка к согласованию рассматриваются как последовательные этапы одной задачи.',
  },
  {
    number: '04',
    title:
      'Работаем по всей России',
    text:
      'Проверяем исходные данные объекта и выстраиваем документальную работу с учётом применимых требований.',
  },
];


const hotelFaqItems = [
  {
    question:
      'Кому нужен паспорт безопасности гостиницы?',
    answer:
      'Если на гостиницу распространяется ПП РФ №447, паспорт безопасности составляется для гостиниц I, II и III категорий опасности. Для гостиниц IV категории паспорт безопасности по ПП РФ №447 не составляется. До начала разработки также необходимо проверить, не относится ли объект к исключениям из сферы действия №447.',
  },
  {
    question:
      'Какое постановление регулирует паспорт гостиницы?',
    answer:
      'Основные обязательные требования к антитеррористической защищённости гостиниц и иных средств размещения, порядок категорирования и форма паспорта безопасности установлены Постановлением Правительства РФ от 14.04.2017 №447.',
  },
  {
    question:
      'Кто разрабатывает паспорт безопасности гостиницы?',
    answer:
      'Ответственность за обеспечение антитеррористической защищённости несёт ответственное лицо, определённое ПП РФ №447. Специализированная организация может подготовить проект паспорта и комплект документов, а утверждается паспорт ответственным лицом после предусмотренного согласования.',
  },
  {
    question:
      'Кто присваивает гостинице категорию опасности?',
    answer:
      'Категория определяется комиссией по результатам обследования гостиницы. Подрядчик или специалист не присваивает категорию единолично.',
  },
  {
    question:
      'С кем согласовывается паспорт безопасности гостиницы?',
    answer:
      'Паспорт согласовывается с руководителем территориального органа безопасности или уполномоченным им лицом, а также с руководителем соответствующего территориального органа Росгвардии или подразделения вневедомственной охраны. После этого паспорт утверждается ответственным лицом.',
  },
  {
    question:
      'Сколько экземпляров паспорта оформляется?',
    answer:
      'По ПП РФ №447 паспорт безопасности гостиницы составляется в трёх экземплярах.',
  },
  {
    question:
      'Сколько стоит паспорт безопасности гостиницы?',
    answer:
      'Разработка паспорта безопасности гостиницы — от 9 500 ₽. Точную стоимость определяем после проверки объекта, исходных данных и необходимого состава работ.',
  },
  {
    question:
      'Какие документы нужны для разработки?',
    answer:
      'На старте нужны основные сведения об организации и объекте: адрес, характеристики гостиницы, планы или схемы, данные о количестве гостей и персонала, охране и технических средствах защиты, а также существующий акт или паспорт при их наличии. Точный перечень определяем после первичной проверки.',
  },
  {
    question:
      'Нужен ли сначала акт категорирования?',
    answer:
      'Да. Для гостиниц I–III категорий паспорт составляется после обследования и категорирования комиссией. Результаты обследования и категорирования оформляются актом.',
  },
  {
    question:
      'Как выглядит форма паспорта безопасности гостиницы?',
    answer:
      'Форма паспорта утверждена ПП РФ №447. Она включает сведения о гостинице, её характеристиках, категории, работниках и посетителях, потенциально опасных участках и критических элементах, охране, технических средствах защиты, мероприятиях и предусмотренных приложениях.',
  },
  {
    question:
      'Когда паспорт гостиницы нужно актуализировать?',
    answer:
      'Паспорт актуализируется не реже одного раза в 5 лет, а также при наступлении оснований, перечисленных в ПП РФ №447. При возникновении такого обстоятельства актуализация проводится в течение 30 дней.',
  },
  {
    question:
      'Что делать, если гостиница уже относится к месту массового пребывания людей?',
    answer:
      'ПП РФ №447 не распространяется на гостиницы, включённые в перечни мест массового пребывания людей, формируемые по ПП РФ №272. В такой ситуации сначала необходимо определить применимый нормативный режим и не оформлять два параллельных паспорта по разным постановлениям.',
  },
];


const hotelFormStructure = [
  'Титульная часть',
  'Сведения о гостинице',
  'Результаты категорирования',
  'Характеристики объекта',
  'Сведения о защите',
  'Мероприятия',
  'Актуализация и иные предусмотренные разделы',
];


const hotelActualizationReasons = [
  {
    title:
      'Изменились требования',
    text:
      'Установлены новые или дополнительные нормативные требования к антитеррористической защищённости.',
  },
  {
    title:
      'Изменилась ситуация в регионе',
    text:
      'Изменилась криминогенная ситуация в субъекте Российской Федерации или муниципальном образовании.',
  },
  {
    title:
      'Реконструкция или застройка',
    text:
      'Изменилась застройка территории гостиницы или завершились работы по реконструкции.',
  },
  {
    title:
      'Изменилась техническая защита',
    text:
      'Появились или были дополнительно установлены технические средства контроля, защиты или видеонаблюдения.',
  },
  {
    title:
      'Изменился собственник',
    text:
      'Сменился собственник, наименование или организационно-правовая форма.',
  },
  {
    title:
      'Изменились данные должностных лиц',
    text:
      'Изменились персональные данные, состав должностных лиц или способы связи с ними.',
  },
];


const hotelAccommodationTypes = [
  {
    number: '01',
    title: 'Гостиница',
  },
  {
    number: '02',
    title: 'Отель',
  },
  {
    number: '03',
    title: 'Иное средство размещения',
  },
];


const hotelServiceItems = [
  'Проверка применимого нормативного режима',
  'Анализ исходных данных',
  'Подготовка к категорированию',
  'Подготовка проекта акта',
  'Разработка паспорта безопасности',
  'Проверка по форме ПП РФ №447',
  'Подготовка к согласованию',
  'Сопровождение по замечаниям',
];


const hotelSourceData = [
  {
    title: 'Организация',
    text:
      'собственник / эксплуатирующее лицо',
  },
  {
    title: 'Адрес',
    text:
      'фактический адрес гостиницы',
  },
  {
    title: 'Характеристики',
    text:
      'площадь, этажность, вместимость',
  },
  {
    title: 'Планировка',
    text:
      'планы / схемы',
  },
  {
    title: 'Люди',
    text:
      'количество гостей и персонала',
  },
  {
    title: 'Охрана',
    text:
      'организация охраны объекта',
  },
  {
    title: 'Техническая защита',
    text:
      'видеонаблюдение, сигнализация и др.',
  },
  {
    title: 'Документы',
    text:
      'существующий акт/паспорт при наличии',
  },
];


const hotelCategories = [
  {
    category: 'I категория',
    value: 'более 1 000 человек',
  },
  {
    category: 'II категория',
    value: 'от 200 до 1 000 человек',
  },
  {
    category: 'III категория',
    value: 'от 50 до 200 человек',
  },
  {
    category: 'IV категория',
    value: 'менее 50 человек',
  },
];


const hotelProcess = [
  {
    title:
      'Определяем применимость ПП РФ №447',
  },
  {
    title:
      'Собираем сведения о гостинице',
  },
  {
    title:
      'Готовим документы для категорирования',
  },
  {
    title:
      'Проводится обследование и определяется категория',
  },
  {
    title:
      'Оформляется акт',
  },
  {
    title:
      'Разрабатывается паспорт безопасности',
  },
  {
    title:
      'Паспорт проходит предусмотренное согласование',
  },
  {
    title:
      'Заказчик получает комплект документов',
  },
];


const regulationPoints = [
  {
    number: '01',
    title: 'Определяем применимый режим',
    text:
      'Сначала проверяем, распространяются ли требования Постановления №447 именно на конкретную гостиницу или средство размещения.',
  },
  {
    number: '02',
    title: 'Учитываем категорирование',
    text:
      'Требования предусматривают категорирование объекта. Категория определяется комиссией по результатам обследования.',
  },
  {
    number: '03',
    title: 'Работаем по установленной форме',
    text:
      'Форма паспорта безопасности гостиницы установлена применимыми требованиями. Документ готовится после определения нормативного режима объекта.',
  },
];


export default function HotelPage({
  objectType,
}) {
  const city =
    useCity();

  const getNeutralRegionPrepositional = (
    name,
  ) => {
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
  };


  const getRegionalWorkText = (
    currentCity,
  ) => {
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
        getNeutralRegionPrepositional(
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
  };


  const regionalWorkText =
    getRegionalWorkText(
      city,
    );

  return (
    <main
      id="main-content"
      className="hotel-page"
    >
      <section className="hotel-hero">
        <Container>
          <nav
            className="hotel-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Паспорт безопасности гостиницы
            </span>
          </nav>

          <div className="hotel-hero__layout">
            <div className="hotel-hero__content">
              <p className="hotel-kicker">
                Антитеррористическая защищённость
                средств размещения
              </p>

              <h1>
                {objectType.h1}
              </h1>

              <p className="hotel-hero__lead">
                {objectType.pageLead}

                {regionalWorkText ? (
                  <>
                    {' '}
                    {regionalWorkText}
                  </>
                ) : null}
              </p>

              <div className="hotel-hero__commercial">
                <div className="hotel-hero__price">
                  <span>
                    Стоимость
                  </span>

                  <strong>
                    от 9 500 ₽
                  </strong>

                  <small>
                    разработка паспорта
                  </small>
                </div>

              </div>

              <div className="hotel-hero__actions">
                <a
                  className="button button--primary"
                  href="#contact"
                >
                  Заказать паспорт
                </a>

                <a
                  className="hotel-hero__check"
                  href="#hotel-check"
                >
                  Проверить, нужен ли паспорт гостинице

                  <span aria-hidden="true">
                    ↓
                  </span>
                </a>
              </div>
            </div>

            <aside
              className="hotel-hero__panel"
              aria-label="Ключевые сведения"
            >
              <p className="hotel-hero__panel-label">
                Для гостиниц
              </p>

              <h2>
                Сначала определяем требования,
                потом оформляем документы
              </h2>

              <div className="hotel-hero__panel-list">
                {heroFacts.map(
                  (item, index) => (
                    <div
                      className="hotel-hero__panel-item"
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

                      <p>
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="hotel-check"
        id="hotel-check"
      >
        <Container>
          <div className="hotel-check__layout">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">
                Применимость требований
              </p>

              <h2>
                Нужен ли паспорт безопасности
                гостинице
              </h2>
            </div>

            <div className="hotel-check__content">
              <p className="hotel-check__lead">
                Постановление Правительства РФ №447
                устанавливает требования к
                антитеррористической защищённости
                гостиниц и иных средств размещения,
                включая категорирование и разработку
                паспорта безопасности.
              </p>

              <p>
                Но применять требования только потому,
                что объект называется гостиницей,
                неправильно. Для части объектов может
                действовать иной нормативный режим.
              </p>

              <aside className="hotel-check__important">
                <span className="hotel-check__important-mark">
                  Важно
                </span>

                <div>
                  <h3>
                    Сначала проверяем статус объекта
                  </h3>

                  <p>
                    Требования №447, в частности,
                    не применяются к гостиницам,
                    включённым в перечни мест массового
                    пребывания людей по Постановлению
                    Правительства РФ №272, а также
                    к отдельным объектам, для которых
                    установлены специальные требования.
                  </p>
                </div>
              </aside>

              <a
                className="hotel-inline-link"
                href="#contact"
              >
                Проверить гостиницу

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="hotel-regulation"
        id="hotel-regulation"
      >
        <Container>
          <div className="hotel-regulation__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">
                Нормативная основа
              </p>

              <h2>
                Постановление Правительства РФ №447
              </h2>
            </div>

            <p className="hotel-regulation__intro">
              Основным нормативным документом
              для антитеррористической защищённости
              гостиниц и иных средств размещения
              является Постановление Правительства РФ
              от 14.04.2017 №447. Оно устанавливает
              требования к категорированию, защите
              гостиниц и форме паспорта безопасности.
            </p>
          </div>

          <div className="hotel-regulation__body">
            <div className="hotel-regulation__statement">
              <span>
                №447
              </span>

              <p>
                Перед разработкой паспорта проверяем
                применимость требований к конкретному
                объекту и используем действующую
                нормативную форму.
              </p>
            </div>

            <ol className="hotel-regulation__list">
              {regulationPoints.map(
                (item) => (
                  <li key={item.number}>
                    <span className="hotel-regulation__number">
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


      <section
        className="hotel-categories"
        id="hotel-categories"
      >
        <Container>
          <div className="hotel-categories__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">
                Категорирование
              </p>

              <h2>
                Категории опасности гостиниц
              </h2>
            </div>

            <p className="hotel-categories__lead">
              Категория гостиницы определяется
              комиссией по результатам обследования
              с учётом возможных последствий
              террористического акта.
            </p>
          </div>

          <div className="hotel-categories__table">
            <div className="hotel-categories__table-head">
              <span>
                Категория
              </span>

              <span>
                Прогнозируемое количество пострадавших
              </span>
            </div>

            {hotelCategories.map(
              (item, index) => (
                <div
                  className="hotel-categories__row"
                  key={item.category}
                >
                  <span className="hotel-categories__index">
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      '0',
                    )}
                  </span>

                  <strong>
                    {item.category}
                  </strong>

                  <p>
                    {item.value}
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="hotel-categories__footer">
            <p>
              Комиссия изучает характеристики объекта,
              существующие меры защиты, потенциально
              опасные участки и критические элементы.
            </p>

            <a
              className="hotel-inline-link"
              href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
            >
              Подробнее об акте обследования
              и категорирования

              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </Container>
      </section>


      <section
        className="hotel-process"
        id="hotel-process"
      >
        <Container>
          <div className="hotel-process__layout">
            <div className="hotel-process__intro">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Порядок работы
                </p>

                <h2>
                  Как оформить паспорт
                  безопасности гостиницы
                </h2>
              </div>

              <div className="hotel-process__note">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  Категорию определяет комиссия,
                  а не подрядчик единолично.
                </p>
              </div>
            </div>

            <ol className="hotel-process__steps">
              {hotelProcess.map(
                (item, index) => (
                  <li key={item.title}>
                    <span className="hotel-process__number">
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        '0',
                      )}
                    </span>

                    <div>
                      <span className="hotel-process__label">
                        Этап
                      </span>

                      <h3>
                        {item.title}
                      </h3>
                    </div>

                    <span
                      className="hotel-process__arrow"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  </li>
                ),
              )}
            </ol>
          </div>
        </Container>
      </section>


      <section
        className="hotel-approval"
        id="hotel-approval"
      >
        <Container>
          <div className="hotel-approval__panel">
            <div className="hotel-approval__heading">
              <p className="hotel-kicker">
                Согласование
              </p>

              <h2>
                С кем согласовывается паспорт
                безопасности гостиницы
              </h2>

              <p>
                По действующей редакции требований
                паспорт составляется в трёх экземплярах,
                проходит предусмотренное согласование,
                после чего утверждается ответственным
                лицом.
              </p>
            </div>

            <div className="hotel-approval__scheme">
              <div className="hotel-approval__item">
                <span>
                  01
                </span>

                <div>
                  <strong>
                    Территориальный орган безопасности
                  </strong>

                  <p>
                    Паспорт согласовывается
                    с руководителем соответствующего
                    территориального органа безопасности
                    или уполномоченным им лицом.
                  </p>
                </div>
              </div>

              <div className="hotel-approval__item">
                <span>
                  02
                </span>

                <div>
                  <strong>
                    Росгвардия
                  </strong>

                  <p>
                    Также предусмотрено согласование
                    с руководителем соответствующего
                    территориального органа Росгвардии
                    или подразделения вневедомственной
                    охраны.
                  </p>
                </div>
              </div>

              <div className="hotel-approval__item">
                <span>
                  03
                </span>

                <div>
                  <strong>
                    Утверждение
                  </strong>

                  <p>
                    После предусмотренных согласований
                    паспорт утверждается ответственным
                    лицом.
                  </p>
                </div>
              </div>
            </div>

            <div className="hotel-approval__footer">
              <strong>
                3 экземпляра
              </strong>

              <p>
                Количество экземпляров установлено
                требованиями к паспорту безопасности
                гостиницы.
              </p>

              <a
                className="hotel-approval__action"
                href="#contact"
              >
                Заказать разработку паспорта

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>



      <section
        className="hotel-service"
        id="hotel-service"
      >
        <Container>
          <div className="hotel-service__layout">
            <div className="hotel-service__heading">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Состав услуги
                </p>

                <h2>
                  Что входит в разработку
                  паспорта безопасности гостиницы
                </h2>
              </div>

              <p>
                Работа строится вокруг конкретного объекта:
                сначала определяем применимые требования,
                затем готовим документы для категорирования,
                паспорта и предусмотренного согласования.
              </p>
            </div>

            <ol className="hotel-service__list">
              {hotelServiceItems.map(
                (item, index) => (
                  <li key={item}>
                    <span className="hotel-service__number">
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

                    <span
                      className="hotel-service__check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </li>
                ),
              )}
            </ol>
          </div>
        </Container>
      </section>


      <section
        className="hotel-price"
        id="hotel-price"
      >
        <Container>
          <div className="hotel-price__panel">
            <div className="hotel-price__copy">
              <p className="hotel-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость паспорта
                безопасности гостиницы
              </h2>

              <p>
                Итоговый состав работ зависит
                от состояния исходных документов,
                необходимости подготовки к категорированию
                и объёма сопровождения.
              </p>
            </div>

            <div className="hotel-price__value">
              <span>
                Разработка паспорта
              </span>

              <strong>
                от 9 500 ₽
              </strong>

              <p>
                Точную стоимость определяем
                после первичной проверки объекта
                и исходных данных.
              </p>

              <a
                className="hotel-price__action"
                href="#contact"
              >
                Получить точную стоимость

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="hotel-source"
        id="hotel-source"
      >
        <Container>
          <div className="hotel-source__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">
                Исходные данные
              </p>

              <h2>
                Что потребуется
                от гостиницы
              </h2>
            </div>

            <div className="hotel-source__intro">
              <p>
                Для начала не требуется собирать
                большой комплект документов.
                Достаточно основных сведений,
                чтобы проверить объект и определить
                дальнейший порядок работы.
              </p>

              <strong>
                Точный перечень определяем
                после первичной проверки объекта.
              </strong>
            </div>
          </div>

          <div className="hotel-source__grid">
            {hotelSourceData.map(
              (item, index) => (
                <article
                  className="hotel-source__item"
                  key={item.title}
                >
                  <span>
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      '0',
                    )}
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



      <section
        className="hotel-form"
        id="hotel-form"
      >
        <Container>
          <div className="hotel-form__layout">
            <div className="hotel-form__copy">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Форма документа
                </p>

                <h2>
                  Форма и образец паспорта
                  безопасности гостиницы
                </h2>
              </div>

              <p className="hotel-form__lead">
                Форма паспорта безопасности гостиницы
                или иного средства размещения утверждена
                Постановлением Правительства РФ №447.
              </p>

              <p>
                На странице мы показываем структуру
                документа без публикации заполненного
                паспорта действующего объекта.
              </p>

              <a
                className="hotel-form__action"
                href="#contact"
              >
                Получить образец формы

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>

            <div
              className="hotel-form__document"
              aria-label="Структура паспорта безопасности гостиницы"
            >
              <div className="hotel-form__document-top">
                <span>
                  ПП РФ №447
                </span>

                <strong>
                  Паспорт безопасности
                </strong>
              </div>

              <ol className="hotel-form__structure">
                {hotelFormStructure.map(
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

                      <p>
                        {item}
                      </p>
                    </li>
                  ),
                )}
              </ol>

              <div className="hotel-form__document-note">
                <span aria-hidden="true">
                  i
                </span>

                <p>
                  Конкретное содержание оформляется
                  по официальной форме и исходным
                  сведениям конкретной гостиницы.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="hotel-actualization"
        id="hotel-actualization"
      >
        <Container>
          <div className="hotel-actualization__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">
                Действующий паспорт
              </p>

              <h2>
                Когда нужно актуализировать
                паспорт гостиницы
              </h2>
            </div>

            <div className="hotel-actualization__deadline">
              <strong>
                30 дней
              </strong>

              <p>
                со дня возникновения обстоятельства,
                являющегося основанием для актуализации
              </p>
            </div>
          </div>

          <div className="hotel-actualization__grid">
            {hotelActualizationReasons.map(
              (item, index) => (
                <article
                  className="hotel-actualization__item"
                  key={item.title}
                >
                  <span>
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      '0',
                    )}
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

          <div className="hotel-actualization__footer">
            <p>
              ПП РФ №447 также предусматривает
              периодическую актуализацию паспорта
              безопасности гостиницы не реже
              одного раза в 5 лет.
            </p>

            <a
              className="hotel-inline-link"
              href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
            >
              Подробнее об актуализации
              паспорта безопасности

              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </Container>
      </section>


      <section
        className="hotel-accommodation"
        id="hotel-accommodation"
      >
        <Container>
          <div className="hotel-accommodation__layout">
            <div className="hotel-accommodation__copy">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Средства размещения
                </p>

                <h2>
                  Для каких средств размещения
                  разрабатываем паспорта
                </h2>
              </div>

              <p>
                Проверяем применимость требований
                для гостиниц и иных средств размещения
                с учётом фактического назначения
                объекта и его нормативного статуса.
              </p>
            </div>

            <div className="hotel-accommodation__types">
              {hotelAccommodationTypes.map(
                (item) => (
                  <div
                    className="hotel-accommodation__type"
                    key={item.title}
                  >
                    <span>
                      {item.number}
                    </span>

                    <strong>
                      {item.title}
                    </strong>

                    <span
                      className="hotel-accommodation__mark"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <aside className="hotel-accommodation__note">
            <span aria-hidden="true">
              ✓
            </span>

            <p>
              Название объекта само по себе
              не определяет нормативный режим.
              Перед разработкой документации
              проверяем применимые требования.
            </p>
          </aside>
        </Container>
      </section>


      <section
        className="hotel-standard"
        id="hotel-standard"
      >
        <Container>
          <div className="hotel-standard__panel">
            <div className="hotel-standard__number">
              <span>
                Действует с
              </span>

              <strong>
                01.05.2026
              </strong>
            </div>

            <div className="hotel-standard__content">
              <p className="hotel-kicker">
                Требования 2026 года
              </p>

              <h2>
                ГОСТ Р 72551-2026
              </h2>

              <p className="hotel-standard__lead">
                Национальный стандарт устанавливает
                общие требования к услугам
                по категорированию объектов
                и разработке паспортов безопасности
                объектов, для которых установлены
                обязательные требования
                к антитеррористической защищённости.
              </p>

              <div className="hotel-standard__distinction">
                <span>
                  Важно
                </span>

                <p>
                  ГОСТ устанавливает общие требования
                  к оказанию услуги. Порядок
                  категорирования конкретной гостиницы
                  и форма её паспорта определяются
                  применимыми обязательными
                  требованиями, включая ПП РФ №447.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>



      <section
        className="hotel-why"
        id="hotel-why"
      >
        <Container>
          <div className="hotel-why__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">
                Подход к работе
              </p>

              <h2>
                Почему БОЙКОВГРУПП
              </h2>
            </div>

            <p>
              Для гостиницы важно не просто заполнить
              форму, а правильно пройти всю
              последовательность: определить
              применимые требования, провести
              категорирование и подготовить паспорт
              к предусмотренному согласованию.
            </p>
          </div>

          <div className="hotel-why__grid">
            {hotelWhyItems.map(
              (item) => (
                <article
                  className="hotel-why__item"
                  key={item.number}
                >
                  <span className="hotel-why__number">
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


      <section
        className="hotel-faq"
        id="hotel-faq"
      >
        <Container>
          <div className="hotel-faq__layout">
            <div className="hotel-faq__heading">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">
                  Вопросы и ответы
                </p>

                <h2>
                  Частые вопросы
                  о паспорте безопасности гостиницы
                </h2>
              </div>

              <p>
                Коротко отвечаем на вопросы
                о ПП РФ №447, категорировании,
                согласовании, стоимости, форме
                и актуализации паспорта.
              </p>
            </div>

            <div className="hotel-faq__list">
              {hotelFaqItems.map(
                (item, index) => (
                  <details
                    className="hotel-faq__item"
                    key={item.question}
                  >
                    <summary>
                      <span className="hotel-faq__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="hotel-faq__question">
                        {item.question}
                      </span>

                      <span
                        className="hotel-faq__toggle"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>

                    <div className="hotel-faq__answer">
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
