import Container from "../../../../components/ui/Container/Container";

import { hotelFaqItems } from "../../hotelPageData";

export default function HotelFaq() {
  return (
    <>
      <section className="hotel-faq" id="hotel-faq">
        <Container>
          <div className="hotel-faq__layout">
            <div className="hotel-faq__heading">
              <div className="hotel-section-heading">
                <p className="hotel-kicker">Вопросы и ответы</p>

                <h2>Частые вопросы о паспорте безопасности гостиницы</h2>
              </div>

              <p>
                Коротко отвечаем на вопросы о Постановлении Правительства РФ от
                13.04.2017 №447, категорировании, согласовании, стоимости, форме
                и актуализации паспорта.
              </p>
            </div>

            <div className="hotel-faq__list">
              {hotelFaqItems.map((item, index) => (
                <details className="hotel-faq__item" key={item.question}>
                  <summary>
                    <span className="hotel-faq__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="hotel-faq__question">{item.question}</span>

                    <span className="hotel-faq__toggle" aria-hidden="true">
                      +
                    </span>
                  </summary>

                  <div className="hotel-faq__answer">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
