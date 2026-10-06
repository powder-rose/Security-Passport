import Container from '../../../../components/ui/Container/Container';

import { scopeItems } from '../../actualizationPageData';

export default function ActualizationServiceScope() {
  return (
    <>
      <section className="actualization-scope">
        <Container>
          <div className="actualization-scope__layout">
            <div>
              <p className="actualization-kicker">Состав работы</p>

              <h2>Что мы сделаем</h2>

              <p>
                Состав действий определяем после проверки паспорта и требований к конкретному виду
                объекта.
              </p>
            </div>

            <ul className="actualization-scope__list">
              {scopeItems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>

                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
