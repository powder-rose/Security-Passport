import Container from '../../../../components/ui/Container/Container';

import { cultureFaqItems } from '../../culturePageData';

export default function CultureFaq() {
  return (
    <>
      <section className="culture-faq" id="culture-faq">
        <Container>
          <div className="culture-faq__layout">
            <div className="culture-faq__heading">
              <div>
                <p className="culture-kicker">Вопросы и ответы</p>

                <h2>Частые вопросы о паспорте безопасности объекта культуры</h2>
              </div>

              <p>
                Ответы по ПП РФ №176, категорированию, актуализации, форме паспорта, ДСП и
                согласованию.
              </p>
            </div>

            <div className="culture-faq__list">
              {cultureFaqItems.map((item, index) => (
                <details className="culture-faq__item" key={item.question}>
                  <summary>
                    <span className="culture-faq__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="culture-faq__question">{item.question}</span>

                    <span className="culture-faq__toggle" aria-hidden="true">
                      +
                    </span>
                  </summary>

                  <div className="culture-faq__answer">
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
