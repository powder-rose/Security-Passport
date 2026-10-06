import Container from '../../../../components/ui/Container/Container';

import { serviceItems } from '../../categorizationActPageData';

export default function CategorizationActServiceScope() {
  return (
    <>
      <section className="categorization-act-service">
        <Container>
          <div className="categorization-act-service__grid">
            <div>
              <p className="categorization-act-kicker">Состав услуги</p>

              <h2>Что мы подготовим</h2>

              <p>
                Состав документов уточняется после определения требований, применимых к конкретному
                объекту.
              </p>
            </div>

            <ol>
              {serviceItems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>

                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
