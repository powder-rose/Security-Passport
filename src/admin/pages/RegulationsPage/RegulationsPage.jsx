import './RegulationsPage.polish.css';

import { useMemo, useState } from 'react';

import RegulationsList from './RegulationsList.jsx';
import RegulationsQuizActions from './RegulationsQuizActions.jsx';
import RegulationsQuizContent from './RegulationsQuizContent.jsx';
import RegulationsPublicationStatus from './RegulationsPublicationStatus.jsx';
import useRegulationPublication from './useRegulationPublication.js';
import useRegulations from './useRegulations.js';
import saveRegulationOperation from './regulationSaveOperation.js';

import { createEmptyRegulation, generalSteps, getTopicQuestions } from './regulationsModel.js';

export default function RegulationsPage() {
  const [expanded, setExpanded] = useState(false);

  const [mode, setMode] = useState('list');

  const [selected, setSelected] = useState('');

  const [form, setForm] = useState(null);

  const [topicQuestions, setTopicQuestions] = useState([]);

  const [stepIndex, setStepIndex] = useState(0);

  const [isCreating, setIsCreating] = useState(false);

  const [message, setMessage] = useState('');

  const [saving, setSaving] = useState(false);

  const { items, loading, reload: loadItems } = useRegulations(setMessage);

  const {
    publication,
    setPublication,
    retryPublication: retryPublicationRequest,
  } = useRegulationPublication();

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
      await retryPublicationRequest();

      setMessage('Повторная публикация запущена');
    } catch (error) {
      setMessage(error.message);
    }
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
      const saveResult = await saveRegulationOperation({
        form,
        isCreating,
        selected,
        topicQuestions,
      });

      if (saveResult.publication) {
        setPublication(saveResult.publication);
      }

      await loadItems();

      showList();
      setExpanded(true);

      setMessage(
        isCreating
          ? 'Постановление добавлено'
          : saveResult.publication
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

      {!loading && mode === 'list' && (
        <RegulationsList
          items={items}
          expanded={expanded}
          onOpen={openExisting}
          onCreate={openCreate}
        />
      )}

      {!loading && mode === 'quiz' && form && currentStep && (
        <section className="regulations-quiz">
          <RegulationsQuizContent
            step={currentStep}
            counterText={counterText}
            progress={progress}
            form={form}
            isCreating={isCreating}
            topicQuestions={topicQuestions}
            onChange={change}
            onTopicChange={changeTopic}
            onTopicQuestionChange={changeTopicQuestion}
          />

          <RegulationsQuizActions
            isFirstStep={stepIndex === 0}
            isLastStep={isLastStep}
            saving={saving}
            isCreating={isCreating}
            onBack={stepIndex === 0 ? showList : previousStep}
            onNext={nextStep}
            onSave={save}
          />
        </section>
      )}

      <RegulationsPublicationStatus publication={publication} onRetry={retryPublication} />
    </div>
  );
}
