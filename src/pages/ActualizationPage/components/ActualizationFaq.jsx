import Container
from '../../../components/ui/Container/Container';


import {
  faqItems,
} from '../actualizationPageData';



export default function ActualizationFaq() {
  return (
    <>
      <section className="actualization-faq">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Вопросы об актуализации
            </p>

            <h2>
              Что важно знать до внесения изменений
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
    </>
  );
}
