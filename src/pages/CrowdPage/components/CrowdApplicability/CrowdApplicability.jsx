import Container from "../../../../components/ui/Container/Container";

export default function CrowdApplicability() {
  return (
    <>
      <section className="crowd-applicability" id="applicability">
        <Container>
          <div className="crowd-applicability__heading">
            <div>
              <p className="crowd-kicker">Сначала — применимость требований</p>

              <h2>Что считается местом массового пребывания людей</h2>
            </div>

            <p>
              Для применения ПП РФ №272 недостаточно только факта высокой
              посещаемости. Сначала проверяется статус конкретного места и
              применимый к нему нормативный режим.
            </p>
          </div>

          <div className="crowd-applicability__layout">
            <div className="crowd-applicability__rules">
              <article className="crowd-applicability__rule">
                <span className="crowd-applicability__index">01</span>

                <div>
                  <h3>Более 50 человек — часть определения</h3>

                  <p>
                    Законодательное определение связывает ММПЛ с территорией или
                    местом общего пользования, где при определённых условиях
                    одновременно может находиться более 50 человек.
                  </p>
                </div>
              </article>

              <article className="crowd-applicability__rule">
                <span className="crowd-applicability__index">02</span>

                <div>
                  <h3>Место должно рассматриваться в установленном перечне</h3>

                  <p>
                    Перечень мест массового пребывания людей формируется
                    исполнительными органами субъекта РФ или органами местного
                    самоуправления по предусмотренной процедуре согласования.
                  </p>
                </div>
              </article>
            </div>

            <aside className="crowd-applicability__check">
              <span className="crowd-applicability__check-label">Важно</span>

              <h3>
                50 человек — не автоматическое основание для паспорта по №272
              </h3>

              <p>
                Сначала проверяем, включено ли конкретное место в перечень ММПЛ
                и какой нормативный режим распространяется на объект.
              </p>

              <a className="button button--primary" href="#lead-form">
                Проверить объект
              </a>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
