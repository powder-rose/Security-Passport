import Container from '../../../../components/ui/Container/Container';

import { regulationTracks } from '../../educationPageData';

export default function EducationRegulation() {
  return (
    <>
      <section className="education-regulation" id="education-requirements">
        <Container>
          <div className="education-regulation__intro">
            <p className="education-kicker">Нормативный режим</p>

            <h2>Какое постановление применяется к образовательной организации</h2>

            <p>
              Для образовательных организаций нет одного универсального нормативного режима на все
              случаи. Требования определяются в том числе ведомственной принадлежностью и сферой
              деятельности объекта.
            </p>
          </div>

          <div className="education-regulation__tracks">
            {regulationTracks.map(item => (
              <article className="education-regulation__track" key={item.number}>
                <div className="education-regulation__track-top">
                  <span>{item.number}</span>

                  <strong>{item.act}</strong>
                </div>

                <h3>{item.audience}</h3>

                <p>{item.date}</p>
              </article>
            ))}
          </div>

          <div className="education-regulation__action">
            <div>
              <strong>Не уверены, какое постановление относится к вашей организации?</strong>

              <p>Определим применимые требования до начала подготовки документов.</p>
            </div>

            <a className="button button--primary" href="#lead-form">
              Определить требования для моего объекта
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
