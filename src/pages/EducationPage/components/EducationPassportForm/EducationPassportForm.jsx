import Container from '../../../../components/ui/Container/Container';
import EducationRegulationDetails from '../EducationRegulationDetails/EducationRegulationDetails';

import { educationPassportStructure } from '../../educationPageData';

export default function EducationPassportForm() {
  return (
    <>
      <section className="education-form">
        <Container>
          <div className="education-form__header">
            <div>
              <p className="education-kicker">Форма и образец</p>

              <h2>Форма паспорта безопасности образовательной организации</h2>
            </div>

            <p>
              ПП РФ №1006 содержит утверждённую форму паспорта для объектов, подпадающих под этот
              нормативный режим.
            </p>
          </div>

          <div className="education-form__layout">
            <div className="education-form__intro">
              <span className="education-form__index">08</span>

              <h3>Основные разделы формы паспорта</h3>

              <p>
                Показываем структуру документа и поясняем состав сведений. Заполненный паспорт
                конкретного клиента публично не размещаем.
              </p>

              <a className="button button--primary" href="#lead-form">
                Получить форму паспорта
              </a>
            </div>

            <ol className="education-form__structure">
              {educationPassportStructure.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>

                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </div>

          <EducationRegulationDetails title="Форма паспорта безопасности образовательной организации по ПП РФ № 1421">
            <p>
              Для объектов Министерства науки и высшего образования Российской Федерации,
              подведомственных организаций и объектов соответствующей сферы деятельности применяется
              форма паспорта безопасности, утверждённая Постановлением Правительства РФ от
              07.11.2019 № 1421.
            </p>

            <p>Форма паспорта № 1421 отличается от формы № 1006.</p>

            <p>
              Поэтому при подготовке документа необходимо сначала определить нормативную
              принадлежность объекта, а затем использовать установленную для него форму.
            </p>

            <div className="education-form__intro">
              <p>
                БОЙКОВГРУПП помогает определить применимые требования и подготовить паспорт
                безопасности по соответствующему постановлению.
              </p>

              <a className="button button--primary" href="#lead-form">
                Получить форму паспорта
              </a>
            </div>
          </EducationRegulationDetails>
        </Container>
      </section>
    </>
  );
}
