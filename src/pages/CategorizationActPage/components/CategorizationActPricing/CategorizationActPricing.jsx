import Container from '../../../../components/ui/Container/Container';

export default function CategorizationActPricing() {
  return (
    <>
      <section className="categorization-act-cost">
        <Container>
          <div className="categorization-act-cost__card">
            <div>
              <p className="categorization-act-kicker">Стоимость</p>

              <h2>Стоимость акта обследования и категорирования</h2>

              <p>
                Стоимость подготовки документации для категорирования одного объекта. При
                нестандартном составе работ или необходимости дополнительных выездных мероприятий
                стоимость согласовывается до начала работ.
              </p>
            </div>

            <div className="categorization-act-cost__price">
              <strong>9 500 ₽</strong>

              <span>за объект</span>

              <a className="button button--primary" href="#lead-form">
                Заказать подготовку акта
              </a>
            </div>
          </div>

          <div className="categorization-act-passport-link">
            <div>
              <span>Следующий этап</span>

              <h3>После категорирования может потребоваться паспорт безопасности</h3>

              <p>
                Необходимость паспорта определяется требованиями, распространяющимися на конкретный
                объект.
              </p>
            </div>

            <a href="/">Разработка паспорта безопасности объекта →</a>
          </div>
        </Container>
      </section>
    </>
  );
}
