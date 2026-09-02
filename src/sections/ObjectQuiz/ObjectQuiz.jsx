import { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../components/ui/Container/Container';
import { SITE } from '../../config/site';
import { METRICA_GOALS, reachGoal } from '../../lib/analytics';
import { getLeadEndpoint, submitLead } from '../../lib/lead';
import {
  answerQuestion,
  completeQuiz,
  nextStep,
  previousStep,
  resetQuiz,
} from '../../features/quiz/quizSlice';
import { quizQuestions, quizResultPoints } from '../../features/quiz/quizData';
import './ObjectQuiz.css';

const emptyObject = {};

function ChoiceCards({ question, value, onChange }) {
  return (
    <fieldset className="quiz-options">
      <legend className="sr-only">{question.title}</legend>
      {question.options.map((option) => {
        const id = `${question.id}-${option.replace(/[^a-zа-яё0-9]+/gi, '-').toLowerCase()}`;
        const checked = value === option;

        return (
          <label className={`quiz-option${checked ? ' quiz-option--selected' : ''}`} key={option} htmlFor={id}>
            <input
              id={id}
              type="radio"
              name={question.id}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
            />
            <span className="quiz-option__indicator" aria-hidden="true" />
            <span>{option}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function TextField({ id, label, value = '', onChange, placeholder, type = 'text', required = false, inputMode, autoComplete }) {
  return (
    <label className="quiz-field" htmlFor={id}>
      <span className="quiz-field__label">
        {label}{required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <input
        id={id}
        type={type}
        name={id}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function StepFields({ question, answer, updateAnswer }) {
  if (question.type === 'choice' || question.type === 'choice-with-other') {
    const selected = typeof answer === 'string' ? answer : answer?.selected;
    const other = typeof answer === 'object' ? answer?.other ?? '' : '';

    const handleChoice = (option) => {
      if (question.type === 'choice-with-other') {
        updateAnswer({ selected: option, other: option === 'Другой тип объекта' ? other : '' });
      } else {
        updateAnswer(option);
      }
    };

    return (
      <>
        <ChoiceCards question={question} value={selected} onChange={handleChoice} />
        {question.type === 'choice-with-other' && selected === 'Другой тип объекта' ? (
          <TextField
            id="quiz-object-other"
            label="Укажите тип объекта"
            value={other}
            placeholder="Например, административное здание"
            onChange={(value) => updateAnswer({ selected, other: value })}
            required
          />
        ) : null}
      </>
    );
  }

  if (question.type === 'location') {
    return (
      <div className="quiz-fields-grid">
        <TextField
          id="quiz-region"
          label="Регион"
          value={answer?.region}
          placeholder="Например, Московская область"
          onChange={(value) => updateAnswer({ ...answer, region: value })}
          required
        />
        <TextField
          id="quiz-city"
          label="Населённый пункт"
          value={answer?.city}
          placeholder="Например, г. Химки"
          onChange={(value) => updateAnswer({ ...answer, city: value })}
          required
        />
      </div>
    );
  }

  if (question.type === 'metrics') {
    return (
      <div className="quiz-fields-grid">
        <TextField
          id="quiz-area"
          label="Площадь объекта, м²"
          value={answer?.area}
          placeholder="Например, 850"
          inputMode="numeric"
          onChange={(value) => updateAnswer({ ...answer, area: value.replace(/[^0-9., ]/g, '') })}
          required
        />
        <TextField
          id="quiz-people"
          label="Максимальное количество людей"
          value={answer?.people}
          placeholder="Например, 120"
          inputMode="numeric"
          onChange={(value) => updateAnswer({ ...answer, people: value.replace(/\D/g, '') })}
          required
        />
      </div>
    );
  }

  if (question.type === 'contact') {
    return (
      <div className="quiz-contact-fields">
        <div className="quiz-fields-grid">
          <TextField
            id="quiz-name"
            label="Ваше имя"
            value={answer?.name}
            placeholder="Как к вам обращаться"
            onChange={(value) => updateAnswer({ ...answer, name: value })}
            autoComplete="name"
            required
          />
          <TextField
            id="quiz-phone"
            label="Телефон"
            type="tel"
            value={answer?.phone}
            placeholder="+7 900 000-00-00"
            inputMode="tel"
            autoComplete="tel"
            onChange={(value) => updateAnswer({ ...answer, phone: value })}
            required
          />
          <TextField
            id="quiz-email"
            label="Электронная почта"
            type="email"
            value={answer?.email}
            placeholder="name@example.ru"
            autoComplete="email"
            onChange={(value) => updateAnswer({ ...answer, email: value })}
          />
          <TextField
            id="quiz-company"
            label="Название организации"
            value={answer?.company}
            placeholder="ООО «Название»"
            onChange={(value) => updateAnswer({ ...answer, company: value })}
          />
        </div>

        <label className="quiz-consent" htmlFor="quiz-consent">
          <input
            id="quiz-consent"
            type="checkbox"
            name="quiz-consent"
            checked={Boolean(answer?.consent)}
            onChange={(event) => updateAnswer({ ...answer, consent: event.target.checked })}
          />
          <span>
            Я соглашаюсь на обработку персональных данных и принимаю{' '}
            <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer">политику конфиденциальности</a>.
          </span>
        </label>
      </div>
    );
  }

  return null;
}

function isStepValid(question, answer) {
  if (question.type === 'choice') return Boolean(answer);
  if (question.type === 'choice-with-other') {
    if (!answer?.selected) return false;
    if (answer.selected === 'Другой тип объекта') return Boolean(answer.other?.trim());
    return true;
  }
  if (question.type === 'location') return Boolean(answer?.region?.trim() && answer?.city?.trim());
  if (question.type === 'metrics') return Boolean(answer?.area?.trim() && answer?.people?.trim());
  if (question.type === 'contact') {
    return Boolean(answer?.name?.trim() && answer?.phone?.trim() && answer?.consent);
  }
  return false;
}

export default function ObjectQuiz() {
  const dispatch = useDispatch();
  const { currentStep, answers, completed } = useSelector((state) => state.quiz);
  const [showError, setShowError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const quizStartedRef = useRef(false);
  const question = quizQuestions[currentStep];
  const answer = answers[question.id] ?? emptyObject;
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const isLastStep = currentStep === quizQuestions.length - 1;

  const valid = useMemo(() => isStepValid(question, answer), [question, answer]);

  const updateAnswer = (value) => {
    setShowError(false);
    setSubmitStatus('idle');
    setSubmitMessage('');

    if (!quizStartedRef.current) {
      quizStartedRef.current = true;
      reachGoal(METRICA_GOALS.quizStart, { step: currentStep + 1 });
    }
    dispatch(answerQuestion({ questionId: question.id, value }));
  };

  const handleNext = async () => {
    if (!valid || submitStatus === 'loading') {
      if (!valid) setShowError(true);
      return;
    }

    setShowError(false);
    reachGoal(METRICA_GOALS.quizStepCompleted, {
      step: currentStep + 1,
      question: question.id,
    });

    if (!isLastStep) {
      dispatch(nextStep());
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
    setShowError(false);
    dispatch(previousStep());
  };

  if (completed) {
    return (
      <section className="object-quiz object-quiz--complete" id="quiz" aria-labelledby="quiz-complete-title">
        <Container>
          <div className="quiz-complete">
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
    <section className="object-quiz" id="quiz" aria-labelledby="quiz-title">
      <Container className="object-quiz__layout">
        <header className="object-quiz__intro">
          <p className="quiz-kicker">Экспресс-проверка объекта</p>
          <h2 id="quiz-title">Нужен ли паспорт безопасности вашему объекту?</h2>
          <p>
            Ответьте на несколько вопросов. Мы предварительно определим возможное основание для
            разработки документов, состав работ, ориентировочные сроки и стоимость.
          </p>

          <aside className="quiz-result-note" aria-labelledby="quiz-result-note-title">
            <span className="quiz-result-note__number" aria-hidden="true">6</span>
            <div>
              <h3 id="quiz-result-note-title">Что определим после проверки</h3>
              <ul>
                {quizResultPoints.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </aside>
        </header>

        <div className="quiz-card">
          <div className="quiz-card__topline">
            <span>Проверка объекта</span>
            <span>Вопрос {currentStep + 1} из {quizQuestions.length}</span>
          </div>

          <div
            className="quiz-progress"
            role="progressbar"
            aria-valuemin="1"
            aria-valuemax={quizQuestions.length}
            aria-valuenow={currentStep + 1}
            aria-label={`Вопрос ${currentStep + 1} из ${quizQuestions.length}`}
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
              <span className="quiz-question__number" aria-hidden="true">{question.number}</span>
              <div className="quiz-question__copy">
                <h3>{question.title}</h3>
                <p>{question.description}</p>
              </div>
            </div>

            <StepFields question={question} answer={answer} updateAnswer={updateAnswer} />

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
                disabled={currentStep === 0}
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
