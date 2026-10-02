import Container
from '../../../components/ui/Container/Container';


import {
  educationServiceItems,
} from '../educationPageData';



export default function EducationServiceScope() {
  return (
    <>
      <section className="education-service">
        <Container>
          <div className="education-service__heading">
            <p className="education-kicker">
              Что входит в работу
            </p>

            <h2>
              Разработка документов
              для образовательной организации
            </h2>

            <p>
              Состав работ определяется после
              проверки применимых требований
              и текущего состояния документов
              конкретного объекта.
            </p>
          </div>


          <div className="education-service__list">
            {educationServiceItems.map(
              (item) => (
                <article
                  className="education-service__item"
                  key={item.number}
                >
                  <span className="education-service__number">
                    {item.number}
                  </span>

                  <div>
                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.text}
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
