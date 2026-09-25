import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';


export default function CrowdPage() {
  return (
    <main
      id="main-content"
      className="crowd-page"
      data-crowd-stage="2"
    >
      {/* CROWD_STAGE_1_V1:start */}

      <section
        className="crowd-hero"
        id="top"
      >
        <Container>
          <nav
            className="crowd-breadcrumbs"
            aria-label="Хлебные крошки"
          >
            <a href="/">
              Паспорт безопасности
            </a>

            <span aria-hidden="true">
              /
            </span>

            <span>
              Места массового пребывания людей
            </span>
          </nav>


          <div className="crowd-hero__layout">
            <div className="crowd-hero__content">
              <p className="crowd-kicker">
                Места массового пребывания людей
              </p>

              <h1>
                Паспорт безопасности места
                массового пребывания людей —
                разработка и согласование
              </h1>

              <p className="crowd-hero__lead">
                Подготовим паспорт безопасности
                места массового пребывания людей
                по требованиям ПП РФ №272.
                Сопроводим обследование
                и категорирование, подготовим акт,
                паспорт и комплект для согласования.
              </p>


              <div className="crowd-hero__commercial">
                <div className="crowd-hero__price">
                  <span>
                    Стоимость разработки
                  </span>

                  <strong>
                    от 9 500 ₽
                  </strong>
                </div>


                <div className="crowd-hero__facts">
                  <div>
                    <strong>
                      3
                    </strong>

                    <span>
                      категории ММПЛ
                    </span>
                  </div>

                  <div>
                    <strong>
                      6
                    </strong>

                    <span>
                      экземпляров паспорта
                    </span>
                  </div>
                </div>
              </div>


              <div className="crowd-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Заказать паспорт
                </a>

                <a
                  className="crowd-text-action"
                  href="#applicability"
                >
                  Проверить, относится ли
                  территория к ММПЛ
                </a>
              </div>
            </div>


            <aside className="crowd-hero__regulation">
              <div className="crowd-hero__regulation-top">
                <span>
                  Нормативная база
                </span>

                <span>
                  ММПЛ
                </span>
              </div>

              <div className="crowd-hero__number">
                №272
              </div>

              <h2>
                Постановление
                Правительства РФ
              </h2>

              <div className="crowd-hero__definition">
                <span>
                  Базовый ориентир
                </span>

                <p>
                  Территория или место общего
                  пользования, где при определённых
                  условиях одновременно может
                  находиться более 50 человек.
                </p>
              </div>

              <p className="crowd-hero__note">
                Количество людей само по себе
                не означает автоматического
                применения ПП РФ №272.
              </p>
            </aside>
          </div>
        </Container>
      </section>


      <section
        className="crowd-applicability"
        id="applicability"
      >
        <Container>
          <div className="crowd-applicability__heading">
            <div>
              <p className="crowd-kicker">
                Сначала — применимость требований
              </p>

              <h2>
                Что считается местом
                массового пребывания людей
              </h2>
            </div>

            <p>
              Для применения ПП РФ №272 недостаточно
              только факта высокой посещаемости.
              Сначала проверяется статус конкретного
              места и применимый к нему нормативный
              режим.
            </p>
          </div>


          <div className="crowd-applicability__layout">
            <div className="crowd-applicability__rules">
              <article className="crowd-applicability__rule">
                <span className="crowd-applicability__index">
                  01
                </span>

                <div>
                  <h3>
                    Более 50 человек —
                    часть определения
                  </h3>

                  <p>
                    Законодательное определение
                    связывает ММПЛ с территорией
                    или местом общего пользования,
                    где при определённых условиях
                    одновременно может находиться
                    более 50 человек.
                  </p>
                </div>
              </article>


              <article className="crowd-applicability__rule">
                <span className="crowd-applicability__index">
                  02
                </span>

                <div>
                  <h3>
                    Место должно рассматриваться
                    в установленном перечне
                  </h3>

                  <p>
                    Перечень мест массового
                    пребывания людей формируется
                    исполнительными органами
                    субъекта РФ или органами
                    местного самоуправления
                    по предусмотренной процедуре
                    согласования.
                  </p>
                </div>
              </article>
            </div>


            <aside className="crowd-applicability__check">
              <span className="crowd-applicability__check-label">
                Важно
              </span>

              <h3>
                50 человек — не автоматическое
                основание для паспорта по №272
              </h3>

              <p>
                Сначала проверяем, включено ли
                конкретное место в перечень ММПЛ
                и какой нормативный режим
                распространяется на объект.
              </p>

              <a
                className="button button--primary"
                href="#lead-form"
              >
                Проверить объект
              </a>
            </aside>
          </div>
        </Container>
      </section>


      <section className="crowd-regime">
        <Container>
          <div className="crowd-regime__layout">
            <div className="crowd-regime__identity">
              <p className="crowd-kicker">
                Ключевое различие
              </p>

              <span className="crowd-regime__mark">
                ≠
              </span>
            </div>


            <div className="crowd-regime__content">
              <h2>
                «Место, где много людей»
                и ММПЛ по ПП РФ №272 —
                не всегда одно и то же
              </h2>

              <p className="crowd-regime__lead">
                По фактическому назначению место
                может напоминать торговый центр,
                гостиницу, площадь, парк,
                общественное пространство
                или культурную площадку.
              </p>

              <div className="crowd-regime__principle">
                <span>
                  Принцип проверки
                </span>

                <p>
                  Если для конкретного объекта
                  действуют специальные отраслевые
                  требования, ПП РФ №272 нельзя
                  механически применять вместо них.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CROWD_STAGE_1_V1:end */}


      {/* CROWD_STAGE_2_V1:start */}

      <section
        className="crowd-regulation"
        id="regulation"
      >
        <Container>
          <div className="crowd-regulation__layout">
            <aside className="crowd-regulation__identity">
              <p className="crowd-kicker">
                Нормативная база
              </p>

              <div className="crowd-regulation__number">
                272
              </div>

              <p className="crowd-regulation__date">
                Постановление Правительства РФ
                от 25.03.2015
              </p>
            </aside>


            <div className="crowd-regulation__content">
              <h2>
                Когда применяется
                ПП РФ №272
              </h2>

              <p className="crowd-regulation__lead">
                Постановление устанавливает
                требования к антитеррористической
                защищённости мест массового
                пребывания людей и официальную
                форму паспорта безопасности.
              </p>

              <div className="crowd-regulation__points">
                <article>
                  <span>
                    01
                  </span>

                  <div>
                    <h3>
                      Сначала определяется
                      применимый режим
                    </h3>

                    <p>
                      Паспорт ММПЛ не является
                      универсальным документом
                      для любого объекта
                      с высокой посещаемостью.
                    </p>
                  </div>
                </article>


                <article>
                  <span>
                    02
                  </span>

                  <div>
                    <h3>
                      Затем проверяется
                      перечень ММПЛ
                    </h3>

                    <p>
                      Для применения порядка
                      по №272 важно, относится ли
                      конкретное место
                      к сформированному перечню.
                    </p>
                  </div>
                </article>


                <article>
                  <span>
                    03
                  </span>

                  <div>
                    <h3>
                      После этого проводится
                      обследование
                    </h3>

                    <p>
                      Категория определяется
                      по результатам установленной
                      процедуры обследования
                      и категорирования.
                    </p>
                  </div>
                </article>
              </div>


              <aside className="crowd-regulation__edition">
                <span>
                  Редакция
                </span>

                <p>
                  В ТЗ используется справочная
                  редакция ПП РФ №272
                  от 24.10.2023.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


      <section className="crowd-listing">
        <Container>
          <div className="crowd-listing__heading">
            <div>
              <p className="crowd-kicker">
                Перечень ММПЛ
              </p>

              <h2>
                Как место включается
                в перечень
              </h2>
            </div>

            <p>
              Перечень формируется
              исполнительными органами субъекта РФ
              или органами местного самоуправления
              по установленной процедуре.
            </p>
          </div>


          <div className="crowd-listing__flow">
            <div className="crowd-listing__step">
              <span>
                01
              </span>

              <div>
                <h3>
                  Формирование перечня
                </h3>

                <p>
                  Решение принимается
                  уполномоченным исполнительным
                  органом субъекта РФ либо органом
                  местного самоуправления.
                </p>
              </div>
            </div>


            <div className="crowd-listing__step">
              <span>
                02
              </span>

              <div>
                <h3>
                  Согласование
                </h3>

                <p>
                  Перечень согласовывается
                  с предусмотренными
                  территориальными органами.
                </p>
              </div>
            </div>


            <div className="crowd-listing__step">
              <span>
                03
              </span>

              <div>
                <h3>
                  Работа с конкретным местом
                </h3>

                <p>
                  После определения применимости
                  требований проводится
                  обследование и категорирование
                  конкретного ММПЛ.
                </p>
              </div>
            </div>
          </div>


          <div className="crowd-listing__authorities">
            <span>
              Территориальный орган безопасности
            </span>

            <span>
              МВД России
            </span>

            <span>
              Росгвардия
            </span>

            <span>
              МЧС России
            </span>
          </div>
        </Container>
      </section>


      <section
        className="crowd-categories"
        id="categories"
      >
        <Container>
          <div className="crowd-categories__heading">
            <div>
              <p className="crowd-kicker">
                Категорирование
              </p>

              <h2>
                3 категории ММПЛ
              </h2>
            </div>

            <p>
              Базовый критерий —
              максимальное одновременное
              количество людей.
            </p>
          </div>


          <div className="crowd-categories__table">
            <article className="crowd-category">
              <span className="crowd-category__number">
                01
              </span>

              <h3>
                1 категория
              </h3>

              <div className="crowd-category__metric">
                <strong>
                  &gt; 1 000
                </strong>

                <span>
                  человек
                </span>
              </div>
            </article>


            <article className="crowd-category">
              <span className="crowd-category__number">
                02
              </span>

              <h3>
                2 категория
              </h3>

              <div className="crowd-category__metric">
                <strong>
                  200–1 000
                </strong>

                <span>
                  человек
                </span>
              </div>
            </article>


            <article className="crowd-category">
              <span className="crowd-category__number">
                03
              </span>

              <h3>
                3 категория
              </h3>

              <div className="crowd-category__metric">
                <strong>
                  50–200
                </strong>

                <span>
                  человек
                </span>
              </div>
            </article>
          </div>


          <aside className="crowd-categories__note">
            <span>
              Решение комиссии
            </span>

            <p>
              При предусмотренных обстоятельствах
              комиссия вправе присвоить категорию
              выше или ниже исходной с учётом
              оперативной обстановки и угроз.
            </p>
          </aside>
        </Container>
      </section>


      <section
        className="crowd-count"
        id="counting"
      >
        <Container>
          <div className="crowd-count__layout">
            <div className="crowd-count__heading">
              <p className="crowd-kicker">
                Расчёт категории
              </p>

              <h2>
                Как определяется
                количество людей
              </h2>

              <p>
                Учитывается одновременное
                пребывание или передвижение людей,
                а не только паспортная вместимость
                объекта.
              </p>
            </div>


            <div className="crowd-count__metrics">
              <article>
                <strong>
                  3
                </strong>

                <div>
                  <span>
                    дня мониторинга
                  </span>

                  <p>
                    Наблюдение проводится
                    в течение трёх дней,
                    включая рабочие
                    и выходные или праздничные дни.
                  </p>
                </div>
              </article>


              <article>
                <strong>
                  0,5
                </strong>

                <div>
                  <span>
                    м² на человека
                  </span>

                  <p>
                    Этот показатель применяется
                    для расчёта прогнозируемого
                    количества людей,
                    если отсутствуют иные
                    нормативы площади.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </Container>
      </section>

      {/* CROWD_STAGE_2_V1:end */}


      {/* CROWD_STAGE_3_V1:start */}

      <section
        className="crowd-process"
        id="process"
      >

        <Container>

          <div className="crowd-process__heading">

            <div>

              <p className="crowd-kicker">
                Порядок разработки
              </p>

              <h2>
                От обследования
                до паспорта безопасности
              </h2>

            </div>


            <p>
              После обследования объекта
              проводится категорирование,
              оформляется акт и разрабатывается
              паспорт безопасности.
            </p>

          </div>


          <div className="crowd-process__list">


            <article>

              <span>
                01
              </span>

              <div>

                <h3>
                  Формирование комиссии
                </h3>

                <p>
                  Комиссия проводит обследование
                  места массового пребывания людей
                  и рассматривает необходимые
                  материалы по объекту.
                </p>

              </div>

            </article>


            <article>

              <span>
                02
              </span>

              <div>

                <h3>
                  Обследование и категорирование
                </h3>

                <p>
                  По результатам обследования
                  определяется категория объекта
                  и оформляются необходимые документы.
                </p>

                <strong>
                  Срок — до 30 дней
                </strong>

              </div>

            </article>


            <article>

              <span>
                03
              </span>

              <div>

                <h3>
                  Оформление акта обследования
                </h3>

                <p>
                  Результаты работы комиссии
                  оформляются в виде акта
                  обследования и категорирования.
                </p>

                <strong>
                  Срок — до 10 дней
                </strong>

              </div>

            </article>


            <article>

              <span>
                04
              </span>

              <div>

                <h3>
                  Разработка паспорта безопасности
                </h3>

                <p>
                  После завершения процедуры
                  подготавливается паспорт безопасности
                  объекта в установленной форме.
                </p>

                <strong>
                  До 6 экземпляров
                </strong>

              </div>

            </article>


          </div>


        </Container>

      </section>


      {/* CROWD_STAGE_3_V1:end */}



<section
  className="crowd-faq"
  id="faq"
>
  <Container>

    <div className="crowd-faq__layout">

      <div className="crowd-faq__heading">

        <h2>
          Частые вопросы о паспорте безопасности
          места массового пребывания людей
        </h2>

      </div>


      <div className="crowd-faq__list">


        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              01
            </span>

            <span className="crowd-faq__question">
              Для каких объектов требуется паспорт безопасности?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              Необходимость разработки паспорта определяется
              требованиями законодательства и характеристиками
              конкретного объекта.
            </p>

          </div>

        </details>



        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              02
            </span>

            <span className="crowd-faq__question">
              Что входит в разработку паспорта безопасности?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              В состав работ входят обследование объекта,
              подготовка материалов и оформление паспорта
              безопасности.
            </p>

          </div>

        </details>



        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              03
            </span>

            <span className="crowd-faq__question">
              Нужно ли актуализировать ранее разработанный паспорт?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              Необходимость актуализации зависит от изменений
              объекта и требований, применяемых к нему.
            </p>

          </div>

        </details>


      </div>

    </div>

  </Container>
</section>


      <FinalCTA />
    </main>
  );
}
