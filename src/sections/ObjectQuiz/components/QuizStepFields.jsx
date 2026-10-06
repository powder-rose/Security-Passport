import { SITE } from '../../../config/site';

import { formatRussianPhone, sanitizeEmailInput } from '../../../lib/formInput';

function ChoiceCards({ question, value, onChange }) {
  return (
    <fieldset className="quiz-options">
      <legend className="quiz-sr-only">{question.title}</legend>
      {question.options.map(option => {
        const id = `${question.id}-${option.replace(/[^a-zа-яё0-9]+/gi, '-').toLowerCase()}`;
        const checked = value === option;

        return (
          <label
            className={`quiz-option${checked ? ' quiz-option--selected' : ''}`}
            key={option}
            htmlFor={id}
          >
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
  onBlur,
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
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
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
        onChange={event => onChange(event.target.value)}
        onBlur={onBlur ? event => onBlur(event.target.value) : undefined}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function sanitizeAreaInput(value) {
  let cleaned = String(value ?? '')
    .replace(/\s/g, '')
    .replace(/,/g, '.')
    .replace(/[^0-9.]/g, '');

  const firstDot = cleaned.indexOf('.');

  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
  }

  const [whole = '', decimal] = cleaned.split('.');

  const safeWhole = whole.slice(0, 8);

  if (decimal === undefined) {
    return safeWhole;
  }

  return `${safeWhole}.${decimal.slice(0, 2)}`;
}

export default function QuizStepFields({
  question,
  answer,
  updateAnswer,
  regionOptions = [],
  settlementOptions = [],
}) {
  if (question.type === 'choice' || question.type === 'choice-with-other') {
    const selected = typeof answer === 'string' ? answer : answer?.selected;
    const other = typeof answer === 'object' ? (answer?.other ?? '') : '';

    const handleChoice = option => {
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
            onChange={value => updateAnswer({ selected, other: value })}
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
          onChange={value =>
            updateAnswer({
              ...answer,
              region: value,
              city: value === answer?.region ? (answer?.city ?? '') : '',
            })
          }
        />

        <datalist id="quiz-region-options">
          {regionOptions.map(region => (
            <option key={region.name} value={region.name} />
          ))}
        </datalist>

        <TextField
          id="quiz-city"
          label="Населённый пункт"
          value={answer?.city}
          placeholder="Например, Химки"
          list="quiz-city-options"
          autoComplete="off"
          onChange={value =>
            updateAnswer({
              ...answer,
              city: value,
            })
          }
        />

        <datalist id="quiz-city-options">
          {settlementOptions.map(settlement => (
            <option
              key={`${settlement.type}-${settlement.name}`}
              value={settlement.name}
              label={settlement.type ? `${settlement.type} ${settlement.name}` : settlement.name}
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
          onChange={value =>
            updateAnswer({
              ...answer,
              area: sanitizeAreaInput(value),
            })
          }
        />
        <TextField
          id="quiz-people"
          label="Максимальное количество людей"
          value={answer?.people}
          placeholder="Например, 120"
          inputMode="numeric"
          onChange={value =>
            updateAnswer({
              ...answer,
              people: value.replace(/\D/g, '').slice(0, 7),
            })
          }
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
            onChange={value => updateAnswer({ ...answer, name: value })}
            autoComplete="name"
            required
          />
          <TextField
            id="quiz-phone"
            label="Телефон"
            type="tel"
            value={answer?.phone}
            placeholder="+7 (900) 000-00-00"
            inputMode="tel"
            autoComplete="tel"
            onChange={value =>
              updateAnswer({
                ...answer,
                phone: value,
              })
            }
            onBlur={value =>
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
            onChange={value =>
              updateAnswer({
                ...answer,
                email: sanitizeEmailInput(value),
              })
            }
            required
          />
          <TextField
            id="quiz-company"
            label="Название организации"
            value={answer?.company}
            placeholder="ООО «Название»"
            onChange={value => updateAnswer({ ...answer, company: value })}
          />
        </div>

        <label className="quiz-consent" htmlFor="quiz-consent">
          <input
            id="quiz-consent"
            type="checkbox"
            name="quiz-consent"
            checked={Boolean(answer?.consent)}
            onChange={event => updateAnswer({ ...answer, consent: event.target.checked })}
            required
          />
          <span>
            Я соглашаюсь на обработку персональных данных и{'\u00A0'}принимаю{' '}
            <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer">
              политику конфиденциальности
            </a>
            .
          </span>
        </label>
      </div>
    );
  }

  return null;
}
