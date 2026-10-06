import Container from '../../../../components/ui/Container/Container';

import { checklistItems } from '../../actualizationPageData';

export default function ActualizationChecklist() {
  return (
    <>
      <section className="actualization-checklist">
        <Container>
          <div className="actualization-checklist__layout">
            <div>
              <p className="actualization-kicker">Быстрая самопроверка</p>

              <h2>Как понять, нужно ли актуализировать ваш паспорт</h2>

              <p>
                Проверьте документ, если после его разработки произошло хотя бы одно из
                перечисленных изменений.
              </p>

              <a className="button button--primary actualization-check-button" href="#lead-form">
                <span className="actualization-check-button__label">
                  Отправить паспорт на проверку
                </span>

                <span className="actualization-check-button__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>

            <ul className="actualization-checklist__items">
              {checklistItems.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>

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
