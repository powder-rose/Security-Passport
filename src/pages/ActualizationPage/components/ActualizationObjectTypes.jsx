import Container
from '../../../components/ui/Container/Container';


import {
  objectTypes,
} from '../actualizationPageData';



export default function ActualizationObjectTypes() {
  return (
    <>
      <section className="actualization-objects">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">
              Типы объектов
            </p>

            <h2>
              Актуализируем паспорта безопасности для
            </h2>
          </div>


          <div className="actualization-objects__list">
            {objectTypes.map(
              (item, index) => (
                <article key={item}>
                  <span>
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </span>

                  <h3>
                    {item ===
                    'Образовательные организации' ? (
                      <a href="/pasport-bezopasnosti-obrazovatelnoj-organizacii/">
                        {item}
                      </a>
                    ) : item ===
                      'Объекты спорта' ? (
                      <a href="/pasport-bezopasnosti-obekta-sporta/">
                        {item}
                      </a>
                    ) : (
                      item
                    )}
                  </h3>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
