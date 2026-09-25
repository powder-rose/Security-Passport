import {
  useEffect,
  useState,
} from 'react';

import {
  getLeads,
} from '../../api/adminApi';

import './LeadsPage.css';


function formatDateTime(value) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return {
      date: '—',
      time: '',
    };
  }

  return {
    date:
      new Intl.DateTimeFormat(
        'ru-RU',
        {
          timeZone:
            'Europe/Moscow',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      ).format(date),

    time:
      new Intl.DateTimeFormat(
        'ru-RU',
        {
          timeZone:
            'Europe/Moscow',
          hour: '2-digit',
          minute: '2-digit',
        },
      ).format(date),
  };
}


function pluralLeads(count) {
  const n =
    Math.abs(count) % 100;

  const n1 =
    n % 10;

  if (
    n > 10 &&
    n < 20
  ) {
    return `${count} заявок`;
  }

  if (n1 === 1) {
    return `${count} заявка`;
  }

  if (
    n1 >= 2 &&
    n1 <= 4
  ) {
    return `${count} заявки`;
  }

  return `${count} заявок`;
}


export default function LeadsPage() {
  const [
    leads,
    setLeads,
  ] = useState([]);

  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  });

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    appliedSearch,
    setAppliedSearch,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');


  async function loadLeads({
    page = 1,
    query = appliedSearch,
  } = {}) {
    setLoading(true);
    setError('');

    try {
      const result =
        await getLeads({
          page,
          limit: 50,
          search: query,
        });

      if (
        !result?.ok ||
        !Array.isArray(
          result?.leads,
        )
      ) {
        throw new Error(
          'LEADS_LOAD_FAILED',
        );
      }

      setLeads(
        result.leads,
      );

      setPagination(
        result.pagination || {
          page: 1,
          total:
            result.leads.length,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      );
    } catch (loadError) {
      console.error(
        loadError,
      );

      setError(
        'Не удалось загрузить заявки.',
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(
    () => {
      loadLeads({
        page: 1,
        query: '',
      });
    },
    [],
  );


  function submitSearch(event) {
    event.preventDefault();

    const query =
      search.trim();

    setAppliedSearch(
      query,
    );

    loadLeads({
      page: 1,
      query,
    });
  }


  function clearSearch() {
    setSearch('');
    setAppliedSearch('');

    loadLeads({
      page: 1,
      query: '',
    });
  }


  return (
    <div className="leads-page">

      <section className="leads-page__header">

        <div>
          <p className="leads-page__eyebrow">
            Обращения
          </p>

          <h1>
            Последние
            <br />

            <em>
              заявки
            </em>
          </h1>

          <p className="leads-page__count">
            {pluralLeads(
              pagination.total || 0,
            )}
          </p>
        </div>


        <form
          className="leads-page__search"
          onSubmit={
            submitSearch
          }
        >
          <label>
            <span>
              Поиск
            </span>

            <input
              type="search"
              value={search}
              onChange={
                (event) =>
                  setSearch(
                    event.target.value,
                  )
              }
              placeholder="Имя, телефон, город..."
              autoComplete="off"
            />
          </label>

          <div className="leads-page__search-actions">

            <button
              type="submit"
              disabled={loading}
            >
              Найти
            </button>

            {appliedSearch && (
              <button
                type="button"
                className="leads-page__clear"
                onClick={
                  clearSearch
                }
              >
                Сбросить
              </button>
            )}

          </div>
        </form>

      </section>


      {error && (
        <div className="leads-page__error">
          {error}
        </div>
      )}


      {loading && !leads.length ? (
        <div className="leads-page__state">
          Загрузка заявок...
        </div>
      ) : null}


      {!loading &&
      !error &&
      leads.length === 0 ? (
        <div className="leads-page__empty">
          <span>00</span>

          <p>
            Пока нет заявок.
          </p>
        </div>
      ) : null}


      {leads.length > 0 && (
        <div className="leads-page__table-wrap">

          <table className="leads-page__table">

            <thead>
              <tr>
                <th>Дата</th>
                <th>Город</th>
                <th>Источник</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Организация</th>
              </tr>
            </thead>


            <tbody>

              {leads.map(
                (lead) => {
                  const date =
                    formatDateTime(
                      lead.receivedAt,
                    );

                  return (
                    <tr
                      key={
                        lead.id ||
                        `${lead.receivedAt}-${lead.phone}`
                      }
                    >

                      <td>
                        <div className="leads-page__date">
                          <strong>
                            {date.date}
                          </strong>

                          <span>
                            {date.time}
                          </span>
                        </div>
                      </td>


                      <td>
                        <span className="leads-page__city">
                          {
                            lead?.city
                              ?.name ||
                            'Не определён'
                          }
                        </span>
                      </td>


                      <td>
                        <span className="leads-page__source">
                          {
                            lead.sourceTitle ||
                            'Форма'
                          }
                        </span>
                      </td>


                      <td className="leads-page__name">
                        {lead.name || '—'}
                      </td>


                      <td>
                        {lead.phone ? (
                          <a
                            className="leads-page__phone"
                            href={
                              `tel:${String(
                                lead.phone,
                              ).replace(
                                /[^\d+]/g,
                                '',
                              )}`
                            }
                          >
                            {lead.phone}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>


                      <td className="leads-page__company">
                        {
                          lead.company ||
                          '—'
                        }
                      </td>

                    </tr>
                  );
                },
              )}

            </tbody>

          </table>

        </div>
      )}


      {pagination.totalPages > 1 && (
        <div className="leads-page__pagination">

          <button
            type="button"
            disabled={
              loading ||
              !pagination.hasPrevious
            }
            onClick={
              () =>
                loadLeads({
                  page:
                    pagination.page -
                    1,
                })
            }
          >
            ← Назад
          </button>

          <span>
            {pagination.page}
            {' / '}
            {pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={
              loading ||
              !pagination.hasNext
            }
            onClick={
              () =>
                loadLeads({
                  page:
                    pagination.page +
                    1,
                })
            }
          >
            Далее →
          </button>

        </div>
      )}

    </div>
  );
}
