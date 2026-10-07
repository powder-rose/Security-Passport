import RegulationsQuizField from './RegulationsQuizField.jsx';

export default function RegulationsQuizContent({
  step,
  counterText,
  progress,
  form,
  isCreating,
  topicQuestions,
  onChange,
  onTopicChange,
  onTopicQuestionChange,
}) {
  return (
    <>
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
          {step.label}
        </label>

        <div className="regulations-quiz__field">
          <RegulationsQuizField
            fieldId="regulations-quiz-field"
            step={step}
            form={form}
            isCreating={isCreating}
            topicQuestions={topicQuestions}
            onChange={onChange}
            onTopicChange={onTopicChange}
            onTopicQuestionChange={onTopicQuestionChange}
          />
        </div>
      </div>
    </>
  );
}
