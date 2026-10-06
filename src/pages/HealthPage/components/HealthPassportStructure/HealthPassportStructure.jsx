import Container from '../../../../components/ui/Container/Container';

export default function HealthPassportStructure() {
  return (
    <>
      <section className="health-form">
        <Container>
          <div className="health-form__layout">
            <div className="health-form__heading">
              <p className="health-kicker">Форма и содержание</p>

              <h2>Форма паспорта безопасности объекта здравоохранения</h2>

              <p>
                Официальная форма паспорта утверждена непосредственно Постановлением Правительства
                РФ №8.
              </p>

              <a className="button button--primary" href="#lead-form">
                Получить форму паспорта
              </a>
            </div>

            <div className="health-form__document">
              <div className="health-form__document-head">
                <span>Постановление Правительства РФ №8</span>

                <strong>Форма паспорта</strong>
              </div>

              <ol className="health-form__contents">
                <li>
                  <span>01</span>

                  <p>Общие сведения об объекте</p>
                </li>

                <li>
                  <span>02</span>

                  <p>Сведения о работниках и арендаторах</p>
                </li>

                <li>
                  <span>03</span>

                  <p>Потенциально опасные участки и критические элементы</p>
                </li>

                <li>
                  <span>04</span>

                  <p>Возможные последствия террористического акта</p>
                </li>

                <li>
                  <span>05</span>

                  <p>Силы и средства обеспечения защищённости</p>
                </li>

                <li>
                  <span>06</span>

                  <p>Инженерно-техническая и физическая защита</p>
                </li>

                <li>
                  <span>07</span>

                  <p>Меры пожарной безопасности</p>
                </li>

                <li>
                  <span>08</span>

                  <p>Выводы, рекомендации и дополнительная информация</p>
                </li>
              </ol>

              <aside className="health-form__attachments">
                <span>В приложениях</span>

                <p>В том числе планы объекта, схема охраны и акт обследования и категорирования.</p>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
