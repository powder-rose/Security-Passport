import {
  useMemo,
  useState,
} from 'react';

import {
  SITE,
} from '../../config/site';

import {
  METRICA_GOALS,
  reachGoal,
} from '../../lib/analytics';

import {
  getLeadEndpoint,
  submitLead,
} from '../../lib/lead';

import {
  quizContactSchema,
  quizLocationSchema,
  quizMetricsSchema,
} from '../../lib/validation/leadValidation';

import {
  isQuizStepValid,
} from './quizStepValidation';


export default function useQuizSubmission({
  question,
  answer,
  answers,
  visibleStep,
  isLastStep,
  preview = false,
  validateLocation,
  updateCurrentAnswer,
  goForward,
  markCompleted,
}) {
  const [
    showError,
    setShowError,
  ] =
    useState(false);

  const [
    submitStatus,
    setSubmitStatus,
  ] =
    useState('idle');

  const [
    submitMessage,
    setSubmitMessage,
  ] =
    useState('');


  const valid =
    useMemo(
      () =>
        isQuizStepValid(
          question,
          answer,
        ),
      [
        question,
        answer,
      ],
    );


  function updateAnswer(
    value,
  ) {
    setShowError(
      false,
    );

    setSubmitStatus(
      'idle',
    );

    setSubmitMessage(
      '',
    );

    updateCurrentAnswer(
      value,
    );
  }


  function clearStepError() {
    setShowError(
      false,
    );
  }


  async function handleNext() {
    if (
      !valid ||
      submitStatus ===
        'loading'
    ) {
      if (!valid) {
        setShowError(
          true,
        );
      }

      return;
    }


    const validationSchema =
      question.type ===
        'location'
        ? quizLocationSchema
        : question.type ===
            'metrics'
          ? quizMetricsSchema
          : question.type ===
              'contact'
            ? quizContactSchema
            : null;


    if (validationSchema) {
      try {
        await validationSchema.validate(
          answer,
          {
            abortEarly:
              false,
          },
        );
      } catch (error) {
        setShowError(
          true,
        );

        setSubmitStatus(
          'error',
        );

        setSubmitMessage(
          error?.errors?.[0] ||
            'Проверьте правильность заполнения данных.',
        );

        return;
      }
    }


    if (
      question.type ===
      'location'
    ) {
      const locationError =
        validateLocation(
          answer,
        );

      if (locationError) {
        setShowError(
          true,
        );

        setSubmitStatus(
          'error',
        );

        setSubmitMessage(
          locationError,
        );

        return;
      }
    }


    setShowError(
      false,
    );


    reachGoal(
      METRICA_GOALS
        .quizStepCompleted,
      {
        step:
          visibleStep,

        question:
          question.id,
      },
    );


    if (!isLastStep) {
      goForward();
      return;
    }


    if (preview) {
      setSubmitStatus(
        'notice',
      );

      setSubmitMessage(
        'Режим предпросмотра: ответы заполнены корректно, но заявка не отправлена.',
      );

      return;
    }


    const endpoint =
      getLeadEndpoint();

    if (!endpoint) {
      setSubmitStatus(
        'notice',
      );

      setSubmitMessage(
        `Онлайн-отправка пока не подключена. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`,
      );

      return;
    }


    try {
      setSubmitStatus(
        'loading',
      );

      setSubmitMessage(
        'Отправляем ответы специалисту…',
      );


      await submitLead({
        source:
          'passport-security-quiz',

        data: {
          answers,
        },
      });


      reachGoal(
        METRICA_GOALS
          .quizSubmitSuccess,
        {
          source:
            'object_quiz',
        },
      );


      markCompleted();
    } catch (error) {
      reachGoal(
        METRICA_GOALS
          .quizSubmitError,
        {
          source:
            'object_quiz',

          reason:
            error?.name ===
            'AbortError'
              ? 'timeout'
              : 'request_error',
        },
      );


      setSubmitStatus(
        'error',
      );

      setSubmitMessage(
        `Не удалось отправить ответы. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`,
      );
    }
  }


  return {
    showError,
    submitStatus,
    submitMessage,

    updateAnswer,
    handleNext,
    clearStepError,
  };
}
