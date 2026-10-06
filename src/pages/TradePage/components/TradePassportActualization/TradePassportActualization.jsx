import Container from '../../../../components/ui/Container/Container';

export default function TradePassportActualization() {
  return (
    <>
      <section className="trade-actualization">
        <Container>
          <div className="trade-actualization__heading">
            <div>
              <p className="trade-kicker">Актуализация</p>

              <h2>Когда нужно актуализировать паспорт торгового объекта</h2>
            </div>

            <p>
              Паспорт является документом постоянного действия, но изменения характеристик объекта
              могут требовать его актуализации или внесения корректировок в установленном порядке.
            </p>
          </div>

          <div className="trade-actualization__reasons">
            <article>
              <span>01</span>

              <h3>Специализация или вид торговли</h3>

              <p>Когда изменение влияет на прогнозируемое число пострадавших.</p>
            </article>

            <article>
              <span>02</span>

              <h3>Площадь и границы объекта</h3>

              <p>При изменении общей площади или границ торгового объекта.</p>
            </article>

            <article>
              <span>03</span>

              <h3>Потенциально опасные участки</h3>

              <p>При изменении количества таких участков.</p>
            </article>

            <article>
              <span>04</span>

              <h3>Критические элементы</h3>

              <p>При изменении количества критических элементов объекта.</p>
            </article>
          </div>

          <div className="trade-actualization__corrections">
            <div>
              <span>Лист учёта корректировок</span>

              <h3>Не каждое изменение означает полную переработку паспорта</h3>
            </div>

            <p>
              При изменении сил и средств антитеррористической защищённости и в иных предусмотренных
              случаях применяется лист учёта корректировок.
            </p>
          </div>

          <a className="trade-inline-link" href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
            Подробнее об актуализации паспорта безопасности
            <span aria-hidden="true">→</span>
          </a>
        </Container>
      </section>
    </>
  );
}
