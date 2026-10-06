import QuizComplete from './components/QuizComplete';

import QuizPanel from './components/QuizPanel';

import useQuizGeography from './useQuizGeography';

import useQuizNavigation from './useQuizNavigation';

import useQuizSubmission from './useQuizSubmission';

import './ObjectQuiz.css';

export default function ObjectQuiz({
  presetObjectType = null,
  variant = 'default',
  preview = false,
}) {
  const sectionClassName =
    variant === 'article' ? 'object-quiz object-quiz--article' : 'object-quiz';

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
  } = useQuizNavigation({
    presetObjectType,
  });

  const { regionOptions, settlementOptions } = useQuizGeography({
    questionType: question.type,

    regionValue: answer?.region,
  });

  const {
    showError,
    submitStatus,
    submitMessage,

    updateAnswer,
    handleNext,
    clearStepError,
  } = useQuizSubmission({
    question,
    answer,
    answers,
    visibleStep,
    isLastStep,
    preview,
    updateCurrentAnswer,
    goForward,
    markCompleted,
  });

  const handleBack = () => {
    if (goBack()) {
      clearStepError();
    }
  };

  const backDisabled = hasPresetObjectType ? currentStep <= 1 : currentStep === 0;

  if (completed) {
    return (
      <QuizComplete
        sectionClassName={sectionClassName}
        quizCompleteRef={quizCompleteRef}
        onRestart={restartQuiz}
      />
    );
  }

  return (
    <QuizPanel
      sectionClassName={sectionClassName}

      quizCardRef={quizCardRef}

      question={question}

      answer={answer}

      regionOptions={regionOptions}

      settlementOptions={settlementOptions}

      visibleTotal={visibleTotal}

      visibleStep={visibleStep}

      progress={progress}

      displayQuestionNumber={displayQuestionNumber}

      isLastStep={isLastStep}

      showError={showError}

      submitStatus={submitStatus}

      submitMessage={submitMessage}

      backDisabled={backDisabled}

      updateAnswer={updateAnswer}

      handleNext={handleNext}

      handleBack={handleBack}
    />
  );
}
