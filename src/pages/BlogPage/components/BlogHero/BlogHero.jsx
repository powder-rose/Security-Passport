import Container from "../../../../components/ui/Container/Container.jsx";

export default function BlogHero() {
  return (
    <>
      <section className="blog-hero">
        <Container>
          <div className="blog-hero__eyebrow">
            <span>БАЗА ЗНАНИЙ</span>

            <span>БОЙКОВГРУПП</span>
          </div>

          <div className="blog-hero__grid">
            <h1>
              Статьи о
              <br />
              безопасности
              <br />
              объектов
            </h1>

            <aside className="blog-hero__aside" aria-label="О блоге">
              <div className="blog-hero__aside-label">О блоге</div>

              <p>
                Блог <strong>Николая Бойкова</strong>, эксперта по безопасности
                объектов. Практические разборы требований, категорирования,
                паспортов безопасности и подготовки документов.
              </p>

              <div className="blog-hero__tags">
                <span>Практика</span>

                <span>Требования</span>

                <span>Документы</span>
              </div>

              <a href="#blog-categories" className="blog-hero__aside-link">
                Выбрать тему
                <span aria-hidden="true">↓</span>
              </a>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
