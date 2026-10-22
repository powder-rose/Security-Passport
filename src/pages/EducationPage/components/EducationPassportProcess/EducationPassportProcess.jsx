import Container from '../../../../components/ui/Container/Container';
import EducationComparison from '../EducationComparison/EducationComparison';

import { educationPassportTerms, educationProcess } from '../../educationPageData';

export default function EducationPassportProcess() {
  return (
    <>
      <section className="education-process">
        <Container>
          <div className="education-process__heading">
            <p className="education-kicker">Порядок работы</p>

            <h2>Как оформить паспорт безопасности образовательной организации</h2>

            <p>
              Сначала определяем нормативный режим конкретного объекта. После этого последовательно
              проходим этапы категорирования и подготовки паспорта.
            </p>
          </div>

          <ol className="education-process__list">
            {educationProcess.map((item, index) => (
              <li className="education-process__step" key={item}>
                <span className="education-process__number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p>{item}</p>
              </li>
            ))}
          </ol>

          <aside className="education-process__term">
            <h3>Сроки разработки паспорта безопасности</h3>

            <div>
              <EducationComparison
                headers={['Постановление', 'Нормативный срок']}
                rows={educationPassportTerms}
              />

              <p>
                Эти сроки регулируют подготовку паспорта и не означают гарантированного завершения
                согласования со всеми государственными органами в тот же период.
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
