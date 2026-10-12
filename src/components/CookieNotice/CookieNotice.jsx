import { useEffect, useState } from 'react';

import './CookieNotice.css';

const STORAGE_KEY = 'passport-cookie-notice-v1';

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== 'dismissed');
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);

    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      return;
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <aside className="cookie-notice" aria-labelledby="cookie-notice-title">
      <div className="cookie-notice__top">
        <span className="cookie-notice__eyebrow">
          <span className="cookie-notice__dot" aria-hidden="true" />
          Приватность
        </span>

        <button
          className="cookie-notice__close"
          type="button"
          aria-label="Закрыть уведомление"
          onClick={dismiss}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <h2 className="cookie-notice__title" id="cookie-notice-title">
        Немного о cookie.
        <span>И о вашем удобстве.</span>
      </h2>

      <p className="cookie-notice__description">
        Мы используем файлы cookie и аналитику посещений, чтобы улучшать сайт и делать материалы
        полезнее.
      </p>

      <div className="cookie-notice__actions">
        <a className="cookie-notice__link" href="/privacy/">
          Политика конфиденциальности
          <span aria-hidden="true"> ↗</span>
        </a>

        <button className="cookie-notice__accept" type="button" onClick={dismiss}>
          Понятно
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </aside>
  );
}
