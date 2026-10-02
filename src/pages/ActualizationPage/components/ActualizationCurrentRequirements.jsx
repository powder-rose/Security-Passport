import Container
from '../../../components/ui/Container/Container';



export default function ActualizationCurrentRequirements() {
  return (
    <>
      <section className="actualization-standard">
        <Container>
          <div className="actualization-standard__panel">
            <div>
              <p className="actualization-kicker">
                Требования 2026 года
              </p>

              <h2>
                ГОСТ Р 72551-2026
              </h2>
            </div>

            <div>
              <p>
                С 1 мая 2026 года действует
                ГОСТ Р 72551-2026, устанавливающий
                общие требования к услугам
                по категорированию объектов
                и разработке паспортов безопасности
                объектов, для которых установлены
                обязательные требования
                к антитеррористической защищённости.
              </p>

              <strong>
                ГОСТ не устанавливает единый срок
                актуализации для всех объектов.
              </strong>

              <p>
                Конкретные основания, сроки
                и порядок определяются требованиями
                к соответствующему виду объекта.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
