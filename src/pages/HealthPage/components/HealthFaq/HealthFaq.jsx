import Container from "../../../../components/ui/Container/Container";

import { healthFaqItems } from "../../healthPageData";

export default function HealthFaq() {
  return (
    <>
      <section className="health-faq" id="faq">
        <Container>
          <div className="health-faq__layout">
            <div className="health-faq__heading">
              <div>
                <p className="health-kicker">Вопросы и ответы</p>

                <h2>
                  Частые вопросы о паспорте безопасности объекта здравоохранения
                </h2>
              </div>

              <p>
                Применимость Постановление Правительства РФ №8, категорирование,
                комиссия, акт, согласование, экземпляры, форма, актуализация и
                стоимость разработки.
              </p>
            </div>

            <div className="health-faq__list">
              {healthFaqItems.map((item, index) => (
                <details className="health-faq__item" key={item.question}>
                  <summary>
                    <span className="health-faq__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="health-faq__question">
                      {item.question}
                    </span>

                    <span className="health-faq__toggle" aria-hidden="true" />
                  </summary>

                  <div className="health-faq__answer">
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
