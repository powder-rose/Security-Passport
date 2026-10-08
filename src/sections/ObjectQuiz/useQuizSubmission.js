import { useState } from 'react';
import { LEAD_SOURCE_QUIZ } from '../../../shared/contracts/lead.js';

import { SITE } from '../../config/site';

import { METRICA_GOALS, reachGoal } from '../../lib/analytics';

import { formatRussianPhone } from '../../lib/formInput';

import { getLeadEndpoint, submitLead } from '../../lib/lead';

import { quizContactSchema } from '../../../shared/validation/leadValidation.js';

export default function useQuizSubmission({
  question,
  answer,
  answers,
  visibleStep,
  isLastStep,
  preview = false,
  updateCurrentAnswer,
  goForward,
  markCompleted,
}) {
  const [showError, setShowError] = useState(false);

  const [submitStatus, setSubmitStatus] = useState('idle');

  const [submitMessage, setSubmitMessage] = useState('');

  function updateAnswer(value) {
    setShowError(false);
    setSubmitStatus('idle');
    setSubmitMessage('');

    updateCurrentAnswer(value);
  }

  function clearStepError() {
    setShowError(false);
  }

  async function handleNext() {
    if (submitStatus === 'loading') {
      return;
    }

    let submissionAnswers = answers;

    if (question.type === 'contact') {
      const normalizedContact = {
        ...answer,

        phone: formatRussianPhone(answer?.phone),
      };

      try {
        await quizContactSchema.validate(normalizedContact, {
          abortEarly: false,
        });
      } catch (error) {
        setShowError(true);
        setSubmitStatus('error');

        setSubmitMessage(error?.errors?.[0] || 'Проверьте обязательные контактные данные.');

        return;
      }

      updateCurrentAnswer(normalizedContact);

      submissionAnswers = {
        ...answers,

        [question.id]: normalizedContact,
      };
    }

    setShowError(false);

    reachGoal(METRICA_GOALS.quizStepCompleted, {
      step: visibleStep,
      question: question.id,
    });

    if (!isLastStep) {
      goForward();
      return;
    }

    if (preview) {
      setSubmitStatus('notice');

      setSubmitMessage(
        'Режим предпросмотра: контактные данные заполнены корректно, но заявка не отправлена.',
      );

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
        source: LEAD_SOURCE_QUIZ,

        data: {
          answers: submissionAnswers,
        },
      });

      reachGoal(METRICA_GOALS.quizSubmitSuccess, {
        source: 'object_quiz',
      });

      markCompleted();
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
