import Container
from '../../../components/ui/Container/Container';


export default function TradeOwnership() {
  return (
    <>
      <section className="trade-owners">
        <Container>
          <div className="trade-owners__layout">
            <div className="trade-owners__intro">
              <p className="trade-kicker">
                Торговые центры и комплексы
              </p>

              <h2>
                Что делать, если у торгового объекта
                несколько собственников
              </h2>
            </div>


            <div className="trade-owners__content">
              <p className="trade-owners__lead">
                Обновлённый ПП РФ №1273 отдельно
                регулирует ситуацию, когда торговый
                объект принадлежит нескольким
                собственникам.
              </p>


              <div className="trade-owners__rules">
                <article>
                  <span>
                    01
                  </span>

                  <h3>
                    Определяется организатор
                    антитеррористической защищённости
                  </h3>

                  <p>
                    Организатор определяется
                    по соглашению между всеми
                    собственниками торгового объекта.
                  </p>
                </article>


                <article>
                  <span>
                    02
                  </span>

                  <h3>
                    Правообладатели получают
                    копии паспорта
                  </h3>

                  <p>
                    После оформления копии паспорта
                    направляются всем правообладателям
                    торгового объекта.
                  </p>
                </article>
              </div>


              <aside className="trade-owners__tenant-note">
                <strong>
                  А что с арендаторами?
                </strong>

                <p>
                  Нельзя автоматически считать,
                  что каждому арендатору торгового
                  центра требуется отдельный паспорт.
                  Сначала определяется нормативный
                  статус конкретного объекта,
                  состав правообладателей
                  и применимый порядок.
                </p>

                <a
                  className="trade-inline-link"
                  href="#lead-form"
                >
                  Проверить ситуацию по объекту

                  <span aria-hidden="true">
                    →
                  </span>
                </a>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
