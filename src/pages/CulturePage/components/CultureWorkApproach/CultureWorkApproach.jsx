import Container from "../../../../components/ui/Container/Container";

import { cultureWhyItems } from "../../culturePageData";

export default function CultureWorkApproach() {
  return (
    <>
      <section className="culture-why" id="culture-why">
        <Container>
          <div className="culture-why__header">
            <div>
              <p className="culture-kicker">Подход к работе</p>

              <h2>Почему БОЙКОВГРУПП</h2>
            </div>

            <p>
              Для объекта культуры важно правильно определить нормативный режим
              и последовательно пройти категорирование, оформление акта,
              разработку паспорта и предусмотренное согласование.
            </p>
          </div>

          <div className="culture-why__grid">
            {cultureWhyItems.map((item) => (
              <article className="culture-why__item" key={item.number}>
                <span>{item.number}</span>

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>

          <nav className="culture-why__links" aria-label="Связанные услуги">
            <a href="/">
              Паспорт безопасности объекта
              <span aria-hidden="true">↗</span>
            </a>

            <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
              Акт обследования и категорирования
              <span aria-hidden="true">↗</span>
            </a>

            <a href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
              Актуализация паспорта безопасности
              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </Container>
      </section>
    </>
  );
}
