import Container from '../../../../components/ui/Container/Container';

import { educationSourceData } from '../../educationPageData';

export default function EducationRequiredDocuments() {
  return (
    <>
      <section className="education-source-data">
        <Container>
          <div className="education-source-data__layout">
            <div className="education-source-data__heading">
              <p className="education-kicker">Исходные данные</p>

              <h2>Что желательно подготовить образовательной организации</h2>

              <p>
                На старте нужны основные сведения, позволяющие определить применимые требования и
                понять текущее состояние документов по объекту.
              </p>

              <aside className="education-source-data__note">
                <span aria-hidden="true">✓</span>

                <p>
                  Точный перечень уточняем после идентификации конкретного объекта и его
                  нормативного режима.
                </p>
              </aside>
            </div>

            <ol className="education-source-data__list">
              {educationSourceData.map(item => (
                <li className="education-source-data__item" key={item.number}>
                  <span>{item.number}</span>

                  <div>
                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
