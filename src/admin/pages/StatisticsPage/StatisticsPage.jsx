import {
  useEffect,
  useMemo,
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

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    sort,
    setSort,
  ] = useState({
    key: 'leads',
    direction: 'desc',
  });


  async function loadStatistics() {
    setLoading(true);
    setError('');

    try {
      const result =
        await getStatistics();

      if (
        !result?.ok ||
        !result?.periods
      ) {
        throw new Error(
          'STATISTICS_LOAD_FAILED',
        );
      }

      setStatistics(
        result,
      );
    } catch (loadError) {
      console.error(
        loadError,
      );

      setError(
        'Не удалось загрузить статистику.',
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(
    () => {
      loadStatistics();
    },
    [],
  );


  const currentPeriod =
    statistics
      ?.periods
      ?.[period] ||
    null;


  const rows =
    useMemo(
      () => {
        if (!currentPeriod) {
          return [];
        }

        const query =
          search
            .trim()
            .toLocaleLowerCase(
              'ru',
            );

        let result =
          Array.isArray(
            currentPeriod.rows,
          )
            ? [
                ...currentPeriod.rows,
              ]
            : [];

        if (query) {
          result =
            result.filter(
              (row) =>
                String(
                  row.name || '',
                )
                  .toLocaleLowerCase(
                    'ru',
                  )
                  .includes(
                    query,
                  ),
            );
        }

        const factor =
          sort.direction ===
          'asc'
            ? 1
            : -1;

        result.sort(
          (a, b) => {
            if (
              sort.key ===
              'name'
            ) {
              return (
                String(
                  a.name || '',
                ).localeCompare(
                  String(
                    b.name || '',
                  ),
                  'ru',
                ) *
                factor
              );
            }

            const first =
              Number(
                a[
                  sort.key
                ],
              ) || 0;

            const second =
              Number(
                b[
                  sort.key
                ],
              ) || 0;

            if (
              first ===
              second
            ) {
              return String(
                a.name || '',
              ).localeCompare(
                String(
                  b.name || '',
                ),
                'ru',
              );
            }

            return (
              (
                first -
                second
              ) *
              factor
            );
          },
        );

        return result;
      },
      [
        currentPeriod,
        search,
        sort,
      ],
    );


  function handleSort(
    key,
  ) {
    setSort(
      (current) => {
        if (
          current.key ===
          key
        ) {
          return {
            key,
            direction:
              current.direction ===
              'desc'
                ? 'asc'
                : 'desc',
          };
        }

        return {
          key,
          direction:
            key === 'name'
              ? 'asc'
              : 'desc',
        };
      },
    );
  }


  function sortLabel(
    key,
    label,
  ) {
    if (
      sort.key !==
      key
    ) {
      return label;
    }

    return (
      `${label} ${
        sort.direction ===
        'asc'
          ? '↑'
          : '↓'
      }`
    );
  }


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


      <section className="statistics-cities">

        <div className="statistics-cities__heading">

          <div>
            <p className="statistics-eyebrow">
              География
            </p>

            <h2>
              Статистика{' '}
              <em>
                по городам
              </em>
            </h2>
          </div>


          <label className="statistics-search">

            <span>
              Поиск
            </span>

            <input
              type="search"
              value={
                search
              }
              onChange={
                (event) =>
                  setSearch(
                    event
                      .target
                      .value,
                  )
              }
              placeholder="Название города"
              autoComplete="off"
            />

          </label>

        </div>


        <div className="statistics-table-wrap">

          <table className="statistics-table">

            <thead>
              <tr>

                <th>
                  <button
                    type="button"
                    onClick={
                      () =>
                        handleSort(
                          'name',
                        )
                    }
                  >
                    {sortLabel(
                      'name',
                      'Город',
                    )}
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    onClick={
                      () =>
                        handleSort(
                          'visits',
                        )
                    }
                  >
                    {sortLabel(
                      'visits',
                      'Посещения',
                    )}
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    onClick={
                      () =>
                        handleSort(
                          'leads',
                        )
                    }
                  >
                    {sortLabel(
                      'leads',
                      'Заявки',
                    )}
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    onClick={
                      () =>
                        handleSort(
                          'conversion',
                        )
                    }
                  >
                    {sortLabel(
                      'conversion',
                      'Конверсия',
                    )}
                  </button>
                </th>

              </tr>
            </thead>


            <tbody>

              {rows.map(
                (row) => (
                  <tr
                    key={
                      row.slug ||
                      row.name
                    }
                  >
                    <td>
                      {row.name}
                    </td>

                    <td>
                      {formatNumber(
                        row.visits,
                      )}
                    </td>

                    <td>
                      {formatNumber(
                        row.leads,
                      )}
                    </td>

                    <td>
                      {formatPercent(
                        row.conversion,
                        row.visits,
                      )}
                    </td>
                  </tr>
                ),
              )}

            </tbody>


            <tfoot>
              <tr>
                <td>
                  Итого
                </td>

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
            </tfoot>

          </table>

        </div>


        {rows.length === 0 && (
          <p className="statistics-empty">
            Города не найдены.
          </p>
        )}

      </section>

    </div>
  );
}
