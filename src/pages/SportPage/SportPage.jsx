import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


const sportObjects = [
  {
    number: '01',
    title: 'Стадионы',
  },
  {
    number: '02',
    title: 'Спортивные комплексы',
  },
  {
    number: '03',
    title: 'Физкультурно-оздоровительные комплексы',
  },
  {
    number: '04',
    title: 'Спортивные залы и центры',
  },
  {
    number: '05',
    title: 'Ледовые арены',
  },
  {
    number: '06',
    title: 'Бассейны',
  },
  {
    number: '07',
    title: 'Манежи',
  },
  {
    number: '08',
    title: 'Открытые спортивные сооружения',
  },
  {
    number: '09',
    title: 'Иные объекты спорта',
  },
];


const sportFaqItems = [
  {
    question:
      'Каким спортивным объектам нужен паспорт безопасности?',
    answer:
      'ПП РФ №202 распространяется на объекты недвижимости и комплексы недвижимости, специально предназначенные для проведения физкультурных и/или спортивных мероприятий. Применимость требований определяется по фактическому назначению и статусу конкретного объекта.',
  },
  {
    question:
      'Какое постановление регулирует паспорт объекта спорта?',
    answer:
      'Основной нормативный акт для объектов спорта — Постановление Правительства РФ от 06.03.2015 №202, которым установлены требования к антитеррористической защищённости объектов спорта и форма паспорта безопасности.',
  },
  {
    question:
      'Сколько категорий опасности существует?',
    answer:
      'ПП РФ №202 предусматривает четыре категории опасности объектов спорта.',
  },
  {
    question:
      'Как определяется категория объекта спорта?',
    answer:
      'Категория определяется комиссией по результатам обследования и категорирования с учётом установленных критериев. Исполнитель документации не присваивает категорию объекту единолично.',
  },
  {
    question:
      'Кто проводит категорирование?',
    answer:
      'Обследование и категорирование проводятся комиссией. По результатам её работы принимается решение об отнесении объекта к соответствующей категории.',
  },
  {
    question:
      'Как оформляется акт обследования?',
    answer:
      'Результаты работы комиссии оформляются актом обследования и категорирования. По ПП РФ №202 акт составляется в одном экземпляре, подписывается всеми членами комиссии и хранится вместе с паспортом безопасности объекта.',
  },
  {
    question:
      'Сколько времени даётся на разработку паспорта?',
    answer:
      'Паспорт безопасности объекта спорта составляется в течение 3 месяцев после проведения обследования и категорирования.',
  },
  {
    question:
      'С кем согласовывается паспорт объекта спорта?',
    answer:
      'Паспорт согласовывается с руководителем территориального органа безопасности либо уполномоченным им лицом, а также с руководителем территориального органа Росгвардии либо подразделения вневедомственной охраны Росгвардии по месту нахождения объекта. После согласования паспорт утверждается ответственным лицом.',
  },
  {
    question:
      'Какой срок согласования?',
    answer:
      'Срок согласования паспорта объекта спорта — не более 30 дней со дня его представления в соответствующие органы.',
  },
  {
    question:
      'Можно ли скачать форму паспорта?',
    answer:
      'ПП РФ №202 утверждает официальную форму паспорта безопасности объекта спорта. На этой странице показана обезличенная структура документа, а получить форму можно через заявку.',
  },
  {
    question:
      'Можно ли публиковать заполненный паспорт?',
    answer:
      'Заполненный паспорт действующего спортивного объекта публично не размещаем, поскольку документ содержит служебную информацию ограниченного распространения и имеет пометку «Для служебного пользования».',
  },
  {
    question:
      'Когда паспорт необходимо актуализировать?',
    answer:
      'ПП РФ №202 предусматривает актуализацию при изменении нормативных требований, застройки или после реконструкции, изменении профиля деятельности, схемы охраны или технического оснащения, смене собственника, наименования или организационно-правовой формы, а также при изменении предусмотренных сведений о должностных лицах и способах связи. Актуализация проводится в течение 30 дней после возникновения соответствующих обстоятельств.',
  },
  {
    question:
      'Сколько стоит разработка?',
    answer:
      'Подготовка паспорта безопасности — 9 500 ₽. Акт обследования и категорирования — 9 500 ₽, сопровождение согласования — от 9 500 ₽, комплекс под ключ — от 35 000 ₽.',
  },
  {
    question:
      'Нужен ли паспорт открытому спортивному сооружению?',
    answer:
      'Если открытое сооружение относится к объектам спорта, подпадающим под ПП РФ №202, применяются требования этого постановления. Для открытых плоскостных сооружений установлено специальное правило — им присваивается IV категория опасности.',
  },
];


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

      <section
        className="sport-hero"
        id="top"
      >
        <Container>
          <nav
            className="sport-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Паспорт безопасности
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Объекты спорта
            </span>
          </nav>


          <div className="sport-hero__layout">
            <div className="sport-hero__content">
              <p className="sport-kicker">
                Объекты спорта
              </p>

              <h1>
                Паспорт безопасности объекта спорта —
                разработка и согласование
              </h1>

              <p className="sport-hero__lead">
                Подготовим паспорт безопасности объекта
                спорта в соответствии с требованиями
                к антитеррористической защищённости.
                Подготовим документы для категорирования,
                акт, паспорт и сопроводим предусмотренное
                согласование.
              </p>


              <div className="sport-hero__commercial">
                <div className="sport-hero__price">
                  <span>
                    Стоимость разработки
                  </span>

                  <strong>
                    от 9 500 ₽
                  </strong>
                </div>


                <div className="sport-hero__facts">
                  <span>
                    По ПП РФ №202
                  </span>

                  <span>
                    4 категории опасности
                  </span>

                  <span>
                    Категорирование + паспорт
                  </span>
                </div>
              </div>


              <div className="sport-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Заказать паспорт
                </a>

                <a
                  className="sport-text-action"
                  href="#objects"
                >
                  Проверить требования для объекта

                  <span aria-hidden="true">
                    ↓
                  </span>
                </a>
              </div>
            </div>


            <aside className="sport-hero__legal">
              <div className="sport-hero__legal-top">
                <span>
                  Нормативная основа
                </span>

                <span>
                  06.03.2015
                </span>
              </div>

              <div className="sport-hero__legal-number">
                <small>
                  №
                </small>

                <strong>
                  202
                </strong>
              </div>

              <h2>
                Требования к антитеррористической
                защищённости объектов спорта
              </h2>

              <p>
                Постановлением утверждены требования
                к защищённости объектов спорта
                и форма паспорта безопасности.
              </p>

              <div className="sport-hero__legal-footer">
                <div>
                  <strong>
                    4
                  </strong>

                  <span>
                    категории
                  </span>
                </div>

                <div>
                  <strong>
                    2026
                  </strong>

                  <span>
                    актуальная страница
                  </span>
                </div>
              </div>

              {!city.isDefault && (
                <p className="sport-hero__region">
                  Регион: {city.name}
                </p>
              )}
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="sport-objects"
        id="objects"
      >
        <Container>
          <div className="sport-objects__heading">
            <div>
              <p className="sport-kicker">
                Применимость требований
              </p>

              <h2>
                Каким объектам спорта нужен
                паспорт безопасности
              </h2>
            </div>

            <p>
              Требования распространяются на объекты
              недвижимости и комплексы недвижимости,
              специально предназначенные для проведения
              физкультурных и/или спортивных мероприятий.
            </p>
          </div>


          <div className="sport-objects__layout">
            <ol className="sport-objects__list">
              {sportObjects.map(
                (item) => (
                  <li
                    className="sport-object"
                    key={item.number}
                  >
                    <span className="sport-object__number">
                      {item.number}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                    <span
                      className="sport-object__mark"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </li>
                ),
              )}
            </ol>


            <aside className="sport-objects__note">
              <span className="sport-objects__note-index">
                Важно
              </span>

              <h3>
                Название объекта само по себе
                не определяет нормативный режим
              </h3>

              <p>
                Применимость ПП РФ №202 определяем
                по фактическому назначению и статусу
                конкретного объекта.
              </p>

              <p>
                Поэтому не предполагаем автоматически,
                что любой фитнес-клуб или площадка
                подпадает под один и тот же порядок.
              </p>

              <a
                className="sport-inline-link"
                href="#lead-form"
              >
                Проверить конкретный объект

                <span aria-hidden="true">
                  →
                </span>
              </a>
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="sport-regulation"
        id="about-passport"
      >
        <Container>
          <div className="sport-regulation__layout">
            <div className="sport-regulation__identity">
              <p className="sport-kicker">
                Нормативное основание
              </p>

              <span>
                ПП РФ
              </span>

              <strong>
                №202
              </strong>
            </div>


            <div className="sport-regulation__content">
              <h2>
                Постановление Правительства РФ №202
              </h2>

              <p className="sport-regulation__lead">
                Постановление Правительства Российской
                Федерации от 06.03.2015 №202
                «Об утверждении требований
                к антитеррористической защищённости
                объектов спорта и формы паспорта
                безопасности объектов спорта».
              </p>


              <div className="sport-regulation__points">
                <article>
                  <span>
                    01
                  </span>

                  <h3>
                    Категорирование
                  </h3>

                  <p>
                    Для объектов спорта предусмотрено
                    категорирование с определением
                    категории опасности.
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
                    Постановление устанавливает
                    специальную форму паспорта
                    безопасности объекта спорта.
                  </p>
                </article>

                <article>
                  <span>
                    03
                  </span>

                  <h3>
                    Актуальная редакция
                  </h3>

                  <p>
                    Перед началом работ проверяем
                    действующую редакцию требований
                    применительно к конкретному объекту.
                  </p>
                </article>
              </div>


              <aside className="sport-regulation__notice">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  На странице не подменяем специальный
                  порядок для объектов спорта общими
                  требованиями к другим типам объектов.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


      {/* SPORT_STAGE_2_V1:start */}

      <section className="sport-categories">
        <Container>
          <div className="sport-categories__heading">
            <div>
              <p className="sport-kicker">
                Категорирование объекта спорта
              </p>

              <h2>
                Четыре категории опасности
              </h2>
            </div>

            <div className="sport-categories__intro">
              <p>
                Действующая редакция ПП РФ №202
                предусматривает 4 категории опасности.
                Категория определяется исходя
                из прогнозируемого количества
                пострадавших.
              </p>

              <p>
                Решение об отнесении объекта
                к категории принимает комиссия
                по результатам обследования
                и категорирования.
              </p>
            </div>
          </div>


          <div
            className="sport-categories__scale"
            aria-label="Категории опасности объектов спорта"
          >
            <article className="sport-category sport-category--one">
              <div className="sport-category__code">
                <span>
                  I
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="sport-category__value">
                <strong>
                  более 500
                </strong>

                <span>
                  человек
                </span>
              </div>

              <p>
                Прогнозируемое количество
                пострадавших.
              </p>
            </article>


            <article className="sport-category sport-category--two">
              <div className="sport-category__code">
                <span>
                  II
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="sport-category__value">
                <strong>
                  101–500
                </strong>

                <span>
                  человек
                </span>
              </div>

              <p>
                Прогнозируемое количество
                пострадавших.
              </p>
            </article>


            <article className="sport-category sport-category--three">
              <div className="sport-category__code">
                <span>
                  III
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="sport-category__value">
                <strong>
                  31–100
                </strong>

                <span>
                  человек
                </span>
              </div>

              <p>
                Прогнозируемое количество
                пострадавших.
              </p>
            </article>


            <article className="sport-category sport-category--four">
              <div className="sport-category__code">
                <span>
                  IV
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="sport-category__value">
                <strong>
                  менее 30
                </strong>

                <span>
                  человек
                </span>
              </div>

              <p>
                Прогнозируемое количество
                пострадавших.
              </p>
            </article>
          </div>


          <div className="sport-categories__bottom">
            <aside className="sport-categories__special">
              <span className="sport-categories__special-mark">
                IV
              </span>

              <div>
                <h3>
                  Открытые плоскостные сооружения
                </h3>

                <p>
                  Для открытых плоскостных сооружений
                  установлено отдельное правило —
                  им присваивается IV категория
                  опасности.
                </p>
              </div>
            </aside>


            <aside className="sport-categories__commission">
              <span>
                Комиссия
              </span>

              <p>
                Категория объекта определяется
                комиссией по результатам обследования
                и категорирования. Исполнитель
                документации не присваивает категорию
                единолично.
              </p>
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="sport-act"
        id="sport-categorization-act"
      >
        <Container>
          <div className="sport-act__layout">
            <div className="sport-act__index">
              <span>
                Следующий документ
              </span>

              <strong>
                АКТ
              </strong>
            </div>


            <div className="sport-act__content">
              <p className="sport-kicker">
                Результат работы комиссии
              </p>

              <h2>
                Акт обследования и категорирования
                объекта спорта
              </h2>

              <p className="sport-act__lead">
                Результаты работы комиссии оформляются
                актом обследования и категорирования
                объекта спорта.
              </p>


              <div className="sport-act__facts">
                <article>
                  <span>
                    01
                  </span>

                  <div>
                    <strong>
                      Один экземпляр
                    </strong>

                    <p>
                      По действующей редакции
                      ПП РФ №202 акт составляется
                      в одном экземпляре.
                    </p>
                  </div>
                </article>


                <article>
                  <span>
                    02
                  </span>

                  <div>
                    <strong>
                      Подписи комиссии
                    </strong>

                    <p>
                      Акт подписывается всеми
                      членами комиссии.
                    </p>
                  </div>
                </article>


                <article>
                  <span>
                    03
                  </span>

                  <div>
                    <strong>
                      Хранение с паспортом
                    </strong>

                    <p>
                      Акт хранится вместе
                      с паспортом безопасности
                      объекта спорта.
                    </p>
                  </div>
                </article>
              </div>


              <div className="sport-act__action">
                <a
                  href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
                  className="sport-act__link"
                >
                  <span>
                    Подробнее об акте обследования
                    и категорирования объекта
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SPORT_STAGE_2_V1:end */}


      {/* SPORT_STAGE_3_V1:start */}

      <section
        className="sport-process"
        id="process"
      >
        <Container>
          <div className="sport-process__heading">
            <div>
              <p className="sport-kicker">
                Порядок разработки
              </p>

              <h2>
                Как оформить паспорт безопасности
                объекта спорта
              </h2>
            </div>

            <p>
              Паспорт разрабатывается после
              обследования и категорирования объекта.
              Процесс последовательно проходит
              от проверки применимых требований
              до предусмотренного согласования.
            </p>
          </div>


          <ol
            className="sport-process__steps"
            aria-label="Этапы разработки паспорта безопасности объекта спорта"
          >
            <li className="sport-process__step">
              <span className="sport-process__number">
                01
              </span>

              <div>
                <h3>
                  Определяем применимость ПП РФ №202
                </h3>

                <p>
                  Проверяем фактическое назначение
                  и статус конкретного объекта спорта.
                </p>
              </div>
            </li>


            <li className="sport-process__step">
              <span className="sport-process__number">
                02
              </span>

              <div>
                <h3>
                  Собираем исходные сведения
                </h3>

                <p>
                  Формируем сведения, необходимые
                  для дальнейшего обследования,
                  категорирования и подготовки
                  документов.
                </p>
              </div>
            </li>


            <li className="sport-process__step">
              <span className="sport-process__number">
                03
              </span>

              <div>
                <h3>
                  Подготавливается работа комиссии
                </h3>

                <p>
                  Организуется следующий этап —
                  обследование и категорирование
                  объекта спорта.
                </p>
              </div>
            </li>


            <li className="sport-process__step">
              <span className="sport-process__number">
                04
              </span>

              <div>
                <h3>
                  Проводится обследование объекта
                </h3>

                <p>
                  Комиссия обследует объект
                  для последующего определения
                  категории опасности.
                </p>
              </div>
            </li>


            <li className="sport-process__step">
              <span className="sport-process__number">
                05
              </span>

              <div>
                <h3>
                  Определяется категория
                </h3>

                <p>
                  Решение об отнесении объекта
                  к категории принимает комиссия.
                </p>
              </div>
            </li>


            <li className="sport-process__step">
              <span className="sport-process__number">
                06
              </span>

              <div>
                <h3>
                  Оформляется акт обследования
                  и категорирования
                </h3>

                <p>
                  Результаты работы комиссии
                  закрепляются в акте.
                </p>
              </div>
            </li>


            <li className="sport-process__step">
              <span className="sport-process__number">
                07
              </span>

              <div>
                <h3>
                  Разрабатывается паспорт безопасности
                </h3>

                <p>
                  Документ оформляется по форме
                  и требованиям, установленным
                  для объектов спорта.
                </p>
              </div>
            </li>


            <li className="sport-process__step">
              <span className="sport-process__number">
                08
              </span>

              <div>
                <h3>
                  Проходит предусмотренное согласование
                </h3>

                <p>
                  Подготовленный паспорт направляется
                  на предусмотренное ПП РФ №202
                  согласование.
                </p>
              </div>
            </li>
          </ol>


          <aside className="sport-process__deadline">
            <div className="sport-process__deadline-value">
              <strong>
                3
              </strong>

              <span>
                месяца
              </span>
            </div>

            <div>
              <h3>
                Срок разработки паспорта
              </h3>

              <p>
                Паспорт безопасности составляется
                в течение 3 месяцев после проведения
                обследования и категорирования объекта.
              </p>
            </div>
          </aside>
        </Container>
      </section>


      <section className="sport-approval">
        <Container>
          <div className="sport-approval__layout">
            <div className="sport-approval__intro">
              <p className="sport-kicker">
                Согласование
              </p>

              <h2>
                С кем согласовывается паспорт
                объекта спорта
              </h2>

              <p>
                По действующей редакции ПП РФ №202
                паспорт проходит предусмотренное
                согласование, после чего утверждается
                ответственным лицом.
              </p>
            </div>


            <div className="sport-approval__route">
              <article className="sport-approval__authority">
                <span className="sport-approval__authority-number">
                  01
                </span>

                <div>
                  <h3>
                    Территориальный орган безопасности
                  </h3>

                  <p>
                    Паспорт согласовывается
                    с руководителем территориального
                    органа безопасности либо
                    уполномоченным им лицом.
                  </p>
                </div>
              </article>


              <div
                className="sport-approval__connector"
                aria-hidden="true"
              >
                <span />
              </div>


              <article className="sport-approval__authority">
                <span className="sport-approval__authority-number">
                  02
                </span>

                <div>
                  <h3>
                    Росгвардия
                  </h3>

                  <p>
                    Паспорт согласовывается
                    с руководителем территориального
                    органа Росгвардии либо
                    подразделения вневедомственной
                    охраны Росгвардии по месту
                    нахождения объекта.
                  </p>
                </div>
              </article>


              <div
                className="sport-approval__connector"
                aria-hidden="true"
              >
                <span />
              </div>


              <article className="sport-approval__authority sport-approval__authority--final">
                <span className="sport-approval__authority-number">
                  03
                </span>

                <div>
                  <h3>
                    Утверждение
                  </h3>

                  <p>
                    После предусмотренного согласования
                    паспорт утверждается ответственным
                    лицом.
                  </p>
                </div>
              </article>
            </div>
          </div>


          <div className="sport-approval__deadline">
            <div className="sport-approval__deadline-main">
              <span>
                Срок согласования
              </span>

              <strong>
                до 30 дней
              </strong>
            </div>

            <p>
              Не более 30 дней со дня представления
              паспорта в соответствующие органы.
            </p>
          </div>
        </Container>
      </section>

      {/* SPORT_STAGE_3_V1:end */}


      {/* SPORT_STAGE_4_V1:start */}

      <section className="sport-dsp">
        <Container>
          <div className="sport-dsp__layout">
            <div className="sport-dsp__label">
              <span>
                ДСП
              </span>

              <small>
                Для служебного пользования
              </small>
            </div>


            <div className="sport-dsp__content">
              <p className="sport-kicker">
                Работа с документом
              </p>

              <h2>
                Можно ли публиковать паспорт
                объекта спорта
              </h2>

              <p className="sport-dsp__lead">
                Паспорт объекта спорта содержит
                служебную информацию ограниченного
                распространения и имеет пометку
                «Для служебного пользования».
              </p>


              <div className="sport-dsp__rules">
                <article className="sport-dsp__rule">
                  <span className="sport-dsp__rule-sign sport-dsp__rule-sign--yes">
                    ✓
                  </span>

                  <div>
                    <h3>
                      Официальная форма
                    </h3>

                    <p>
                      На сайте можно показывать
                      официальную форму паспорта.
                    </p>
                  </div>
                </article>


                <article className="sport-dsp__rule">
                  <span className="sport-dsp__rule-sign sport-dsp__rule-sign--yes">
                    ✓
                  </span>

                  <div>
                    <h3>
                      Обезличенная структура
                    </h3>

                    <p>
                      Можно использовать обезличенный
                      пример структуры документа.
                    </p>
                  </div>
                </article>


                <article className="sport-dsp__rule sport-dsp__rule--restricted">
                  <span className="sport-dsp__rule-sign">
                    —
                  </span>

                  <div>
                    <h3>
                      Заполненный паспорт объекта
                    </h3>

                    <p>
                      Реальный заполненный паспорт
                      действующего спортивного объекта
                      на сайте не публикуем.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section className="sport-service">
        <Container>
          <div className="sport-service__heading">
            <div>
              <p className="sport-kicker">
                Состав работ
              </p>

              <h2>
                Что входит в работу по паспорту
                безопасности объекта спорта
              </h2>
            </div>

            <p>
              Состав проекта зависит от того,
              проведено ли категорирование
              и есть ли у объекта действующий акт.
              Не объединяем разные этапы
              в одну услугу автоматически.
            </p>
          </div>


          <div className="sport-service__flow">
            <article>
              <span>
                01
              </span>

              <h3>
                Проверка применимого порядка
              </h3>

              <p>
                Определяем применимость ПП РФ №202
                к конкретному объекту спорта.
              </p>
            </article>


            <article>
              <span>
                02
              </span>

              <h3>
                Исходные сведения
              </h3>

              <p>
                Собираем и анализируем данные,
                необходимые для подготовки
                документов.
              </p>
            </article>


            <article>
              <span>
                03
              </span>

              <h3>
                Категорирование и акт
              </h3>

              <p>
                Если объект не категорирован,
                сначала проводится обследование
                и категорирование с оформлением акта.
              </p>
            </article>


            <article>
              <span>
                04
              </span>

              <h3>
                Разработка паспорта
              </h3>

              <p>
                Подготавливаем паспорт безопасности
                объекта спорта по установленной форме.
              </p>
            </article>


            <article>
              <span>
                05
              </span>

              <h3>
                Подготовка к согласованию
              </h3>

              <p>
                Подготавливаем документ
                к предусмотренному порядку
                согласования.
              </p>
            </article>


            <article>
              <span>
                06
              </span>

              <h3>
                Сопровождение согласования
              </h3>

              <p>
                Сопровождаем предусмотренное
                согласование в рамках выбранного
                состава работ.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section
        className="sport-prices"
        id="prices"
      >
        <Container>
          <div className="sport-prices__heading">
            <div>
              <p className="sport-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость паспорта безопасности
                объекта спорта
              </h2>
            </div>

            <p>
              Цена зависит от текущего состояния
              документации объекта и необходимого
              состава работ.
            </p>
          </div>


          <div className="sport-prices__list">
            <article className="sport-price">
              <div className="sport-price__name">
                <span>
                  01
                </span>

                <h3>
                  Паспорт безопасности
                </h3>
              </div>

              <strong>
                9 500 ₽
              </strong>
            </article>


            <article className="sport-price">
              <div className="sport-price__name">
                <span>
                  02
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


            <article className="sport-price">
              <div className="sport-price__name">
                <span>
                  03
                </span>

                <h3>
                  Сопровождение согласования
                </h3>
              </div>

              <strong>
                от 9 500 ₽
              </strong>
            </article>


            <article className="sport-price sport-price--complex">
              <div className="sport-price__name">
                <span>
                  04
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


          <div className="sport-prices__logic">
            <div className="sport-prices__logic-item">
              <span>
                Есть действующий акт
              </span>

              <p>
                Если действующий акт категорирования
                уже есть и соответствует фактическому
                состоянию объекта, можно заказать
                только подготовку паспорта.
              </p>
            </div>


            <div className="sport-prices__logic-arrow">
              <span aria-hidden="true">
                ↔
              </span>
            </div>


            <div className="sport-prices__logic-item">
              <span>
                Акта нет
              </span>

              <p>
                Если объект не категорирован,
                сначала проводится процедура
                обследования и категорирования.
              </p>
            </div>
          </div>


          <div className="sport-prices__action">
            <a
              className="button button--primary"
              href="#lead-form"
            >
              Заказать паспорт
            </a>
          </div>
        </Container>
      </section>

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

      <section className="sport-current">
        <Container>
          <div className="sport-current__layout">
            <div className="sport-current__year">
              <span>
                Актуально
              </span>

              <strong>
                2026
              </strong>
            </div>


            <div className="sport-current__content">
              <p className="sport-kicker">
                Действующие требования
              </p>

              <h2>
                Что учитывать в 2026 году
              </h2>

              <p className="sport-current__lead">
                На момент подготовки страницы
                ПП РФ №202 применяется в редакции
                с изменениями от 25.03.2025.
                Перед началом работ дополнительно
                проверяем актуальную редакцию
                требований для конкретного объекта.
              </p>


              <div className="sport-current__standard">
                <div>
                  <span>
                    С 1 мая 2026 года
                  </span>

                  <h3>
                    ГОСТ Р 72551-2026
                  </h3>
                </div>

                <p>
                  Стандарт устанавливает общие
                  требования к услугам
                  по категорированию объектов
                  и разработке паспортов безопасности.
                </p>
              </div>


              <aside className="sport-current__notice">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  ГОСТ не заменяет специальные
                  обязательные требования ПП РФ №202.
                  Конкретный порядок для спортивного
                  объекта определяется применимым
                  нормативным режимом.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


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
