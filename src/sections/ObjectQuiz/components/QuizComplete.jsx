import Container from '../../../components/ui/Container/Container';

export default function QuizComplete({ sectionClassName, quizCompleteRef, onRestart }) {
  return (
    <section
      className={`${sectionClassName} object-quiz--complete`}
      id="quiz"
      aria-labelledby="quiz-complete-title"
    >
      <Container>
        <div className="quiz-complete" ref={quizCompleteRef}>
          <div className="quiz-complete__mark" aria-hidden="true">
            ✓
          </div>

          <p className="quiz-kicker">Экспресс-проверка заполнена</p>

          <h2 id="quiz-complete-title">Ответы отправлены специалисту</h2>

          <p>
            Ответы отправлены специалисту. Мы проверим сведения об объекте и свяжемся с вами по
            указанным контактам для уточнения деталей и предварительного заключения.
          </p>

          <button className="button button--primary" type="button" onClick={onRestart}>
            Пройти проверку заново
          </button>
        </div>
      </Container>
    </section>
  );
}
