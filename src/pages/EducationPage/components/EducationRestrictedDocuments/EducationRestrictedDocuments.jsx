import Container from '../../../../components/ui/Container/Container';

export default function EducationRestrictedDocuments() {
  return (
    <>
      <section className="education-restricted">
        <Container>
          <div className="education-restricted__layout">
            <div className="education-restricted__marker">ДСП</div>

            <div className="education-restricted__content">
              <p className="education-kicker">Ограниченное распространение</p>

              <h3>Можно ли публиковать паспорт безопасности образовательной организации</h3>

              <p className="education-restricted__lead">
                Паспорта безопасности образовательных объектов, оформляемые по ПП РФ № 1006 и №
                1421, содержат служебную информацию ограниченного распространения.
              </p>

              <p className="education-restricted__lead">
                По ПП РФ № 1006 паспорт имеет пометку «Для служебного пользования».
              </p>

              <p className="education-restricted__lead">
                По ПП РФ № 1421 паспорт также имеет пометку «Для служебного пользования», если ему
                не присвоен гриф секретности.
              </p>

              <div className="education-restricted__rule">
                <strong>
                  Заполненные паспорта действующих объектов и содержащиеся в них защищаемые сведения
                  не размещаются в открытом доступе.
                </strong>

                <p>Для ознакомления используются официальные незаполненные формы документов.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
