import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../components/ui/Container/Container';
import { SITE } from '../../config/site';
import { METRICA_GOALS, reachGoal } from '../../lib/analytics';
import { getLeadEndpoint, submitLead } from '../../lib/lead';
import {
  formatRussianPhone,
  normalizeGeoName,
  normalizeSettlementName,
  sanitizeEmailInput,
} from '../../lib/formInput';
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

function TextField({
  id,
  label,
  value = '',
  onChange,
  placeholder,
  type = 'text',
  required = false,
  inputMode,
  autoComplete,
  list,
  maxLength,
}) {
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
        list={list}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}


function sanitizeAreaInput(value) {
  let cleaned =
    String(value ?? '')
      .replace(/\s/g, '')
      .replace(/,/g, '.')
      .replace(/[^0-9.]/g, '');

  const firstDot =
    cleaned.indexOf('.');

  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned
        .slice(firstDot + 1)
        .replace(/\./g, '');
  }

  const [whole = '', decimal] =
    cleaned.split('.');

  const safeWhole =
    whole.slice(0, 8);

  if (decimal === undefined) {
    return safeWhole;
  }

  return (
    `${safeWhole}.${decimal.slice(0, 2)}`
  );
}

function StepFields({
  question,
  answer,
  updateAnswer,
  regionOptions = [],
  settlementOptions = [],
}) {
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
          list="quiz-region-options"
          autoComplete="off"
          onChange={(value) =>
            updateAnswer({
              ...answer,
              region: value,
              city:
                value === answer?.region
                  ? answer?.city ?? ''
                  : '',
            })
          }
          required
        />

        <datalist id="quiz-region-options">
          {regionOptions.map((region) => (
            <option
              key={region.name}
              value={region.name}
            />
          ))}
        </datalist>

        <TextField
          id="quiz-city"
          label="Населённый пункт"
          value={answer?.city}
          placeholder="Например, Химки"
          list="quiz-city-options"
          autoComplete="off"
          onChange={(value) =>
            updateAnswer({
              ...answer,
              city: value,
            })
          }
          required
        />

        <datalist id="quiz-city-options">
          {settlementOptions.map((settlement) => (
            <option
              key={`${settlement.type}-${settlement.name}`}
              value={settlement.name}
              label={
                settlement.type
                  ? `${settlement.type} ${settlement.name}`
                  : settlement.name
              }
            />
          ))}
        </datalist>
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
          onChange={(value) =>
            updateAnswer({
              ...answer,
              area: sanitizeAreaInput(value),
            })
          }
          required
        />
        <TextField
          id="quiz-people"
          label="Максимальное количество людей"
          value={answer?.people}
          placeholder="Например, 120"
          inputMode="numeric"
          onChange={(value) =>
            updateAnswer({
              ...answer,
              people: value
                .replace(/\D/g, '')
                .slice(0, 7),
            })
          }
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
            placeholder="+7 (900) 000-00-00"
            inputMode="numeric"
            autoComplete="tel"
            onChange={(value) =>
              updateAnswer({
                ...answer,
                phone: formatRussianPhone(value),
              })
            }
            required
          />
          <TextField
            id="quiz-email"
            label="Электронная почта"
            type="email"
            value={answer?.email}
            placeholder="name@example.ru"
            autoComplete="email"
            onChange={(value) =>
              updateAnswer({
                ...answer,
                email: sanitizeEmailInput(value),
              })
            }
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

export default function ObjectQuiz({
  presetObjectType = null,
}) {
  const dispatch = useDispatch();
  const { currentStep, answers, completed } = useSelector((state) => state.quiz);
  const [showError, setShowError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [geography, setGeography] = useState(null);
  const [geographyError, setGeographyError] = useState(false);
  const quizStartedRef = useRef(false);
  const quizCardRef = useRef(null);
  const quizCompleteRef = useRef(null);
  const question = quizQuestions[currentStep];
  const answer = answers[question.id] ?? emptyObject;

  useEffect(() => {
    let cancelled = false;

    fetch('/assets/quiz-geography-v1.json', {
      cache: 'force-cache',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Geography HTTP ${response.status}`,
          );
        }

        return response.json();
      })
      .then((data) => {
        if (
          cancelled ||
          !Array.isArray(data?.regions)
        ) {
          return;
        }

        setGeography(data);
        setGeographyError(false);
      })
      .catch(() => {
        if (!cancelled) {
          setGeographyError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const regionOptions =
    geography?.regions ?? [];

  const selectedGeoRegion = useMemo(() => {
    if (
      question.type !== 'location' ||
      !answer?.region
    ) {
      return null;
    }

    const target =
      normalizeGeoName(answer.region);

    return (
      regionOptions.find(
        (region) =>
          normalizeGeoName(region.name) ===
          target,
      ) ?? null
    );
  }, [
    question.type,
    answer?.region,
    regionOptions,
  ]);

  const settlementOptions =
    selectedGeoRegion?.settlements ?? [];

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
        isStepValid(
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

    if (question.type === 'location') {
      if (geographyError || !geography) {
        setShowError(true);
        setSubmitStatus('error');
        setSubmitMessage(
          'Не удалось загрузить справочник населённых пунктов. Обновите страницу и попробуйте ещё раз.',
        );
        return;
      }

      const regionTarget =
        normalizeGeoName(answer?.region);

      const region =
        geography.regions.find(
          (item) =>
            normalizeGeoName(item.name) ===
            regionTarget,
        );

      if (!region) {
        setShowError(true);
        setSubmitStatus('error');
        setSubmitMessage(
          'Выберите регион из списка.',
        );
        return;
      }

      const cityTarget =
        normalizeSettlementName(answer?.city);

      const cityExists =
        region.settlements.some(
          (settlement) =>
            normalizeGeoName(
              settlement.name,
            ) === cityTarget,
        );

      if (!cityExists) {
        setShowError(true);
        setSubmitStatus('error');
        setSubmitMessage(
          'Выберите существующий населённый пункт в выбранном регионе.',
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
      <section className="object-quiz object-quiz--complete" id="quiz" aria-labelledby="quiz-complete-title">
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

            <StepFields
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
