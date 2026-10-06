import {
  useEffect,
  useState,
} from 'react';

import {
  getStatistics,
} from '../../api/adminApi';

import './StatisticsPage.css';


const PERIODS = [
  ['day', 'Сутки'],
  ['7days', '7 дней'],
  ['30days', '30 дней'],
  ['365days', '365 дней'],
];


function formatNumber(value) {
  return new Intl.NumberFormat(
    'ru-RU',
  ).format(
    Number(value) || 0,
  );
}


function formatPercent(
  value,
  visits,
) {
  if (!visits) {
    return '—';
  }

  return (
    new Intl.NumberFormat(
      'ru-RU',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    ).format(
      Number(value) || 0,
    ) + '%'
  );
}


function formatDate(value) {
  return new Intl.DateTimeFormat(
    'ru-RU',
    {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  ).format(
    new Date(value),
  );
}


function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'ru-RU',
    {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
  );
}


function formatRange(range) {
  if (
    !range?.start ||
    !range?.end
  ) {
    return '—';
  }

  const end =
    new Date(
      new Date(
        range.end,
      ).getTime() - 1,
    );

  const startText =
    formatDate(
      range.start,
    );

  const endText =
    formatDate(
      end,
    );

  if (
    startText === endText
  ) {
    return startText;
  }

  return (
    `${startText} — ${endText}`
  );
}


export default function StatisticsPage() {
  const [
    statistics,
    setStatistics,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    period,
    setPeriod,
  ] = useState('day');

  if (
    loading &&
    !statistics
  ) {
    return (
      <div className="statistics-state">
        Загрузка статистики...
      </div>
    );
  }


  if (
    error &&
    !statistics
  ) {
    return (
      <div className="statistics-state statistics-state--error">
        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={
            loadStatistics
          }
        >
          Повторить
        </button>
      </div>
    );
  }


  const totals =
    currentPeriod
      ?.totals || {
        visits: 0,
        leads: 0,
        conversion: 0,
      };

  const range =
    formatRange(
      currentPeriod
        ?.range,
    );


  return (
    <div className="statistics-page">

      <section className="statistics-intro">

        <div>
          <p className="statistics-eyebrow">
            Аналитика
          </p>

          <h1>
            Посещения
            <br />

            <em>
              и заявки
            </em>
          </h1>
        </div>


        <div className="statistics-intro__meta">

          <p>
            Статистика рассчитывается
            по полностью завершённым
            календарным дням.
          </p>

          <span>
            Обновлено{' '}
            {formatDateTime(
              statistics
                ?.generatedAt,
            )}{' '}
            · МСК
          </span>

          <button
            type="button"
            onClick={
              loadStatistics
            }
            disabled={
              loading
            }
          >
            {loading
              ? 'Обновление...'
              : 'Обновить'}
          </button>

        </div>

      </section>


      <nav
        className="statistics-periods"
        aria-label="Период статистики"
      >

        {PERIODS.map(
          ([
            key,
            label,
          ]) => (
            <button
              key={key}
              type="button"
              className={
                period === key
                  ? 'is-active'
                  : ''
              }
              onClick={
                () =>
                  setPeriod(
                    key,
                  )
              }
            >
              {label}
            </button>
          ),
        )}

      </nav>


      <section className="statistics-summary">

        <article className="statistics-summary-card">

          <div className="statistics-summary-card__top">
            <span>01</span>
            <p>
              Посещения
            </p>
          </div>

          <strong>
            {formatNumber(
              totals.visits,
            )}
          </strong>

          <small>
            {range}
          </small>

        </article>


        <article className="statistics-summary-card statistics-summary-card--blue">

          <div className="statistics-summary-card__top">
            <span>02</span>
            <p>
              Заявки
            </p>
          </div>

          <strong>
            {formatNumber(
              totals.leads,
            )}
          </strong>

          <small>
            {range}
          </small>

        </article>


        <article className="statistics-summary-card statistics-summary-card--lime">

          <div className="statistics-summary-card__top">
            <span>03</span>
            <p>
              Конверсия
            </p>
          </div>

          <strong>
            {formatPercent(
              totals.conversion,
              totals.visits,
            )}
          </strong>

          <small>
            заявки / посещения
          </small>

        </article>

      </section>


      <section className="statistics-federal">

        <div className="statistics-federal__heading">

          <div>
            <p className="statistics-eyebrow">
              Федеральный сайт
            </p>

            <h2>
              Россия
            </h2>
          </div>

        </div>


        <div className="statistics-table-wrap">

          <table className="statistics-table">

            <thead>
              <tr>

                <th>
                  Посещения
                </th>

                <th>
                  Заявки
                </th>

                <th>
                  Конверсия
                </th>

              </tr>
            </thead>


            <tbody>

              <tr>
                  <td>
                    {formatNumber(
                      totals.visits,
                    )}
                  </td>

                  <td>
                    {formatNumber(
                      totals.leads,
                    )}
                  </td>

                  <td>
                    {formatPercent(
                      totals.conversion,
                      totals.visits,
                    )}
                  </td>
                </tr>

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}
