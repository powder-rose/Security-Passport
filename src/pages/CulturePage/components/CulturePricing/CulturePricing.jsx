import Container from "../../../../components/ui/Container/Container";

export default function CulturePricing() {
  return (
    <>
      <section className="culture-price" id="culture-price">
        <Container>
          <div className="culture-price__panel">
            <div className="culture-price__main">
              <p className="culture-kicker">Стоимость</p>

              <h2>Стоимость разработки паспорта объекта культуры</h2>

              <div className="culture-price__value">
                <span>от</span>

                <strong>9 500 ₽</strong>
              </div>

              <p className="culture-price__description">
                Итоговый объём работ зависит от исходного состояния документации
                и того, прошёл ли объект обследование и категорирование.
              </p>

              <a className="button button--primary" href="#contact">
                Получить точную стоимость
              </a>
            </div>

            <div className="culture-price__scenarios">
              <article>
                <span>Сценарий 01</span>

                <h3>Акт уже есть и остаётся актуальным</h3>

                <p>
                  Если обследование и категорирование уже проведены, можно
                  рассматривать отдельную разработку паспорта по действующей
                  форме.
                </p>
              </article>

              <article>
                <span>Сценарий 02</span>

                <h3>Объект ещё не категорирован</h3>

                <p>
                  Если действующего акта нет, работу начинаем с подготовки к
                  обследованию и категорированию, после чего оформляется
                  паспорт.
                </p>
              </article>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
