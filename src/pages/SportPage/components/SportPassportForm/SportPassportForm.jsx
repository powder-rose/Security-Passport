import Container from "../../../../components/ui/Container/Container";

export default function SportPassportForm() {
  return (
    <>
      <section className="sport-form">
        <Container>
          <div className="sport-form__layout">
            <div className="sport-form__content">
              <p className="sport-kicker">Форма и образец</p>

              <h2>Форма паспорта безопасности объекта спорта</h2>

              <p className="sport-form__lead">
                ПП РФ №202 непосредственно утверждает официальную форму паспорта
                безопасности объекта спорта.
              </p>

              <div className="sport-form__structure">
                <div>
                  <span>01</span>

                  <p>Общие сведения об объекте</p>
                </div>

                <div>
                  <span>02</span>

                  <p>Вид объекта спорта</p>
                </div>

                <div>
                  <span>03</span>

                  <p>Категория опасности</p>
                </div>

                <div>
                  <span>04</span>

                  <p>Сведения о собственнике или законном пользователе</p>
                </div>

                <div>
                  <span>05</span>

                  <p>Количество посетителей</p>
                </div>

                <div>
                  <span>06</span>

                  <p>Количество зрительских мест</p>
                </div>
              </div>

              <p className="sport-form__after">
                Далее форма предусматривает сведения, необходимые для оценки
                антитеррористической защищённости объекта.
              </p>

              <a className="button button--primary" href="#lead-form">
                Получить форму паспорта объекта спорта
              </a>
            </div>

            <aside className="sport-form__document">
              <div className="sport-form__document-top">
                <span>ПП РФ №202</span>

                <span>Форма</span>
              </div>

              <div className="sport-form__document-title">
                <small>Паспорт безопасности</small>

                <strong>объекта спорта</strong>
              </div>

              <div className="sport-form__document-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="sport-form__document-note">
                <span>ДСП</span>

                <p>
                  На сайте используем официальную форму или обезличенную
                  структуру, а не заполненный паспорт действующего объекта.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
