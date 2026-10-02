import Container
from '../../../components/ui/Container/Container';

import {
  getRegulationClaim,
} from '../../../data/regulationClaims';


export default function CrowdFaq() {
  return (
    <>
<section
  className="crowd-faq"
  id="faq"
>
  <Container>

    <div className="crowd-faq__layout">

      <div className="crowd-faq__heading">

        <h2>
          Частые вопросы о паспорте безопасности
          места массового пребывания людей
        </h2>

      </div>


      <div className="crowd-faq__list">


        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              01
            </span>

            <span className="crowd-faq__question">
              Для каких объектов требуется паспорт безопасности?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              {getRegulationClaim(
                '272',
                'crowd.faq.00',
              )}
            </p>

          </div>

        </details>


        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              02
            </span>

            <span className="crowd-faq__question">
              Что входит в разработку паспорта безопасности?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              {getRegulationClaim(
                '272',
                'crowd.faq.01',
              )}
            </p>

          </div>

        </details>


        <details className="crowd-faq__item">

          <summary>

            <span className="crowd-faq__number">
              03
            </span>

            <span className="crowd-faq__question">
              Нужно ли актуализировать ранее разработанный паспорт?
            </span>

            <span className="crowd-faq__toggle">
            </span>

          </summary>


          <div className="crowd-faq__answer">

            <p>
              {getRegulationClaim(
                '272',
                'crowd.faq.02',
              )}
            </p>

          </div>

        </details>


      </div>

    </div>

  </Container>
</section>
    </>
  );
}
