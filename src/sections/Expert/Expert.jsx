import Container from '../../components/ui/Container/Container';
import './Expert.css';

const expertPoints = [
  {
    number: '01',
    title: 'Сначала определяем применимые требования',
    text: 'Не предлагаем типовой комплект вслепую: сначала проверяем назначение объекта, категорию, имеющиеся документы и нормативное основание.',
  },
  {
    number: '02',
    title: 'Документ должен работать на практике',
    text: 'Паспорт безопасности должен отражать реальное состояние объекта, действующие меры защиты и сведения, которые можно подтвердить при согласовании и проверке.',
  },
  {
    number: '03',
    title: 'Сопровождаем до результата',
    text: 'Помогаем пройти путь от сбора исходных данных и категорирования до подготовки документа и его дальнейшего согласования.',
  },
];

export default function Expert() {
  return (
    <section className="expert" id="expert" aria-labelledby="expert-title">
      <Container className="expert__layout">
        <figure className="expert__portrait">
          <div className="expert__portrait-surface" aria-hidden="true" />
          <div className="expert__portrait-orb" aria-hidden="true" />
          <div className="expert__portrait-grid" aria-hidden="true" />

          <img
            src="/images/nikolay-boykov-expert.webp"
            alt="Николай Бойков, руководитель БОЙКОВГРУПП"
            width="1649"
            height="2048"
            loading="lazy"
            decoding="async"
          />

          <figcaption className="expert__portrait-caption">
            <span>Эксперт проекта</span>
            <strong>Николай Бойков</strong>
          </figcaption>
        </figure>

        <div className="expert__content">
          <p className="expert__kicker">Эксперт БОЙКОВГРУПП</p>

          <h2 id="expert-title">
            Николай Бойков <em>о подходе к разработке</em>
          </h2>

          <blockquote className="expert__quote">
            <p>
              В паспорте безопасности важен не объём текста сам по себе, а соответствие документа
              конкретному объекту, его категории и фактическим мерам защиты.
            </p>
          </blockquote>

          <div className="expert__identity">
            <p className="expert__name">Николай Бойков</p>
            <p className="expert__role">Руководитель БОЙКОВГРУПП · эксперт по комплексной безопасности</p>
          </div>

          <ol className="expert__principles" aria-label="Принципы работы">
            {expertPoints.map((point) => (
              <li key={point.number}>
                <span className="expert__principle-number" aria-hidden="true">{point.number}</span>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <a className="expert__action" href="#contact">
            <span>Обсудить объект со специалистом</span>
            <span className="expert__action-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
