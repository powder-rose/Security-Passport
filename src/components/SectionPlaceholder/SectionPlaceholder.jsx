import Container from '../ui/Container/Container';
import './SectionPlaceholder.css';

export default function SectionPlaceholder({ id, title, index }) {
  return (
    <section className="placeholder-section" id={id} aria-labelledby={`${id}-title`}>
      <Container className="placeholder-section__grid">
        <p className="placeholder-section__index" aria-hidden="true">{String(index).padStart(2, '0')}</p>
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>Секция подготовлена в структуре проекта и будет собрана поэтапно.</p>
        </div>
      </Container>
    </section>
  );
}
