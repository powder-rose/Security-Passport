import Container from '../../../../components/ui/Container/Container';

export default function SportRequiredDocuments() {
  return (
    <>
      <section className="sport-source-data" id="documents">
        <Container>
          <div className="sport-source-data__heading">
            <div>
              <p className="sport-kicker">Исходные данные</p>

              <h2>Что потребуется для разработки</h2>
            </div>

            <p>
              Для подготовки документов используются сведения об объекте, его характеристиках,
              посетителях, персонале, охране и технических средствах защиты.
            </p>
          </div>

          <div className="sport-source-data__layout">
            <div className="sport-source-data__list">
              <article>
                <span>01</span>

                <div>
                  <h3>Объект и правообладатель</h3>

                  <p>
                    Наименование и адрес объекта, вид спортивного объекта, сведения о
                    правообладателе.
                  </p>
                </div>
              </article>

              <article>
                <span>02</span>

                <div>
                  <h3>Планы и характеристики</h3>

                  <p>Планы и схемы, площадь и основные характеристики объекта.</p>
                </div>
              </article>

              <article>
                <span>03</span>

                <div>
                  <h3>Посетители и вместимость</h3>

                  <p>Среднее число посетителей и зрительская вместимость.</p>
                </div>
              </article>

              <article>
                <span>04</span>

                <div>
                  <h3>Персонал</h3>

                  <p>Данные о персонале объекта.</p>
                </div>
              </article>

              <article>
                <span>05</span>

                <div>
                  <h3>Охрана и техническая защита</h3>

                  <p>Сведения об охране и технических средствах защиты.</p>
                </div>
              </article>

              <article>
                <span>06</span>

                <div>
                  <h3>Критические элементы</h3>

                  <p>Сведения о критических элементах и потенциально опасных участках.</p>
                </div>
              </article>

              <article>
                <span>07</span>

                <div>
                  <h3>Действующие документы</h3>

                  <p>
                    Действующий акт обследования и категорирования и паспорт безопасности — при
                    наличии.
                  </p>
                </div>
              </article>
            </div>

            <aside className="sport-source-data__note">
              <span>Перечень</span>

              <strong>Не собираем лишние документы заранее</strong>

              <p>
                Точный перечень исходных данных определяется после проверки конкретного объекта.
              </p>

              <a href="#lead-form" className="sport-inline-link">
                Проверить исходные данные
                <span aria-hidden="true">→</span>
              </a>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
