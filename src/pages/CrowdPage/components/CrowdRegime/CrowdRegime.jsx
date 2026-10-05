import Container from "../../../../components/ui/Container/Container";

export default function CrowdRegime() {
  return (
    <>
      <section className="crowd-regime">
        <Container>
          <div className="crowd-regime__layout">
            <div className="crowd-regime__identity">
              <p className="crowd-kicker">Ключевое различие</p>

              <span className="crowd-regime__mark">≠</span>
            </div>

            <div className="crowd-regime__content">
              <h2>
                «Место, где много людей» и ММПЛ по ПП РФ №272 — не всегда одно и
                то же
              </h2>

              <p className="crowd-regime__lead">
                По фактическому назначению место может напоминать торговый
                центр, гостиницу, площадь, парк, общественное пространство или
                культурную площадку.
              </p>

              <div className="crowd-regime__principle">
                <span>Принцип проверки</span>

                <p>
                  Если для конкретного объекта действуют специальные отраслевые
                  требования, ПП РФ №272 нельзя механически применять вместо
                  них.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
