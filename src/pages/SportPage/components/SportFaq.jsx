import Container
from '../../../components/ui/Container/Container';


import {
  sportFaqItems,
} from '../sportPageData';



export default function SportFaq() {
  return (
    <>
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
    </>
  );
}
