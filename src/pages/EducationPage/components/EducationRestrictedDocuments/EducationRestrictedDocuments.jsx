import Container from "../../../../components/ui/Container/Container";

export default function EducationRestrictedDocuments() {
  return (
    <>
      <section className="education-restricted">
        <Container>
          <div className="education-restricted__layout">
            <div className="education-restricted__marker">ДСП</div>

            <div className="education-restricted__content">
              <p className="education-kicker">Ограниченное распространение</p>

              <h2>Можно ли публиковать паспорт образовательной организации</h2>

              <p className="education-restricted__lead">
                Для объектов по ПП РФ №1006 паспорт является документом со
                служебной информацией ограниченного распространения и имеет
                пометку «Для служебного пользования».
              </p>

              <div className="education-restricted__rule">
                <strong>
                  Поэтому реальный заполненный паспорт клиента не публикуем.
                </strong>

                <p>
                  Для ознакомления используем официальную форму, обезличенную
                  структуру документа и пояснения по заполнению.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
