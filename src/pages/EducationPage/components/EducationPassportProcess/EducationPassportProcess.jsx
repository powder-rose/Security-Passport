import Container from "../../../../components/ui/Container/Container";

import { educationProcess } from "../../educationPageData";

export default function EducationPassportProcess() {
  return (
    <>
      <section className="education-process">
        <Container>
          <div className="education-process__heading">
            <p className="education-kicker">Порядок работы</p>

            <h2>
              Как оформить паспорт безопасности образовательной организации
            </h2>

            <p>
              Сначала определяем нормативный режим конкретного объекта. После
              этого последовательно проходим этапы категорирования и подготовки
              паспорта.
            </p>
          </div>

          <ol className="education-process__list">
            {educationProcess.map((item, index) => (
              <li className="education-process__step" key={item}>
                <span className="education-process__number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>{item}</p>
              </li>
            ))}
          </ol>

          <aside className="education-process__term">
            <span>Для объектов по ПП РФ №1006</span>

            <strong>Паспорт составляется в течение 30 дней</strong>

            <p>
              Срок отсчитывается после проведения обследования и категорирования
              объекта.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
