import Container from '../../components/ui/Container/Container';
import { ObjectTypeIllustration, ShieldBuildingIllustration } from '../../components/illustrations/BlushIllustrations';
import { objectTypes } from '../../data/objectTypes';
import './WhoNeedsPassport.css';

function ObjectTypeCard({ item, featured = false }) {
  return (
    <article className={`object-type-card${featured ? ' object-type-card--featured' : ''}`}>
      <div className="object-type-card__illustration">
        <ObjectTypeIllustration variant={item.id} title={item.title} />
      </div>
      <div className="object-type-card__content">
        <span className="object-type-card__accent">{item.accent}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

export default function WhoNeedsPassport() {
  return (
    <section className="who-needs-passport" id="objects" aria-labelledby="who-needs-passport-title">
      <Container>
        <div className="who-needs-passport__heading">
          <div>
            <p className="who-needs-passport__kicker">Кому требуется документ</p>
            <h2 id="who-needs-passport-title">
              Когда паспорт безопасности нужен <em>объекту</em>
            </h2>
          </div>

          <div className="who-needs-passport__intro-card">
            <div className="who-needs-passport__intro-illustration" aria-hidden="true">
              <ShieldBuildingIllustration />
            </div>
            <div>
              <p className="who-needs-passport__intro-label">Иллюстративный обзор</p>
              <p>
                Ниже — типовые категории объектов, для которых вопрос категорирования и разработки
                паспорта встречается чаще всего. Точный состав документов зависит от категории
                объекта и применимого постановления.
              </p>
            </div>
          </div>
        </div>

        <div className="who-needs-passport__grid">
          {objectTypes.map((item, index) => (
            <ObjectTypeCard key={item.id} item={item} featured={index === 0 || index === 5} />
          ))}
        </div>

        <aside className="who-needs-passport__note" aria-label="Дополнительная информация о типах объектов">
          <div className="who-needs-passport__note-copy">
            <p className="who-needs-passport__note-kicker">Если вашего объекта нет в списке</p>
            <h3>Проверим основание для категорирования индивидуально</h3>
            <p>
              Для нестандартных объектов анализируем профиль деятельности, посещаемость,
              функциональное назначение здания и применимые нормативные акты. После этого можно
              определить, требуется ли акт категорирования, паспорт безопасности или оба документа.
            </p>
          </div>
          <a className="button button--primary individual-check__button" href="#contact">
            <span className="individual-check__button-label">Получить консультацию</span>
            <span className="individual-check__button-icon" aria-hidden="true">↗</span>
          </a>
        </aside>
      </Container>
    </section>
  );
}
