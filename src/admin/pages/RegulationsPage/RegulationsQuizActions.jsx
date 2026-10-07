import './RegulationsQuizActions.css';

export default function RegulationsQuizActions({
  isFirstStep,
  isLastStep,
  saving,
  isCreating,
  onBack,
  onNext,
  onSave,
}) {
  return (
    <div className="regulations-quiz__actions">
      <button type="button" className="regulations-quiz__back" onClick={onBack}>
        {isFirstStep ? 'К списку' : 'Назад'}
      </button>

      {!isLastStep && (
        <button type="button" className="regulations-quiz__next" onClick={onNext}>
          Далее
          <span aria-hidden="true">→</span>
        </button>
      )}

      {isLastStep && (
        <button type="button" className="regulations-quiz__save" onClick={onSave} disabled={saving}>
          {saving ? 'Сохранение...' : isCreating ? 'Добавить постановление' : 'Сохранить'}
        </button>
      )}
    </div>
  );
}
