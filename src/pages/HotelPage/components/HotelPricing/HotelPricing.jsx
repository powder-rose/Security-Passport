import Container from '../../../../components/ui/Container/Container';

export default function HotelPricing() {
  return (
    <>
      <section className="hotel-price" id="hotel-price">
        <Container>
          <div className="hotel-price__panel">
            <div className="hotel-price__copy">
              <p className="hotel-kicker">Стоимость</p>

              <h2>Стоимость паспорта безопасности гостиницы</h2>

              <p>
                Итоговый состав работ зависит от состояния исходных документов, необходимости
                подготовки к категорированию и объёма сопровождения.
              </p>
            </div>

            <div className="hotel-price__value">
              <span>Разработка паспорта</span>

              <strong>от 9 500 ₽</strong>

              <p>Точную стоимость определяем после первичной проверки объекта и исходных данных.</p>

              <a className="hotel-price__action" href="#contact">
                Получить точную стоимость
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
