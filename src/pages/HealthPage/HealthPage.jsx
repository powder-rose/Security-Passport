import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


const healthObjects = [
  {
    number: '01',
    title: 'Больницы',
  },
  {
    number: '02',
    title: 'Поликлиники',
  },
  {
    number: '03',
    title: 'Медицинские центры',
  },
  {
    number: '04',
    title: 'Диспансеры',
  },
  {
    number: '05',
    title: 'Стоматологии',
  },
  {
    number: '06',
    title: 'Диагностические центры',
  },
  {
    number: '07',
    title: 'Фармацевтические организации',
  },
  {
    number: '08',
    title: 'Иные медицинские объекты',
  },
];


const healthFaqItems = [
  {
    question:
      'Каким медицинским организациям нужен паспорт безопасности?',
    answer:
      'Применимость ПП РФ №8 определяется с учётом правообладателя, назначения и фактического статуса конкретного объекта. Требования распространяются на предусмотренные постановлением объекты в сфере здравоохранения, включая объекты организаций, осуществляющих медицинскую и фармацевтическую деятельность.',
  },
  {
    question:
      'Нужен ли паспорт частной клинике?',
    answer:
      'Само название «частная клиника» не означает автоматическую обязанность оформлять отдельный паспорт. Сначала проверяются статус организации, назначение и фактические характеристики конкретного объекта и применимость ПП РФ №8.',
  },
  {
    question:
      'Нужен ли паспорт аптеке?',
    answer:
      'ПП РФ №8 охватывает в том числе объекты организаций, осуществляющих фармацевтическую деятельность. При этом применимость требований к конкретной аптеке определяется с учётом статуса организации и самого объекта.',
  },
  {
    question:
      'Какое постановление регулирует объекты здравоохранения?',
    answer:
      'Специальные требования к антитеррористической защищённости рассматриваемых объектов здравоохранения и форма паспорта безопасности установлены Постановлением Правительства РФ от 13.01.2017 №8. На сентябрь 2026 года применяется редакция от 15.08.2025.',
  },
  {
    question:
      'Сколько категорий предусмотрено?',
    answer:
      'ПП РФ №8 предусматривает четыре категории объектов: I, II, III и IV.',
  },
  {
    question:
      'Как определяется категория объекта?',
    answer:
      'Категорию определяет комиссия по результатам обследования. При категорировании учитываются прогнозируемое количество пострадавших и возможный материальный ущерб, поэтому определять категорию только по количеству людей некорректно.',
  },
  {
    question:
      'Кто входит в комиссию?',
    answer:
      'В комиссию входят представители правообладателя и объекта, а также по согласованию представители территориального органа безопасности, Росгвардии или подразделения вневедомственной охраны и территориального органа МЧС. К работе могут привлекаться эксперты специализированных организаций.',
  },
  {
    question:
      'Сколько времени может работать комиссия?',
    answer:
      'Максимальный срок работы комиссии по обследованию и категорированию составляет 60 рабочих дней. Конкретный срок определяется с учётом сложности объекта.',
  },
  {
    question:
      'Сколько экземпляров акта составляется?',
    answer:
      'Акт обследования и категорирования составляется в двух экземплярах, подписывается всеми членами комиссии, утверждается председателем комиссии и является неотъемлемой частью паспорта безопасности.',
  },
  {
    question:
      'Сколько экземпляров паспорта оформляется?',
    answer:
      'Паспорт безопасности оформляется в двух экземплярах. Первый хранится на объекте или территории, второй направляется правообладателю. Копия или электронная копия направляется в территориальный орган безопасности.',
  },
  {
    question:
      'С кем согласовывается паспорт?',
    answer:
      'Паспорт согласовывается с территориальным органом безопасности и с соответствующим территориальным органом Росгвардии либо подразделением вневедомственной охраны. После согласования документ утверждает правообладатель объекта либо уполномоченное им лицо.',
  },
  {
    question:
      'Какой срок согласования?',
    answer:
      'По ПП РФ №8 срок согласования паспорта составляет 30 дней со дня его разработки.',
  },
  {
    question:
      'Как часто нужно актуализировать паспорт?',
    answer:
      'Паспорт подлежит актуализации не реже одного раза в пять лет, а также при предусмотренных изменениях характеристик объекта, опасных и критических элементов, сил и средств обеспечения защищённости и мер инженерно-технической защиты.',
  },
  {
    question:
      'Можно ли скачать форму паспорта?',
    answer:
      'Официальная форма паспорта утверждена непосредственно ПП РФ №8. На странице можно ознакомиться со структурой документа и запросить форму паспорта.',
  },
  {
    question:
      'Можно ли публиковать заполненный паспорт?',
    answer:
      'Реальный заполненный паспорт, содержащий сведения о защищённости действующего объекта, публично не размещаем. Можно показывать официальную форму, структуру документа и обезличенный пример.',
  },
  {
    question:
      'Сколько стоит разработка?',
    answer:
      'Разработка паспорта безопасности стоит 9 500 ₽, акт обследования и категорирования — 9 500 ₽, сопровождение согласования — от 9 500 ₽, комплекс под ключ — от 35 000 ₽.',
  },
];


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

      <section
        className="health-hero"
        id="top"
      >
        <Container>
          <nav
            className="health-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Паспорт безопасности
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Объекты здравоохранения
            </span>
          </nav>


          <div className="health-hero__layout">
            <div className="health-hero__content">
              <p className="health-kicker">
                Объекты здравоохранения
              </p>

              <h1>
                Паспорт безопасности объекта
                здравоохранения — разработка
                и согласование
              </h1>

              <p className="health-hero__lead">
                Подготовим паспорт безопасности
                медицинского или фармацевтического
                объекта с учётом требований
                к антитеррористической защищённости.
                Подготовим документацию для
                категорирования, акт, паспорт
                и сопровождение согласования.
              </p>


              <div className="health-hero__commercial">
                <div className="health-hero__price">
                  <span>
                    Стоимость разработки
                  </span>

                  <strong>
                    от 9 500 ₽
                  </strong>
                </div>


                <div className="health-hero__facts">
                  <span>
                    ПП РФ №8
                  </span>

                  <span>
                    4 категории объектов
                  </span>

                  <span>
                    Категорирование + паспорт
                  </span>
                </div>
              </div>


              <div className="health-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Заказать паспорт
                </a>

                <a
                  className="button button--secondary"
                  href="#objects"
                >
                  Проверить требования для моего объекта
                </a>
              </div>
            </div>


            <aside className="health-hero__legal">
              <div className="health-hero__legal-top">
                <span>
                  Нормативное основание
                </span>

                <strong>
                  редакция 15.08.2025
                </strong>
              </div>


              <div className="health-hero__legal-number">
                <span>
                  ПП РФ
                </span>

                <strong>
                  №8
                </strong>
              </div>


              <div className="health-hero__legal-title">
                <span>
                  Антитеррористическая
                  защищённость объектов
                  здравоохранения
                </span>
              </div>


              <div
                className="health-hero__categories"
                aria-label="Четыре категории объектов"
              >
                <span>
                  I
                </span>

                <span>
                  II
                </span>

                <span>
                  III
                </span>

                <span>
                  IV
                </span>
              </div>


              <p className="health-hero__legal-note">
                Категория определяется
                по результатам обследования
                и категорирования объекта.
              </p>


              {!city.isDefault && (
                <p className="health-hero__region">
                  Регион: {city.name}
                </p>
              )}
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="health-objects"
        id="objects"
      >
        <Container>
          <div className="health-objects__heading">
            <div>
              <p className="health-kicker">
                Применимость ПП РФ №8
              </p>

              <h2>
                Каким объектам здравоохранения
                требуется паспорт безопасности
              </h2>
            </div>


            <p>
              Требования распространяются
              не только на объекты непосредственно
              Минздрава России. В сферу ПП РФ №8
              входят предусмотренные постановлением
              объекты в сфере здравоохранения,
              включая объекты организаций,
              осуществляющих медицинскую
              и фармацевтическую деятельность.
            </p>
          </div>


          <div className="health-objects__layout">
            <ol className="health-objects__list">
              {healthObjects.map(
                (item) => (
                  <li
                    className="health-object"
                    key={item.number}
                  >
                    <span className="health-object__number">
                      {item.number}
                    </span>

                    <h3>
                      {item.title}
                    </h3>
                  </li>
                ),
              )}
            </ol>


            <aside className="health-objects__scope">
              <div className="health-objects__scope-mark">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  Важно
                </p>
              </div>

              <h3>
                Сначала определяем статус
                конкретного объекта
              </h3>

              <p>
                Применимость конкретных требований
                проверяется с учётом правообладателя,
                назначения и фактического статуса
                объекта.
              </p>

              <p>
                Само название «клиника»,
                «стоматология» или «аптека»
                не заменяет проверку применимого
                нормативного режима.
              </p>

              <a
                className="health-inline-link"
                href="#lead-form"
              >
                Проверить требования
                для моего объекта

                <span aria-hidden="true">
                  →
                </span>
              </a>
            </aside>
          </div>
        </Container>
      </section>


      {/* HEALTH_STAGE_1_V1:end */}


      {/* HEALTH_STAGE_2_V1:start */}

      <section
        className="health-regulation"
        id="about-passport"
      >
        <Container>
          <div className="health-regulation__layout">
            <aside className="health-regulation__identity">
              <div className="health-regulation__eyebrow">
                <span>
                  Нормативное основание
                </span>

                <strong>
                  действует
                </strong>
              </div>

              <div className="health-regulation__number">
                <small>
                  Постановление Правительства РФ
                </small>

                <strong>
                  №8
                </strong>
              </div>

              <div className="health-regulation__date">
                <span>
                  13.01.2017
                </span>

                <span>
                  редакция 15.08.2025
                </span>
              </div>
            </aside>


            <div className="health-regulation__content">
              <p className="health-kicker">
                Постановление Правительства РФ №8
              </p>

              <h2>
                Требования к объектам
                здравоохранения
              </h2>

              <p className="health-regulation__lead">
                Требования к антитеррористической
                защищённости объектов Минздрава России
                и объектов, относящихся к сфере
                деятельности Минздрава, а также
                официальная форма паспорта безопасности
                установлены Постановлением Правительства
                РФ от 13.01.2017 №8.
              </p>

              <div className="health-regulation__status">
                <span aria-hidden="true">
                  2026
                </span>

                <p>
                  На сентябрь 2026 года
                  постановление применяется
                  в редакции от 15 августа 2025 года.
                </p>
              </div>


              <div className="health-regulation__points">
                <article>
                  <span>
                    01
                  </span>

                  <h3>
                    Категорирование
                  </h3>

                  <p>
                    Требования предусматривают
                    определение категории
                    конкретного объекта.
                  </p>
                </article>

                <article>
                  <span>
                    02
                  </span>

                  <h3>
                    Защищённость
                  </h3>

                  <p>
                    Категория используется
                    при применении требований
                    к антитеррористической
                    защищённости.
                  </p>
                </article>

                <article>
                  <span>
                    03
                  </span>

                  <h3>
                    Паспорт
                  </h3>

                  <p>
                    Постановлением утверждена
                    форма паспорта безопасности
                    объекта.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </section>


      <section className="health-categories">
        <Container>
          <div className="health-categories__heading">
            <div>
              <p className="health-kicker">
                Категорирование
              </p>

              <h2>
                Четыре категории
                объектов здравоохранения
              </h2>
            </div>

            <div className="health-categories__intro">
              <p>
                ПП РФ №8 предусматривает
                четыре категории объектов.
              </p>

              <strong>
                Категория не определяется
                только по числу людей.
              </strong>
            </div>
          </div>


          <div className="health-categories__criteria">
            <div>
              <span className="health-categories__dot" />

              <p>
                Прогнозируемое количество
                пострадавших
              </p>
            </div>

            <div>
              <span className="health-categories__dot" />

              <p>
                Возможный материальный
                ущерб
              </p>
            </div>
          </div>


          <ol
            className="health-categories__matrix"
            aria-label="Категории объектов здравоохранения"
          >
            <li>
              <div className="health-category__identity">
                <span>
                  I
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="health-category__metric">
                <small>
                  Пострадавшие
                </small>

                <strong>
                  более 1 000 чел.
                </strong>
              </div>

              <div className="health-category__metric">
                <small>
                  Материальный ущерб
                </small>

                <strong>
                  более 100 млн ₽
                </strong>
              </div>
            </li>


            <li>
              <div className="health-category__identity">
                <span>
                  II
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="health-category__metric">
                <small>
                  Пострадавшие
                </small>

                <strong>
                  500–1 000 чел.
                </strong>
              </div>

              <div className="health-category__metric">
                <small>
                  Материальный ущерб
                </small>

                <strong>
                  50–100 млн ₽
                </strong>
              </div>
            </li>


            <li>
              <div className="health-category__identity">
                <span>
                  III
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="health-category__metric">
                <small>
                  Пострадавшие
                </small>

                <strong>
                  50–500 чел.
                </strong>
              </div>

              <div className="health-category__metric">
                <small>
                  Материальный ущерб
                </small>

                <strong>
                  30–50 млн ₽
                </strong>
              </div>
            </li>


            <li>
              <div className="health-category__identity">
                <span>
                  IV
                </span>

                <small>
                  категория
                </small>
              </div>

              <div className="health-category__metric">
                <small>
                  Пострадавшие
                </small>

                <strong>
                  менее 50 чел.
                </strong>
              </div>

              <div className="health-category__metric">
                <small>
                  Материальный ущерб
                </small>

                <strong>
                  менее 30 млн ₽
                </strong>
              </div>
            </li>
          </ol>


          <aside className="health-categories__note">
            <span className="health-categories__note-mark">
              !
            </span>

            <div>
              <strong>
                Учитываются оба критерия
              </strong>

              <p>
                При категорировании учитываются
                прогнозируемое количество
                пострадавших и возможный
                материальный ущерб. Поэтому
                упрощённо определять категорию
                только по количеству людей
                некорректно.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {/* HEALTH_STAGE_2_V1:end */}


      {/* HEALTH_STAGE_3_V1:start */}

      <section className="health-commission">
        <Container>
          <div className="health-commission__layout">
            <div className="health-commission__heading">
              <p className="health-kicker">
                Кто определяет категорию
              </p>

              <h2>
                Комиссия по обследованию
                и категорированию
              </h2>

              <p>
                Для проведения категорирования
                решением руководителя органа
                или организации, являющегося
                правообладателем объекта,
                назначается комиссия.
              </p>
            </div>


            <div className="health-commission__content">
              <aside className="health-commission__term">
                <span>
                  Срок работы комиссии
                </span>

                <strong>
                  60
                </strong>

                <p>
                  рабочих дней
                </p>

                <small>
                  не более — конкретный срок
                  определяется с учётом
                  сложности объекта
                </small>
              </aside>


              <div className="health-commission__members">
                <p className="health-commission__members-label">
                  В состав комиссии входят
                </p>

                <div className="health-commission__member">
                  <span>
                    01
                  </span>

                  <div>
                    <strong>
                      Представители правообладателя
                    </strong>

                    <p>
                      Представители органа или
                      организации, являющегося
                      правообладателем объекта.
                    </p>
                  </div>
                </div>

                <div className="health-commission__member">
                  <span>
                    02
                  </span>

                  <div>
                    <strong>
                      Работники объекта
                    </strong>

                    <p>
                      Представители непосредственно
                      объекта или территории.
                    </p>
                  </div>
                </div>

                <div className="health-commission__member">
                  <span>
                    03
                  </span>

                  <div>
                    <strong>
                      Территориальный орган безопасности
                    </strong>

                    <p>
                      Представитель включается
                      в состав комиссии
                      по согласованию.
                    </p>
                  </div>
                </div>

                <div className="health-commission__member">
                  <span>
                    04
                  </span>

                  <div>
                    <strong>
                      Росгвардия
                    </strong>

                    <p>
                      Представитель территориального
                      органа Росгвардии либо
                      подразделения вневедомственной
                      охраны — по согласованию.
                    </p>
                  </div>
                </div>

                <div className="health-commission__member">
                  <span>
                    05
                  </span>

                  <div>
                    <strong>
                      Территориальный орган МЧС
                    </strong>

                    <p>
                      Представитель по месту
                      нахождения объекта —
                      по согласованию.
                    </p>
                  </div>
                </div>
              </div>
            </div>


            <div className="health-commission__expert">
              <span>
                Дополнительно
              </span>

              <p>
                К работе комиссии могут привлекаться
                эксперты специализированных организаций.
              </p>
            </div>


            <aside className="health-commission__role">
              <div>
                <span>
                  Наша роль
                </span>

                <strong>
                  Сопровождаем процедуру,
                  а не присваиваем категорию
                </strong>
              </div>

              <p>
                Мы сопровождаем категорирование
                и готовим документацию для работы
                комиссии. Категория определяется
                комиссией, а не подрядчиком
                единолично.
              </p>
            </aside>
          </div>
        </Container>
      </section>


      <section className="health-act">
        <Container>
          <div className="health-act__layout">
            <div className="health-act__intro">
              <p className="health-kicker">
                Результат категорирования
              </p>

              <h2>
                Акт обследования
                и категорирования
                медицинского объекта
              </h2>

              <p className="health-act__lead">
                Результаты работы комиссии
                оформляются актом обследования
                и категорирования объекта.
              </p>

              <a
                className="health-act__link"
                href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
              >
                Подробнее об акте обследования
                и категорирования объекта

                <span aria-hidden="true">
                  →
                </span>
              </a>
            </div>


            <div className="health-act__content">
              <div className="health-act__quantity">
                <span>
                  Акт составляется
                </span>

                <div>
                  <strong>
                    2
                  </strong>

                  <p>
                    экземпляра
                  </p>
                </div>

                <small>
                  По ПП РФ №8
                </small>
              </div>


              <div className="health-act__rules">
                <article>
                  <span>
                    01
                  </span>

                  <div>
                    <strong>
                      Подписывается комиссией
                    </strong>

                    <p>
                      Акт подписывают все
                      члены комиссии.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    02
                  </span>

                  <div>
                    <strong>
                      Утверждается председателем
                    </strong>

                    <p>
                      После подписания акт
                      утверждается председателем
                      комиссии.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    03
                  </span>

                  <div>
                    <strong>
                      Два экземпляра
                    </strong>

                    <p>
                      Акт обследования
                      и категорирования
                      оформляется в двух экземплярах.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    04
                  </span>

                  <div>
                    <strong>
                      Часть паспорта
                    </strong>

                    <p>
                      Акт является неотъемлемой
                      частью паспорта безопасности
                      объекта.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* HEALTH_STAGE_3_V1:end */}


      {/* HEALTH_STAGE_4_V1:start */}

      <section
        className="health-process"
        id="process"
      >
        <Container>
          <div className="health-process__layout">
            <div className="health-process__heading">
              <p className="health-kicker">
                От проверки до утверждения
              </p>

              <h2>
                Порядок разработки
                паспорта безопасности
                объекта здравоохранения
              </h2>

              <p>
                Работа строится последовательно:
                сначала проверяется применимость
                требований и проводится
                категорирование, затем на основании
                акта разрабатывается паспорт
                и проходит предусмотренное
                согласование.
              </p>
            </div>


            <ol className="health-process__steps">
              <li>
                <span className="health-process__number">
                  01
                </span>

                <div>
                  <strong>
                    Определяем применимость ПП РФ №8
                  </strong>

                  <p>
                    Проверяем объект, правообладателя,
                    назначение и фактический статус.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  02
                </span>

                <div>
                  <strong>
                    Собираем исходные данные
                  </strong>

                  <p>
                    Формируем сведения, необходимые
                    для обследования, категорирования
                    и последующей подготовки документов.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  03
                </span>

                <div>
                  <strong>
                    Формируется комиссия
                  </strong>

                  <p>
                    Правообладатель назначает
                    комиссию по обследованию
                    и категорированию объекта.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  04
                </span>

                <div>
                  <strong>
                    Проводится обследование
                  </strong>

                  <p>
                    Комиссия обследует объект
                    и рассматривает сведения,
                    необходимые для категорирования.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  05
                </span>

                <div>
                  <strong>
                    Определяется категория
                  </strong>

                  <p>
                    Категория устанавливается
                    комиссией по результатам
                    обследования объекта.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  06
                </span>

                <div>
                  <strong>
                    Оформляется акт
                  </strong>

                  <p>
                    Результаты обследования
                    и категорирования фиксируются
                    в акте комиссии.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  07
                </span>

                <div>
                  <strong>
                    Разрабатывается паспорт безопасности
                  </strong>

                  <p>
                    Паспорт оформляется
                    для соответствующего объекта
                    в соответствии с актом
                    обследования и категорирования.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  08
                </span>

                <div>
                  <strong>
                    Согласование и утверждение
                  </strong>

                  <p>
                    Паспорт проходит предусмотренное
                    ПП РФ №8 согласование,
                    после чего утверждается
                    правообладателем.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </Container>
      </section>


      <section className="health-approval">
        <Container>
          <div className="health-approval__heading">
            <div>
              <p className="health-kicker">
                Согласование паспорта
              </p>

              <h2>
                С кем согласовывается
                паспорт объекта здравоохранения
              </h2>
            </div>

            <p>
              По действующей редакции ПП РФ №8
              паспорт согласовывается с двумя
              предусмотренными постановлением
              органами, а затем утверждается
              правообладателем объекта.
            </p>
          </div>


          <div className="health-approval__layout">
            <aside className="health-approval__term">
              <span>
                Срок согласования
              </span>

              <strong>
                30
              </strong>

              <p>
                дней
              </p>

              <small>
                со дня разработки паспорта
              </small>
            </aside>


            <div className="health-approval__content">
              <div className="health-approval__authorities">
                <article>
                  <span>
                    01
                  </span>

                  <div>
                    <small>
                      Согласование
                    </small>

                    <strong>
                      Территориальный
                      орган безопасности
                    </strong>

                    <p>
                      С руководителем
                      территориального органа
                      безопасности либо
                      уполномоченным им
                      должностным лицом.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    02
                  </span>

                  <div>
                    <small>
                      Согласование
                    </small>

                    <strong>
                      Росгвардия
                    </strong>

                    <p>
                      С руководителем
                      соответствующего
                      территориального органа
                      Росгвардии либо подразделения
                      вневедомственной охраны.
                    </p>
                  </div>
                </article>
              </div>


              <div className="health-approval__final">
                <span>
                  После согласования
                </span>

                <div>
                  <strong>
                    Паспорт утверждает
                    правообладатель
                  </strong>

                  <p>
                    Документ утверждается
                    руководителем органа
                    или организации,
                    являющегося правообладателем
                    объекта, либо уполномоченным
                    им лицом.
                  </p>
                </div>
              </div>


              <aside className="health-approval__clarification">
                <span>
                  Важно различать этапы
                </span>

                <p>
                  Представитель МЧС участвует
                  в комиссии по обследованию
                  и категорированию по согласованию.
                  В перечне согласующих паспорт
                  по ПП РФ №8 названы орган
                  безопасности и Росгвардия.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


      <section className="health-copies">
        <Container>
          <div className="health-copies__layout">
            <div className="health-copies__identity">
              <p className="health-kicker">
                Экземпляры документа
              </p>

              <div>
                <strong>
                  2
                </strong>

                <span>
                  экземпляра
                </span>
              </div>

              <p>
                Паспорт безопасности
                объекта здравоохранения
                оформляется в двух экземплярах.
              </p>
            </div>


            <div className="health-copies__distribution">
              <h2>
                Где хранятся экземпляры
                паспорта
              </h2>

              <div className="health-copies__row">
                <span>
                  01
                </span>

                <div>
                  <strong>
                    На объекте
                  </strong>

                  <p>
                    Первый экземпляр
                    паспорта хранится
                    на объекте или территории.
                  </p>
                </div>
              </div>

              <div className="health-copies__row">
                <span>
                  02
                </span>

                <div>
                  <strong>
                    У правообладателя
                  </strong>

                  <p>
                    Второй экземпляр
                    направляется органу
                    или организации,
                    являющемуся правообладателем
                    объекта.
                  </p>
                </div>
              </div>


              <aside className="health-copies__copy">
                <span>
                  Копия
                </span>

                <p>
                  Копия или электронная копия
                  паспорта направляется
                  в территориальный орган
                  безопасности по месту
                  нахождения объекта.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>

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
                ПП РФ №8 согласования
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
                  ПП РФ №8
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
              ПП РФ №8 устанавливает
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
                ПП РФ №8 действует
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
                    ПП РФ №8
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
                  берём из ПП РФ №8.
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
                    ПП РФ №8
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
                Применимость ПП РФ №8,
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
