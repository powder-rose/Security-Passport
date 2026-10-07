const statuses = {
  needs_review: 'Требует проверки',
  reviewed: 'Проверено',
  outdated: 'Требует обновления',
};

const topicOptions = [
  {
    value: 'hotel',
    label: 'Гостиницы и средства размещения',
  },
  {
    value: 'education',
    label: 'Образовательные организации',
  },
  {
    value: 'culture',
    label: 'Объекты культуры',
  },
  {
    value: 'trade',
    label: 'Торговые объекты',
  },
  {
    value: 'sport',
    label: 'Объекты спорта',
  },
  {
    value: 'health',
    label: 'Объекты здравоохранения',
  },
  {
    value: 'crowd',
    label: 'Места массового пребывания людей',
  },
  {
    value: 'social',
    label: 'Объекты социальной защиты',
  },
];

export default function RegulationsQuizField({
  step,
  form,
  isCreating,
  topicQuestions,
  onChange,
  onTopicChange,
  onTopicQuestionChange,
  fieldId,
}) {
  if (!step) {
    return null;
  }

  if (step.type === 'topic-question') {
    const question = topicQuestions.find(item => item.key === step.questionKey);

    return (
      <textarea
        id={fieldId}
        rows={6}
        maxLength={1000}
        value={question?.text || ''}
        onChange={event => onTopicQuestionChange(step.questionKey, event.target.value)}
        autoFocus
        required
      />
    );
  }

  if (step.type === 'topic') {
    return (
      <>
        <select
          id={fieldId}
          value={form.topic || ''}
          onChange={event => onTopicChange(event.target.value)}
          disabled={!isCreating}
          autoFocus
          required
        >
          <option value="">Выберите тематику</option>

          {topicOptions.map(option => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {!isCreating && (
          <small
            style={{
              display: 'block',
              marginTop: 10,
              opacity: 0.6,
            }}
          >
            Тематика существующего постановления связана с текущим контентом сайта.
          </small>
        )}
      </>
    );
  }

  if (step.type === 'status') {
    return (
      <select
        id={fieldId}
        value={form.reviewStatus || 'needs_review'}
        onChange={event => onChange('reviewStatus', event.target.value)}
        autoFocus
      >
        {Object.entries(statuses).map(([value, label]) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }

  if (step.type === 'date') {
    return (
      <input
        id={fieldId}
        type="date"
        value={form[step.key]?.slice?.(0, 10) || ''}
        onChange={event => onChange(step.key, event.target.value || null)}
        autoFocus
      />
    );
  }

  if (step.type === 'number') {
    return (
      <input
        id={fieldId}
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={form.number || ''}
        onChange={event => onChange('number', event.target.value.replace(/\D/g, ''))}
        autoFocus
        required
      />
    );
  }

  return (
    <input
      id={fieldId}
      type="text"
      value={form[step.key] || ''}
      onChange={event => onChange(step.key, event.target.value)}
      autoFocus
      required={step.key === 'title'}
    />
  );
}
