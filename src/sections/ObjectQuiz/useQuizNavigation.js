import { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { METRICA_GOALS, reachGoal } from '../../lib/analytics';

import {
  answerQuestion,
  completeQuiz,
  goToStep,
  nextStep,
  previousStep,
  resetQuiz,
} from '../../features/quiz/quizSlice';

import { quizQuestions } from '../../features/quiz/quizData';

const emptyObject = {};

export default function useQuizNavigation({ presetObjectType = null }) {
  const dispatch = useDispatch();

  const { currentStep, answers, completed } = useSelector(state => state.quiz);

  const quizStartedRef = useRef(false);

  const quizCardRef = useRef(null);

  const quizCompleteRef = useRef(null);

  const question = quizQuestions[currentStep];

  const answer = answers[question.id] ?? emptyObject;

  const hasPresetObjectType = Boolean(presetObjectType);

  const visibleTotal = hasPresetObjectType ? quizQuestions.length - 1 : quizQuestions.length;

  const visibleStep = hasPresetObjectType ? Math.max(1, currentStep) : currentStep + 1;

  const progress = (visibleStep / visibleTotal) * 100;

  const displayQuestionNumber = hasPresetObjectType
    ? String(visibleStep).padStart(2, '0')
    : question.number;

  const isLastStep = currentStep === quizQuestions.length - 1;

  useEffect(() => {
    if (!hasPresetObjectType) {
      return;
    }

    const existingObjectType = answers.objectType;

    const existingSelected =
      typeof existingObjectType === 'string' ? existingObjectType : existingObjectType?.selected;

    if (existingSelected !== presetObjectType) {
      dispatch(
        answerQuestion({
          questionId: 'objectType',

          value: {
            selected: presetObjectType,

            other: '',
          },
        }),
      );
    }

    if (currentStep === 0) {
      dispatch(goToStep(1));
    }
  }, [answers.objectType, currentStep, dispatch, hasPresetObjectType, presetObjectType]);

  useEffect(() => {
    if (
      !completed ||
      typeof window === 'undefined' ||
      !window.matchMedia('(max-width: 768px)').matches
    ) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      const completeBlock = quizCompleteRef.current;

      if (!completeBlock) {
        return;
      }

      const top = completeBlock.getBoundingClientRect().top + window.scrollY - 96;

      window.scrollTo(0, Math.max(0, top));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [completed]);

  function scrollToCurrentQuestion() {
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 768px)').matches) {
      return;
    }

    window.requestAnimationFrame(() => {
      const card = quizCardRef.current;

      if (!card) {
        return;
      }

      const top = card.getBoundingClientRect().top + window.scrollY - 96;

      window.scrollTo(0, Math.max(0, top));
    });
  }

  function updateCurrentAnswer(value) {
    if (!quizStartedRef.current) {
      quizStartedRef.current = true;

      reachGoal(METRICA_GOALS.quizStart, {
        step: visibleStep,
      });
    }

    dispatch(
      answerQuestion({
        questionId: question.id,

        value,
      }),
    );
  }

  function goForward() {
    dispatch(nextStep());

    scrollToCurrentQuestion();
  }

  function goBack() {
    if (hasPresetObjectType && currentStep <= 1) {
      return false;
    }

    if (!hasPresetObjectType && currentStep === 0) {
      return false;
    }

    dispatch(previousStep());

    scrollToCurrentQuestion();

    return true;
  }

  function markCompleted() {
    dispatch(completeQuiz());
  }

  function restartQuiz() {
    dispatch(resetQuiz());
  }

  return {
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
  };
}
