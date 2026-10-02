import Container
from '../../../components/ui/Container/Container';



export default function HotelCurrentRequirements() {
  return (
    <>
      <section
        className="hotel-standard"
        id="hotel-standard"
      >
        <Container>
          <div className="hotel-standard__panel">
            <div className="hotel-standard__number">
              <span>
                Действует с
              </span>

              <strong>
                01.05.2026
              </strong>
            </div>

            <div className="hotel-standard__content">
              <p className="hotel-kicker">
                Требования 2026 года
              </p>

              <h2>
                ГОСТ Р 72551-2026
              </h2>

              <p className="hotel-standard__lead">
                Национальный стандарт устанавливает
                общие требования к услугам
                по категорированию объектов
                и разработке паспортов безопасности
                объектов, для которых установлены
                обязательные требования
                к антитеррористической защищённости.
              </p>

              <div className="hotel-standard__distinction">
                <span>
                  Важно
                </span>

                <p>
                  ГОСТ устанавливает общие требования
                  к оказанию услуги. Порядок
                  категорирования конкретной гостиницы
                  и форма её паспорта определяются
                  применимыми обязательными
                  требованиями, включая Постановление Правительства РФ от 13.04.2017 №447.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
