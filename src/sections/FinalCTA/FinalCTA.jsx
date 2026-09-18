import { useState } from 'react';
import Container from '../../components/ui/Container/Container';
import { SITE } from '../../config/site';
import { METRICA_GOALS, reachGoal } from '../../lib/analytics';
import { getLeadEndpoint, submitLead } from '../../lib/lead';
import './FinalCTA.css';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  object: '',
  consent: false,
  website: '',
};

export default function FinalCTA() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const endpoint = getLeadEndpoint();
  const nameInvalid = status === 'error' && !form.name.trim();
  const phoneInvalid = status === 'error' && !form.phone.trim();
  const consentInvalid = status === 'error' && !form.consent;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== 'idle') {
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.consent) {
      setStatus('error');
      setMessage('Укажите имя и телефон и подтвердите согласие на обработку данных.');
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
        source: 'passport-security-final-cta',
        data: form,
      });

      reachGoal(METRICA_GOALS.leadSubmitSuccess, { source: 'final_cta' });
      setForm(initialForm);
      setStatus('success');
      setMessage('Заявка отправлена. Специалист свяжется с вами по указанным контактам.');
    } catch (error) {
      reachGoal(METRICA_GOALS.leadSubmitError, {
        source: 'final_cta',
        reason: error?.name === 'AbortError' ? 'timeout' : 'request_error',
      });
      setStatus('error');
      setMessage(`Не удалось отправить заявку. Позвоните ${SITE.phone} или напишите на ${SITE.email}.`);
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
            <li><span aria-hidden="true">01</span> Проверим основание для категорирования</li>
            <li><span aria-hidden="true">02</span> Определим состав документов и работ</li>
            <li><span aria-hidden="true">03</span> Сориентируем по стоимости и этапам</li>
          </ul>

          <div className="final-cta__contacts">
            <a href={SITE.phoneHref} aria-label={`Позвонить: ${SITE.phone}`}>
              <span>Телефон</span>
              <strong>{SITE.phone}</strong>
            </a>
            <a href={`mailto:${SITE.email}`} aria-label={`Написать на электронную почту ${SITE.email}`}>
              <span>Почта</span>
              <strong>{SITE.email}</strong>
            </a>
          </div>
        </div>

        <form
          className="final-cta__form"
          id="lead-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="lead-honeypot" aria-hidden="true">
            <span>Ваш сайт</span>
            <input
              type="text"
              name="website"
              tabIndex="-1"
              autoComplete="off"
              value={form.website}
              onChange={(event) => updateField('website', event.target.value)}
            />
          </label>
          <div className="final-cta__form-head">
            <p>Заявка специалисту</p>
            <span aria-hidden="true">↘</span>
          </div>

          <div className="final-cta__fields">
            <label>
              <span>Ваше имя *</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Как к вам обращаться"
                aria-invalid={nameInvalid || undefined}
                aria-describedby={nameInvalid ? 'final-cta-status' : undefined}
                required
              />
            </label>

            <label>
              <span>Телефон *</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="+7 900 000-00-00"
                aria-invalid={phoneInvalid || undefined}
                aria-describedby={phoneInvalid ? 'final-cta-status' : undefined}
                required
              />
            </label>

            <label>
              <span>Электронная почта</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="name@example.ru"
              />
            </label>

            <label className="final-cta__field--wide">
              <span>Объект или задача</span>
              <textarea
                name="object"
                rows="4"
                value={form.object}
                onChange={(event) => updateField('object', event.target.value)}
                placeholder="Например: гостиница, 2 400 м², требуется актуализация паспорта"
              />
            </label>
          </div>

          <label className="final-cta__consent">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={(event) => updateField('consent', event.target.checked)}
              aria-invalid={consentInvalid || undefined}
              aria-describedby={consentInvalid ? 'final-cta-status' : undefined}
              required
            />
            <span>
              Я согласен на обработку персональных данных в целях обратной связи и принимаю{' '}
              <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer">политику конфиденциальности</a>.
            </span>
          </label>

          <button className="final-cta__submit" type="submit" disabled={status === 'loading'}>
            <span>{status === 'loading' ? 'Отправляем…' : 'Отправить заявку'}</span>
            <span className="final-cta__submit-arrow" aria-hidden="true">↗</span>
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
