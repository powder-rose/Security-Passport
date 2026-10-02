import Container
from '../../../components/ui/Container/Container';


export default function CrowdRegulation() {
  return (
    <>
      <section
        className="crowd-regulation"
        id="regulation"
      >
        <Container>
          <div className="crowd-regulation__layout">
            <aside className="crowd-regulation__identity">
              <p className="crowd-kicker">
                Нормативная база
              </p>

              <div className="crowd-regulation__number">
                272
              </div>

              <p className="crowd-regulation__date">
                Постановление Правительства РФ
                от 25.03.2015
              </p>
            </aside>


            <div className="crowd-regulation__content">
              <h2>
                Когда применяется
                ПП РФ №272
              </h2>

              <p className="crowd-regulation__lead">
                Постановление устанавливает
                требования к антитеррористической
                защищённости мест массового
                пребывания людей и официальную
                форму паспорта безопасности.
              </p>

              <div className="crowd-regulation__points">
                <article>
                  <span>
                    01
                  </span>

                  <div>
                    <h3>
                      Сначала определяется
                      применимый режим
                    </h3>

                    <p>
                      Паспорт ММПЛ не является
                      универсальным документом
                      для любого объекта
                      с высокой посещаемостью.
                    </p>
                  </div>
                </article>


                <article>
                  <span>
                    02
                  </span>

                  <div>
                    <h3>
                      Затем проверяется
                      перечень ММПЛ
                    </h3>

                    <p>
                      Для применения порядка
                      по №272 важно, относится ли
                      конкретное место
                      к сформированному перечню.
                    </p>
                  </div>
                </article>


                <article>
                  <span>
                    03
                  </span>

                  <div>
                    <h3>
                      После этого проводится
                      обследование
                    </h3>

                    <p>
                      Категория определяется
                      по результатам установленной
                      процедуры обследования
                      и категорирования.
                    </p>
                  </div>
                </article>
              </div>


              <aside className="crowd-regulation__edition">
                <span>
                  Редакция
                </span>

                <p>
                  В ТЗ используется справочная
                  редакция ПП РФ №272
                  от 24.10.2023.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
