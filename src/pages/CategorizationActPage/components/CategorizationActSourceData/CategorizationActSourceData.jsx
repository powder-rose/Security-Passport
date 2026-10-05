import Container from "../../../../components/ui/Container/Container";

import { sourceDataItems } from "../../categorizationActPageData";

export default function CategorizationActSourceData() {
  return (
    <>
      <section className="categorization-act-source-data">
        <Container>
          <div className="categorization-act-source-data__grid">
            <div>
              <p className="categorization-act-kicker">До начала работ</p>

              <h2>Какие данные потребуются</h2>

              <p>
                Окончательный перечень исходных данных зависит от требований,
                распространяющихся на конкретный объект.
              </p>
            </div>

            <ul>
              {sourceDataItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
