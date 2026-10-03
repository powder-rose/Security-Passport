import Container from "../../../../components/ui/Container/Container";

import { documentItems } from "../../actualizationPageData";

export default function ActualizationRequiredDocuments() {
  return (
    <>
      <section className="actualization-documents">
        <Container>
          <div className="actualization-documents__grid">
            <div>
              <p className="actualization-kicker">Для первичной проверки</p>

              <h2>Что потребуется для актуализации</h2>

              <p>
                Сначала достаточно действующего паспорта и основных сведений.
                Дополнительный комплект определяем после проверки применимых
                требований.
              </p>

              <a className="button button--primary" href="#lead-form">
                Отправить паспорт на предварительную проверку
              </a>
            </div>

            <ol>
              {documentItems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>

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
