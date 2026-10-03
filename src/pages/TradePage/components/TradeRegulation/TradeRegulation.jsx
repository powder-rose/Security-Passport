import Container from "../../../../components/ui/Container/Container";

export default function TradeRegulation() {
  return (
    <>
      <section className="trade-regulation" id="about-passport">
        <Container>
          <div className="trade-regulation__layout">
            <div className="trade-regulation__identity">
              <p className="trade-kicker">Нормативное основание</p>

              <span>ПП РФ</span>

              <strong>№1273</strong>

              <small>от 19.10.2017</small>
            </div>

            <div className="trade-regulation__content">
              <div className="trade-regulation__badge">
                Актуально с учётом изменений от 13.03.2026
              </div>

              <h2>Требования к торговым объектам по ПП РФ №1273</h2>

              <p className="trade-regulation__lead">
                Основной нормативный акт — Постановление Правительства РФ от
                19.10.2017 №1273. На сентябрь 2026 года действует редакция от
                04.03.2026, учитывающая изменения Постановления Правительства РФ
                №229.
              </p>

              <div className="trade-regulation__meta">
                <div>
                  <span>Редакция</span>

                  <strong>04.03.2026</strong>
                </div>

                <div>
                  <span>Изменения</span>

                  <strong>ПП РФ №229</strong>
                </div>

                <div>
                  <span>Применение изменений</span>

                  <strong>с 13.03.2026</strong>
                </div>
              </div>

              <aside className="trade-regulation__notice">
                <span aria-hidden="true">!</span>

                <p>
                  При подготовке документов используем актуальный порядок и
                  действующую форму, а не старые шаблоны, составленные до
                  изменений марта 2026 года.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
