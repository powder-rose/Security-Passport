import Container from '../../../../components/ui/Container/Container';

import { objectTypes } from '../../../../data/objectTypes';

export default function CategorizationActObjectTypes() {
  return (
    <>
      <section className="categorization-act-types" id="who-needs-act">
        <Container>
          <div className="categorization-act-types__header">
            <div>
              <p className="categorization-act-kicker">Для каких объектов</p>

              <h2>Категорирование зависит от назначения объекта</h2>
            </div>

            <p>
              Для разных сфер действуют разные требования, поэтому перед подготовкой акта мы сначала
              определяем нормативный режим конкретного объекта.
            </p>
          </div>

          <div className="categorization-act-types__directory">
            {objectTypes.map((item, index) => (
              <a href={item.path} key={item.id}>
                <span className="categorization-act-types__number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <strong>{item.title}</strong>

                <span className="categorization-act-types__regulation">{item.regulationAct}</span>

                <span className="categorization-act-types__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}

            <div className="categorization-act-types__other">
              <span className="categorization-act-types__number">09</span>

              <strong>Другие объекты и территории</strong>

              <span className="categorization-act-types__regulation">
                По применимым требованиям
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
