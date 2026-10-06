import Container from '../../../../components/ui/Container/Container';

import { triggerRows } from '../../actualizationPageData';

export default function ActualizationReasons() {
  return (
    <>
      <section className="actualization-reasons" id="when-update">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">Сроки, основания и причины</p>

            <h2>Когда требуется актуализация паспорта безопасности</h2>

            <p>
              Конкретные основания зависят от вида объекта и требований, по которым разработан его
              паспорт.
            </p>
          </div>

          <div
            className="actualization-reasons-table"
            role="table"
            aria-label="Основания для проверки актуальности паспорта"
          >
            <div className="actualization-reasons-table__head" role="row">
              <span role="columnheader">Что изменилось</span>

              <span role="columnheader">Может потребоваться актуализация</span>
            </div>

            {triggerRows.map(item => (
              <div className="actualization-reasons-table__row" role="row" key={item.change}>
                <span role="cell">{item.change}</span>

                <strong role="cell">{item.result}</strong>
              </div>
            ))}
          </div>

          <aside className="actualization-reasons__notice">
            <strong>
              Основания и сроки актуализации зависят от вида объекта и нормативного акта, который
              устанавливает требования к его антитеррористической защищённости.
            </strong>

            <p>
              Поэтому мы не просто меняем дату в паспорте — сначала определяем применимые
              требования.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
