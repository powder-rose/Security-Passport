import Container from '../../../../components/ui/Container/Container';

import { cultureCategorizationSteps } from '../../culturePageData';

export default function CultureCategorization() {
  return (
    <>
      <section className="culture-categorization" id="culture-categorization">
        <Container>
          <div className="culture-categorization__layout">
            <div className="culture-categorization__heading">
              <div>
                <p className="culture-kicker">Обследование</p>

                <h2>Как проходит категорирование объекта культуры</h2>
              </div>

              <div className="culture-categorization__deadline">
                <span>Срок работы комиссии</span>

                <strong>до 30</strong>

                <p>рабочих дней</p>
              </div>

              <p className="culture-categorization__caption">
                Конкретный срок устанавливает руководитель организации-правообладателя с учётом
                сложности объекта, но он не должен превышать 30 рабочих дней.
              </p>
            </div>

            <ol className="culture-categorization__steps">
              {cultureCategorizationSteps.map((item, index) => (
                <li className="culture-categorization__step" key={item.number}>
                  <div className="culture-categorization__step-head">
                    <span>{item.number}</span>

                    {index < cultureCategorizationSteps.length - 1 && (
                      <span className="culture-categorization__connector" aria-hidden="true" />
                    )}
                  </div>

                  <div className="culture-categorization__step-copy">
                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="culture-categorization__footer">
            <p>
              Категорирование — это работа комиссии. Мы можем подготовить исходные материалы,
              документы и проект акта для прохождения установленной процедуры.
            </p>

            <a className="culture-inline-link" href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
              Подробнее об акте обследования и категорирования объекта
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
