import Container from '../../../../components/ui/Container/Container';

import { cultureFormStructure } from '../../culturePageData';

export default function CulturePassportForm() {
  return (
    <>
      <section className="culture-form" id="culture-form">
        <Container>
          <div className="culture-form__header">
            <div>
              <p className="culture-kicker">Форма и образец</p>

              <h2>Форма паспорта безопасности объекта культуры</h2>
            </div>

            <div className="culture-form__intro">
              <p>
                Официальная форма паспорта утверждена ПП РФ №176. После изменений 2025 года для
                нового документа необходимо использовать актуальную форму.
              </p>

              <p>
                Заполненный паспорт действующего объекта в открытом доступе не публикуем из-за
                ограниченного характера содержащихся в нём сведений.
              </p>
            </div>
          </div>

          <div className="culture-form__layout">
            <div className="culture-form__document">
              <div className="culture-form__document-head">
                <span>Паспорт безопасности</span>

                <strong>№176</strong>
              </div>

              <div className="culture-form__document-body">
                <span>Обезличенная структура</span>

                <p>Показываем состав разделов, а не сведения конкретного учреждения культуры.</p>
              </div>

              <div className="culture-form__document-footer">
                <span>ДСП</span>

                <span>актуальная форма</span>
              </div>
            </div>

            <div className="culture-form__structure">
              <p className="culture-form__structure-label">Основные разделы формы</p>

              <ol>
                {cultureFormStructure.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, '0')}</span>

                    <strong>{item}</strong>
                  </li>
                ))}
              </ol>

              <a className="button button--primary" href="#contact">
                Получить форму для объекта культуры
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
