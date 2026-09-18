import Container from '../../components/ui/Container/Container';

import {
  objectTypes,
} from '../../data/objectTypes';

import './RegulationByObject.css';


export default function RegulationByObject() {
  return (
    <section
      className="regulation-guide"
      id="requirements-by-object"
      aria-labelledby="regulation-guide-title"
    >
      <Container>
        <div className="regulation-guide__heading">
          <div>
            <p className="regulation-guide__kicker">
              Нормативная структура
            </p>

            <h2 id="regulation-guide-title">
              Требования зависят
              <em> от типа объекта</em>
            </h2>
          </div>

          <p className="regulation-guide__lead">
            Для гостиницы, торгового объекта,
            учреждения культуры, спортивного объекта
            и других категорий применяются разные
            требования, порядок категорирования
            и формы паспорта безопасности.
          </p>
        </div>


        <div className="regulation-guide__table-wrap">
          <table className="regulation-guide__table">
            <thead>
              <tr>
                <th scope="col">
                  Ваш объект
                </th>

                <th scope="col">
                  Что проверяем
                </th>
              </tr>
            </thead>

            <tbody>
              {objectTypes.map(
                (objectType) => (
                  <tr key={objectType.id}>
                    <td className="regulation-guide__object">
                      <a href={objectType.path}>
                        <span>
                          {objectType.title}
                        </span>

                        <span
                          className="regulation-guide__arrow"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </a>
                    </td>

                    <td className="regulation-guide__requirements">
                      <span className="regulation-guide__focus">
                        {objectType.regulationFocus}
                      </span>

                      <span className="regulation-guide__act">
                        {objectType.regulationAct}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>


        <div className="regulation-guide__footer">
          <span
            className="regulation-guide__footer-mark"
            aria-hidden="true"
          >
            ✓
          </span>

          <p>
            Конкретный нормативный акт определяем
            по назначению объекта, сфере деятельности,
            правообладателю и другим исходным сведениям.
            Подробные требования раскрыты на страницах
            соответствующих типов объектов.
          </p>
        </div>
      </Container>
    </section>
  );
}
