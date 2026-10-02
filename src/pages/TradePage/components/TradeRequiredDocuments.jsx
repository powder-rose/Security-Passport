import Container
from '../../../components/ui/Container/Container';


export default function TradeRequiredDocuments() {
  return (
    <>
      <section
        className="trade-documents"
        id="documents"
      >
        <Container>
          <div className="trade-documents__layout">
            <div className="trade-documents__heading">
              <p className="trade-kicker">
                Исходные данные
              </p>

              <h2>
                Что потребуется
                для разработки
              </h2>

              <p>
                Не запрашиваем одинаковый
                универсальный пакет у каждого
                заказчика. Сначала определяем
                статус объекта, затем уточняем
                состав необходимых сведений.
              </p>
            </div>


            <div className="trade-documents__list">
              <article>
                <span>
                  01
                </span>

                <div>
                  <h3>
                    Правообладатель
                  </h3>

                  <p>
                    Организация, собственник
                    или пользователь объекта.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  02
                </span>

                <div>
                  <h3>
                    Объект
                  </h3>

                  <p>
                    Наименование, адрес
                    и специализация.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  03
                </span>

                <div>
                  <h3>
                    Характеристики
                  </h3>

                  <p>
                    Площадь, границы,
                    этажность.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  04
                </span>

                <div>
                  <h3>
                    Люди
                  </h3>

                  <p>
                    Сведения о работниках
                    и посетителях.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  05
                </span>

                <div>
                  <h3>
                    Планы
                  </h3>

                  <p>
                    Поэтажные планы
                    и схемы территории.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  06
                </span>

                <div>
                  <h3>
                    Безопасность
                  </h3>

                  <p>
                    Охрана, видеонаблюдение,
                    сигнализация и другие
                    применимые сведения.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  07
                </span>

                <div>
                  <h3>
                    Опасные участки
                  </h3>

                  <p>
                    При наличии таких участков
                    на объекте.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  08
                </span>

                <div>
                  <h3>
                    Критические элементы
                  </h3>

                  <p>
                    При наличии критических
                    элементов объекта.
                  </p>
                </div>
              </article>


              <article>
                <span>
                  09
                </span>

                <div>
                  <h3>
                    Существующие документы
                  </h3>

                  <p>
                    Уведомление, акт,
                    старый паспорт —
                    если они уже есть.
                  </p>
                </div>
              </article>
            </div>
          </div>


          <aside className="trade-documents__note">
            <strong>
              Точный перечень
            </strong>

            <p>
              Запрашиваем после определения
              нормативного статуса
              конкретного торгового объекта.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
