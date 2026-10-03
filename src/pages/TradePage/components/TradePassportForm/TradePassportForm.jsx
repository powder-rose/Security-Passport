import Container from "../../../../components/ui/Container/Container";

export default function TradePassportForm() {
  return (
    <>
      <section className="trade-form">
        <Container>
          <div className="trade-form__layout">
            <div className="trade-form__content">
              <p className="trade-kicker">Форма и образец</p>

              <h2>Форма паспорта безопасности торгового объекта</h2>

              <p className="trade-form__lead">
                Форма паспорта безопасности торгового объекта была изменена с 13
                марта 2026 года. ПП РФ №229 внесло изменения непосредственно в
                форму документа.
              </p>

              <div className="trade-form__statement">
                <span>Используем</span>

                <strong>
                  форму паспорта безопасности в редакции ПП РФ №229 от
                  04.03.2026
                </strong>
              </div>

              <div className="trade-form__notes">
                <article>
                  <span>01</span>

                  <p>
                    Изменились отдельные грифы, таблицы и другие элементы формы
                    документа.
                  </p>
                </article>

                <article>
                  <span>02</span>

                  <p>
                    Старый шаблон нельзя механически использовать для подготовки
                    нового паспорта.
                  </p>
                </article>
              </div>

              <a
                className="button button--primary trade-form__button"
                href="#lead-form"
              >
                <span>Получить актуальную форму паспорта</span>

                <span className="trade-form__button-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>

            <aside
              className="trade-form__document"
              aria-label="Схематичное изображение формы паспорта безопасности"
            >
              <div className="trade-form__document-top">
                <span>ПП РФ №1273</span>

                <span>Редакция 2026</span>
              </div>

              <div className="trade-form__document-heading">
                <small>Паспорт безопасности</small>

                <strong>торгового объекта</strong>
              </div>

              <div className="trade-form__document-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="trade-form__document-footer">
                <span>№229</span>

                <p>
                  Схематичное отображение. Заполненный паспорт действующего
                  объекта публично не размещаем.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
