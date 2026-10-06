import Container from '../../../../components/ui/Container/Container';

export default function HealthRestrictedDocuments() {
  return (
    <>
      <section className="health-restricted">
        <Container>
          <div className="health-restricted__layout">
            <div className="health-restricted__identity">
              <p className="health-kicker">Режим документа</p>

              <strong>ДСП</strong>

              <span>Для служебного пользования</span>
            </div>

            <div className="health-restricted__content">
              <h2>Можно ли публиковать паспорт медицинского объекта</h2>

              <p className="health-restricted__lead">
                Паспорт безопасности содержит служебную информацию ограниченного распространения и
                имеет пометку «Для служебного пользования», если ему не присвоен гриф секретности.
              </p>

              <div className="health-restricted__rules">
                <div className="health-restricted__rule">
                  <span className="health-restricted__sign">+</span>

                  <div>
                    <strong>Можно показывать</strong>

                    <ul>
                      <li>официальную форму паспорта</li>

                      <li>структуру документа</li>

                      <li>обезличенный пример можно подготовить</li>
                    </ul>
                  </div>
                </div>

                <div
                  className="
                    health-restricted__rule
                    health-restricted__rule--private
                  "
                >
                  <span className="health-restricted__sign">—</span>

                  <div>
                    <strong>Не публикуем</strong>

                    <p>
                      Реальный заполненный паспорт больницы, поликлиники или иного медицинского
                      объекта, содержащий сведения о его защищённости.
                    </p>
                  </div>
                </div>
              </div>

              <aside className="health-restricted__act-note">
                <span>Акт</span>

                <p>
                  Сведения о состоянии антитеррористической защищённости и принимаемых мерах,
                  содержащиеся в материалах акта обследования и категорирования, также относятся к
                  служебной информации ограниченного распространения.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
