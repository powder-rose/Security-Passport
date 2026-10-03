import Container from "../../../../components/ui/Container/Container";

export default function TradePricing() {
  return (
    <>
      <section className="trade-prices" id="prices">
        <Container>
          <div className="trade-prices__heading">
            <div>
              <p className="trade-kicker">Стоимость</p>

              <h2>Стоимость разработки и сопровождения</h2>
            </div>

            <p>
              Итоговый состав работ определяется по статусу конкретного объекта.
              Поэтому стоимость паспорта не означает стоимость всего комплекса.
            </p>
          </div>

          <div className="trade-prices__list">
            <article>
              <span>Паспорт безопасности</span>

              <strong>9 500 ₽</strong>

              <p>
                Разработка паспорта при наличии необходимых исходных данных.
              </p>
            </article>

            <article>
              <span>Акт обследования и категорирования</span>

              <strong>9 500 ₽</strong>

              <p>
                Подготовка документа по этапу обследования и категорирования.
              </p>
            </article>

            <article>
              <span>Сопровождение согласования</span>

              <strong>от 9 500 ₽</strong>

              <p>Работа по предусмотренному этапу согласования документа.</p>
            </article>

            <article className="trade-price--accent">
              <span>Комплекс под ключ</span>

              <strong>от 35 000 ₽</strong>

              <p>
                Комплекс работ определяется после проверки статуса торгового
                объекта.
              </p>
            </article>
          </div>

          <div className="trade-prices__logic">
            <article>
              <span>Есть актуальный акт</span>

              <p>
                Если торговый объект уже категорирован и имеется актуальный акт,
                можно заказать только разработку паспорта.
              </p>
            </article>

            <article>
              <span>Категорирования ещё нет</span>

              <p>
                Если объект только включён в перечень и категорирование ещё не
                проводилось, работа начинается с обследования и категорирования.
              </p>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
