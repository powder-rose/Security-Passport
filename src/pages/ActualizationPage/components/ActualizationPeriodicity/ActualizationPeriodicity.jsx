import Container from '../../../../components/ui/Container/Container';

import { periodicityItems } from '../../actualizationPageData';

export default function ActualizationPeriodicity() {
  return (
    <>
      <section className="actualization-periods">
        <Container>
          <div className="actualization-section-head">
            <p className="actualization-kicker">Периодичность</p>

            <h2>Как часто нужно актуализировать паспорт безопасности</h2>

            <p>
              Единого срока для всех паспортов безопасности нет. Периодичность устанавливается
              требованиями для конкретного вида объекта.
            </p>
          </div>

          <div className="actualization-periods__summary">
            <article>
              <strong>3 года</strong>

              <p>Такой срок предусмотрен для отдельных видов объектов.</p>
            </article>

            <article>
              <strong>5 лет</strong>

              <p>Для других видов объектов действует иная периодичность.</p>
            </article>

            <article>
              <strong>Внепланово</strong>

              <p>
                Актуализация также может требоваться при предусмотренных нормативными требованиями
                изменениях.
              </p>
            </article>
          </div>

          <div className="actualization-periods__list">
            {periodicityItems.map((item, index) => (
              <article className="actualization-period" key={item.type}>
                <span className="actualization-period__number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="actualization-period__name">
                  <h3>{item.type}</h3>

                  <p>{item.regulation}</p>
                </div>

                <strong>{item.period}</strong>

                <p className="actualization-period__description">{item.text}</p>
              </article>
            ))}
          </div>

          <p className="actualization-periods__note">
            Это не полный перечень видов объектов. Для гостиниц, объектов спорта, социальной защиты
            и других категорий применяются собственные требования, которые необходимо проверять
            отдельно.
          </p>
        </Container>
      </section>
    </>
  );
}
