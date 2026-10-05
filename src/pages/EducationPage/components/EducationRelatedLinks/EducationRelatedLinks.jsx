import Container from "../../../../components/ui/Container/Container";

export default function EducationRelatedLinks() {
  return (
    <>
      <section className="education-related">
        <Container>
          <div className="education-related__header">
            <p className="education-kicker">Связанные материалы</p>

            <h2>Документы и этапы, связанные с паспортом</h2>
          </div>

          <nav
            className="education-related__links"
            aria-label="Связанные услуги"
          >
            <a href="/">
              <span>Паспорт безопасности объекта</span>

              <span aria-hidden="true">↗</span>
            </a>

            <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
              <span>Акт обследования и категорирования</span>

              <span aria-hidden="true">↗</span>
            </a>

            <a href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
              <span>Актуализация паспорта безопасности</span>

              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </Container>
      </section>
    </>
  );
}
