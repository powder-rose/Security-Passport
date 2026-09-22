import { useEffect } from 'react';

import Container from '../../components/ui/Container/Container';

import Expert from '../../sections/Expert/Expert';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

import {
  useCity,
} from '../../context/GeoContext';


function getLocationText(city) {
  if (
    city.isDefault ||
    city.type === 'country'
  ) {
    return 'по России';
  }

  if (
    city.hasTrustedInflection &&
    !city.seoNeedsSubject
  ) {
    return city.locationPhrase;
  }

  return `в регионе: ${city.locationSeo}`;
}


const triggerRows = [
  {
    change:
      'Назначение или вид деятельности объекта',
    result:
      'Да',
  },
  {
    change:
      'Площадь, границы или периметр',
    result:
      'Да',
  },
  {
    change:
      'Потенциально опасные или критические элементы',
    result:
      'Да',
  },
  {
    change:
      'Организация охраны',
    result:
      'Да',
  },
  {
    change:
      'Силы и средства обеспечения защищённости',
    result:
      'Да',
  },
  {
    change:
      'Инженерно-технические средства защиты',
    result:
      'Да',
  },
  {
    change:
      'Иные сведения, содержащиеся в паспорте',
    result:
      'Зависит от применимых требований',
  },
  {
    change:
      'Истёк установленный нормативный период',
    result:
      'Если это предусмотрено требованиями для данного вида объекта',
  },
];


const checklistItems = [
  'изменилась площадь объекта',
  'изменилась планировка, границы или периметр',
  'изменилось назначение объекта',
  'изменились сведения о собственнике или эксплуатирующей организации, если это имеет значение по применимым требованиям',
  'изменилась организация охраны',
  'установлены или заменены инженерно-технические средства защиты',
  'изменилось количество или расположение критических элементов',
  'проведена реконструкция или иные существенные работы',
  'изменились сведения, внесённые в паспорт',
  'подходит установленный нормативный срок актуализации',
];


const processItems = [
  {
    title:
      'Анализируем существующий паспорт',
    text:
      'Проверяем редакцию, дату составления, категорию объекта и нормативное основание.',
  },
  {
    title:
      'Проверяем фактическое состояние объекта',
    text:
      'Определяем, что изменилось после разработки действующего паспорта.',
  },
  {
    title:
      'Определяем действующие требования',
    text:
      'Устанавливаем нормативный режим, который применяется к конкретному виду объекта.',
  },
  {
    title:
      'Определяем способ актуализации',
    text:
      'Проверяем, достаточно ли внесения изменений или требуется повторное категорирование либо новая редакция паспорта.',
  },
  {
    title:
      'Подготавливаем документы',
    text:
      'Формируем необходимые изменения и связанные документы в зависимости от применимых требований.',
  },
  {
    title:
      'Сопровождаем оформление',
    text:
      'Учитываем предусмотренный порядок направления, согласования и устранения обоснованных замечаний.',
  },
];


const scopeItems = [
  'Проверим действующий паспорт безопасности',
  'Определим применимый нормативный акт',
  'Проверим срок и основания актуализации',
  'Сопоставим сведения паспорта с фактическим состоянием объекта',
  'Определим необходимость подтверждения или изменения категории',
  'Подготовим необходимые изменения',
  'При необходимости подготовим новую редакцию паспорта',
  'Подготовим связанные документы',
  'Сопроводим устранение обоснованных замечаний',
];


const documentItems = [
  'действующий паспорт безопасности',
  'акт обследования и категорирования',
  'сведения об изменениях на объекте',
  'актуальные планы и схемы',
  'сведения об охране',
  'сведения об инженерно-технических средствах защиты',
  'ранее полученные замечания согласующих органов — если имеются',
  'иные сведения в зависимости от требований к конкретному виду объекта',
];


const periodicityItems = [
  {
    type:
      'Образовательные объекты',
    regulation:
      'Постановление Правительства РФ № 1006',
    period:
      'Не реже 1 раза в 5 лет',
    text:
      'Также актуализация проводится при предусмотренных требованиями изменениях характеристик объекта и мер его защищённости.',
  },
  {
    type:
      'Объекты здравоохранения',
    regulation:
      'Постановление Правительства РФ № 8',
    period:
      'Не реже 1 раза в 5 лет',
    text:
      'Дополнительные основания связаны с изменениями характеристик объекта и применяемых мер антитеррористической защищённости.',
  },
  {
    type:
      'Объекты культуры',
    regulation:
      'Постановление Правительства РФ № 176',
    period:
      'Не реже 1 раза в 3 года',
    text:
      'Основаниями также могут быть изменение назначения, площади, периметра, реконструкция и другие предусмотренные требованиями изменения.',
  },
  {
    type:
      'Места массового пребывания людей',
    regulation:
      'Постановление Правительства РФ № 272',
    period:
      'Не реже 1 раза в 3 года',
    text:
      'Актуализация требуется и при предусмотренных изменениях самого места, его границ, назначения и условий защищённости.',
  },
  {
    type:
      'Торговые объекты',
    regulation:
      'Постановление Правительства РФ № 1273',
    period:
      'По установленным основаниям',
    text:
      'Для торговых объектов действует отдельный порядок актуализации в соответствии с применимыми требованиями.',
  },
];


const objectTypes = [
  'Гостиницы',
  'Образовательные организации',
  'Торговые объекты',
  'Объекты культуры',
  'Объекты спорта',
  'Объекты здравоохранения',
  'Места массового пребывания людей',
];


const faqItems = [
  {
    question:
      'Что такое актуализация паспорта безопасности?',
    answer:
      'Это приведение действующего паспорта безопасности в соответствие с текущими характеристиками объекта и применимыми требованиями. В зависимости от нормативного режима это может быть внесение изменений либо подготовка новой редакции документа.',
  },
  {
    question:
      'Как часто нужно актуализировать паспорт безопасности?',
    answer:
      'Единого срока для всех объектов нет. Периодичность определяется требованиями для конкретного вида объекта. Для отдельных объектов предусмотрены сроки 3 года, для других — 5 лет, а также могут существовать основания для внеплановой актуализации.',
  },
  {
    question:
      'Сколько действует паспорт безопасности?',
    answer:
      'Срок и порядок актуализации зависят от требований, по которым оформлен паспорт конкретного объекта. Поэтому дату документа необходимо оценивать вместе с его нормативным основанием.',
  },
  {
    question:
      'Какие основания существуют для актуализации?',
    answer:
      'Основания зависят от вида объекта. Значение могут иметь изменения назначения, площади, периметра, критических элементов, организации охраны, инженерно-технических средств защиты и других сведений паспорта.',
  },
  {
    question:
      'Нужно ли заново проводить категорирование?',
    answer:
      'Нет, не всегда. Необходимость повторного категорирования зависит от основания актуализации и требований для конкретного объекта.',
  },
  {
    question:
      'Можно ли просто внести изменения в старый паспорт?',
    answer:
      'В некоторых случаях применимые требования допускают внесение изменений в действующий документ. В других случаях может потребоваться новая редакция или иная предусмотренная процедура.',
  },
  {
    question:
      'Когда требуется полностью новый паспорт?',
    answer:
      'Это определяется после проверки нормативного основания и характера изменений на объекте. Универсального правила для всех видов объектов нет.',
  },
  {
    question:
      'Что делать, если паспорт разработан несколько лет назад?',
    answer:
      'Нужно проверить дату составления, применимый нормативный акт, установленную периодичность и изменения, которые произошли на объекте после оформления документа.',
  },
  {
    question:
      'Нужно ли согласовывать актуализированный паспорт?',
    answer:
      'Порядок дальнейшего оформления зависит от требований к конкретному виду объекта. Сначала необходимо определить применимый нормативный режим.',
  },
  {
    question:
      'Сколько стоит актуализация паспорта безопасности?',
    answer:
      'Стоимость зависит от объёма необходимых изменений и от того, требуется ли повторное категорирование объекта. Фактический состав работ определяется после проверки действующего паспорта.',
  },
  {
    question:
      'Какие документы нужны для актуализации?',
    answer:
      'Для первоначальной проверки нужен действующий паспорт, акт обследования и категорирования и сведения об изменениях на объекте. Дополнительные документы определяются после анализа требований.',
  },
];


export default function ActualizationPage() {
  const city =
    useCity();

  const locationText =
    getLocationText(city);


  useEffect(() => {
    const items =
      Array.from(
        document.querySelectorAll(
          '.actualization-work__timeline li',
        ),
      );

    if (!items.length) {
      return undefined;
    }

    if (
      !('IntersectionObserver' in window)
    ) {
      items.forEach(
        (item) => {
          item.classList.add('is-active');
        },
      );

      return undefined;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add(
                'is-active',
              );

              observer.unobserve(
                entry.target,
              );
            },
          );
        },
        {
          threshold: 0.42,
          rootMargin:
            '0px 0px -18% 0px',
        },
      );

    items.forEach(
      (item) => {
        observer.observe(item);
      },
    );

    return () => {
      observer.disconnect();
    };
  }, []);


  return (
    <main
      id="main-content"
      className="actualization-page"
    >
      <section className="actualization-hero">
        <Container>
          <nav
            className="actualization-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Актуализация паспорта
            </span>
          </nav>


          <div className="actualization-hero__grid">
            <div className="actualization-hero__copy">
              <p className="actualization-kicker">
                Проверка действующего документа
              </p>

              <h1>
                Актуализация паспорта безопасности объекта
              </h1>

              <p className="actualization-hero__lead">
                Проверим действующий паспорт безопасности,
                определим основания и порядок его
                актуализации по требованиям, применимым
                к вашему объекту. Подготовим изменения
                либо новую редакцию документа. Работаем{' '}
                {locationText}.
              </p>


              <ul className="actualization-hero__benefits">
                <li>
                  Определим, действительно ли требуется актуализация
                </li>

                <li>
                  Проверим необходимость повторного категорирования
                </li>

                <li>
                  Учтём требования именно для вашего типа объекта
                </li>
              </ul>


              <div className="actualization-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Проверить паспорт
                </a>

                <a
                  className="actualization-hero__secondary"
                  href="#lead-form"
                >
                  Заказать актуализацию
                  <span aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </div>


            <aside className="actualization-hero__note">
              <span>
                Важно
              </span>

              <h2>
                Актуализация — не просто замена даты
              </h2>

              <p>
                Сначала определяем нормативный режим
                объекта, проверяем действующий паспорт
                и выясняем, какой порядок внесения
                изменений применяется именно в вашем
                случае.
              </p>
            </aside>
          </div>
        </Container>
      </section>


      <section className="actualization-definition">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Что это значит
            </p>

            <h2>
              Что такое актуализация паспорта безопасности
            </h2>

            <p>
              Актуализация — это приведение действующего
              паспорта безопасности в соответствие
              с текущими характеристиками объекта
              и применимыми требованиями.
            </p>
          </div>


          <div className="actualization-definition__paths">
            <article>
              <span>
                01
              </span>

              <h3>
                Внесение изменений
              </h3>

              <p>
                В предусмотренных случаях необходимые
                сведения могут быть изменены
                в существующем документе.
              </p>
            </article>

            <div
              className="actualization-definition__or"
              aria-hidden="true"
            >
              или
            </div>

            <article>
              <span>
                02
              </span>

              <h3>
                Новая редакция паспорта
              </h3>

              <p>
                Если применимый порядок этого требует,
                может потребоваться переработка
                документа или подготовка новой редакции.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section
        className="actualization-reasons"
        id="when-update"
      >
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Сроки, основания и причины
            </p>

            <h2>
              Когда требуется актуализация паспорта безопасности
            </h2>

            <p>
              Конкретные основания зависят от вида
              объекта и требований, по которым
              разработан его паспорт.
            </p>
          </div>


          <div
            className="actualization-reasons-table"
            role="table"
            aria-label="Основания для проверки актуальности паспорта"
          >
            <div
              className="actualization-reasons-table__head"
              role="row"
            >
              <span role="columnheader">
                Что изменилось
              </span>

              <span role="columnheader">
                Может потребоваться актуализация
              </span>
            </div>

            {triggerRows.map(
              (item) => (
                <div
                  className="actualization-reasons-table__row"
                  role="row"
                  key={item.change}
                >
                  <span role="cell">
                    {item.change}
                  </span>

                  <strong role="cell">
                    {item.result}
                  </strong>
                </div>
              ),
            )}
          </div>


          <aside className="actualization-reasons__notice">
            <strong>
              Основания и сроки актуализации зависят
              от вида объекта и нормативного акта,
              который устанавливает требования
              к его антитеррористической защищённости.
            </strong>

            <p>
              Поэтому мы не просто меняем дату
              в паспорте — сначала определяем
              применимые требования.
            </p>
          </aside>
        </Container>
      </section>


      <section className="actualization-checklist">
        <Container>
          <div className="actualization-checklist__layout">
            <div>
              <p className="actualization-kicker">
                Быстрая самопроверка
              </p>

              <h2>
                Как понять, нужно ли актуализировать ваш паспорт
              </h2>

              <p>
                Проверьте документ, если после
                его разработки произошло хотя бы
                одно из перечисленных изменений.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Отправить паспорт на проверку
              </a>
            </div>


            <ul className="actualization-checklist__items">
              {checklistItems.map(
                (item, index) => (
                  <li key={item}>
                    <span aria-hidden="true">
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
            </ul>
          </div>
        </Container>
      </section>


      <section className="actualization-category">
        <Container>
          <div className="actualization-category__panel">
            <div>
              <p className="actualization-kicker">
                Важный вопрос
              </p>

              <h2>
                Всегда ли нужно заново проводить категорирование?
              </h2>
            </div>

            <div className="actualization-category__answer">
              <strong>
                Нет, не всегда.
              </strong>

              <p>
                Это зависит от основания актуализации
                и требований для конкретного объекта.
                При одних изменениях может потребоваться
                подтверждение или изменение категории,
                при других — изменения могут оформляться
                без полной процедуры повторного
                категорирования.
              </p>

              <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
                Подробнее об обследовании и категорировании
                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>


      <section className="actualization-work">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Порядок работы
            </p>

            <h2>
              Как мы актуализируем паспорт безопасности
            </h2>
          </div>


          <ol className="actualization-work__timeline">
            {processItems.map(
              (item, index) => (
                <li key={item.title}>
                  <span className="actualization-work__number">
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
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
        </Container>
      </section>


      <section className="actualization-scope">
        <Container>
          <div className="actualization-scope__layout">
            <div>
              <p className="actualization-kicker">
                Состав работы
              </p>

              <h2>
                Что мы сделаем
              </h2>

              <p>
                Состав действий определяем после
                проверки паспорта и требований
                к конкретному виду объекта.
              </p>
            </div>


            <ul className="actualization-scope__list">
              {scopeItems.map(
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
            </ul>
          </div>
        </Container>
      </section>


      <section
        className="actualization-price"
        id="actualization-price"
      >
        <Container>
          <div className="actualization-price__panel">
            <div className="actualization-price__heading">
              <p className="actualization-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость актуализации паспорта безопасности
              </h2>

              <p className="actualization-price__intro">
                Состав работ определяем после проверки
                действующего паспорта и изменений
                на объекте.
              </p>
            </div>


            <aside className="actualization-price__card">
              <p className="actualization-price__card-label">
                На расчёт влияют
              </p>

              <div className="actualization-price__factor">
                <span>
                  01
                </span>

                <div>
                  <strong>
                    Объём необходимых изменений
                  </strong>

                  <p>
                    Проверяем, какие сведения
                    действующего паспорта требуется
                    актуализировать.
                  </p>
                </div>
              </div>


              <div className="actualization-price__factor">
                <span>
                  02
                </span>

                <div>
                  <strong>
                    Повторное категорирование
                  </strong>

                  <p>
                    Отдельно определяем, требуется ли
                    оно для конкретного объекта.
                  </p>
                </div>
              </div>


              <a
                className="actualization-price__action"
                href="#lead-form"
              >
                Уточнить стоимость

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </aside>
          </div>
        </Container>
      </section>


      <section className="actualization-documents">
        <Container>
          <div className="actualization-documents__grid">
            <div>
              <p className="actualization-kicker">
                Для первичной проверки
              </p>

              <h2>
                Что потребуется для актуализации
              </h2>

              <p>
                Сначала достаточно действующего
                паспорта и основных сведений.
                Дополнительный комплект определяем
                после проверки применимых требований.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Отправить паспорт на предварительную проверку
              </a>
            </div>


            <ol>
              {documentItems.map(
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


      <section className="actualization-periods">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Периодичность
            </p>

            <h2>
              Как часто нужно актуализировать паспорт безопасности
            </h2>

            <p>
              Единого срока для всех паспортов
              безопасности нет. Периодичность
              устанавливается требованиями
              для конкретного вида объекта.
            </p>
          </div>


          <div className="actualization-periods__summary">
            <article>
              <strong>
                3 года
              </strong>

              <p>
                Такой срок предусмотрен
                для отдельных видов объектов.
              </p>
            </article>

            <article>
              <strong>
                5 лет
              </strong>

              <p>
                Для других видов объектов
                действует иная периодичность.
              </p>
            </article>

            <article>
              <strong>
                Внепланово
              </strong>

              <p>
                Актуализация также может требоваться
                при предусмотренных нормативными
                требованиями изменениях.
              </p>
            </article>
          </div>


          <div className="actualization-periods__list">
            {periodicityItems.map(
              (item, index) => (
                <article
                  className="actualization-period"
                  key={item.type}
                >
                  <span className="actualization-period__number">
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </span>

                  <div className="actualization-period__name">
                    <h3>
                      {item.type}
                    </h3>

                    <p>
                      {item.regulation}
                    </p>
                  </div>

                  <strong>
                    {item.period}
                  </strong>

                  <p className="actualization-period__description">
                    {item.text}
                  </p>
                </article>
              ),
            )}
          </div>


          <p className="actualization-periods__note">
            Это не полный перечень видов объектов.
            Для гостиниц, объектов спорта,
            социальной защиты и других категорий
            применяются собственные требования,
            которые необходимо проверять отдельно.
          </p>
        </Container>
      </section>


      <section className="actualization-replacement">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Старый паспорт
            </p>

            <h2>
              Нужно ли менять паспорт полностью
            </h2>

            <p>
              Не всегда. Способ оформления зависит
              от нормативного основания и характера
              изменений на объекте.
            </p>
          </div>


          <div className="actualization-replacement__options">
            <article>
              <span>
                Вариант 01
              </span>

              <h3>
                Внести изменения
              </h3>

              <p>
                Если применимые требования позволяют
                актуализировать сведения
                в существующем документе.
              </p>
            </article>

            <article>
              <span>
                Вариант 02
              </span>

              <h3>
                Подготовить новую редакцию
              </h3>

              <p>
                Если характер изменений или
                установленный порядок требуют
                переработки паспорта.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section className="actualization-objects">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Типы объектов
            </p>

            <h2>
              Актуализируем паспорта безопасности для
            </h2>
          </div>


          <div className="actualization-objects__list">
            {objectTypes.map(
              (item, index) => (
                <article key={item}>
                  <span>
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </span>

                  <h3>
                    {item ===
                    'Образовательные организации' ? (
                      <a href="/pasport-bezopasnosti-obrazovatelnoj-organizacii/">
                        {item}
                      </a>
                    ) : item ===
                      'Объекты спорта' ? (
                      <a href="/pasport-bezopasnosti-obekta-sporta/">
                        {item}
                      </a>
                    ) : (
                      item
                    )}
                  </h3>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>


      <section className="actualization-standard">
        <Container>
          <div className="actualization-standard__panel">
            <div>
              <p className="actualization-kicker">
                Требования 2026 года
              </p>

              <h2>
                ГОСТ Р 72551-2026
              </h2>
            </div>

            <div>
              <p>
                С 1 мая 2026 года действует
                ГОСТ Р 72551-2026, устанавливающий
                общие требования к услугам
                по категорированию объектов
                и разработке паспортов безопасности
                объектов, для которых установлены
                обязательные требования
                к антитеррористической защищённости.
              </p>

              <strong>
                ГОСТ не устанавливает единый срок
                актуализации для всех объектов.
              </strong>

              <p>
                Конкретные основания, сроки
                и порядок определяются требованиями
                к соответствующему виду объекта.
              </p>
            </div>
          </div>
        </Container>
      </section>


      <Expert />


      <section className="actualization-faq">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Вопросы об актуализации
            </p>

            <h2>
              Что важно знать до внесения изменений
            </h2>
          </div>


          <div className="actualization-faq__list">
            {faqItems.map(
              (item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                  </summary>

                  <p>
                    {item.answer}
                  </p>
                </details>
              ),
            )}
          </div>
        </Container>
      </section>


      <FinalCTA />
    </main>
  );
}
