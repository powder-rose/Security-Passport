import './TradePage.css';

import {
  tradeFaqItems,
} from './tradePageData';

import TradeHeroAndObjects
from './components/TradeHeroAndObjects';

import TradeRegulation
from './components/TradeRegulation';


import TradeRegulationChanges
from './components/TradeRegulationChanges';

import TradeCategorizationAndAct
from './components/TradeCategorizationAndAct';


import TradePassportDevelopment
from './components/TradePassportDevelopment';

import TradeApprovalAndCopies
from './components/TradeApprovalAndCopies';

import TradeOwnership
from './components/TradeOwnership';


import TradeRestrictedDocuments
from './components/TradeRestrictedDocuments';

import TradeServiceScope
from './components/TradeServiceScope';

import TradePricing
from './components/TradePricing';

import TradeRequiredDocuments
from './components/TradeRequiredDocuments';
import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';

import {
  useCity,
} from '../../context/GeoContext';


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

      <TradeHeroAndObjects
        city={city}
      />

      <TradeRegulation />

      {/* TRADE_STAGE_1_V1:end */}


      {/* TRADE_STAGE_2_V1:start */}

      <TradeRegulationChanges />

      <TradeCategorizationAndAct />

      {/* TRADE_STAGE_2_V1:end */}


      {/* TRADE_STAGE_3_V1:start */}

      <TradePassportDevelopment />

      <TradeApprovalAndCopies />

      <TradeOwnership />

      {/* TRADE_STAGE_3_V1:end */}


      {/* TRADE_STAGE_4_V1:start */}

      <TradeRestrictedDocuments />

      <TradeServiceScope />

      <TradePricing />

      <TradeRequiredDocuments />

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
                <span>
                  Получить актуальную форму паспорта
                </span>

                <span
                  className="trade-form__button-arrow"
                  aria-hidden="true"
                >
                  ↗
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
