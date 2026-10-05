import Container from "../../../../components/ui/Container/Container";

import { approvalAuthorities } from "../../educationPageData";

export default function EducationApproval() {
  return (
    <>
      <section className="education-approval">
        <Container>
          <div className="education-approval__layout">
            <div className="education-approval__heading">
              <p className="education-kicker">Согласование по №1006</p>

              <h2>С кем согласовывается паспорт образовательной организации</h2>

              <p>
                По ПП РФ №1006 паспорт подписывает лицо, непосредственно
                руководящее деятельностью работников на объекте. После этого
                документ проходит установленное согласование.
              </p>
            </div>

            <div className="education-approval__content">
              <div className="education-approval__authorities">
                {approvalAuthorities.map((item) => (
                  <article
                    className="education-approval__authority"
                    key={item.number}
                  >
                    <span>{item.number}</span>

                    <h3>{item.title}</h3>
                  </article>
                ))}
              </div>

              <div className="education-approval__timing">
                <div>
                  <span>Общий срок согласования</span>

                  <strong>не более 45 рабочих дней</strong>

                  <p>Со дня подписания паспорта.</p>
                </div>

                <div>
                  <span>Рассмотрение каждым органом</span>

                  <strong>не более 10 дней</strong>

                  <p>С момента поступления документа.</p>
                </div>
              </div>

              <div className="education-approval__finish">
                <span>После согласования</span>

                <p>
                  Паспорт утверждает руководитель организации-правообладателя
                  либо уполномоченное лицо.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
