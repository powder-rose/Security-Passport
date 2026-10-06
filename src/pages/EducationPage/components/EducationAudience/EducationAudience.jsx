import Container from '../../../../components/ui/Container/Container';

import { educationAudienceItems } from '../../educationPageData';

export default function EducationAudience() {
  return (
    <>
      <section className="education-audience">
        <Container>
          <div className="education-audience__header">
            <div>
              <p className="education-kicker">Образовательные объекты</p>

              <h2>Паспорт безопасности школы и детского сада</h2>
            </div>

            <p>
              Для школы, детского сада, колледжа и иной образовательной организации сначала
              определяется нормативный режим конкретного объекта, после чего проводится
              категорирование и оформляется предусмотренный комплект документов.
            </p>
          </div>

          <div className="education-audience__list">
            {educationAudienceItems.map(item => (
              <article className="education-audience__item" key={item.number}>
                <span>{item.number}</span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
