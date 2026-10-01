import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../components/ui/Container/Container';
import { SITE } from '../../config/site';
import { METRICA_GOALS, reachGoal } from '../../lib/analytics';
import { getLeadEndpoint, submitLead } from '../../lib/lead';
import {
  quizContactSchema,
  quizLocationSchema,
  quizMetricsSchema,
} from '../../lib/validation/leadValidation';
import {
  answerQuestion,
  completeQuiz,
  goToStep,
  nextStep,
  previousStep,
  resetQuiz,
} from '../../features/quiz/quizSlice';
import { quizQuestions, quizResultPoints } from '../../features/quiz/quizData';

import QuizStepFields
from './components/QuizStepFields';

import {
  isQuizStepValid,
} from './quizStepValidation';

import useQuizGeography
from './useQuizGeography';

import './ObjectQuiz.css';

const emptyObject = {};

export default function ObjectQuiz({
  presetObjectType = null,
  variant = 'default',
  preview = false,
}) {
  const sectionClassName =
    variant === 'article'
      ? 'object-quiz object-quiz--article'
      : 'object-quiz';

  const dispatch = useDispatch();
  const { currentStep, answers, completed } = useSelector((state) => state.quiz);
  const [showError, setShowError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const quizStartedRef = useRef(false);
  const quizCardRef = useRef(null);
  const quizCompleteRef = useRef(null);
  const question = quizQuestions[currentStep];
  const answer = answers[question.id] ?? emptyObject;

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

  const hasPresetObjectType =
    Boolean(
      presetObjectType,
    );

  const visibleTotal =
    hasPresetObjectType
      ? quizQuestions.length - 1
      : quizQuestions.length;

  const visibleStep =
    hasPresetObjectType
      ? Math.max(
          1,
          currentStep,
        )
      : currentStep + 1;

  const progress =
    (
      visibleStep /
      visibleTotal
    ) * 100;

  const displayQuestionNumber =
    hasPresetObjectType
      ? String(
          visibleStep,
        ).padStart(
          2,
          '0',
        )
      : question.number;

  const isLastStep =
    currentStep ===
    quizQuestions.length - 1;

  const valid =
    useMemo(
      () =>
        isQuizStepValid(
          question,
          answer,
        ),
      [
        question,
        answer,
      ],
    );

  useEffect(() => {
    if (!hasPresetObjectType) {
      return;
    }

    const existingObjectType =
      answers.objectType;

    const existingSelected =
      typeof existingObjectType === 'string'
        ? existingObjectType
        : existingObjectType?.selected;

    if (
      existingSelected !==
      presetObjectType
    ) {
      dispatch(
        answerQuestion({
          questionId:
            'objectType',

          value: {
            selected:
              presetObjectType,

            other:
              '',
          },
        }),
      );
    }

    if (currentStep === 0) {
      dispatch(
        goToStep(1),
      );
    }
  }, [
    answers.objectType,
    currentStep,
    dispatch,
    hasPresetObjectType,
    presetObjectType,
  ]);


  useEffect(() => {
    if (
      !completed ||
      typeof window === 'undefined' ||
      !window.matchMedia('(max-width: 768px)').matches
    ) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const completeBlock = quizCompleteRef.current;

      if (!completeBlock) return;

      const top =
        completeBlock.getBoundingClientRect().top +
        window.scrollY -
        96;

      window.scrollTo(
        0,
        Math.max(0, top),
      );
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [completed]);

  const scrollToCurrentQuestion = () => {
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(max-width: 768px)').matches
    ) {
      return;
    }

    window.requestAnimationFrame(() => {
      const card = quizCardRef.current;

      if (!card) return;

      const top =
        card.getBoundingClientRect().top +
        window.scrollY -
        96;

      window.scrollTo(
        0,
        Math.max(0, top),
      );
    });
  };

  const updateAnswer = (value) => {
    setShowError(false);
    setSubmitStatus('idle');
    setSubmitMessage('');

    if (!quizStartedRef.current) {
      quizStartedRef.current = true;
      reachGoal(METRICA_GOALS.quizStart, { step: visibleStep });
    }
    dispatch(answerQuestion({ questionId: question.id, value }));
  };

  const handleNext = async () => {
    if (!valid || submitStatus === 'loading') {
      if (!valid) setShowError(true);
      return;
    }

    const validationSchema =
      question.type === 'location'
        ? quizLocationSchema
        : question.type === 'metrics'
          ? quizMetricsSchema
          : question.type === 'contact'
            ? quizContactSchema
            : null;

    if (validationSchema) {
      try {
        await validationSchema.validate(answer, {
          abortEarly: false,
        });
      } catch (error) {
        setShowError(true);
        setSubmitStatus('error');
        setSubmitMessage(
          error?.errors?.[0] ||
            'Проверьте правильность заполнения данных.',
        );
        return;
      }
    }

    if (
      question.type ===
      'location'
    ) {
      const locationError =
        validateLocation(
          answer,
        );

      if (locationError) {
        setShowError(
          true,
        );

        setSubmitStatus(
          'error',
        );

        setSubmitMessage(
          locationError,
        );

        return;
      }
    }

    setShowError(false);
    reachGoal(METRICA_GOALS.quizStepCompleted, {
      step: visibleStep,
      question: question.id,
    });

    if (!isLastStep) {
      dispatch(nextStep());
      scrollToCurrentQuestion();
      return;
    }

    if (preview) {
      setSubmitStatus('notice');
      setSubmitMessage(
        'Режим предпросмотра: ответы заполнены корректно, но заявка не отправлена.'
      );
      return;
    }

    const endpoint = getLeadEndpoint();
    if (!endpoint) {
      setSubmitStatus('notice');
      setSubmitMessage(
        `Онлайн-отправка пока не подключена. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`,
      );
      return;
    }

    try {
      setSubmitStatus('loading');
      setSubmitMessage('Отправляем ответы специалисту…');

      await submitLead({
        source: 'passport-security-quiz',
        data: { answers },
      });

      reachGoal(METRICA_GOALS.quizSubmitSuccess, { source: 'object_quiz' });
      dispatch(completeQuiz());
    } catch (error) {
      reachGoal(METRICA_GOALS.quizSubmitError, {
        source: 'object_quiz',
        reason: error?.name === 'AbortError' ? 'timeout' : 'request_error',
      });
      setSubmitStatus('error');
      setSubmitMessage(
        `Не удалось отправить ответы. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`,
      );
    }
  };

  const handleBack = () => {
    if (
      hasPresetObjectType &&
      currentStep <= 1
    ) {
      return;
    }

    setShowError(false);
    dispatch(previousStep());
    scrollToCurrentQuestion();
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
            <button className="button button--primary" type="button" onClick={() => dispatch(resetQuiz())}>
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
