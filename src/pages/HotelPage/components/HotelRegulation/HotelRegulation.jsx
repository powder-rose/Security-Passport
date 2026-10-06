import Container from '../../../../components/ui/Container/Container';

import { regulationPoints } from '../../hotelPageData';

export default function HotelRegulation() {
  return (
    <>
      <section className="hotel-regulation" id="hotel-regulation">
        <Container>
          <div className="hotel-regulation__header">
            <div className="hotel-section-heading">
              <p className="hotel-kicker">Нормативная основа</p>

              <h2>Постановление Правительства РФ от 13.04.2017 №447</h2>
            </div>

            <p className="hotel-regulation__intro">
              Основным нормативным документом для антитеррористической защищённости гостиниц и иных
              средств размещения является Постановление Правительства РФ от 13.04.2017 №447. Оно
              устанавливает требования к категорированию, защите гостиниц и форме паспорта
              безопасности.
            </p>
          </div>

          <div className="hotel-regulation__body">
            <div className="hotel-regulation__statement">
              <span>№447</span>

              <p>
                Перед разработкой паспорта проверяем применимость требований к конкретному объекту и
                используем действующую нормативную форму.
              </p>
            </div>

            <ol className="hotel-regulation__list">
              {regulationPoints.map(item => (
                <li key={item.number}>
                  <span className="hotel-regulation__number">{item.number}</span>

                  <div>
                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
