import Container
from '../../../components/ui/Container/Container';



export default function CategorizationActDifference() {
  return (
    <>
      <section className="categorization-act-difference">
        <Container>
          <div className="categorization-act-section-head">
            <p className="categorization-act-kicker">
              Не одно и то же
            </p>

            <h2>
              Акт категорирования и паспорт безопасности — в чём разница
            </h2>
          </div>

          <div className="categorization-act-difference__grid">
            <article>
              <span>
                01
              </span>

              <h3>
                Акт категорирования
              </h3>

              <p>
                Фиксирует результаты обследования
                и работы комиссии, включая решение
                по категорированию и другие сведения,
                предусмотренные применимыми требованиями.
              </p>
            </article>

            <article>
              <span>
                02
              </span>

              <h3>
                Паспорт безопасности
              </h3>

              <p>
                Содержит сведения об объекте,
                состоянии его антитеррористической
                защищённости и предусмотренных
                мерах обеспечения безопасности.
              </p>
            </article>
          </div>

          <p className="categorization-act-difference__sequence">
            <strong>
              Типовая последовательность:
            </strong>{' '}
            обследование → категорирование → акт →
            паспорт безопасности. Конкретная процедура
            определяется требованиями для соответствующего
            объекта.
          </p>
        </Container>
      </section>
    </>
  );
}
