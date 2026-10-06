import Container from '../../../../components/ui/Container/Container';

import { objectTypes } from '../../../../data/objectTypes';

export default function CategorizationActRequirements() {
  return (
    <>
      <section className="categorization-act-requirements">
        <Container>
          <div className="categorization-act-requirements__grid">
            <div>
              <p className="categorization-act-kicker">Не одна форма для всех</p>

              <h2>Требования к акту зависят от типа объекта</h2>
            </div>

            <div className="categorization-act-requirements__copy">
              <p>
                Единой формы акта обследования и категорирования для всех объектов не существует.
                Порядок категорирования, критерии категорий, состав комиссии, форма и содержание
                документов определяются обязательными требованиями для соответствующего вида
                объекта.
              </p>

              <p>
                Поэтому перед подготовкой документов сначала необходимо определить, какой
                нормативный режим применяется именно к вашему объекту.
              </p>
            </div>
          </div>

          <div className="categorization-act-requirements__list">
            {objectTypes
              .filter(item => item.id !== 'social')
              .map((item, index) => (
                <article key={item.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>

                  <strong>{item.title}</strong>

                  <p>{item.regulationFocus}</p>
                </article>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
}
