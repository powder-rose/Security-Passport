import Container from '../../../../components/ui/Container/Container';

export default function TradeRestrictedDocuments() {
  return (
    <>
      <section className="trade-restricted">
        <Container>
          <div className="trade-restricted__layout">
            <div className="trade-restricted__identity">
              <span>Ограниченное</span>

              <strong>распространение</strong>

              <small>Заполненный паспорт действующего объекта публично не размещаем</small>
            </div>

            <div className="trade-restricted__content">
              <p className="trade-kicker">Работа с документом</p>

              <h2>Можно ли разместить заполненный паспорт торгового объекта в интернете</h2>

              <p className="trade-restricted__lead">
                Информация в паспорте безопасности торгового объекта относится к информации
                ограниченного распространения и должна защищаться в установленном порядке.
              </p>

              <div className="trade-restricted__rules">
                <article>
                  <span className="trade-restricted__sign">+</span>

                  <div>
                    <h3>Что можно показывать</h3>

                    <p>
                      Официальную форму, структуру документа и обезличенный демонстрационный пример.
                    </p>
                  </div>
                </article>

                <article className="trade-restricted__rule--negative">
                  <span className="trade-restricted__sign">−</span>

                  <div>
                    <h3>Что не публикуем</h3>

                    <p>
                      Реальный заполненный паспорт действующего торгового объекта или торгового
                      центра.
                    </p>
                  </div>
                </article>
              </div>

              <p className="trade-restricted__footnote">
                Отдельно нормативными требованиями регулируется возможность присвоения содержащимся
                в паспорте сведениям грифа секретности.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
