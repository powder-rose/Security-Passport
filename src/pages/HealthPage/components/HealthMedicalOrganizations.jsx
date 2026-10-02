import Container
from '../../../components/ui/Container/Container';


export default function HealthMedicalOrganizations() {
  return (
    <>
<section className="health-medical">
        <Container>
          <div className="health-medical__layout">
            <div className="health-medical__heading">
              <p className="health-kicker">
                Медицинские организации
              </p>

              <h2>
                Паспорт безопасности
                медицинской организации
              </h2>

              <p>
                При проверке применимости
                требований учитываются
                статус организации,
                назначение и фактические
                характеристики конкретного
                объекта.
              </p>
            </div>


            <div className="health-medical__types">
              <div>
                <span>
                  01
                </span>

                <strong>
                  Больница
                </strong>
              </div>

              <div>
                <span>
                  02
                </span>

                <strong>
                  Поликлиника
                </strong>
              </div>

              <div>
                <span>
                  03
                </span>

                <strong>
                  Медицинский центр
                </strong>
              </div>

              <div>
                <span>
                  04
                </span>

                <strong>
                  Стоматология
                </strong>
              </div>

              <div>
                <span>
                  05
                </span>

                <strong>
                  Частная клиника
                </strong>
              </div>

              <div>
                <span>
                  06
                </span>

                <strong>
                  Медицинская организация
                </strong>
              </div>
            </div>
          </div>


          <aside className="health-medical__pharma">
            <div className="health-medical__pharma-label">
              <span>
                Фармацевтическая деятельность
              </span>

              <strong>
                Аптеки и другие
                фармацевтические объекты
              </strong>
            </div>

            <p>
              Для объектов организаций,
              осуществляющих фармацевтическую
              деятельность, применимость
              требований определяется
              с учётом статуса организации
              и конкретного объекта.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
