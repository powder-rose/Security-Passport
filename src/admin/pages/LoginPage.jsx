import { useState } from 'react';

import { useAuth } from '../auth/AuthProvider';


export default function LoginPage() {
  const { signIn } = useAuth();

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await signIn(password);
    } catch {
      setError('Неверный пароль');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="admin-login">

      <div className="admin-login__card">

        <div className="admin-login__brand">
          БОЙКОВГРУПП
        </div>


        <div className="admin-login__number">
          01
        </div>


        <h1>
          Админ-панель
        </h1>


        <p>
          Управление сайтом и контентом
        </p>


        <form onSubmit={handleSubmit}>

          <label>
            <span>
              Пароль
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
            />
          </label>


          {error && (
            <p className="admin-form-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            <span>
              {loading
                ? 'Проверка'
                : 'Войти'}
            </span>

            <span>
              →
            </span>

          </button>

        </form>

      </div>

    </div>
  );
}
