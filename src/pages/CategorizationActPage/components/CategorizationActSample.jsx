import Container
from '../../../components/ui/Container/Container';


import {
  sampleStructure,
} from '../categorizationActPageData';



export default function CategorizationActSample() {
  return (
    <>
      <section className="categorization-act-sample">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Форма и образец
            </p>

            <h2>
              Образец акта обследования и категорирования объекта
            </h2>

            <p>
              Универсального образца, который подходит
              всем объектам, нет. Ниже показана
              демонстрационная структура документа —
              конкретные разделы зависят от применимых
              требований.
            </p>
          </div>

          <div className="categorization-act-sample__grid">
            {sampleStructure.map((item, index) => (
              <article key={item}>
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p>
                  {item}
                </p>
              </article>
            ))}
          </div>

          <a
            className="button button--secondary"
            href="#lead-form"
          >
            Получить форму для вашего типа объекта
          </a>
        </Container>
      </section>
    </>
  );
}
