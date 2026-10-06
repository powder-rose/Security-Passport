import Container from '../../../../components/ui/Container/Container';

import { educationFaqItems } from '../../educationPageData';

export default function EducationFaq() {
  return (
    <>
      <section className="education-faq" id="education-faq">
        <Container>
          <div className="education-faq__layout">
            <div className="education-faq__heading">
              <div>
                <p className="education-kicker">Вопросы и ответы</p>

                <h2>Частые вопросы о паспорте безопасности образовательной организации</h2>
              </div>

              <p>
                Ответы о применимом постановлении, категорировании, согласовании, экземплярах,
                стоимости, форме и актуализации.
              </p>
            </div>

            <div className="education-faq__list">
              {educationFaqItems.map((item, index) => (
                <details className="education-faq__item" key={item.question}>
                  <summary>
                    <span className="education-faq__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="education-faq__question">{item.question}</span>

                    <span className="education-faq__toggle" aria-hidden="true">
                      +
                    </span>
                  </summary>

                  <div className="education-faq__answer">
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
