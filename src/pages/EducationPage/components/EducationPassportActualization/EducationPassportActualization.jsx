import Container from '../../../../components/ui/Container/Container';
import EducationRegulationDetails from '../EducationRegulationDetails/EducationRegulationDetails';

import {
  educationActualizationReasons,
  educationActualizationReasons1421,
} from '../../educationPageData';

export default function EducationPassportActualization() {
  return (
    <>
      <section className="education-actualization">
        <Container>
          <div className="education-actualization__header">
            <div>
              <p className="education-kicker">Актуализация по №1006</p>

              <h2>Как часто актуализируется паспорт образовательной организации</h2>
            </div>

            <div className="education-actualization__period">
              <span>Не реже</span>

              <strong>
                1 раз
                <small>в 5 лет</small>
              </strong>
            </div>
          </div>

          <div className="education-actualization__body">
            <div>
              <h3>Также актуализация проводится при изменении</h3>

              <div className="education-actualization__reasons">
                {educationActualizationReasons.map(item => (
                  <article className="education-actualization__reason" key={item.number}>
                    <span>{item.number}</span>

                    <p>{item.title}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="education-actualization__aside">
              <p className="education-actualization__aside-kicker">После актуализации</p>

              <h3>Изменения должны быть отражены во всех экземплярах</h3>

              <p>
                Изменения прилагаются ко всем экземплярам паспорта с указанием причины и даты их
                внесения.
              </p>

              <div className="education-actualization__storage">
                <strong>Ещё 5 лет</strong>

                <p>хранится на объекте паспорт, который был заменён по результатам актуализации.</p>
              </div>
            </aside>
          </div>

          <div className="education-actualization__footer">
            <p>
              Для объекта, подпадающего под другой нормативный режим, основания и порядок
              актуализации проверяются отдельно.
            </p>

            <a className="education-text-link" href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
              Подробнее об актуализации паспорта безопасности
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <EducationRegulationDetails title="Актуализация паспорта безопасности по ПП РФ № 1421">
            <p>
              Для объектов, подпадающих под ПП РФ № 1421, паспорт безопасности актуализируется не
              реже одного раза в пять лет, а также при изменении предусмотренных постановлением
              характеристик.
            </p>

            <p>К основаниям относятся:</p>

            <div className="education-actualization__reasons">
              {educationActualizationReasons1421.map((reason, index) => (
                <article className="education-actualization__reason" key={reason}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>

                  <p>{reason}</p>
                </article>
              ))}
            </div>

            <p>
              При актуализации проводится подтверждение или изменение категории объекта в
              установленном порядке.
            </p>

            <p>Заменённый паспорт хранится на объекте в течение пяти лет.</p>

            <a
              className="button button--primary"
              href="/aktualizaciya-pasporta-bezopasnosti-obekta/"
            >
              Заказать актуализацию паспорта
            </a>
          </EducationRegulationDetails>
        </Container>
      </section>
    </>
  );
}
