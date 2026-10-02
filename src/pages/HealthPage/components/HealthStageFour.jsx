import Container
from '../../../components/ui/Container/Container';


export default function HealthStageFour() {
  return (
    <>
      <section
        className="health-process"
        id="process"
      >
        <Container>
          <div className="health-process__layout">
            <div className="health-process__heading">
              <p className="health-kicker">
                От проверки до утверждения
              </p>

              <h2>
                Порядок разработки
                паспорта безопасности
                объекта здравоохранения
              </h2>

              <p>
                Работа строится последовательно:
                сначала проверяется применимость
                требований и проводится
                категорирование, затем на основании
                акта разрабатывается паспорт
                и проходит предусмотренное
                согласование.
              </p>
            </div>


            <ol className="health-process__steps">
              <li>
                <span className="health-process__number">
                  01
                </span>

                <div>
                  <strong>
                    Определяем применимость Постановление Правительства РФ №8
                  </strong>

                  <p>
                    Проверяем объект, правообладателя,
                    назначение и фактический статус.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  02
                </span>

                <div>
                  <strong>
                    Собираем исходные данные
                  </strong>

                  <p>
                    Формируем сведения, необходимые
                    для обследования, категорирования
                    и последующей подготовки документов.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  03
                </span>

                <div>
                  <strong>
                    Формируется комиссия
                  </strong>

                  <p>
                    Правообладатель назначает
                    комиссию по обследованию
                    и категорированию объекта.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  04
                </span>

                <div>
                  <strong>
                    Проводится обследование
                  </strong>

                  <p>
                    Комиссия обследует объект
                    и рассматривает сведения,
                    необходимые для категорирования.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  05
                </span>

                <div>
                  <strong>
                    Определяется категория
                  </strong>

                  <p>
                    Категория устанавливается
                    комиссией по результатам
                    обследования объекта.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  06
                </span>

                <div>
                  <strong>
                    Оформляется акт
                  </strong>

                  <p>
                    Результаты обследования
                    и категорирования фиксируются
                    в акте комиссии.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  07
                </span>

                <div>
                  <strong>
                    Разрабатывается паспорт безопасности
                  </strong>

                  <p>
                    Паспорт оформляется
                    для соответствующего объекта
                    в соответствии с актом
                    обследования и категорирования.
                  </p>
                </div>
              </li>

              <li>
                <span className="health-process__number">
                  08
                </span>

                <div>
                  <strong>
                    Согласование и утверждение
                  </strong>

                  <p>
                    Паспорт проходит предусмотренное
                    Постановление Правительства РФ №8 согласование,
                    после чего утверждается
                    правообладателем.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </Container>
      </section>


      <section className="health-approval">
        <Container>
          <div className="health-approval__heading">
            <div>
              <p className="health-kicker">
                Согласование паспорта
              </p>

              <h2>
                С кем согласовывается
                паспорт объекта здравоохранения
              </h2>
            </div>

            <p>
              По действующей редакции Постановление Правительства РФ №8
              паспорт согласовывается с двумя
              предусмотренными постановлением
              органами, а затем утверждается
              правообладателем объекта.
            </p>
          </div>


          <div className="health-approval__layout">
            <aside className="health-approval__term">
              <span>
                Срок согласования
              </span>

              <strong>
                30
              </strong>

              <p>
                дней
              </p>

              <small>
                со дня разработки паспорта
              </small>
            </aside>


            <div className="health-approval__content">
              <div className="health-approval__authorities">
                <article>
                  <span>
                    01
                  </span>

                  <div>
                    <small>
                      Согласование
                    </small>

                    <strong>
                      Территориальный
                      орган безопасности
                    </strong>

                    <p>
                      С руководителем
                      территориального органа
                      безопасности либо
                      уполномоченным им
                      должностным лицом.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    02
                  </span>

                  <div>
                    <small>
                      Согласование
                    </small>

                    <strong>
                      Росгвардия
                    </strong>

                    <p>
                      С руководителем
                      соответствующего
                      территориального органа
                      Росгвардии либо подразделения
                      вневедомственной охраны.
                    </p>
                  </div>
                </article>
              </div>


              <div className="health-approval__final">
                <span>
                  После согласования
                </span>

                <div>
                  <strong>
                    Паспорт утверждает
                    правообладатель
                  </strong>

                  <p>
                    Документ утверждается
                    руководителем органа
                    или организации,
                    являющегося правообладателем
                    объекта, либо уполномоченным
                    им лицом.
                  </p>
                </div>
              </div>


              <aside className="health-approval__clarification">
                <span>
                  Важно различать этапы
                </span>

                <p>
                  Представитель МЧС участвует
                  в комиссии по обследованию
                  и категорированию по согласованию.
                  В перечне согласующих паспорт
                  по Постановление Правительства РФ №8 названы орган
                  безопасности и Росгвардия.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>


      <section className="health-copies">
        <Container>
          <div className="health-copies__layout">
            <div className="health-copies__identity">
              <p className="health-kicker">
                Экземпляры документа
              </p>

              <div>
                <strong>
                  2
                </strong>

                <span>
                  экземпляра
                </span>
              </div>

              <p>
                Паспорт безопасности
                объекта здравоохранения
                оформляется в двух экземплярах.
              </p>
            </div>


            <div className="health-copies__distribution">
              <h2>
                Где хранятся экземпляры
                паспорта
              </h2>

              <div className="health-copies__row">
                <span>
                  01
                </span>

                <div>
                  <strong>
                    На объекте
                  </strong>

                  <p>
                    Первый экземпляр
                    паспорта хранится
                    на объекте или территории.
                  </p>
                </div>
              </div>

              <div className="health-copies__row">
                <span>
                  02
                </span>

                <div>
                  <strong>
                    У правообладателя
                  </strong>

                  <p>
                    Второй экземпляр
                    направляется органу
                    или организации,
                    являющемуся правообладателем
                    объекта.
                  </p>
                </div>
              </div>


              <aside className="health-copies__copy">
                <span>
                  Копия
                </span>

                <p>
                  Копия или электронная копия
                  паспорта направляется
                  в территориальный орган
                  безопасности по месту
                  нахождения объекта.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
