import Container from "../../../../components/ui/Container/Container";

export default function SportRelatedLinks() {
  return (
    <>
      <section className="sport-related">
        <Container>
          <div className="sport-related__heading">
            <p className="sport-kicker">Связанные материалы</p>

            <h2>Документы и этапы, связанные с паспортом</h2>
          </div>

          <nav className="sport-related__links" aria-label="Связанные страницы">
            <a href="/">
              <div>
                <span>01</span>

                <strong>Паспорт безопасности объекта</strong>
              </div>

              <span aria-hidden="true">↗</span>
            </a>

            <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
              <div>
                <span>02</span>

                <strong>Акт обследования и категорирования</strong>
              </div>

              <span aria-hidden="true">↗</span>
            </a>

            <a href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
              <div>
                <span>03</span>

                <strong>Актуализация паспорта безопасности</strong>
              </div>

              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </Container>
      </section>
    </>
  );
}
