import { useEffect, useRef, useState } from 'react';

import { LEAD_SOURCE_DOCUMENT_REQUEST } from '../../../shared/contracts/lead.js';
import { documentRequestSchema } from '../../../shared/validation/leadValidation.js';
import { METRICA_GOALS, reachGoal } from '../../lib/analytics';
import { formatRussianPhone } from '../../lib/formInput';
import { submitLead } from '../../lib/lead';
import { SITE } from '../../config/site';

const initialForm = { name: '', phone: '', email: '', consent: false, website: '' };

export default function ArticleDocumentRequest({ article, document, preview, onClose }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  function updateField(key, value) {
    setForm(current => ({ ...current, [key]: value }));
    setMessage('');
    setStatus('idle');
  }

  async function submit(event) {
    event.preventDefault();

    if (status === 'loading' || status === 'success') return;

    const data = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: formatRussianPhone(form.phone),
      articleSlug: article.slug,
      documentIndex: document.index,
    };

    try {
      await documentRequestSchema.validate(data, { abortEarly: false });
    } catch (error) {
      setStatus('error');
      setMessage(error?.errors?.[0] || 'Проверьте заполнение формы.');
      return;
    }

    if (preview) {
      setStatus('notice');
      setMessage('В предпросмотре заявка не отправляется.');
      return;
    }

    setStatus('loading');
    setMessage('Отправляем заявку…');

    try {
      await submitLead({ source: LEAD_SOURCE_DOCUMENT_REQUEST, data });
      reachGoal(METRICA_GOALS.leadSubmitSuccess, { source: 'document_request' });
      setStatus('success');
      setMessage('');
    } catch {
      reachGoal(METRICA_GOALS.leadSubmitError, { source: 'document_request' });
      setStatus('error');
      setMessage(
        `Не удалось отправить запрос. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`,
      );
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="passport-document-modal"
      aria-labelledby="passport-document-modal-title"
      onCancel={event => {
        event.preventDefault();
        if (status !== 'loading') onClose();
      }}
    >
      <button
        type="button"
        className="passport-document-modal__close"
        aria-label="Закрыть форму"
        disabled={status === 'loading'}
        onClick={onClose}
      >
        ×
      </button>
      {status === 'success' ? (
        <div className="passport-document-modal__success" role="status">
          <span aria-hidden="true">✓</span>
          <h2 id="passport-document-modal-title">Запрос отправлен</h2>
          <p>Специалист свяжется с вами по указанным контактам по поводу документа.</p>
          <button type="button" className="passport-document-modal__submit" onClick={onClose}>
            Закрыть
          </button>
        </div>
      ) : (
        <>
          <p className="passport-document-modal__eyebrow">Материалы для вашей работы</p>
          <h2 id="passport-document-modal-title">Запросить документ</h2>
          <p className="passport-document-modal__document-name">{document.title}</p>
          <form onSubmit={submit} noValidate>
            <label>
              Имя
              <input
                type="text"
                autoComplete="name"
                maxLength={80}
                required
                value={form.name}
                onChange={event => updateField('name', event.target.value)}
              />
            </label>
            <label>
              Телефон
              <input
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
                value={form.phone}
                onChange={event => updateField('phone', formatRussianPhone(event.target.value))}
                placeholder="+7 (999) 000-00-00"
              />
            </label>
            <label>
              Электронная почта
              <input
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={form.email}
                onChange={event => updateField('email', event.target.value)}
              />
            </label>
            <label className="passport-document-modal__consent">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={event => updateField('consent', event.target.checked)}
              />
              <span>
                Согласен на обработку персональных данных и принимаю{' '}
                <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer">
                  политику конфиденциальности
                </a>
                .
              </span>
            </label>
            <label className="passport-document-modal__honeypot" aria-hidden="true">
              Ваш сайт
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={event => updateField('website', event.target.value)}
              />
            </label>
            <button
              type="submit"
              className="passport-document-modal__submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Отправляем…' : 'Запросить документ'}
              <span aria-hidden="true">↗</span>
            </button>
            {message && (
              <p
                className={`passport-document-modal__message passport-document-modal__message--${status}`}
                role={status === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {message}
              </p>
            )}
          </form>
        </>
      )}
    </dialog>
  );
}
