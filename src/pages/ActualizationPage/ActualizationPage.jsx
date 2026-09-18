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


const periodicityItems = [
  {
    type:
      'Образовательные объекты',
    regulation:
      'Постановление Правительства РФ № 1006',
    period:
      'Не реже 1 раза в 5 лет',
    text:
      'Также актуализация проводится при изменении общей площади и периметра, количества критических элементов и мер инженерно-технической защиты.',
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
      'Основаниями также могут быть изменение назначения, площади, периметра, капитальный ремонт, реконструкция и другие предусмотренные требованиями изменения.',
  },

  {
    type:
      'Места массового пребывания людей',
    regulation:
      'Постановление Правительства РФ № 272',
    period:
      'Не реже 1 раза в 3 года',
    text:
      'Актуализация требуется и при ряде изменений самого места, его границ, назначения и условий, влияющих на антитеррористическую защищённость.',
  },

  {
    type:
      'Торговые объекты',
    regulation:
      'Постановление Правительства РФ № 1273',
    period:
      'По установленным основаниям',
    text:
      'Для торговых объектов действует отдельный порядок. С 13 марта 2026 года в ряде случаев актуализация оформляется листом учёта корректировок без полной переработки паспорта.',
  },
];


const faqItems = [
  {
    question:
      'Актуализация всегда означает разработку нового паспорта?',
    answer:
      'Нет. Сначала нужно определить применимый нормативный акт и характер изменений. В зависимости от требований может потребоваться внесение изменений, актуализация в установленном порядке, лист учёта корректировок либо замена паспорта.',
  },

  {
    question:
      'Как понять, прошёл ли срок актуализации?',
    answer:
      'Периодичность зависит от типа объекта и постановления Правительства РФ, по которому разработан паспорт. Универсального срока для всех паспортов безопасности нет.',
  },

  {
    question:
      'Нужно ли актуализировать паспорт после ремонта?',
    answer:
      'Не любой ремонт автоматически является основанием. Значение имеют характер работ и изменения характеристик объекта. Например, отдельные требования прямо учитывают изменение площади, периметра, критических элементов, инженерных систем или мер защиты.',
  },

  {
    question:
      'Можно ли просто заменить устаревшие страницы паспорта?',
    answer:
      'Сначала нужно проверить порядок, установленный для конкретного типа объекта. Изменения должны оформляться именно тем способом, который предусмотрен применимыми требованиями.',
  },

  {
    question:
      'Что нужно для первоначальной проверки?',
    answer:
      'Обычно достаточно действующего паспорта, акта обследования и категорирования и информации о том, что изменилось на объекте после их оформления. Остальные сведения можно определить после первичного анализа.',
  },
];


export default function ActualizationPage() {
  const city =
    useCity();

  const locationText =
    getLocationText(city);


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
                Проверим действующий паспорт,
                основания для внесения изменений
                или замены документа и подготовим
                актуальную редакцию. Работаем{' '}
                {locationText}.
              </p>

              <div className="actualization-hero__actions">
                <a
                  className="button button--primary"
                  href="#lead-form"
                >
                  Проверить паспорт
                </a>

                <a
                  className="actualization-hero__secondary"
                  href="#when-update"
                >
                  Когда нужна актуализация
                  <span aria-hidden="true">
                    ↓
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


      <section
        className="actualization-reasons"
        id="when-update"
      >
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Основания для проверки
            </p>

            <h2>
              Когда стоит проверить действующий паспорт
            </h2>

            <p>
              Конкретный перечень оснований зависит
              от вида объекта и применимого
              постановления. Ниже — ситуации, после
              которых особенно важно проверить
              актуальность документа.
            </p>
          </div>


          <div className="actualization-reasons__grid">
            <article>
              <span>
                01
              </span>

              <h3>
                Подошёл срок периодической актуализации
              </h3>

              <p>
                Для ряда объектов требования прямо
                устанавливают периодическую
                актуализацию паспорта — например,
                один раз в 3 или 5 лет.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Изменились характеристики объекта
              </h3>

              <p>
                Проверка необходима при значимых
                изменениях площади, периметра,
                назначения, границ или других
                характеристик, если они входят
                в основания применимого постановления.
              </p>
            </article>

            <article>
              <span>
                03
              </span>

              <h3>
                Изменились меры защиты
              </h3>

              <p>
                Изменения инженерно-технической
                защиты, критических элементов,
                сил и средств охраны могут влиять
                на сведения действующего паспорта.
              </p>
            </article>

            <article>
              <span>
                04
              </span>

              <h3>
                Изменились требования или сам объект
              </h3>

              <p>
                После реконструкции, капитального
                ремонта или иных существенных
                изменений нужно проверить,
                соответствует ли паспорт фактическому
                состоянию объекта.
              </p>
            </article>
          </div>
        </Container>
      </section>


      <section className="actualization-periods">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Не один срок для всех
            </p>

            <h2>
              Периодичность зависит от типа объекта
            </h2>

            <p>
              У разных категорий объектов действуют
              разные требования. Поэтому сначала
              устанавливаем нормативный акт,
              по которому оформлен паспорт.
            </p>
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
            которые проверяются отдельно.
          </p>
        </Container>
      </section>


      <section className="actualization-work">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Порядок работы
            </p>

            <h2>
              Сначала проверка — потом изменения
            </h2>
          </div>


          <div className="actualization-work__grid">
            <article>
              <span>
                01
              </span>

              <h3>
                Изучаем действующий паспорт
              </h3>

              <p>
                Проверяем дату оформления,
                нормативное основание, акт
                категорирования и текущую редакцию
                документа.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Сопоставляем с объектом
              </h3>

              <p>
                Выясняем, что изменилось после
                оформления паспорта и влияет ли
                это на сведения в документе.
              </p>
            </article>

            <article>
              <span>
                03
              </span>

              <h3>
                Определяем нужный порядок
              </h3>

              <p>
                Разделяем актуализацию,
                корректировку и случаи, когда
                требуется замена паспорта.
              </p>
            </article>

            <article>
              <span>
                04
              </span>

              <h3>
                Готовим актуальную редакцию
              </h3>

              <p>
                Вносим изменения в предусмотренном
                порядке и сопровождаем дальнейшее
                оформление документа.
              </p>
            </article>
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
                Что прислать нам в начале
              </h2>

              <p>
                Не нужно заранее собирать большой
                комплект. Сначала достаточно
                основных документов и информации
                об изменениях.
              </p>
            </div>

            <ol>
              <li>
                <span>01</span>
                <p>
                  действующий паспорт безопасности
                </p>
              </li>

              <li>
                <span>02</span>
                <p>
                  акт обследования и категорирования,
                  если он сохранился
                </p>
              </li>

              <li>
                <span>03</span>
                <p>
                  сведения о том, что изменилось
                  на объекте после оформления паспорта
                </p>
              </li>

              <li>
                <span>04</span>
                <p>
                  сведения о реконструкции,
                  изменении площади, назначения
                  или мер защиты — если такие
                  изменения были
                </p>
              </li>
            </ol>
          </div>
        </Container>
      </section>


      <section className="actualization-faq">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Вопросы об актуализации
            </p>

            <h2>
              Что важно уточнить до внесения изменений
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


      <Expert />
      <FinalCTA />
    </main>
  );
}
