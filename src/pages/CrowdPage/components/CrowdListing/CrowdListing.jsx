import Container from "../../../../components/ui/Container/Container";

export default function CrowdListing() {
  return (
    <>
      <section className="crowd-listing">
        <Container>
          <div className="crowd-listing__heading">
            <div>
              <p className="crowd-kicker">Перечень ММПЛ</p>

              <h2>Как место включается в перечень</h2>
            </div>

            <p>
              Перечень формируется исполнительными органами субъекта РФ или
              органами местного самоуправления по установленной процедуре.
            </p>
          </div>

          <div className="crowd-listing__flow">
            <div className="crowd-listing__step">
              <span>01</span>

              <div>
                <h3>Формирование перечня</h3>

                <p>
                  Решение принимается уполномоченным исполнительным органом
                  субъекта РФ либо органом местного самоуправления.
                </p>
              </div>
            </div>

            <div className="crowd-listing__step">
              <span>02</span>

              <div>
                <h3>Согласование</h3>

                <p>
                  Перечень согласовывается с предусмотренными территориальными
                  органами.
                </p>
              </div>
            </div>

            <div className="crowd-listing__step">
              <span>03</span>

              <div>
                <h3>Работа с конкретным местом</h3>

                <p>
                  После определения применимости требований проводится
                  обследование и категорирование конкретного ММПЛ.
                </p>
              </div>
            </div>
          </div>

          <div className="crowd-listing__authorities">
            <span>Территориальный орган безопасности</span>

            <span>МВД России</span>

            <span>Росгвардия</span>

            <span>МЧС России</span>
          </div>
        </Container>
      </section>
    </>
  );
}
