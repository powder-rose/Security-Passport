import Container
from '../../../components/ui/Container/Container';


import {
  tradeFaqItems,
} from '../tradePageData';



export default function TradeFaq() {
  return (
    <>
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
    </>
  );
}
