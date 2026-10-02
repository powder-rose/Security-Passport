import Container
from '../../../components/ui/Container/Container';


export default function SportRestrictedDocuments() {
  return (
    <>
      <section className="sport-dsp">
        <Container>
          <div className="sport-dsp__layout">
            <div className="sport-dsp__label">
              <span>
                ДСП
              </span>

              <small>
                Для служебного пользования
              </small>
            </div>


            <div className="sport-dsp__content">
              <p className="sport-kicker">
                Работа с документом
              </p>

              <h2>
                Можно ли публиковать паспорт
                объекта спорта
              </h2>

              <p className="sport-dsp__lead">
                Паспорт объекта спорта содержит
                служебную информацию ограниченного
                распространения и имеет пометку
                «Для служебного пользования».
              </p>


              <div className="sport-dsp__rules">
                <article className="sport-dsp__rule">
                  <span className="sport-dsp__rule-sign sport-dsp__rule-sign--yes">
                    ✓
                  </span>

                  <div>
                    <h3>
                      Официальная форма
                    </h3>

                    <p>
                      На сайте можно показывать
                      официальную форму паспорта.
                    </p>
                  </div>
                </article>


                <article className="sport-dsp__rule">
                  <span className="sport-dsp__rule-sign sport-dsp__rule-sign--yes">
                    ✓
                  </span>

                  <div>
                    <h3>
                      Обезличенная структура
                    </h3>

                    <p>
                      Можно использовать обезличенный
                      пример структуры документа.
                    </p>
                  </div>
                </article>


                <article className="sport-dsp__rule sport-dsp__rule--restricted">
                  <span className="sport-dsp__rule-sign">
                    —
                  </span>

                  <div>
                    <h3>
                      Заполненный паспорт объекта
                    </h3>

                    <p>
                      Реальный заполненный паспорт
                      действующего спортивного объекта
                      на сайте не публикуем.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
