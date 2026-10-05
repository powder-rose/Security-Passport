import Container from "../../../../components/ui/Container/Container";

import { cultureActualizationReasons } from "../../culturePageData";

export default function CulturePassportActualization() {
  return (
    <>
      <section className="culture-actualization" id="culture-actualization">
        <Container>
          <div className="culture-actualization__header">
            <div>
              <p className="culture-kicker">Актуализация</p>

              <h2>Как часто актуализировать паспорт объекта культуры</h2>
            </div>

            <div className="culture-actualization__periods">
              <div>
                <span>Периодически</span>

                <strong>3 года</strong>

                <p>не реже одного раза</p>
              </div>

              <div>
                <span>При изменениях</span>

                <strong>5 дней</strong>

                <p>рабочих дней на актуализацию</p>
              </div>
            </div>
          </div>

          <div className="culture-actualization__layout">
            <div className="culture-actualization__reasons">
              <p className="culture-actualization__label">
                Актуализация требуется также при изменении
              </p>

              {cultureActualizationReasons.map((item) => (
                <article
                  className="culture-actualization__reason"
                  key={item.number}
                >
                  <span>{item.number}</span>

                  <div>
                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="culture-actualization__aside">
              <div>
                <span className="culture-actualization__aside-kicker">
                  После актуализации
                </span>

                <p>
                  Изменения заверяются подписью руководителя организации в сфере
                  культуры — правообладателя объекта.
                </p>

                <p>
                  После завершения актуализации паспорт снова направляется на
                  предусмотренное согласование.
                </p>
              </div>

              <a
                className="culture-inline-link"
                href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
              >
                Подробнее об актуализации паспорта безопасности
                <span aria-hidden="true">↗</span>
              </a>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
