import './RegulationsPage.polish.css';

import { useEffect, useMemo, useState } from 'react';

import {
  createRegulation,
  getRegulations,
  saveRegulation,
  saveRegulationTopicClaims,
  getRegulationPublication,
  retryRegulationPublication,
} from '../../api/adminApi';

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

const generalSteps = [
  {
    key: 'number',
    label: 'Номер постановления',
    type: 'number',
  },
  {
    key: 'title',
    label: 'Название',
    type: 'text',
  },
  {
    key: 'documentDate',
    label: 'Дата постановления',
    type: 'date',
  },
  {
    key: 'reviewStatus',
    label: 'Статус проверки',
    type: 'status',
  },
  {
    key: 'reviewedAt',
    label: 'Дата проверки постановления',
    type: 'date',
  },
  {
    key: 'reviewDueDate',
    label: 'Дата окончания срока постановления',
    type: 'date',
  },
  {
    key: 'topic',
    label: 'На какую тематику это постановление?',
    type: 'topic',
  },
];

function createEmptyRegulation() {
  return {
    number: '',
    title: '',
    topic: '',
    documentDate: null,
    edition: '',
    officialUrl: '',
    reviewStatus: 'needs_review',
    reviewedAt: null,
    reviewDueDate: null,
    reviewNote: '',
    claims: [],
    occurrences: [],
  };
}

function cleanClaimLabel(label, fallback) {
  return (
    String(label || fallback || '')
      .replace(/^FAQ:\s*/i, '')
      .trim() || 'Нормативный вопрос'
  );
}

function getTopicQuestions(items, topic) {
  if (!topic) {
    return [];
  }

  const questions = [];
  const seen = new Set();

  for (const regulation of items) {
    if (regulation.topic !== topic) {
      continue;
    }

    for (const claim of regulation.claims || []) {
      if (!claim?.id) {
        continue;
      }

      const ownerNumber = String(regulation.number);

      const key = `${ownerNumber}:${claim.id}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);

      questions.push({
        key,
        ownerNumber,
        id: claim.id,
        label: cleanClaimLabel(claim.label, claim.id),
        text: claim.text || '',
      });
    }
  }

  return questions;
}

function reviewReminder(item) {
  if (item.reviewStatus !== 'reviewed' || !item.reviewedAt) {
    return 'Нужна проверка';
  }

  const next = new Date(`${item.reviewedAt}T00:00:00Z`);

  next.setUTCDate(next.getUTCDate() + 90);

  const due = next.toISOString().slice(0, 10);

  const today = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Moscow',
  });

  const display = due.split('-').reverse().join('.');

  return today > due ? `Проверка просрочена с ${display}` : `Следующая проверка — до ${display}`;
}

function buildPayload(form, claims) {
  return {
    number: String(form.number || '').trim(),

    title: form.title || '',

    topic: form.topic || '',

    documentDate: form.documentDate || null,

    edition: form.edition || '',

    officialUrl: form.officialUrl || '',

    reviewStatus: form.reviewStatus || 'needs_review',

    reviewedAt: form.reviewedAt || null,

    reviewDueDate: form.reviewDueDate || null,

    reviewNote: form.reviewNote || '',

    claims,
  };
}

function PublicationStatus({ publication, onRetry }) {
  if (!publication) {
    return null;
  }

  const label = {
    queued: 'Публикация ожидает сборки',
    publishing: 'Публикация выполняется',
    published: 'Публикация сайта завершена',
    unpublished: 'Есть неопубликованные изменения',
    failed: 'Ошибка публикации',
  }[publication.phase];

  if (!label) {
    return null;
  }

  return (
    <div
      className={`regulations-publication regulations-publication--${publication.phase}`}
      role="status"
    >
      <span>{label}</span>

      {publication.phase === 'failed' && (
        <button type="button" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}

function QuizField({
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

export default function RegulationsPage() {
  const [items, setItems] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const [mode, setMode] = useState('list');

  const [selected, setSelected] = useState('');

  const [form, setForm] = useState(null);

  const [topicQuestions, setTopicQuestions] = useState([]);

  const [stepIndex, setStepIndex] = useState(0);

  const [isCreating, setIsCreating] = useState(false);

  const [message, setMessage] = useState('');

  const [publication, setPublication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  async function loadItems() {
    const result = await getRegulations();

    if (!result?.ok || !Array.isArray(result.regulations)) {
      throw new Error('Не удалось загрузить постановления');
    }

    setItems(result.regulations);

    return result.regulations;
  }

  useEffect(() => {
    let active = true;

    getRegulations()
      .then(result => {
        if (!result?.ok || !Array.isArray(result.regulations)) {
          throw new Error('Не удалось загрузить постановления');
        }

        if (active) {
          setItems(result.regulations);
        }
      })
      .catch(error => {
        if (active) {
          setMessage(error.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function checkPublication() {
      try {
        const result = await getRegulationPublication();

        if (active && result?.ok) {
          setPublication(result.publication);
        }
      } catch (error) {
        if (active) {
          setPublication({
            phase: 'failed',
            error: error.message,
          });
        }
      }
    }

    checkPublication();

    const timer = window.setInterval(checkPublication, 4000);

    return () => {
      active = false;

      window.clearInterval(timer);
    };
  }, []);

  const questionSteps = useMemo(
    () =>
      topicQuestions.map(question => ({
        key: `topic:${question.key}`,
        questionKey: question.key,
        label: question.label,
        type: 'topic-question',
      })),
    [topicQuestions],
  );

  const steps = useMemo(() => [...generalSteps, ...questionSteps], [questionSteps]);

  const currentStep = steps[stepIndex] || null;

  const inQuestions = stepIndex >= generalSteps.length;

  const questionIndex = inQuestions ? stepIndex - generalSteps.length : -1;

  const progress = inQuestions
    ? questionSteps.length
      ? ((questionIndex + 1) / questionSteps.length) * 100
      : 100
    : ((stepIndex + 1) / generalSteps.length) * 100;

  function change(field, value) {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }));

    setMessage('');
  }

  function changeTopic(topic) {
    if (!isCreating) {
      return;
    }

    setForm(previous => ({
      ...previous,
      topic,
    }));

    setTopicQuestions(getTopicQuestions(items, topic));

    setMessage('');
  }

  function changeTopicQuestion(key, value) {
    setTopicQuestions(previous =>
      previous.map(question =>
        question.key === key
          ? {
              ...question,
              text: value,
            }
          : question,
      ),
    );

    setMessage('');
  }

  function openExisting(item) {
    setSelected(String(item.number));

    setForm({
      ...item,
      claims: (item.claims || []).map(claim => ({
        ...claim,
      })),
    });

    setTopicQuestions(getTopicQuestions(items, item.topic));

    setIsCreating(false);
    setStepIndex(0);
    setMode('quiz');
    setExpanded(true);
    setMessage('');
  }

  function openCreate() {
    setSelected('');
    setForm(createEmptyRegulation());
    setTopicQuestions([]);
    setIsCreating(true);
    setStepIndex(0);
    setMode('quiz');
    setExpanded(true);
    setMessage('');
  }

  function showList() {
    setMode('list');
    setForm(null);
    setSelected('');
    setTopicQuestions([]);
    setIsCreating(false);
    setStepIndex(0);
  }

  function toggleSection() {
    if (mode === 'quiz') {
      showList();
      setExpanded(true);
      return;
    }

    setExpanded(previous => !previous);
  }

  function canContinue() {
    if (!currentStep) {
      return false;
    }

    if (currentStep.key === 'number') {
      return /^\d{1,6}$/.test(String(form.number || ''));
    }

    if (currentStep.key === 'title') {
      return Boolean(String(form.title || '').trim());
    }

    if (currentStep.type === 'topic') {
      return Boolean(form.topic);
    }

    if (currentStep.type === 'topic-question') {
      const question = topicQuestions.find(item => item.key === currentStep.questionKey);

      return Boolean(String(question?.text || '').trim());
    }

    return true;
  }

  function nextStep() {
    if (!canContinue()) {
      setMessage('Заполни текущий шаг');
      return;
    }

    setMessage('');

    setStepIndex(previous => Math.min(previous + 1, steps.length - 1));
  }

  function previousStep() {
    setMessage('');

    setStepIndex(previous => Math.max(previous - 1, 0));
  }

  async function retryPublication() {
    try {
      const result = await retryRegulationPublication();

      if (!result?.ok) {
        throw new Error(result?.message || 'Не удалось запустить публикацию');
      }

      setPublication(result.publication);

      setMessage('Повторная публикация запущена');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function buildOwnClaims() {
    if (isCreating) {
      return [];
    }

    const answers = new Map(topicQuestions.map(question => [question.key, question.text]));

    return (form.claims || []).map(claim => {
      const key = `${selected}:${claim.id}`;

      return {
        ...claim,
        text: answers.has(key) ? answers.get(key) : claim.text,
      };
    });
  }

  async function save() {
    if (!canContinue()) {
      setMessage('Заполни текущий вопрос');
      return;
    }

    if (form.reviewStatus === 'reviewed' && !form.reviewedAt) {
      setMessage('Для статуса «Проверено» необходимо указать дату проверки');
      return;
    }

    if (!form.topic) {
      setMessage('Выберите тематику постановления');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const ownClaims = buildOwnClaims();

      const payload = buildPayload(form, ownClaims);

      const baseResult = isCreating
        ? await createRegulation(payload)
        : await saveRegulation(selected, payload);

      if (!baseResult?.ok || !baseResult.regulation) {
        throw new Error(baseResult?.message || 'Не удалось сохранить постановление');
      }

      const newNumber = String(baseResult.regulation.number);

      const topicPayload = topicQuestions.map(question => ({
        number: !isCreating && question.ownerNumber === selected ? newNumber : question.ownerNumber,

        id: question.id,

        text: question.text,
      }));

      const topicResult = await saveRegulationTopicClaims(form.topic, topicPayload);

      if (!topicResult?.ok) {
        throw new Error(topicResult?.message || 'Не удалось сохранить тематические вопросы');
      }

      if (topicResult.publication || baseResult.publication) {
        setPublication(topicResult.publication || baseResult.publication);
      }

      await loadItems();

      showList();
      setExpanded(true);

      setMessage(
        isCreating
          ? 'Постановление добавлено'
          : topicResult.publication || baseResult.publication
            ? 'Сохранено. Публикация запущена'
            : 'Изменения сохранены',
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  const isLastStep = Boolean(steps.length && stepIndex === steps.length - 1);

  const counterText = inQuestions
    ? `Вопрос ${questionIndex + 1} из ${questionSteps.length}`
    : `Шаг ${stepIndex + 1} из ${generalSteps.length}`;

  return (
    <div className="admin-page regulations-page">
      <header className="regulations-heading">
        <h1>Нормативные документы</h1>
      </header>

      {message && (
        <div className="regulations-message" role="status">
          {message}
        </div>
      )}

      <button
        className={`regulations-accordion${expanded ? ' is-expanded' : ''}`}
        type="button"
        aria-expanded={expanded}
        onClick={toggleSection}
      >
        <span>Постановления (ПП РФ)</span>
      </button>

      {loading && <div className="regulations-loading">Загрузка...</div>}

      {!loading && mode === 'list' && expanded && (
        <div className="regulations-list">
          {items.map(item => (
            <button
              type="button"
              className="regulations-list__row"
              key={item.number}
              onClick={() => openExisting(item)}
            >
              <span className="regulations-list__name">Постановление №{item.number}</span>

              <span className="regulations-list__status">{reviewReminder(item)}</span>
            </button>
          ))}
        </div>
      )}

      {!loading && mode === 'list' && (
        <button type="button" className="regulations-add" onClick={openCreate}>
          <span className="regulations-add__label">Добавить постановление</span>

          <span className="regulations-add__plus" aria-hidden="true">
            +
          </span>
        </button>
      )}

      {!loading && mode === 'quiz' && form && currentStep && (
        <section className="regulations-quiz">
          <div className="regulations-quiz__top">
            <span>ПП РФ</span>

            <span>{counterText}</span>
          </div>

          <div className="regulations-quiz__progress" aria-hidden="true">
            <span
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="regulations-quiz__body">
            <label className="regulations-quiz__label" htmlFor="regulations-quiz-field">
              {currentStep.label}
            </label>

            <div className="regulations-quiz__field">
              <QuizField
                fieldId="regulations-quiz-field"
                step={currentStep}
                form={form}
                isCreating={isCreating}
                topicQuestions={topicQuestions}
                onChange={change}
                onTopicChange={changeTopic}
                onTopicQuestionChange={changeTopicQuestion}
              />
            </div>
          </div>

          <div className="regulations-quiz__actions">
            <button
              type="button"
              className="regulations-quiz__back"
              onClick={stepIndex === 0 ? showList : previousStep}
            >
              {stepIndex === 0 ? 'К списку' : 'Назад'}
            </button>

            {!isLastStep && (
              <button type="button" className="regulations-quiz__next" onClick={nextStep}>
                Далее
                <span aria-hidden="true">→</span>
              </button>
            )}

            {isLastStep && (
              <button
                type="button"
                className="regulations-quiz__save"
                onClick={save}
                disabled={saving}
              >
                {saving ? 'Сохранение...' : isCreating ? 'Добавить постановление' : 'Сохранить'}
              </button>
            )}
          </div>
        </section>
      )}

      <PublicationStatus publication={publication} onRetry={retryPublication} />
    </div>
  );
}
