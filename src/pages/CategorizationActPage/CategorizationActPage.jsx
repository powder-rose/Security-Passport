import Container from '../../components/ui/Container/Container';

import Expert from '../../sections/Expert/Expert';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

import {
  objectTypes,
} from '../../data/objectTypes';


const processItems = [
  {
    title:
      'Определяем нормативные требования',
    text:
      'Проверяем назначение объекта, ведомственную принадлежность и обязательные требования, которые распространяются именно на него.',
  },
  {
    title:
      'Формируется комиссия',
    text:
      'Категорирование проводится комиссионно в порядке, установленном применимыми требованиями.',
  },
  {
    title:
      'Собираются исходные данные',
    text:
      'Изучаются характеристики объекта, сведения о людях, схемах, охране, инженерно-технических средствах защиты и другие необходимые данные.',
  },
  {
    title:
      'Проводится обследование',
    text:
      'Оценивается фактическое состояние антитеррористической защищённости и факторы, необходимые для категорирования.',
  },
  {
    title:
      'Комиссия определяет категорию',
    text:
      'Решение принимается комиссией с учётом критериев, установленных для соответствующего типа объекта.',
  },
  {
    title:
      'Оформляется акт',
    text:
      'Результаты обследования и категорирования фиксируются документально. Если это предусмотрено требованиями, далее разрабатывается или актуализируется паспорт безопасности.',
  },
];


const serviceItems = [
  'Определение применимых нормативных требований',
  'Перечень необходимых исходных данных',
  'Помощь в подготовке распорядительных документов для комиссии',
  'Подготовка материалов для обследования объекта',
  'Расчёты и обоснования, необходимые для определения категории, если они предусмотрены применимыми требованиями',
  'Проект акта обследования и категорирования',
  'Перечень необходимых мероприятий по антитеррористической защищённости',
  'Консультационное сопровождение при работе комиссии',
  'Корректировка документации при обоснованных замечаниях',
];


const sourceDataItems = [
  'наименование и адрес объекта',
  'правообладатель или эксплуатирующая организация',
  'назначение объекта',
  'планы и схемы',
  'площадь и основные характеристики объекта',
  'максимальное и среднее количество находящихся людей',
  'сведения об охране',
  'сведения об инженерно-технических средствах защиты',
  'имеющиеся документы по антитеррористической защищённости',
  'предыдущий акт и паспорт, если проводится повторное категорирование или актуализация',
];


const sampleStructure = [
  'Сведения об объекте',
  'Основание проведения категорирования',
  'Состав комиссии',
  'Результаты обследования',
  'Оценка состояния защищённости',
  'Критерии категорирования',
  'Принятое комиссией решение',
  'Необходимые мероприятия',
  'Подписи членов комиссии',
];


const faqItems = [
  {
    question:
      'Что такое акт обследования и категорирования объекта?',
    answer:
      'Это документ, которым оформляются результаты обследования и работы комиссии по категорированию объекта. Конкретное наименование, состав и содержание документа зависят от обязательных требований, распространяющихся на соответствующий вид объекта.',
  },
  {
    question:
      'Кому нужен акт категорирования?',
    answer:
      'Акт необходим объектам и территориям, для которых установлены обязательные требования к антитеррористической защищённости и предусмотрена процедура обследования и категорирования.',
  },
  {
    question:
      'Кто составляет акт обследования и категорирования?',
    answer:
      'Результаты категорирования оформляются комиссией в порядке, установленном применимыми требованиями. Специализированная организация может участвовать в процедуре и готовить необходимую документацию.',
  },
  {
    question:
      'Кто присваивает категорию объекту?',
    answer:
      'Категория определяется комиссией по результатам обследования в соответствии с критериями, установленными для конкретного вида объекта.',
  },
  {
    question:
      'Чем акт категорирования отличается от паспорта безопасности?',
    answer:
      'Акт фиксирует результаты обследования и категорирования. Паспорт безопасности содержит сведения об антитеррористической защищённости объекта и предусмотренных мерах безопасности. Конкретная последовательность оформления зависит от применимых требований.',
  },
  {
    question:
      'Можно ли самостоятельно составить акт?',
    answer:
      'Подготовить проект документа можно самостоятельно, однако необходимо правильно определить нормативный режим объекта, состав комиссии, критерии категорирования и требования к форме документа.',
  },
  {
    question:
      'Какие документы нужны для категорирования?',
    answer:
      'Перечень зависит от вида объекта. Обычно требуются сведения об объекте, планы и схемы, данные о людях, охране, инженерно-технической защите и ранее оформленные документы по антитеррористической защищённости.',
  },
  {
    question:
      'Сколько стоит подготовка акта?',
    answer:
      'Стоимость подготовки документации для обследования и категорирования одного объекта — 9 500 ₽. При нестандартном составе работ или дополнительных выездных мероприятиях стоимость согласовывается до начала работ.',
  },
  {
    question:
      'Сколько действует акт категорирования?',
    answer:
      'Единого срока для всех объектов нет. Периодичность и основания повторного категорирования определяются требованиями, действующими для конкретного вида объекта.',
  },
  {
    question:
      'Когда нужно проводить повторное категорирование?',
    answer:
      'Основания зависят от нормативного режима объекта и могут быть связаны с изменением его характеристик, назначения, уровня угроз, мер защиты или другими обстоятельствами, предусмотренными применимыми требованиями.',
  },
  {
    question:
      'Есть ли единая форма акта категорирования?',
    answer:
      'Нет универсальной формы для всех объектов. Форма и содержание документов определяются требованиями, установленными для конкретной категории объектов или территорий.',
  },
  {
    question:
      'Можно ли скачать образец акта?',
    answer:
      'Можно использовать демонстрационную структуру как ориентир, но применять один универсальный шаблон для всех объектов неправильно. Документ должен соответствовать требованиям для конкретного вида объекта.',
  },
  {
    question:
      'Нужно ли после категорирования делать паспорт безопасности?',
    answer:
      'Во многих нормативных режимах результаты категорирования используются при разработке паспорта безопасности. Необходимость паспорта и порядок его оформления определяются требованиями для конкретного объекта.',
  },
];


export default function CategorizationActPage() {



  return (
    <main
      id="main-content"
      className="categorization-act-page"
    >
      <section className="categorization-act-hero">
        <Container>
          <nav
            className="categorization-act-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Главная
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Акт обследования и категорирования объекта
            </span>
          </nav>


          <div className="categorization-act-hero__layout">
            <div className="categorization-act-hero__content">
              <p className="categorization-act-kicker">
                Документы по антитеррористической защищённости
              </p>

              <h1>
                Акт обследования и категорирования объекта
              </h1>

              <p className="categorization-act-hero__lead">
                Подготовим документы для работы комиссии,
                определим применимые требования и оформим
                проект акта по результатам обследования
                и категорирования.
              </p>


              <div className="categorization-act-hero__price-row">
                <div>
                  <strong>
                    9 500 ₽
                  </strong>

                  <span>
                    подготовка документации
                    для одного объекта
                  </span>
                </div>

                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Заказать акт
                </a>
              </div>


              <a
                className="categorization-act-hero__check"
                href="#who-needs-act"
              >
                Проверить, нужно ли категорирование
                <span aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>


            <figure
              className="categorization-act-expert-visual"
              aria-label="Николай Бойков, эксперт БОЙКОВГРУПП"
            >
              <img
                src="/images/nikolay-boykov-hero.webp"
                srcSet="/images/nikolay-boykov-hero-560.webp 560w, /images/nikolay-boykov-hero-800.webp 800w, /images/nikolay-boykov-hero.webp 930w"
                sizes="(max-width: 760px) 88vw, (max-width: 1100px) 480px, 380px"
                alt="Николай Бойков, руководитель БОЙКОВГРУПП"
                width="930"
                height="1400"
                decoding="async"
              />

              <figcaption className="categorization-act-expert-visual__caption">
                <span
                  className="categorization-act-expert-visual__caption-dot"
                  aria-hidden="true"
                />

                <span>
                  <strong>
                    Николай Бойков
                  </strong>

                  <small>
                    Руководитель БОЙКОВГРУПП
                  </small>
                </span>
              </figcaption>
            </figure>
          </div>


          <div className="categorization-act-hero__facts">
            <div>
              <span>
                01
              </span>

              <p>
                Подготавливаем проект акта
              </p>
            </div>

            <div>
              <span>
                02
              </span>

              <p>
                Учитываем тип объекта
                и нормативный режим
              </p>
            </div>

            <div>
              <span>
                03
              </span>

              <p>
                Готовим материалы
                для работы комиссии
              </p>
            </div>
          </div>
        </Container>
      </section>


      <section className="categorization-act-intro">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Суть документа
            </p>

            <h2>
              Что такое акт обследования и категорирования объекта
            </h2>
          </div>

          <div className="categorization-act-intro__text">
            <p>
              Категорирование проводится для определения
              требований к антитеррористической
              защищённости конкретного объекта с учётом
              установленных критериев, возможных
              последствий террористического акта и
              фактического состояния защищённости.
            </p>

            <p>
              Результаты работы комиссии оформляются
              актом обследования и категорирования либо
              актом категорирования. Конкретное
              наименование, форма и содержание документа
              зависят от требований, распространяющихся
              на соответствующий тип объекта.
            </p>

            <p>
              В предусмотренных нормативными требованиями
              случаях результаты категорирования
              используются при последующей разработке
              паспорта безопасности объекта.
            </p>
          </div>
        </Container>
      </section>


      <section
        className="categorization-act-types"
        id="who-needs-act"
      >
        <Container>
          <div className="categorization-act-types__header">
            <div>
              <p className="categorization-act-kicker">
                Для каких объектов
              </p>

              <h2>
                Категорирование зависит
                от назначения объекта
              </h2>
            </div>

            <p>
              Для разных сфер действуют разные требования,
              поэтому перед подготовкой акта мы сначала
              определяем нормативный режим конкретного объекта.
            </p>
          </div>


          <div className="categorization-act-types__directory">
            {objectTypes.map((item, index) => (
              <a
                href={item.path}
                key={item.id}
              >
                <span className="categorization-act-types__number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <strong>
                  {item.title}
                </strong>

                <span className="categorization-act-types__regulation">
                  {item.regulationAct}
                </span>

                <span
                  className="categorization-act-types__arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            ))}

            <div className="categorization-act-types__other">
              <span className="categorization-act-types__number">
                09
              </span>

              <strong>
                Другие объекты и территории
              </strong>

              <span className="categorization-act-types__regulation">
                По применимым требованиям
              </span>
            </div>
          </div>
        </Container>
      </section>


      <section className="categorization-act-requirements">
        <Container>
          <div className="categorization-act-requirements__grid">
            <div>
              <p className="categorization-act-kicker">
                Не одна форма для всех
              </p>

              <h2>
                Требования к акту зависят от типа объекта
              </h2>
            </div>

            <div className="categorization-act-requirements__copy">
              <p>
                Единой формы акта обследования и
                категорирования для всех объектов
                не существует. Порядок категорирования,
                критерии категорий, состав комиссии,
                форма и содержание документов
                определяются обязательными требованиями
                для соответствующего вида объекта.
              </p>

              <p>
                Поэтому перед подготовкой документов
                сначала необходимо определить, какой
                нормативный режим применяется именно
                к вашему объекту.
              </p>
            </div>
          </div>

          <div className="categorization-act-requirements__list">
            {objectTypes
              .filter((item) => item.id !== 'social')
              .map((item, index) => (
                <article key={item.id}>
                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <strong>
                    {item.title}
                  </strong>

                  <p>
                    {item.regulationFocus}
                  </p>
                </article>
              ))}
          </div>
        </Container>
      </section>


      <section className="categorization-act-process">
        <Container>
          <div className="categorization-act-process__heading">
            <div>
              <p className="categorization-act-kicker">
                Логика процедуры
              </p>

              <h2>
                От объекта
                до оформленного акта
              </h2>
            </div>

            <p>
              Категорию не «назначает специалист».
              Решение принимается комиссией,
              а мы готовим документацию и сопровождаем
              процедуру в рамках применимых требований.
            </p>
          </div>


          <div className="categorization-act-flow">
            {[
              'Объект',
              'Комиссия',
              'Обследование',
              'Категория',
              'Акт',
              'Паспорт',
            ].map((item, index) => (
              <div
                className="categorization-act-flow__item"
                key={item}
              >
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <strong>
                  {item}
                </strong>
              </div>
            ))}
          </div>


          <div className="categorization-act-process__details">
            {processItems.map((item, index) => (
              <article key={item.title}>
                <span>
                  {String(index + 1).padStart(2, '0')}
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
            ))}
          </div>
        </Container>
      </section>


      <section className="categorization-act-service">
        <Container>
          <div className="categorization-act-service__grid">
            <div>
              <p className="categorization-act-kicker">
                Состав услуги
              </p>

              <h2>
                Что мы подготовим
              </h2>

              <p>
                Состав документов уточняется после
                определения требований, применимых
                к конкретному объекту.
              </p>
            </div>

            <ol>
              {serviceItems.map((item, index) => (
                <li key={item}>
                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p>
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>


      <section className="categorization-act-cost">
        <Container>
          <div className="categorization-act-cost__card">
            <div>
              <p className="categorization-act-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость акта обследования и категорирования
              </h2>

              <p>
                Стоимость подготовки документации
                для категорирования одного объекта.
                При нестандартном составе работ
                или необходимости дополнительных
                выездных мероприятий стоимость
                согласовывается до начала работ.
              </p>
            </div>

            <div className="categorization-act-cost__price">
              <strong>
                9 500 ₽
              </strong>

              <span>
                за объект
              </span>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Заказать подготовку акта
              </a>
            </div>
          </div>

          <div className="categorization-act-passport-link">
            <div>
              <span>
                Следующий этап
              </span>

              <h3>
                После категорирования может потребоваться паспорт безопасности
              </h3>

              <p>
                Необходимость паспорта определяется
                требованиями, распространяющимися
                на конкретный объект.
              </p>
            </div>

            <a href="/">
              Разработка паспорта безопасности объекта →
            </a>
          </div>
        </Container>
      </section>


      <section className="categorization-act-source-data">
        <Container>
          <div className="categorization-act-source-data__grid">
            <div>
              <p className="categorization-act-kicker">
                До начала работ
              </p>

              <h2>
                Какие данные потребуются
              </h2>

              <p>
                Окончательный перечень исходных данных
                зависит от требований, распространяющихся
                на конкретный объект.
              </p>
            </div>

            <ul>
              {sourceDataItems.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>


      <section className="categorization-act-sample">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Форма и образец
            </p>

            <h2>
              Образец акта обследования и категорирования объекта
            </h2>

            <p>
              Универсального образца, который подходит
              всем объектам, нет. Ниже показана
              демонстрационная структура документа —
              конкретные разделы зависят от применимых
              требований.
            </p>
          </div>

          <div className="categorization-act-sample__grid">
            {sampleStructure.map((item, index) => (
              <article key={item}>
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p>
                  {item}
                </p>
              </article>
            ))}
          </div>

          <a
            className="button button--secondary"
            href="#lead-form"
          >
            Получить форму для вашего типа объекта
          </a>
        </Container>
      </section>


      <section className="categorization-act-standard">
        <Container>
          <div className="categorization-act-standard__grid">
            <div>
              <span className="categorization-act-standard__badge">
                ГОСТ Р 72551-2026
              </span>

              <h2>
                Профильный стандарт действует с 1 мая 2026 года
              </h2>
            </div>

            <div>
              <p>
                ГОСТ Р 72551-2026 устанавливает общие
                требования к услугам по категорированию
                объекта или территории и разработке
                паспорта безопасности объектов,
                в отношении которых установлены
                обязательные требования к
                антитеррористической защищённости.
              </p>

              <p>
                При этом конкретный порядок
                категорирования, состав комиссии,
                критерии и форма документов
                по-прежнему определяются обязательными
                требованиями, применимыми
                к соответствующему объекту.
              </p>
            </div>
          </div>
        </Container>
      </section>


      <section className="categorization-act-difference">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Не одно и то же
            </p>

            <h2>
              Акт категорирования и паспорт безопасности — в чём разница
            </h2>
          </div>

          <div className="categorization-act-difference__grid">
            <article>
              <span>
                01
              </span>

              <h3>
                Акт категорирования
              </h3>

              <p>
                Фиксирует результаты обследования
                и работы комиссии, включая решение
                по категорированию и другие сведения,
                предусмотренные применимыми требованиями.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Паспорт безопасности
              </h3>

              <p>
                Содержит сведения об объекте,
                состоянии его антитеррористической
                защищённости и предусмотренных
                мерах обеспечения безопасности.
              </p>
            </article>
          </div>

          <p className="categorization-act-difference__sequence">
            <strong>
              Типовая последовательность:
            </strong>{' '}
            обследование → категорирование → акт →
            паспорт безопасности. Конкретная процедура
            определяется требованиями для соответствующего
            объекта.
          </p>
        </Container>
      </section>


      <Expert />


      <section className="categorization-act-faq">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Вопросы и ответы
            </p>

            <h2>
              Частые вопросы об акте категорирования
            </h2>
          </div>

          <div className="categorization-act-faq__list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                </summary>

                <p>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>


      <FinalCTA />
    </main>
  );
}
