import Container from "../../../../components/ui/Container/Container";

export default function TradeRegulationChanges() {
  return (
    <>
      <section className="trade-changes">
        <Container>
          <div className="trade-changes__heading">
            <div>
              <p className="trade-kicker">Редакция 2026 года</p>

              <h2>Что изменилось в ПП РФ №1273 в 2026 году</h2>
            </div>

            <p>
              С 13 марта 2026 года применяется обновлённый порядок. Изменения
              затронули не только форму паспорта, но и процедуру работы с
              торговым объектом.
            </p>
          </div>

          <div className="trade-changes__grid">
            <article className="trade-change">
              <span>01</span>

              <h3>Региональные перечни</h3>

              <p>
                Уточнён порядок включения торговых объектов в перечни объектов,
                подлежащих категорированию.
              </p>

              <strong>
                Важно правильно определить применимость требований.
              </strong>
            </article>

            <article className="trade-change">
              <span>02</span>

              <h3>Правообладатели объекта</h3>

              <p>
                Уточнён статус правообладателей и организатора
                антитеррористической защищённости.
              </p>

              <strong>
                Особенно важно для объектов с несколькими собственниками.
              </strong>
            </article>

            <article className="trade-change">
              <span>03</span>

              <h3>Работа комиссии</h3>

              <p>
                Установлен обновлённый порядок создания комиссии по обследованию
                и категорированию.
              </p>

              <strong>Категорирование проводим по актуальной процедуре.</strong>
            </article>

            <article className="trade-change">
              <span>04</span>

              <h3>Согласование</h3>

              <p>
                Установлены конкретные сроки согласования паспорта безопасности
                торгового объекта.
              </p>

              <strong>Процедура стала более формализованной.</strong>
            </article>

            <article className="trade-change">
              <span>05</span>

              <h3>Доработка</h3>

              <p>Закреплён срок доработки паспорта при наличии замечаний.</p>

              <strong>
                Замечания должны обрабатываться в установленный срок.
              </strong>
            </article>

            <article className="trade-change">
              <span>06</span>

              <h3>Актуализация</h3>

              <p>Уточнён порядок внесения изменений и актуализации паспорта.</p>

              <strong>Изменения оформляются по действующей схеме.</strong>
            </article>

            <article className="trade-change trade-change--wide">
              <span>07</span>

              <div>
                <h3>Изменилась форма паспорта</h3>

                <p>
                  ПП РФ №229 внесло изменения непосредственно в форму документа.
                  Старый шаблон нельзя механически использовать для паспорта,
                  оформляемого по действующей редакции.
                </p>
              </div>

              <div className="trade-change__edition">
                <small>Действует</small>

                <strong>с 13.03.2026</strong>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
