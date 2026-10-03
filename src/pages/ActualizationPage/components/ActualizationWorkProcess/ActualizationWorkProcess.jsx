import Container from "../../../../components/ui/Container/Container";

import { processItems } from "../../actualizationPageData";

export default function ActualizationWorkProcess() {
  return (
    <>
      <section className="actualization-work">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">Порядок работы</p>

            <h2>Как мы актуализируем паспорт безопасности</h2>
          </div>

          <ol className="actualization-work__timeline">
            {processItems.map((item, index) => (
              <li key={item.title}>
                <span className="actualization-work__number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
