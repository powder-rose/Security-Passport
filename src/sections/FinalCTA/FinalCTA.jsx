import { useState } from 'react';
import { LEAD_SOURCE_FINAL_CTA } from '../../../shared/contracts/lead.js';
import Container from '../../components/ui/Container/Container';
import { SITE } from '../../config/site';
import { METRICA_GOALS, reachGoal } from '../../lib/analytics';
import { getLeadEndpoint, submitLead } from '../../lib/lead';
import { formatRussianPhone, sanitizeEmailInput } from '../../lib/formInput';
import {
  leadFormSchema,
  leadFormWithEmailSchema,
} from '../../../shared/validation/leadValidation.js';
import './FinalCTA.css';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  object: '',
  consent: false,
  website: '',
};

const defaultBenefits = [
  'Проверим основание для категорирования',
  'Определим состав документов и\u00A0работ',
  'Сориентируем по стоимости и\u00A0этапам',
];

export default function FinalCTA({
  preview = false,
  benefits = defaultBenefits,
  service = '',
  objectType = '',
  objectTypeOptions = [],
  objectTypeLabel = 'Тип объекта',
  allowEmailOnly = false,
  objectPlaceholder = 'Например: гостиница, 2 400 м², требуется актуализация паспорта',
}) {
  const [form, setForm] = useState(initialForm);
  const [selectedObjectType, setSelectedObjectType] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const hasObjectTypeOptions = objectTypeOptions.length > 0;

  const objectContext = [
    objectType ? `Тип объекта: ${objectType}` : '',
    hasObjectTypeOptions && selectedObjectType ? `${objectTypeLabel}: ${selectedObjectType}` : '',
    service ? `Услуга: ${service}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  const objectPrefix = objectContext ? `${objectContext}\n\n` : '';
  const objectMaxLength = Math.max(0, 1000 - objectPrefix.length);

  const endpoint = getLeadEndpoint();
  const objectTypeMissing = hasObjectTypeOptions && !objectTypeOptions.includes(selectedObjectType);
  const objectTypeInvalid = status === 'error' && objectTypeMissing;
  const nameInvalid = status === 'error' && !form.name.trim();
  const contactMissing = !form.phone.trim() && !form.email.trim();
  const phoneInvalid = status === 'error' && (allowEmailOnly ? contactMissing : !form.phone.trim());
  const emailInvalid = status === 'error' && allowEmailOnly && contactMissing;
  const consentInvalid = status === 'error' && !form.consent;
  const contactDescription = allowEmailOnly ? 'final-cta-contact-hint' : undefined;

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
    if (status !== 'idle') {
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (preview) {
      setStatus('notice');
      setMessage('Режим предпросмотра: форма работает, но заявка не отправлена.');
      return;
    }

    if (objectTypeMissing) {
      setStatus('error');
      setMessage(`Выберите ${objectTypeLabel.toLowerCase()}.`);
      return;
    }

    const data = {
      ...form,
      object: `${objectPrefix}${form.object}`.trim(),
    };
    const schema = allowEmailOnly ? leadFormWithEmailSchema : leadFormSchema;

    try {
      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (error) {
      setStatus('error');
      setMessage(error?.errors?.[0] || 'Проверьте правильность заполнения формы.');
      return;
    }

    if (!endpoint) {
      setStatus('notice');
      setMessage(
        `Онлайн-отправка пока не подключена. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`,
      );
      return;
    }

    try {
      setStatus('loading');
      setMessage('Отправляем заявку…');

      await submitLead({
        source: LEAD_SOURCE_FINAL_CTA,
        data,
      });

      reachGoal(METRICA_GOALS.leadSubmitSuccess, { source: 'final_cta' });
      setForm(initialForm);
      setSelectedObjectType('');
      setStatus('success');
      setMessage('Заявка отправлена. Специалист свяжется с вами по указанным контактам.');
    } catch (error) {
      reachGoal(METRICA_GOALS.leadSubmitError, {
        source: 'final_cta',
        reason: error?.name === 'AbortError' ? 'timeout' : 'request_error',
      });
      setStatus('error');
      setMessage(
        `Не удалось отправить заявку. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`,
      );
    }
  };

  return (
    <section className="final-cta" id="contact" aria-labelledby="final-cta-title">
      <Container className="final-cta__layout">
        <div className="final-cta__copy">
          <p className="final-cta__kicker">Обсудить объект</p>
          <h2 id="final-cta-title">
            Определим, какие документы нужны <em>именно вашему объекту</em>
          </h2>

          <p className="final-cta__lead">
            Расскажите об объекте — проверим применимые требования, состав исходных данных и
            предложим понятный порядок дальнейшей работы.
          </p>

          <ul className="final-cta__benefits" aria-label="Что уточним на консультации">
            {benefits.map((benefit, index) => (
              <li key={benefit}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span> {benefit}
              </li>
            ))}
          </ul>

          <div className="final-cta__contacts">
            <a href={SITE.phoneHref} aria-label={`Позвонить: ${SITE.phone}`}>
              <span>Телефон</span>
              <strong>{SITE.phone}</strong>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label={`Написать на электронную почту ${SITE.email}`}
            >
              <span>Почта</span>
              <strong>{SITE.email}</strong>
            </a>
          </div>
        </div>

        <form className="final-cta__form" id="lead-form" onSubmit={handleSubmit} noValidate>
          <label className="lead-honeypot" aria-hidden="true">
            <span>Ваш сайт</span>
            <input
              type="text"
              name="website"
              tabIndex="-1"
              autoComplete="off"
              value={form.website}
              onChange={event => updateField('website', event.target.value)}
            />
          </label>
          <div className="final-cta__form-head">
            <p>Заявка специалисту</p>
            <span aria-hidden="true">↘</span>
          </div>

          <div className="final-cta__fields">
            {service ? (
              <label className="final-cta__field--wide">
                <span>Выбранная услуга</span>
                <output className="final-cta__context-value" name="service">
                  {service}
                </output>
              </label>
            ) : null}

            {hasObjectTypeOptions ? (
              <label className="final-cta__field--wide">
                <span>{objectTypeLabel} *</span>
                <select
                  name="objectType"
                  value={selectedObjectType}
                  onChange={event => {
                    setSelectedObjectType(event.target.value);
                    setStatus('idle');
                    setMessage('');
                  }}
                  aria-invalid={objectTypeInvalid || undefined}
                  aria-describedby={objectTypeInvalid ? 'final-cta-status' : undefined}
                  required
                >
                  <option value="" disabled>
                    Выберите тип объекта
                  </option>
                  {objectTypeOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ) : objectType ? (
              <label className="final-cta__field--wide">
                <span>Тип объекта</span>
                <output className="final-cta__context-value" name="objectType">
                  {objectType}
                </output>
              </label>
            ) : null}

            <label className={allowEmailOnly ? 'final-cta__field--wide' : undefined}>
              <span>Ваше имя *</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={event => updateField('name', event.target.value)}
                placeholder="Как к вам обращаться"
                aria-invalid={nameInvalid || undefined}
                aria-describedby={nameInvalid ? 'final-cta-status' : undefined}
                required
              />
            </label>

            {allowEmailOnly ? (
              <p
                className="final-cta__field--wide final-cta__contact-hint"
                id="final-cta-contact-hint"
              >
                Укажите телефон или электронную почту.
              </p>
            ) : null}

            <label>
              <span>{allowEmailOnly ? 'Телефон' : 'Телефон *'}</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={event => updateField('phone', formatRussianPhone(event.target.value))}
                placeholder="+7 (900) 000-00-00"
                aria-invalid={phoneInvalid || undefined}
                aria-describedby={phoneInvalid ? 'final-cta-status' : contactDescription}
                required={!allowEmailOnly}
              />
            </label>

            <label>
              <span>Электронная почта</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={event => updateField('email', sanitizeEmailInput(event.target.value))}
                placeholder="name@example.ru"
                aria-invalid={emailInvalid || undefined}
                aria-describedby={emailInvalid ? 'final-cta-status' : contactDescription}
                required={allowEmailOnly && !form.phone.trim()}
              />
            </label>

            <label className="final-cta__field--wide">
              <span>{objectType ? 'Комментарий' : 'Объект или задача'}</span>
              <textarea
                name="object"
                rows="4"
                value={form.object}
                onChange={event => updateField('object', event.target.value)}
                placeholder={objectPlaceholder}
                maxLength={objectMaxLength}
              />
            </label>
          </div>

          <label className="final-cta__consent">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={event => updateField('consent', event.target.checked)}
              aria-invalid={consentInvalid || undefined}
              aria-describedby={consentInvalid ? 'final-cta-status' : undefined}
              required
            />
            <span>
              Я согласен на обработку персональных данных в целях обратной связи и{'\u00A0'}принимаю{' '}
              <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer">
                политику конфиденциальности
              </a>
              .
            </span>
          </label>

          <button className="final-cta__submit" type="submit" disabled={status === 'loading'}>
            <span>{status === 'loading' ? 'Отправляем…' : 'Отправить заявку'}</span>
            <span className="final-cta__submit-arrow" aria-hidden="true">
              ↗
            </span>
          </button>

          {message ? (
            <p
              id="final-cta-status"
              className={`final-cta__status final-cta__status--${status}`}
              role={status === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}
        </form>
      </Container>
    </section>
  );
}
