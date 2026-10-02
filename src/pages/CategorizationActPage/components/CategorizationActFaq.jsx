import Container
from '../../../components/ui/Container/Container';


import {
  faqItems,
} from '../categorizationActPageData';



export default function CategorizationActFaq() {
  return (
    <>
      <section className="categorization-act-faq">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Вопросы и ответы
            </p>

            <h2>
              Частые вопросы об акте категорирования
            </h2>
          </div>

          <div className="categorization-act-faq__list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                </summary>

                <p>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
