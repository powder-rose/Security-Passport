import Container
from '../../../components/ui/Container/Container';



export default function EducationPassportCopies() {
  return (
    <>
      <section className="education-copies">
        <Container>
          <div className="education-copies__heading">
            <p className="education-kicker">
              Экземпляры и хранение
            </p>

            <h2>
              Сколько экземпляров паспорта оформляется
            </h2>

            <p>
              Порядок зависит от нормативного режима
              конкретного образовательного объекта.
            </p>
          </div>


          <div className="education-copies__comparison">
            <article className="education-copies__card education-copies__card--primary">
              <div className="education-copies__card-top">
                <span>
                  ПП РФ №1006
                </span>

                <strong>
                  2 экземпляра
                </strong>
              </div>

              <ol>
                <li>
                  <span>
                    01
                  </span>

                  <p>
                    Первый экземпляр хранится
                    непосредственно на объекте.
                  </p>
                </li>

                <li>
                  <span>
                    02
                  </span>

                  <p>
                    Второй направляется организации
                    или органу, являющемуся
                    правообладателем объекта.
                  </p>
                </li>
              </ol>

              <div className="education-copies__extra">
                <strong>
                  Дополнительно
                </strong>

                <p>
                  Копия паспорта направляется
                  в территориальный орган безопасности.
                </p>
              </div>
            </article>


            <article className="education-copies__card">
              <div className="education-copies__card-top">
                <span>
                  ПП РФ №1421
                </span>

                <strong>
                  1 экземпляр
                </strong>
              </div>

              <p className="education-copies__card-text">
                Для объекта, подпадающего под этот
                нормативный режим, порядок оформления
                отличается от правил ПП РФ №1006.
              </p>

              <div className="education-copies__warning">
                <span aria-hidden="true">
                  !
                </span>

                <p>
                  Количество экземпляров и порядок
                  хранения нельзя автоматически
                  переносить с одного вида
                  образовательного объекта на другой.
                </p>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
