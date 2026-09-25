import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

import {
  useCity,
} from '../../context/GeoContext';


const tradeObjects = [
  {
    number: '01',
    title: 'Магазины',
  },
  {
    number: '02',
    title: 'Супермаркеты',
  },
  {
    number: '03',
    title: 'Гипермаркеты',
  },
  {
    number: '04',
    title: 'Торговые центры',
  },
  {
    number: '05',
    title: 'Торговые комплексы',
  },
  {
    number: '06',
    title: 'Рынки и иные торговые территории',
  },
  {
    number: '07',
    title: 'Автосалоны и иные объекты торговли',
  },
];


const tradeFaqItems = [
  {
    question:
      'Всем ли торговым объектам нужен паспорт безопасности?',
    answer:
      'Нет. ПП РФ №1273 применяется к торговым объектам, включённым в соответствующий перечень объектов, подлежащих категорированию. Также учитывается, не регулируется ли конкретный объект другими специальными требованиями Правительства РФ.',
  },
  {
    question:
      'Как узнать, включён ли объект в региональный перечень?',
    answer:
      'Необходимо проверить статус конкретного торгового объекта в перечне, который формирует уполномоченный орган субъекта РФ. При наличии уведомления о включении объекта в перечень оно также учитывается при определении дальнейшего порядка работы.',
  },
  {
    question:
      'Какое постановление регулирует торговые объекты?',
    answer:
      'Основной нормативный акт — Постановление Правительства РФ от 19.10.2017 №1273. На сентябрь 2026 года применяется редакция от 04.03.2026 с изменениями, внесёнными Постановлением Правительства РФ №229.',
  },
  {
    question:
      'Что изменилось в ПП №1273 в 2026 году?',
    answer:
      'Изменения затронули порядок формирования перечней торговых объектов, статус правообладателей и организатора антитеррористической защищённости, создание комиссии, сроки согласования и доработки паспорта, порядок актуализации и непосредственно форму паспорта безопасности.',
  },
  {
    question:
      'Кто проводит категорирование торгового объекта?',
    answer:
      'Обследование и категорирование проводит комиссия. С марта 2026 года дополнительно закреплён срок её создания — в частности, в течение одного месяца после получения уведомления о включении торгового объекта в соответствующий перечень.',
  },
  {
    question:
      'Сколько времени даётся на разработку паспорта?',
    answer:
      'Паспорт безопасности торгового объекта должен быть разработан в течение 30 дней после подписания акта обследования и категорирования.',
  },
  {
    question:
      'Сколько занимает согласование?',
    answer:
      'Срок согласования — не более 10 рабочих дней с момента поступления паспорта соответствующим органам. При наличии замечаний на доработку предусмотрено 5 рабочих дней. После согласования всеми предусмотренными должностными лицами паспорт утверждается не позднее 5 рабочих дней.',
  },
  {
    question:
      'Сколько экземпляров паспорта оформляется?',
    answer:
      'С 13 марта 2026 года паспорт безопасности торгового объекта составляется в двух экземплярах. Один передаётся в уполномоченный орган субъекта РФ, второй хранится непосредственно на торговом объекте. Предусмотренным территориальным органам направляются заверенные бумажные или электронные копии.',
  },
  {
    question:
      'Нужен ли паспорт магазину в торговом центре?',
    answer:
      'Сам факт нахождения магазина внутри торгового центра не даёт универсального ответа. Необходимо определить нормативный статус конкретного объекта и проверить его включение в соответствующий перечень.',
  },
  {
    question:
      'Нужен ли отдельный паспорт каждому арендатору ТЦ?',
    answer:
      'Универсального требования оформлять отдельный паспорт каждому арендатору только по факту аренды помещения нет. Сначала необходимо определить статус конкретного торгового объекта, его правообладателей и применимый нормативный порядок.',
  },
  {
    question:
      'Кто отвечает за паспорт при нескольких собственниках?',
    answer:
      'Если торговый объект принадлежит нескольким собственникам, организатор антитеррористической защищённости определяется по соглашению между всеми собственниками. После оформления копии паспорта направляются всем правообладателям торгового объекта.',
  },
  {
    question:
      'Когда паспорт нужно актуализировать?',
    answer:
      'Полная актуализация требуется, в частности, при изменении специализации или вида торговли, если это влияет на прогнозируемое число пострадавших, при изменении общей площади и границ объекта, а также количества потенциально опасных участков или критических элементов. Для изменений сил и средств антитеррористической защищённости и иных предусмотренных случаев применяется лист учёта корректировок.',
  },
  {
    question:
      'Является ли паспорт бессрочным?',
    answer:
      'Паспорт торгового объекта является информационно-справочным документом постоянного действия. При этом при наступлении установленных обстоятельств он подлежит актуализации.',
  },
  {
    question:
      'Можно ли скачать актуальную форму 2026 года?',
    answer:
      'Форма паспорта была изменена с 13 марта 2026 года Постановлением Правительства РФ №229. Для подготовки используем форму в действующей редакции от 04.03.2026; получить актуальную форму можно через заявку на этой странице.',
  },
  {
    question:
      'Сколько стоит разработка?',
    answer:
      'Разработка паспорта безопасности — 9 500 ₽. Акт обследования и категорирования — 9 500 ₽. Сопровождение согласования — от 9 500 ₽. Комплекс под ключ — от 35 000 ₽.',
  },
];


export default function TradePage() {
  const city =
    useCity();

  return (
    <main
      id="main-content"
      className="trade-page"
      data-trade-stage="1"
    >
      {/* TRADE_STAGE_1_V1:start */}

      <section
        className="trade-hero"
        id="top"
      >
        <Container>
          <nav
            className="trade-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Паспорт безопасности
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Торговые объекты
            </span>
          </nav>


          <div className="trade-hero__layout">
            <div className="trade-hero__content">
              <p className="trade-kicker">
                Торговые объекты
              </p>

              <h1>
                Паспорт безопасности торгового объекта —
                разработка и согласование
              </h1>

              <p className="trade-hero__lead">
                Подготовим паспорт безопасности торгового
                объекта (территории) по действующей редакции
                Постановления Правительства РФ №1273.
                Определим применимость требований, подготовим
                документы для категорирования, акт и паспорт,
                сопроводим согласование.
              </p>


              <div className="trade-hero__commercial">
                <div className="trade-hero__price">
                  <span>
                    Стоимость разработки
                  </span>

                  <strong>
                    от 9 500 ₽
                  </strong>
                </div>


                <div className="trade-hero__facts">
                  <span>
                    ПП РФ №1273, редакция 2026 года
                  </span>

                  <span>
                    Категорирование + акт + паспорт
                  </span>

                  <span>
                    Сопровождение согласования
                  </span>
                </div>
              </div>


              <div className="trade-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Заказать паспорт
                </a>

                <a
                  className="trade-text-action"
                  href="#objects"
                >
                  Проверить, нужен ли паспорт объекту

                  <span aria-hidden="true">
                    ↓
                  </span>
                </a>
              </div>
            </div>


            <aside className="trade-hero__edition">
              <div className="trade-hero__edition-top">
                <span>
                  Действующая редакция
                </span>

                <span>
                  2026
                </span>
              </div>


              <div className="trade-hero__number">
                <small>
                  ПП РФ №
                </small>

                <strong>
                  1273
                </strong>
              </div>


              <h2>
                Требования к антитеррористической
                защищённости торговых объектов
              </h2>

              <div className="trade-hero__update">
                <span>
                  Изменения №229
                </span>

                <strong>
                  с 13.03.2026
                </strong>
              </div>

              <p>
                На странице учитываем действующую
                редакцию требований, включая изменения
                порядка формирования перечней,
                категорирования, согласования,
                актуализации и формы паспорта.
              </p>

              {!city.isDefault && (
                <p className="trade-hero__region">
                  Регион: {city.name}
                </p>
              )}
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="trade-applicability"
        id="objects"
      >
        <Container>
          <div className="trade-applicability__heading">
            <div>
              <p className="trade-kicker">
                Применимость ПП РФ №1273
              </p>

              <h2>
                Кому нужен паспорт безопасности
                торгового объекта
              </h2>
            </div>

            <p>
              Требования распространяются не на любой
              магазин автоматически. Для применения
              ПП РФ №1273 имеет значение нормативный
              статус конкретного торгового объекта.
            </p>
          </div>


          <div className="trade-applicability__core">
            <article className="trade-applicability__rule">
              <span className="trade-applicability__index">
                01
              </span>

              <h3>
                Объект должен быть включён
                в соответствующий перечень
              </h3>

              <p>
                Требования №1273 распространяются
                на торговые объекты, включённые
                в специальный перечень объектов,
                подлежащих категорированию,
                который формируется уполномоченным
                органом субъекта РФ.
              </p>
            </article>


            <article className="trade-applicability__rule">
              <span className="trade-applicability__index">
                02
              </span>

              <h3>
                Сначала определяем нормативный
                статус объекта
              </h3>

              <p>
                Объекты, регулируемые другими
                специальными требованиями
                Правительства РФ, а также торговые
                объекты, не включённые
                в соответствующий перечень,
                под №1273 не подпадают.
              </p>
            </article>


            <aside className="trade-applicability__check">
              <p>
                Не уверены, включён ли ваш объект
                в перечень?
              </p>

              <h3>
                Проверим применимость ПП №1273
                до заказа документов
              </h3>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Проверить торговый объект
              </a>
            </aside>
          </div>


          <div className="trade-objects">
            <div className="trade-objects__intro">
              <p className="trade-kicker">
                Виды объектов
              </p>

              <h2>
                Для каких торговых объектов
                разрабатываем документацию
              </h2>
            </div>


            <ol className="trade-objects__list">
              {tradeObjects.map(
                (item) => (
                  <li
                    className="trade-object"
                    key={item.number}
                  >
                    <span className="trade-object__number">
                      {item.number}
                    </span>

                    <h3>
                      {item.title}
                    </h3>
                  </li>
                ),
              )}
            </ol>


            <div className="trade-objects__notice">
              <span>
                Важно
              </span>

              <p>
                Применимость ПП РФ №1273 определяется
                не названием бизнеса само по себе,
                а нормативным статусом объекта
                и его включением в соответствующий
                перечень. Особенно это важно
                для небольших магазинов и арендаторов
                внутри торговых центров.
              </p>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="trade-regulation"
        id="about-passport"
      >
        <Container>
          <div className="trade-regulation__layout">
            <div className="trade-regulation__identity">
              <p className="trade-kicker">
                Нормативное основание
              </p>

              <span>
                ПП РФ
              </span>

              <strong>
                №1273
              </strong>

              <small>
                от 19.10.2017
              </small>
            </div>


            <div className="trade-regulation__content">
              <div className="trade-regulation__badge">
                Актуально с учётом изменений
                от 13.03.2026
              </div>

              <h2>
                Требования к торговым объектам
                по ПП РФ №1273
              </h2>

              <p className="trade-regulation__lead">
                Основной нормативный акт —
                Постановление Правительства РФ
                от 19.10.2017 №1273.
                На сентябрь 2026 года действует
                редакция от 04.03.2026,
                учитывающая изменения
                Постановления Правительства РФ №229.
              </p>


              <div className="trade-regulation__meta">
                <div>
                  <span>
                    Редакция
                  </span>

                  <strong>
                    04.03.2026
                  </strong>
                </div>

                <div>
                  <span>
                    Изменения
                  </span>

                  <strong>
                    ПП РФ №229
                  </strong>
                </div>

                <div>
                  <span>
                    Применение изменений
                  </span>

                  <strong>
                    с 13.03.2026
                  </strong>
                </div>
              </div>


              <aside className="trade-regulation__notice">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  При подготовке документов используем
                  актуальный порядок и действующую форму,
                  а не старые шаблоны, составленные
                  до изменений марта 2026 года.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


      {/* TRADE_STAGE_1_V1:end */}


      {/* TRADE_STAGE_2_V1:start */}

      <section className="trade-changes">
        <Container>
          <div className="trade-changes__heading">
            <div>
              <p className="trade-kicker">
                Редакция 2026 года
              </p>

              <h2>
                Что изменилось в ПП РФ №1273
                в 2026 году
              </h2>
            </div>

            <p>
              С 13 марта 2026 года применяется
              обновлённый порядок. Изменения затронули
              не только форму паспорта, но и процедуру
              работы с торговым объектом.
            </p>
          </div>


          <div className="trade-changes__grid">
            <article className="trade-change">
              <span>
                01
              </span>

              <h3>
                Региональные перечни
              </h3>

              <p>
                Уточнён порядок включения торговых
                объектов в перечни объектов,
                подлежащих категорированию.
              </p>

              <strong>
                Важно правильно определить
                применимость требований.
              </strong>
            </article>


            <article className="trade-change">
              <span>
                02
              </span>

              <h3>
                Правообладатели объекта
              </h3>

              <p>
                Уточнён статус правообладателей
                и организатора антитеррористической
                защищённости.
              </p>

              <strong>
                Особенно важно для объектов
                с несколькими собственниками.
              </strong>
            </article>


            <article className="trade-change">
              <span>
                03
              </span>

              <h3>
                Работа комиссии
              </h3>

              <p>
                Установлен обновлённый порядок
                создания комиссии по обследованию
                и категорированию.
              </p>

              <strong>
                Категорирование проводим
                по актуальной процедуре.
              </strong>
            </article>


            <article className="trade-change">
              <span>
                04
              </span>

              <h3>
                Согласование
              </h3>

              <p>
                Установлены конкретные сроки
                согласования паспорта безопасности
                торгового объекта.
              </p>

              <strong>
                Процедура стала более
                формализованной.
              </strong>
            </article>


            <article className="trade-change">
              <span>
                05
              </span>

              <h3>
                Доработка
              </h3>

              <p>
                Закреплён срок доработки паспорта
                при наличии замечаний.
              </p>

              <strong>
                Замечания должны обрабатываться
                в установленный срок.
              </strong>
            </article>


            <article className="trade-change">
              <span>
                06
              </span>

              <h3>
                Актуализация
              </h3>

              <p>
                Уточнён порядок внесения изменений
                и актуализации паспорта.
              </p>

              <strong>
                Изменения оформляются
                по действующей схеме.
              </strong>
            </article>


            <article className="trade-change trade-change--wide">
              <span>
                07
              </span>

              <div>
                <h3>
                  Изменилась форма паспорта
                </h3>

                <p>
                  ПП РФ №229 внесло изменения
                  непосредственно в форму документа.
                  Старый шаблон нельзя механически
                  использовать для паспорта,
                  оформляемого по действующей редакции.
                </p>
              </div>

              <div className="trade-change__edition">
                <small>
                  Действует
                </small>

                <strong>
                  с 13.03.2026
                </strong>
              </div>
            </article>
          </div>
        </Container>
      </section>


      <section
        className="trade-categorization"
        id="process"
      >
        <Container>
          <div className="trade-categorization__layout">
            <div className="trade-categorization__heading">
              <p className="trade-kicker">
                Обследование объекта
              </p>

              <h2>
                Как проводится категорирование
                торгового объекта
              </h2>

              <p>
                После предусмотренного основания
                создаётся комиссия по обследованию
                и категорированию торгового объекта.
              </p>
            </div>


            <div className="trade-categorization__content">
              <article className="trade-categorization__deadline">
                <span>
                  Срок создания комиссии
                </span>

                <strong>
                  1 месяц
                </strong>

                <p>
                  С марта 2026 года срок её создания
                  закреплён, в частности, после
                  получения уведомления о включении
                  торгового объекта
                  в соответствующий перечень.
                </p>
              </article>


              <div className="trade-categorization__expert-note">
                <span aria-hidden="true">
                  +
                </span>

                <p>
                  К работе комиссии могут привлекаться
                  профильные специалисты и эксперты
                  специализированных организаций.
                </p>
              </div>
            </div>
          </div>


          <ol className="trade-categorization__steps">
            <li>
              <span>
                01
              </span>

              <strong>
                Включение объекта
                в перечень
              </strong>
            </li>

            <li>
              <span>
                02
              </span>

              <strong>
                Создание комиссии
              </strong>
            </li>

            <li>
              <span>
                03
              </span>

              <strong>
                Обследование объекта
              </strong>
            </li>

            <li>
              <span>
                04
              </span>

              <strong>
                Определение категории
              </strong>
            </li>

            <li>
              <span>
                05
              </span>

              <strong>
                Акт обследования
                и категорирования
              </strong>
            </li>

            <li>
              <span>
                06
              </span>

              <strong>
                Паспорт безопасности
              </strong>
            </li>
          </ol>
        </Container>
      </section>


      <section className="trade-act">
        <Container>
          <div className="trade-act__layout">
            <div className="trade-act__index">
              <span>
                Этап
              </span>

              <strong>
                05
              </strong>
            </div>


            <div className="trade-act__content">
              <p className="trade-kicker">
                Результат категорирования
              </p>

              <h2>
                Акт обследования
                и категорирования
                торгового объекта
              </h2>

              <p className="trade-act__lead">
                После обследования и определения
                категории результаты работы комиссии
                оформляются актом обследования
                и категорирования. На основании
                этого этапа далее разрабатывается
                паспорт безопасности.
              </p>


              <div className="trade-act__connection">
                <div>
                  <small>
                    Категорирование
                  </small>

                  <strong>
                    комиссия
                  </strong>
                </div>

                <span aria-hidden="true">
                  →
                </span>

                <div>
                  <small>
                    Результат
                  </small>

                  <strong>
                    акт
                  </strong>
                </div>

                <span aria-hidden="true">
                  →
                </span>

                <div>
                  <small>
                    Следующий этап
                  </small>

                  <strong>
                    паспорт
                  </strong>
                </div>
              </div>


              <a
                className="trade-inline-link"
                href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
              >
                Подробнее об акте обследования
                и категорирования

                <span aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* TRADE_STAGE_2_V1:end */}


      {/* TRADE_STAGE_3_V1:start */}

      <section className="trade-passport">
        <Container>
          <div className="trade-passport__heading">
            <div>
              <p className="trade-kicker">
                После категорирования
              </p>

              <h2>
                Как разрабатывается паспорт
                безопасности торгового объекта
              </h2>
            </div>

            <p>
              После подписания акта обследования
              и категорирования начинается подготовка
              паспорта безопасности по действующей
              форме ПП РФ №1273.
            </p>
          </div>


          <div className="trade-passport__facts">
            <article className="trade-passport__deadline">
              <span>
                Срок разработки
              </span>

              <strong>
                30 дней
              </strong>

              <p>
                Паспорт безопасности должен быть
                разработан в течение 30 дней
                после подписания акта обследования
                и категорирования.
              </p>
            </article>


            <article className="trade-passport__lifetime">
              <span>
                Срок действия
              </span>

              <h3>
                Документ постоянного действия
              </h3>

              <p>
                Для торгового объекта паспорт
                определяется как информационно-справочный
                документ постоянного действия,
                отражающий состояние
                антитеррористической защищённости
                объекта и необходимые мероприятия.
              </p>

              <strong>
                Это не означает, что документ
                никогда не меняется
              </strong>

              <p>
                При наступлении установленных
                обстоятельств паспорт подлежит
                актуализации.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section className="trade-approval">
        <Container>
          <div className="trade-approval__heading">
            <div>
              <p className="trade-kicker">
                Порядок после разработки
              </p>

              <h2>
                Сроки согласования паспорта
                торгового объекта
              </h2>
            </div>

            <p>
              После изменений марта 2026 года
              в ПП РФ №1273 закреплены конкретные
              сроки согласования, доработки
              и последующего утверждения паспорта.
            </p>
          </div>


          <div className="trade-approval__timeline">
            <article>
              <span className="trade-approval__number">
                01
              </span>

              <div>
                <small>
                  Согласование
                </small>

                <strong>
                  до 10 рабочих дней
                </strong>

                <p>
                  Срок исчисляется с момента
                  поступления паспорта
                  соответствующим органам.
                </p>
              </div>
            </article>


            <article>
              <span className="trade-approval__number">
                02
              </span>

              <div>
                <small>
                  Если есть замечания
                </small>

                <strong>
                  5 рабочих дней
                </strong>

                <p>
                  Паспорт направляется председателю
                  комиссии на доработку.
                </p>
              </div>
            </article>


            <article>
              <span className="trade-approval__number">
                03
              </span>

              <div>
                <small>
                  После согласования
                </small>

                <strong>
                  до 5 рабочих дней
                </strong>

                <p>
                  После согласования всеми
                  предусмотренными должностными
                  лицами паспорт утверждается
                  не позднее этого срока.
                </p>
              </div>
            </article>
          </div>


          <div className="trade-approval__summary">
            <span>
              2026
            </span>

            <p>
              Конкретные сроки согласования,
              доработки и утверждения закреплены
              в действующей редакции после изменений
              марта 2026 года.
            </p>
          </div>
        </Container>
      </section>


      <section className="trade-copies">
        <Container>
          <div className="trade-copies__layout">
            <div className="trade-copies__heading">
              <p className="trade-kicker">
                Действующая редакция
              </p>

              <h2>
                Сколько экземпляров
                паспорта оформляется
              </h2>

              <p>
                С 13 марта 2026 года паспорт
                безопасности торгового объекта
                составляется в двух экземплярах.
              </p>
            </div>


            <div className="trade-copies__visual">
              <article>
                <span>
                  01
                </span>

                <strong>
                  Уполномоченный орган
                  субъекта РФ
                </strong>

                <p>
                  Один экземпляр передаётся
                  в уполномоченный орган
                  субъекта Российской Федерации.
                </p>
              </article>


              <article>
                <span>
                  02
                </span>

                <strong>
                  Торговый объект
                </strong>

                <p>
                  Второй экземпляр хранится
                  непосредственно
                  на торговом объекте.
                </p>
              </article>
            </div>
          </div>


          <div className="trade-copies__note">
            <span aria-hidden="true">
              +
            </span>

            <p>
              Заверенные бумажные или электронные
              копии направляются предусмотренным
              территориальным органам.
            </p>
          </div>
        </Container>
      </section>


      <section className="trade-owners">
        <Container>
          <div className="trade-owners__layout">
            <div className="trade-owners__intro">
              <p className="trade-kicker">
                Торговые центры и комплексы
              </p>

              <h2>
                Что делать, если у торгового объекта
                несколько собственников
              </h2>
            </div>


            <div className="trade-owners__content">
              <p className="trade-owners__lead">
                Обновлённый ПП РФ №1273 отдельно
                регулирует ситуацию, когда торговый
                объект принадлежит нескольким
                собственникам.
              </p>


              <div className="trade-owners__rules">
                <article>
                  <span>
                    01
                  </span>

                  <h3>
                    Определяется организатор
                    антитеррористической защищённости
                  </h3>

                  <p>
                    Организатор определяется
                    по соглашению между всеми
                    собственниками торгового объекта.
                  </p>
                </article>


                <article>
                  <span>
                    02
                  </span>

                  <h3>
                    Правообладатели получают
                    копии паспорта
                  </h3>

                  <p>
                    После оформления копии паспорта
                    направляются всем правообладателям
                    торгового объекта.
                  </p>
                </article>
              </div>


              <aside className="trade-owners__tenant-note">
                <strong>
                  А что с арендаторами?
                </strong>

                <p>
                  Нельзя автоматически считать,
                  что каждому арендатору торгового
                  центра требуется отдельный паспорт.
                  Сначала определяется нормативный
                  статус конкретного объекта,
                  состав правообладателей
                  и применимый порядок.
                </p>

                <a
                  className="trade-inline-link"
                  href="#lead-form"
                >
                  Проверить ситуацию по объекту

                  <span aria-hidden="true">
                    →
                  </span>
                </a>
              </aside>
            </div>
          </div>
        </Container>
      </section>

      {/* TRADE_STAGE_3_V1:end */}


      {/* TRADE_STAGE_4_V1:start */}

      <section className="trade-restricted">
        <Container>
          <div className="trade-restricted__layout">
            <div className="trade-restricted__identity">
              <span>
                Ограниченное
              </span>

              <strong>
                распространение
              </strong>

              <small>
                Заполненный паспорт действующего
                объекта публично не размещаем
              </small>
            </div>


            <div className="trade-restricted__content">
              <p className="trade-kicker">
                Работа с документом
              </p>

              <h2>
                Можно ли разместить заполненный
                паспорт торгового объекта
                в интернете
              </h2>

              <p className="trade-restricted__lead">
                Информация в паспорте безопасности
                торгового объекта относится
                к информации ограниченного
                распространения и должна защищаться
                в установленном порядке.
              </p>


              <div className="trade-restricted__rules">
                <article>
                  <span className="trade-restricted__sign">
                    +
                  </span>

                  <div>
                    <h3>
                      Что можно показывать
                    </h3>

                    <p>
                      Официальную форму,
                      структуру документа
                      и обезличенный
                      демонстрационный пример.
                    </p>
                  </div>
                </article>


                <article className="trade-restricted__rule--negative">
                  <span className="trade-restricted__sign">
                    −
                  </span>

                  <div>
                    <h3>
                      Что не публикуем
                    </h3>

                    <p>
                      Реальный заполненный паспорт
                      действующего торгового объекта
                      или торгового центра.
                    </p>
                  </div>
                </article>
              </div>


              <p className="trade-restricted__footnote">
                Отдельно нормативными требованиями
                регулируется возможность присвоения
                содержащимся в паспорте сведениям
                грифа секретности.
              </p>
            </div>
          </div>
        </Container>
      </section>


      <section className="trade-service">
        <Container>
          <div className="trade-service__heading">
            <div>
              <p className="trade-kicker">
                Состав работ
              </p>

              <h2>
                Что входит в работу
                по торговому объекту
              </h2>
            </div>

            <p>
              Состав конкретной услуги зависит
              от исходного статуса объекта
              и выбранного этапа. Паспорт,
              категорирование и сопровождение
              согласования могут заказываться
              как отдельные работы.
            </p>
          </div>


          <div className="trade-service__rows">
            <article>
              <span>
                01
              </span>

              <h3>
                Проверка применимости №1273
              </h3>

              <p>
                Понимаем, относится ли конкретный
                объект к требованиям постановления.
              </p>
            </article>


            <article>
              <span>
                02
              </span>

              <h3>
                Анализ включения
                объекта в перечень
              </h3>

              <p>
                Определяем исходный нормативный
                статус торгового объекта.
              </p>
            </article>


            <article>
              <span>
                03
              </span>

              <h3>
                Анализ исходных данных
              </h3>

              <p>
                Формируем комплект сведений,
                необходимых для дальнейшей работы.
              </p>
            </article>


            <article>
              <span>
                04
              </span>

              <h3>
                Подготовка к работе комиссии
              </h3>

              <p>
                Подготавливаем документы
                и материалы для процедуры
                обследования и категорирования.
              </p>
            </article>


            <article>
              <span>
                05
              </span>

              <h3>
                Подготовка проекта акта
              </h3>

              <p>
                Формируем документ по результатам
                этапа категорирования.
              </p>
            </article>


            <article>
              <span>
                06
              </span>

              <h3>
                Разработка паспорта
              </h3>

              <p>
                Готовим паспорт безопасности
                по актуальной форме 2026 года.
              </p>
            </article>


            <article>
              <span>
                07
              </span>

              <h3>
                Подготовка к согласованию
              </h3>

              <p>
                Формируем комплект
                для предусмотренных
                согласующих органов.
              </p>
            </article>


            <article>
              <span>
                08
              </span>

              <h3>
                Доработка по обоснованным
                замечаниям
              </h3>

              <p>
                Вносим необходимые корректировки
                в подготовленный документ.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section
        className="trade-prices"
        id="prices"
      >
        <Container>
          <div className="trade-prices__heading">
            <div>
              <p className="trade-kicker">
                Стоимость
              </p>

              <h2>
                Стоимость разработки
                и сопровождения
              </h2>
            </div>

            <p>
              Итоговый состав работ определяется
              по статусу конкретного объекта.
              Поэтому стоимость паспорта
              не означает стоимость всего комплекса.
            </p>
          </div>


          <div className="trade-prices__list">
            <article>
              <span>
                Паспорт безопасности
              </span>

              <strong>
                9 500 ₽
              </strong>

              <p>
                Разработка паспорта
                при наличии необходимых
                исходных данных.
              </p>
            </article>


            <article>
              <span>
                Акт обследования
                и категорирования
              </span>

              <strong>
                9 500 ₽
              </strong>

              <p>
                Подготовка документа
                по этапу обследования
                и категорирования.
              </p>
            </article>


            <article>
              <span>
                Сопровождение
                согласования
              </span>

              <strong>
                от 9 500 ₽
              </strong>

              <p>
                Работа по предусмотренному
                этапу согласования документа.
              </p>
            </article>


            <article className="trade-price--accent">
              <span>
                Комплекс под ключ
              </span>

              <strong>
                от 35 000 ₽
              </strong>

              <p>
                Комплекс работ определяется
                после проверки статуса
                торгового объекта.
              </p>
            </article>
          </div>


          <div className="trade-prices__logic">
            <article>
              <span>
                Есть актуальный акт
              </span>

              <p>
                Если торговый объект уже
                категорирован и имеется
                актуальный акт, можно заказать
                только разработку паспорта.
              </p>
            </article>

            <article>
              <span>
                Категорирования ещё нет
              </span>

              <p>
                Если объект только включён
                в перечень и категорирование
                ещё не проводилось, работа
                начинается с обследования
                и категорирования.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section
        className="trade-documents"
        id="documents"
      >
        <Container>
          <div className="trade-documents__layout">
            <div className="trade-documents__heading">
              <p className="trade-kicker">
                Исходные данные
              </p>

              <h2>
                Что потребуется
                для разработки
              </h2>

              <p>
                Не запрашиваем одинаковый
                универсальный пакет у каждого
                заказчика. Сначала определяем
                статус объекта, затем уточняем
                состав необходимых сведений.
              </p>
            </div>


            <div className="trade-documents__list">
              <article>
                <span>
                  01
                </span>

                <div>
                  <h3>
                    Правообладатель
                  </h3>

                  <p>
                    Организация, собственник
                    или пользователь объекта.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  02
                </span>

                <div>
                  <h3>
                    Объект
                  </h3>

                  <p>
                    Наименование, адрес
                    и специализация.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  03
                </span>

                <div>
                  <h3>
                    Характеристики
                  </h3>

                  <p>
                    Площадь, границы,
                    этажность.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  04
                </span>

                <div>
                  <h3>
                    Люди
                  </h3>

                  <p>
                    Сведения о работниках
                    и посетителях.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  05
                </span>

                <div>
                  <h3>
                    Планы
                  </h3>

                  <p>
                    Поэтажные планы
                    и схемы территории.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  06
                </span>

                <div>
                  <h3>
                    Безопасность
                  </h3>

                  <p>
                    Охрана, видеонаблюдение,
                    сигнализация и другие
                    применимые сведения.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  07
                </span>

                <div>
                  <h3>
                    Опасные участки
                  </h3>

                  <p>
                    При наличии таких участков
                    на объекте.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  08
                </span>

                <div>
                  <h3>
                    Критические элементы
                  </h3>

                  <p>
                    При наличии критических
                    элементов объекта.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  09
                </span>

                <div>
                  <h3>
                    Существующие документы
                  </h3>

                  <p>
                    Уведомление, акт,
                    старый паспорт —
                    если они уже есть.
                  </p>
                </div>
              </article>
            </div>
          </div>


          <aside className="trade-documents__note">
            <strong>
              Точный перечень
            </strong>

            <p>
              Запрашиваем после определения
              нормативного статуса
              конкретного торгового объекта.
            </p>
          </aside>
        </Container>
      </section>

      {/* TRADE_STAGE_4_V1:end */}


      {/* TRADE_STAGE_5_V1:start */}

      <section className="trade-form">
        <Container>
          <div className="trade-form__layout">
            <div className="trade-form__content">
              <p className="trade-kicker">
                Форма и образец
              </p>

              <h2>
                Форма паспорта безопасности
                торгового объекта
              </h2>

              <p className="trade-form__lead">
                Форма паспорта безопасности
                торгового объекта была изменена
                с 13 марта 2026 года.
                ПП РФ №229 внесло изменения
                непосредственно в форму документа.
              </p>


              <div className="trade-form__statement">
                <span>
                  Используем
                </span>

                <strong>
                  форму паспорта безопасности
                  в редакции ПП РФ №229
                  от 04.03.2026
                </strong>
              </div>


              <div className="trade-form__notes">
                <article>
                  <span>
                    01
                  </span>

                  <p>
                    Изменились отдельные грифы,
                    таблицы и другие элементы
                    формы документа.
                  </p>
                </article>

                <article>
                  <span>
                    02
                  </span>

                  <p>
                    Старый шаблон нельзя
                    механически использовать
                    для подготовки нового паспорта.
                  </p>
                </article>
              </div>


              <a
                className="button button--primary trade-form__button"
                href="#lead-form"
              >
                <span className="trade-form__button-label">
                  Получить актуальную форму паспорта
                </span>

                <span
                  className="trade-form__button-icon"
                  aria-hidden="true"
                >
                  
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 7H17V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  
                </span>
              </a>
            </div>


            <aside
              className="trade-form__document"
              aria-label="Схематичное изображение формы паспорта безопасности"
            >
              <div className="trade-form__document-top">
                <span>
                  ПП РФ №1273
                </span>

                <span>
                  Редакция 2026
                </span>
              </div>

              <div className="trade-form__document-heading">
                <small>
                  Паспорт безопасности
                </small>

                <strong>
                  торгового объекта
                </strong>
              </div>

              <div className="trade-form__document-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="trade-form__document-footer">
                <span>
                  №229
                </span>

                <p>
                  Схематичное отображение.
                  Заполненный паспорт действующего
                  объекта публично не размещаем.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>


      <section className="trade-actualization">
        <Container>
          <div className="trade-actualization__heading">
            <div>
              <p className="trade-kicker">
                Актуализация
              </p>

              <h2>
                Когда нужно актуализировать
                паспорт торгового объекта
              </h2>
            </div>

            <p>
              Паспорт является документом
              постоянного действия, но изменения
              характеристик объекта могут требовать
              его актуализации или внесения
              корректировок в установленном порядке.
            </p>
          </div>


          <div className="trade-actualization__reasons">
            <article>
              <span>
                01
              </span>

              <h3>
                Специализация
                или вид торговли
              </h3>

              <p>
                Когда изменение влияет
                на прогнозируемое
                число пострадавших.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Площадь
                и границы объекта
              </h3>

              <p>
                При изменении общей площади
                или границ торгового объекта.
              </p>
            </article>

            <article>
              <span>
                03
              </span>

              <h3>
                Потенциально опасные
                участки
              </h3>

              <p>
                При изменении количества
                таких участков.
              </p>
            </article>

            <article>
              <span>
                04
              </span>

              <h3>
                Критические
                элементы
              </h3>

              <p>
                При изменении количества
                критических элементов объекта.
              </p>
            </article>
          </div>


          <div className="trade-actualization__corrections">
            <div>
              <span>
                Лист учёта корректировок
              </span>

              <h3>
                Не каждое изменение означает
                полную переработку паспорта
              </h3>
            </div>

            <p>
              При изменении сил и средств
              антитеррористической защищённости
              и в иных предусмотренных случаях
              применяется лист учёта корректировок.
            </p>
          </div>


          <a
            className="trade-inline-link"
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


      <section className="trade-mall">
        <Container>
          <div className="trade-mall__layout">
            <div className="trade-mall__index">
              <span>
                Отдельный случай
              </span>

              <strong>
                ТЦ
              </strong>
            </div>


            <div className="trade-mall__content">
              <p className="trade-kicker">
                Торговые центры
              </p>

              <h2>
                Паспорт безопасности
                торгового центра
              </h2>

              <p className="trade-mall__lead">
                Торговый центр может подпадать
                под требования ПП РФ №1273
                как торговый объект. Однако
                применимость требований определяется
                по нормативному статусу конкретного
                объекта и его включению
                в соответствующий перечень.
              </p>

              <p>
                Для торговых центров особенно
                важно учитывать ситуации
                с несколькими собственниками,
                правообладателями и арендаторами.
                Если объект принадлежит нескольким
                собственникам, организатор
                антитеррористической защищённости
                определяется по соглашению между ними.
              </p>

              <p>
                Поэтому наличие магазина
                или арендатора внутри торгового
                центра само по себе не означает,
                что для него автоматически требуется
                отдельный паспорт. Сначала определяется
                статус конкретного объекта
                и применимый нормативный порядок.
              </p>
            </div>
          </div>
        </Container>
      </section>


      <section
        className="trade-why"
        id="expert"
      >
        <Container>
          <div className="trade-why__heading">
            <div>
              <p className="trade-kicker">
                Подход к работе
              </p>

              <h2>
                Почему БОЙКОВГРУПП
              </h2>
            </div>

            <p>
              Начинаем не с шаблона,
              а с определения нормативного
              статуса конкретного торгового объекта
              и необходимого состава работ.
            </p>
          </div>


          <div className="trade-why__grid">
            <article>
              <span>
                01
              </span>

              <h3>
                Проверяем применимость
                ПП РФ №1273
              </h3>

              <p>
                До подготовки документов
                определяем статус объекта
                и проверяем применимый порядок.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Используем актуальную
                редакцию 2026 года
              </h3>

              <p>
                Учитываем изменения ПП РФ №229,
                включая обновлённую форму
                паспорта безопасности.
              </p>
            </article>

            <article>
              <span>
                03
              </span>

              <h3>
                Разделяем этапы
                и стоимость
              </h3>

              <p>
                Категорирование, акт,
                паспорт и сопровождение
                согласования не объединяем
                в одну услугу автоматически.
              </p>
            </article>

            <article>
              <span>
                04
              </span>

              <h3>
                Учитываем уже имеющиеся
                документы
              </h3>

              <p>
                Если объект категорирован
                и имеется актуальный акт,
                можно отдельно заказать
                разработку паспорта.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section
        className="trade-faq"
        id="faq"
      >
        <Container>
          <div className="trade-faq__layout">
            <div className="trade-faq__heading">
              <div>
                <p className="trade-kicker">
                  Вопросы и ответы
                </p>

                <h2>
                  Частые вопросы
                  о паспорте безопасности
                  торгового объекта
                </h2>
              </div>

              <p>
                Применимость ПП РФ №1273,
                изменения 2026 года,
                категорирование, сроки,
                экземпляры, актуализация
                и особенности торговых центров.
              </p>
            </div>


            <div className="trade-faq__list">
              {tradeFaqItems.map(
                (item, index) => (
                  <details
                    className="trade-faq__item"
                    key={item.question}
                  >
                    <summary>
                      <span className="trade-faq__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="trade-faq__question">
                        {item.question}
                      </span>

                      <span
                        className="trade-faq__toggle"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>

                    <div className="trade-faq__answer">
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

      {/* TRADE_STAGE_5_V1:end */}


      <FinalCTA />
    </main>
  );
}
