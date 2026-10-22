import Container from '../../../../components/ui/Container/Container';
import EducationComparison from '../EducationComparison/EducationComparison';
import EducationRegulationDetails from '../EducationRegulationDetails/EducationRegulationDetails';

import {
  educationActCopies,
  educationCategories,
  educationCategories1421,
} from '../../educationPageData';

export default function EducationCategories() {
  return (
    <>
      <section className="education-categories">
        <Container>
          <div className="education-categories__heading">
            <div>
              <p className="education-kicker">Категорирование</p>

              <h2>Категорирование образовательной организации</h2>
            </div>

            <p className="education-categories__lead">
              Для объектов, подпадающих под ПП РФ №1006, предусмотрены четыре категории опасности.
              Категория определяется с учётом прогнозируемого количества пострадавших и численности
              населения населённого пункта.
            </p>
          </div>

          <div className="education-categories__notice">
            <span className="education-categories__notice-mark" aria-hidden="true">
              !
            </span>

            <div>
              <strong>Категорию определяет комиссия по обследованию и категорированию</strong>

              <p>
                Подрядчик может готовить исходные материалы, расчёты и проекты документов, но не
                присваивает категорию объекту единолично.
              </p>
            </div>
          </div>

          <div className="education-categories__list">
            {educationCategories.map(category => (
              <details className="education-category" key={category.id}>
                <summary>
                  <span className="education-category__title">{category.title}</span>

                  <span className="education-category__summary">{category.summary}</span>

                  <span className="education-category__toggle" aria-hidden="true">
                    +
                  </span>
                </summary>

                <div className="education-category__body">
                  <ul>
                    {category.criteria.map(criterion => (
                      <li key={criterion}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>

          <a className="education-text-link" href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
            Акт обследования и категорирования объекта
            <span aria-hidden="true">→</span>
          </a>

          <EducationRegulationDetails title="Категории опасности объектов Минобрнауки по ПП РФ № 1421">
            <p>
              Для объектов (территорий), подпадающих под Постановление Правительства РФ от
              07.11.2019 № 1421, предусмотрены три категории опасности.
            </p>

            <EducationComparison
              headers={['Категория', 'Критерий']}
              rows={educationCategories1421}
            />

            <p>
              Категория определяется комиссией по обследованию и категорированию на основании
              установленных критериев.
            </p>

            <p>
              Важно: при подготовке документации нельзя применять четыре категории по № 1006 к
              объектам, подпадающим под № 1421.
            </p>
          </EducationRegulationDetails>

          <EducationRegulationDetails title="Сколько экземпляров акта категорирования оформляется">
            <p>Количество экземпляров акта зависит от применимого постановления.</p>

            <EducationComparison
              headers={['Постановление', 'Количество экземпляров акта']}
              rows={educationActCopies}
            />

            <p>
              В обоих случаях акт обследования и категорирования является основанием для разработки
              и неотъемлемой частью паспорта безопасности.
            </p>

            <p>
              Результаты работы комиссии оформляются в установленном порядке. Документ подписывается
              всеми членами комиссии и утверждается председателем.
            </p>

            <p>
              БОЙКОВГРУПП оказывает услуги по подготовке проекта акта и необходимых документов для
              работы комиссии.
            </p>

            <a
              className="button button--primary"
              href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
            >
              Заказать акт обследования и категорирования
            </a>
          </EducationRegulationDetails>
        </Container>
      </section>
    </>
  );
}
