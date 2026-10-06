import Container from '../../../../components/ui/Container/Container';

export default function HotelApproval() {
  return (
    <>
      <section className="hotel-approval" id="hotel-approval">
        <Container>
          <div className="hotel-approval__panel">
            <div className="hotel-approval__heading">
              <p className="hotel-kicker">Согласование</p>

              <h2>С кем согласовывается паспорт безопасности гостиницы</h2>

              <p>
                По действующей редакции требований паспорт составляется в трёх экземплярах, проходит
                предусмотренное согласование, после чего утверждается ответственным лицом.
              </p>
            </div>

            <div className="hotel-approval__scheme">
              <div className="hotel-approval__item">
                <span>01</span>

                <div>
                  <strong>Территориальный орган безопасности</strong>

                  <p>
                    Паспорт согласовывается с руководителем соответствующего территориального органа
                    безопасности или уполномоченным им лицом.
                  </p>
                </div>
              </div>

              <div className="hotel-approval__item">
                <span>02</span>

                <div>
                  <strong>Росгвардия</strong>

                  <p>
                    Также предусмотрено согласование с руководителем соответствующего
                    территориального органа Росгвардии или подразделения вневедомственной охраны.
                  </p>
                </div>
              </div>

              <div className="hotel-approval__item">
                <span>03</span>

                <div>
                  <strong>Утверждение</strong>

                  <p>
                    После предусмотренных согласований паспорт утверждается ответственным лицом.
                  </p>
                </div>
              </div>
            </div>

            <div className="hotel-approval__footer">
              <strong>3 экземпляра</strong>

              <p>
                Количество экземпляров установлено требованиями к паспорту безопасности гостиницы.
              </p>

              <a className="hotel-approval__action" href="#contact">
                Заказать разработку паспорта
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
