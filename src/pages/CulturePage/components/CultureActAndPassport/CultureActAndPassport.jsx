import Container from '../../../../components/ui/Container/Container';

import { culturePassportProcess } from '../../culturePageData';

export default function CultureActAndPassport() {
  return (
    <>
      <section className="culture-act" id="culture-act">
        <Container>
          <div className="culture-act__panel">
            <div className="culture-act__identity">
              <p className="culture-kicker">Результат категорирования</p>

              <span className="culture-act__big-number">2</span>

              <strong>экземпляра акта</strong>
            </div>

            <div className="culture-act__content">
              <div className="culture-act__heading">
                <h2>Акт обследования и категорирования объекта культуры</h2>

                <p>
                  Результаты работы комиссии оформляются актом обследования и категорирования
                  объекта или территории.
                </p>
              </div>

              <div className="culture-act__facts">
                <div>
                  <span>01</span>

                  <p>Акт является неотъемлемой частью паспорта безопасности.</p>
                </div>

                <div>
                  <span>02</span>

                  <p>Документ составляется в двух экземплярах.</p>
                </div>

                <div>
                  <span>03</span>

                  <p>Акт подписывается всеми членами комиссии.</p>
                </div>
              </div>

              <div className="culture-act__actions">
                <a className="button button--primary" href="#contact">
                  Заказать акт категорирования
                </a>

                <a
                  className="culture-act__link"
                  href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
                >
                  Страница услуги
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="culture-passport" id="culture-passport">
        <Container>
          <div className="culture-passport__header">
            <div>
              <p className="culture-kicker">Разработка документа</p>

              <h2>Порядок разработки паспорта безопасности объекта культуры</h2>
            </div>

            <div className="culture-passport__summary">
              <p>
                На каждый объект или территорию, подпадающие под требования ПП РФ №176, составляется
                паспорт безопасности.
              </p>

              <div className="culture-passport__copies">
                <strong>2</strong>

                <span>экземпляра паспорта</span>
              </div>
            </div>
          </div>

          <div className="culture-passport__process">
            <div className="culture-passport__process-head">
              <span>Этап</span>

              <span>Что происходит</span>

              <span>Результат</span>
            </div>

            <ol>
              {culturePassportProcess.map(item => (
                <li key={item.number}>
                  <span className="culture-passport__number">{item.number}</span>

                  <strong>{item.stage}</strong>

                  <p>{item.result}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="culture-passport__legal-note">
            <span aria-hidden="true">✓</span>

            <p>
              Паспорт составляется комиссией в двух экземплярах, подписывается членами комиссии и
              утверждается руководителем организации в сфере культуры — правообладателем объекта.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
