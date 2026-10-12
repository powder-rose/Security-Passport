import { useEffect, useId, useRef, useState } from 'react';

import {
  ARTICLE_CALLBACK_INTERESTS,
  LEAD_SOURCE_ARTICLE_CALLBACK,
} from '../../../shared/contracts/lead.js';

import { articleCallbackSchema } from '../../../shared/validation/leadValidation.js';

import { SITE } from '../../config/site';

import { METRICA_GOALS, reachGoal } from '../../lib/analytics';

import { formatRussianPhone } from '../../lib/formInput';

import { submitLead } from '../../lib/lead';

import './ArticleCallback.css';

const initialForm = {
  interest: ARTICLE_CALLBACK_INTERESTS[0],
  name: '',
  phone: '',
  consent: false,
  website: '',
};

export default function ArticleCallback({ article, preview = false }) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const titleId = useId();
  const titleRef = useRef(null);
  const openButtonRef = useRef(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (expanded) {
      titleRef.current?.focus();
    } else if (restoreFocusRef.current) {
      openButtonRef.current?.focus();
      restoreFocusRef.current = false;
    }
  }, [expanded]);

  function updateField(field, value) {
    setForm(current => ({
      ...current,
      [field]: value,
    }));

    if (status !== 'idle') {
      setStatus('idle');
      setMessage('');
    }
  }

  function openForm() {
    setExpanded(true);

    if (!preview) {
      reachGoal(METRICA_GOALS.articleCallbackOpen, {
        article: article?.slug || '',
      });
    }
  }

  function closeForm() {
    restoreFocusRef.current = true;
    setExpanded(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (status === 'loading' || status === 'success') {
      return;
    }

    const data = {
      ...form,
      name: form.name.trim(),
      phone: formatRussianPhone(form.phone),
      articleTitle: String(article?.title || '').slice(0, 300),
    };

    try {
      await articleCallbackSchema.validate(data, {
        abortEarly: false,
      });
    } catch (error) {
      setStatus('error');
      setMessage(error?.errors?.[0] || 'Проверьте правильность заполнения формы.');
      return;
    }

    if (preview) {
      setStatus('notice');
      setMessage('Режим предпросмотра: заявка не отправлена.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('Отправляем заявку…');

      await submitLead({
        source: LEAD_SOURCE_ARTICLE_CALLBACK,
        data,
      });

      reachGoal(METRICA_GOALS.leadSubmitSuccess, {
        source: 'article_callback',
      });

      setStatus('success');
      setMessage('');
    } catch (error) {
      reachGoal(METRICA_GOALS.leadSubmitError, {
        source: 'article_callback',
        reason: error?.name === 'AbortError' ? 'timeout' : 'request_error',
      });

      setStatus('error');
      setMessage(
        `Не удалось отправить заявку. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`,
      );
    }
  }

  return (
    <section className="article-callback" aria-labelledby={titleId}>
      {!expanded ? (
        <div className="article-callback__teaser">
          <div className="article-callback__teaser-inner">
            <div className="article-callback__eyebrow">
              <span className="article-callback__badge">Помощь специалиста</span>

              <span>По вашему объекту</span>
            </div>

            <h2 className="article-callback__title" id={titleId}>
              Не знаете, с чего начать?
            </h2>

            <p className="article-callback__question">
              Не уверены, нужен ли паспорт безопасности именно вашему объекту?
            </p>

            <p className="article-callback__description">
              Оставьте номер телефона. Специалист свяжется с вами, уточнит особенности объекта и
              поможет сориентироваться в требованиях и дальнейших действиях.
            </p>

            <button
              className="article-callback__open"
              type="button"
              ref={openButtonRef}
              onClick={openForm}
            >
              <span>Помочь разобраться</span>
              <span aria-hidden="true">↗</span>
            </button>

            <p className="article-callback__hint">
              Без длинных анкет — начнём с короткого разговора.
            </p>
          </div>
        </div>
      ) : (
        <div className="article-callback__panel">
          {status === 'success' ? (
            <div className="article-callback__complete" role="status">
              <span className="article-callback__complete-mark" aria-hidden="true">
                ✓
              </span>

              <h2 id={titleId} className="article-callback__form-title">
                Заявка отправлена
              </h2>

              <p>
                Спасибо! Специалист свяжется с вами по указанному номеру, чтобы обсудить вашу
                ситуацию.
              </p>
            </div>
          ) : (
            <>
              <div className="article-callback__form-head">
                <p className="article-callback__form-kicker">Заявка на обратный звонок</p>

                <button
                  className="article-callback__back"
                  type="button"
                  onClick={closeForm}
                  aria-label="Вернуться к описанию"
                >
                  ← Назад
                </button>
              </div>

              <h2
                id={titleId}
                ref={titleRef}
                tabIndex={-1}
                className="article-callback__form-title"
              >
                Разберёмся с вашим объектом
              </h2>

              <p className="article-callback__form-description">
                Оставьте контакты — специалист позвонит, чтобы уточнить вашу ситуацию.
              </p>

              <form className="article-callback__form" onSubmit={handleSubmit} noValidate>
                <fieldset className="article-callback__interests">
                  <legend>Что хотите выяснить?</legend>

                  {ARTICLE_CALLBACK_INTERESTS.map(interest => (
                    <label className="article-callback__interest" key={interest}>
                      <input
                        type="radio"
                        name={`${titleId}-interest`}
                        value={interest}
                        checked={form.interest === interest}
                        onChange={event => updateField('interest', event.target.value)}
                        disabled={status === 'loading'}
                      />

                      <span>{interest}</span>
                    </label>
                  ))}
                </fieldset>

                <div className="article-callback__fields">
                  <label className="article-callback__field">
                    <span>Ваше имя (необязательно)</span>

                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      maxLength={80}
                      value={form.name}
                      onChange={event => updateField('name', event.target.value)}
                      placeholder="Как к вам обращаться?"
                      disabled={status === 'loading'}
                    />
                  </label>

                  <label className="article-callback__field">
                    <span>Телефон для обратного звонка *</span>

                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={event =>
                        updateField('phone', formatRussianPhone(event.target.value))
                      }
                      placeholder="+7 (999) 000-00-00"
                      disabled={status === 'loading'}
                      required
                    />
                  </label>
                </div>

                <label className="article-callback__consent">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={event => updateField('consent', event.target.checked)}
                    disabled={status === 'loading'}
                    required
                  />

                  <span>
                    Согласен на обработку персональных данных для обратной связи и принимаю{' '}
                    <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer">
                      политику конфиденциальности
                    </a>
                    .
                  </span>
                </label>

                <label className="article-callback__honeypot" aria-hidden="true">
                  <span>Ваш сайт</span>

                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    value={form.website}
                    onChange={event => updateField('website', event.target.value)}
                  />
                </label>

                <button
                  className="article-callback__submit"
                  type="submit"
                  disabled={status === 'loading'}
                >
                  <span>{status === 'loading' ? 'Отправляем…' : 'Жду звонка специалиста'}</span>

                  <span className="article-callback__submit-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>

                {message ? (
                  <p
                    className={`article-callback__message article-callback__message--${status}`}
                    role={status === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                  >
                    {message}
                  </p>
                ) : null}
              </form>
            </>
          )}
        </div>
      )}
    </section>
  );
}
