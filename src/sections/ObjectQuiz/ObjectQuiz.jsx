import Container from '../../components/ui/Container/Container';
import { quizResultPoints } from '../../features/quiz/quizData';

import QuizStepFields
from './components/QuizStepFields';

import useQuizGeography
from './useQuizGeography';

import useQuizNavigation
from './useQuizNavigation';

import useQuizSubmission
from './useQuizSubmission';

import './ObjectQuiz.css';

export default function ObjectQuiz({
  presetObjectType = null,
  variant = 'default',
  preview = false,
}) {
  const sectionClassName =
    variant === 'article'
      ? 'object-quiz object-quiz--article'
      : 'object-quiz';

  const {
    currentStep,
    answers,
    completed,

    question,
    answer,

    hasPresetObjectType,
    visibleTotal,
    visibleStep,
    progress,
    displayQuestionNumber,
    isLastStep,

    quizCardRef,
    quizCompleteRef,

    updateCurrentAnswer,
    goForward,
    goBack,
    markCompleted,
    restartQuiz,
  } =
    useQuizNavigation({
      presetObjectType,
    });


  const {
    regionOptions,
    settlementOptions,
    validateLocation,
  } =
    useQuizGeography({
      questionType:
        question.type,

      regionValue:
        answer?.region,
    });

  const {
    showError,
    submitStatus,
    submitMessage,

    updateAnswer,
    handleNext,
    clearStepError,
  } =
    useQuizSubmission({
      question,
      answer,
      answers,
      visibleStep,
      isLastStep,
      preview,
      validateLocation,
      updateCurrentAnswer,
      goForward,
      markCompleted,
    });


  const handleBack = () => {
    if (goBack()) {
      clearStepError();
    }
  };

  if (completed) {
    return (
      <section className={`${sectionClassName} object-quiz--complete`} id="quiz" aria-labelledby="quiz-complete-title">
        <Container>
          <div className="quiz-complete" ref={quizCompleteRef}>
            <div className="quiz-complete__mark" aria-hidden="true">✓</div>
            <p className="quiz-kicker">Экспресс-проверка заполнена</p>
            <h2 id="quiz-complete-title">Ответы отправлены специалисту</h2>
            <p>
              Ответы отправлены специалисту. Мы проверим сведения об объекте и свяжемся с вами
              по указанным контактам для уточнения деталей и предварительного заключения.
            </p>
            <button className="button button--primary" type="button" onClick={restartQuiz}>
              Пройти проверку заново
            </button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={sectionClassName} id="quiz" aria-labelledby="quiz-title">
      <Container className="object-quiz__layout">
        <header className="object-quiz__intro">
          <p className="quiz-kicker">Экспресс-проверка объекта</p>
          <h2 id="quiz-title">Нужен ли паспорт безопасности вашему объекту?</h2>
          <p>
            Ответьте на несколько вопросов. Мы предварительно определим возможное основание для
            разработки документов, состав работ, ориентировочные сроки и стоимость.
          </p>

          <aside className="quiz-result-note" aria-labelledby="quiz-result-note-title">
            <span className="quiz-result-note__number" aria-hidden="true">
              {visibleTotal}
            </span>
            <div>
              <h3 id="quiz-result-note-title">Что определим после проверки</h3>
              <ul>
                {quizResultPoints.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </aside>
        </header>

        <div className="quiz-card" ref={quizCardRef}>
          <div className="quiz-card__topline">
            <span>Проверка объекта</span>
            <span>
              Вопрос {visibleStep} из {visibleTotal}
            </span>
          </div>

          <div
            className="quiz-progress"
            role="progressbar"
            aria-valuemin="1"
            aria-valuemax={visibleTotal}
            aria-valuenow={visibleStep}
            aria-label={`Вопрос ${visibleStep} из ${visibleTotal}`}
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <form
            className="quiz-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleNext();
            }}
            noValidate
          >
            <div className="quiz-question" key={question.id}>
              <span
                className="quiz-question__number"
                aria-hidden="true"
              >
                {displayQuestionNumber}
              </span>
              <div className="quiz-question__copy">
                <h3>{question.title}</h3>
                <p>{question.description}</p>
              </div>
            </div>

            <QuizStepFields
              question={question}
              answer={answer}
              updateAnswer={updateAnswer}
              regionOptions={regionOptions}
              settlementOptions={settlementOptions}
            />

            {showError ? (
              <p className="quiz-error" role="alert">
                Заполните обязательные поля текущего шага.
              </p>
            ) : null}

            {submitMessage ? (
              <p
                className={`quiz-error quiz-submit-status quiz-submit-status--${submitStatus}`}
                role={submitStatus === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {submitMessage}
              </p>
            ) : null}

            <div className="quiz-controls">
              <button
                className="quiz-back"
                type="button"
                onClick={handleBack}
                disabled={
                  hasPresetObjectType
                    ? currentStep <= 1
                    : currentStep === 0
                }
              >
                ← Назад
              </button>
              <button
                className="button button--primary quiz-next"
                type="submit"
                disabled={submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? 'Отправляем…' : isLastStep ? 'Отправить специалисту' : 'Продолжить'}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
