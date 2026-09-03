const loginView =
  document.querySelector('#login-view');

const dashboardView =
  document.querySelector('#dashboard-view');

const loginForm =
  document.querySelector('#login-form');

const passwordInput =
  document.querySelector('#password');

const loginError =
  document.querySelector('#login-error');

const logoutButton =
  document.querySelector('#logout-button');

const refreshButton =
  document.querySelector('#refresh-button');

const periodTabs =
  document.querySelector('#period-tabs');

const searchInput =
  document.querySelector('#city-search');

const tableBody =
  document.querySelector('#cities-body');

const emptyState =
  document.querySelector('#empty-state');

const cityPageInfo =
  document.querySelector('#city-page-info');

const cityPagePrev =
  document.querySelector('#city-page-prev');

const cityPageNext =
  document.querySelector('#city-page-next');

const leadsBody =
  document.querySelector('#leads-body');

const leadsEmpty =
  document.querySelector('#leads-empty');

const leadsCount =
  document.querySelector('#leads-count');

const leadSearchInput =
  document.querySelector('#lead-search');

const leadsPageInfo =
  document.querySelector('#leads-page-info');

const leadsPagePrev =
  document.querySelector('#leads-page-prev');

const leadsPageNext =
  document.querySelector('#leads-page-next');


const state = {
  statistics: null,
  leads: [],

  period: 'day',

  search: '',
  leadSearch: '',

  leadPage: 1,
  leadPageSize: 50,

  leadPagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  },

  cityPage: 1,
  cityPageSize: 50,

  sort: {
    key: 'leads',
    direction: 'desc',
  },
};


function formatNumber(value) {
  return new Intl.NumberFormat(
    'ru-RU',
  ).format(Number(value) || 0);
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
  ).format(new Date(value));
}


function formatDateTime(value) {
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
  ).format(new Date(value));
}


function formatRange(range) {
  const end =
    new Date(
      new Date(range.end).getTime() - 1,
    );

  const startText =
    formatDate(range.start);

  const endText =
    formatDate(end);

  if (startText === endText) {
    return startText;
  }

  return `${startText} — ${endText}`;
}


function showLogin() {
  dashboardView.hidden = true;
  loginView.hidden = false;

  setTimeout(
    () => passwordInput.focus(),
    0,
  );
}


function showDashboard() {
  loginView.hidden = true;
  dashboardView.hidden = false;
}


function getCurrentPeriod() {
  return (
    state.statistics
      ?.periods
      ?.[state.period]
    || null
  );
}


function sortRows(rows) {
  const {
    key,
    direction,
  } = state.sort;

  const factor =
    direction === 'asc'
      ? 1
      : -1;

  return [...rows].sort(
    (a, b) => {
      if (key === 'name') {
        return (
          a.name.localeCompare(
            b.name,
            'ru',
          ) * factor
        );
      }

      const first =
        Number(a[key]) || 0;

      const second =
        Number(b[key]) || 0;

      if (first === second) {
        return a.name.localeCompare(
          b.name,
          'ru',
        );
      }

      return (
        (first - second) *
        factor
      );
    },
  );
}


function getVisibleRows(period) {
  const search =
    state.search
      .trim()
      .toLocaleLowerCase('ru');

  let rows = period.rows;

  if (search) {
    rows = rows.filter(
      (row) =>
        row.name
          .toLocaleLowerCase('ru')
          .includes(search),
    );
  }

  return sortRows(rows);
}


function updateSortHeaders() {
  document
    .querySelectorAll(
      '[data-sort]',
    )
    .forEach((button) => {
      const key =
        button.dataset.sort;

      const labels = {
        name: 'Город',
        visits: 'Посещения',
        leads: 'Заявки',
        conversion: 'Конверсия',
      };

      button.classList.toggle(
        'is-sorted',
        key === state.sort.key,
      );

      button.textContent =
        labels[key] +
        (
          key === state.sort.key
            ? (
                state.sort.direction ===
                'asc'
                  ? ' ↑'
                  : ' ↓'
              )
            : ''
        );
    });
}


function updateCityPagination(
  totalRows,
) {
  const pageSize =
    state.cityPageSize;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRows / pageSize,
      ),
    );

  if (
    state.cityPage >
    totalPages
  ) {
    state.cityPage =
      totalPages;
  }

  if (!totalRows) {
    cityPageInfo.textContent =
      '0 из 0';

    cityPagePrev.disabled = true;
    cityPageNext.disabled = true;

    return;
  }

  const start =
    (
      state.cityPage - 1
    )
    *
    pageSize
    +
    1;

  const end =
    Math.min(
      state.cityPage
        *
        pageSize,

      totalRows,
    );

  cityPageInfo.textContent =
    `${start}–${end} из ${totalRows}`;

  cityPagePrev.disabled =
    state.cityPage <= 1;

  cityPageNext.disabled =
    state.cityPage >=
    totalPages;
}


function renderTable(period) {
  const rows =
    getVisibleRows(period);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        rows.length /
        state.cityPageSize,
      ),
    );

  if (
    state.cityPage >
    totalPages
  ) {
    state.cityPage =
      totalPages;
  }

  const offset =
    (
      state.cityPage - 1
    )
    *
    state.cityPageSize;

  const pageRows =
    rows.slice(
      offset,
      offset +
      state.cityPageSize,
    );

  tableBody.innerHTML = '';

  for (const row of pageRows) {
    const tr =
      document.createElement('tr');

    const name =
      document.createElement('td');

    const visits =
      document.createElement('td');

    const leads =
      document.createElement('td');

    const conversion =
      document.createElement('td');

    name.textContent =
      row.name;

    visits.textContent =
      formatNumber(
        row.visits,
      );

    leads.textContent =
      formatNumber(
        row.leads,
      );

    conversion.textContent =
      formatPercent(
        row.conversion,
        row.visits,
      );

    tr.append(
      name,
      visits,
      leads,
      conversion,
    );

    tableBody.append(tr);
  }

  emptyState.hidden =
    rows.length > 0;

  document.querySelector(
    '#footer-visits',
  ).textContent =
    formatNumber(
      period.totals.visits,
    );

  document.querySelector(
    '#footer-leads',
  ).textContent =
    formatNumber(
      period.totals.leads,
    );

  document.querySelector(
    '#footer-conversion',
  ).textContent =
    formatPercent(
      period.totals.conversion,
      period.totals.visits,
    );

  updateCityPagination(
    rows.length,
  );

  updateSortHeaders();
}


function getLeadSearchText(lead) {
  return [
    lead?.city?.name,
    lead?.name,
    lead?.phone,
    lead?.email,
    lead?.company,
    lead?.sourceTitle,
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('ru');
}


function pluralLeads(count) {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) return `${count} заявок`;
  if (n1 === 1) return `${count} заявка`;
  if (n1 >= 2 && n1 <= 4) return `${count} заявки`;

  return `${count} заявок`;
}


function renderLeads() {
  const rows =
    state.leads;

  const pagination =
    state.leadPagination;

  leadsBody.innerHTML = '';

  leadsCount.textContent =
    pluralLeads(
      pagination.total || 0,
    );

  if (!pagination.total) {
    leadsPageInfo.textContent =
      '0 из 0';
  } else {
    const start =
      (
        pagination.page - 1
      )
      *
      pagination.limit
      +
      1;

    const end =
      Math.min(
        pagination.page *
        pagination.limit,

        pagination.total,
      );

    leadsPageInfo.textContent =
      `${start}–${end} из ${pagination.total}`;
  }

  leadsPagePrev.disabled =
    !pagination.hasPrevious;

  leadsPageNext.disabled =
    !pagination.hasNext;

  for (const lead of rows) {
    const tr = document.createElement('tr');

    const dateCell = document.createElement('td');
    const dateWrap = document.createElement('div');
    dateWrap.className = 'lead-date';

    const dateStrong = document.createElement('strong');
    const timeSpan = document.createElement('span');

    const receivedAt = new Date(lead.receivedAt);

    if (Number.isNaN(receivedAt.getTime())) {
      dateStrong.textContent = '—';
      timeSpan.textContent = '';
    } else {
      dateStrong.textContent =
        new Intl.DateTimeFormat('ru-RU', {
          timeZone: 'Europe/Moscow',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(receivedAt);

      timeSpan.textContent =
        new Intl.DateTimeFormat('ru-RU', {
          timeZone: 'Europe/Moscow',
          hour: '2-digit',
          minute: '2-digit',
        }).format(receivedAt);
    }

    dateWrap.append(dateStrong, timeSpan);
    dateCell.append(dateWrap);


    const cityCell = document.createElement('td');
    const city = document.createElement('span');

    city.className = 'lead-city';
    city.textContent = lead?.city?.name || 'Не определён';

    cityCell.append(city);


    const sourceCell = document.createElement('td');
    const source = document.createElement('span');

    source.className = 'lead-source';
    source.textContent = lead.sourceTitle || 'Форма';

    sourceCell.append(source);


    const nameCell = document.createElement('td');
    nameCell.className = 'lead-name';
    nameCell.textContent = lead.name || '—';


    const phoneCell = document.createElement('td');

    if (lead.phone) {
      const phone = document.createElement('a');

      phone.className = 'lead-phone';
      phone.href =
        `tel:${String(lead.phone).replace(/[^\\d+]/g, '')}`;
      phone.textContent = lead.phone;

      phoneCell.append(phone);
    } else {
      phoneCell.textContent = '—';
    }


    const companyCell = document.createElement('td');
    companyCell.className = 'lead-company';
    companyCell.textContent = lead.company || '—';


    tr.append(
      dateCell,
      cityCell,
      sourceCell,
      nameCell,
      phoneCell,
      companyCell,
    );

    leadsBody.append(tr);
  }

  leadsEmpty.hidden = rows.length !== 0;

  const table =
    document.querySelector('.leads-table-wrap');

  table.hidden = rows.length === 0;
}


function render() {
  const period =
    getCurrentPeriod();

  if (!period) {
    return;
  }

  const range =
    formatRange(period.range);

  document.querySelector(
    '#total-visits',
  ).textContent =
    formatNumber(
      period.totals.visits,
    );

  document.querySelector(
    '#total-leads',
  ).textContent =
    formatNumber(
      period.totals.leads,
    );

  document.querySelector(
    '#total-conversion',
  ).textContent =
    formatPercent(
      period.totals.conversion,
      period.totals.visits,
    );

  document.querySelector(
    '#period-range-visits',
  ).textContent = range;

  document.querySelector(
    '#period-range-leads',
  ).textContent = range;

  document.querySelector(
    '#generated-at',
  ).textContent =
    `Обновлено ${formatDateTime(
      state.statistics.generatedAt,
    )} · МСК`;

  document
    .querySelectorAll(
      '[data-period]',
    )
    .forEach((button) => {
      button.classList.toggle(
        'is-active',
        button.dataset.period ===
          state.period,
      );
    });

  renderTable(period);
  renderLeads();
}


async function loadLeads() {
  const params =
    new URLSearchParams({
      page:
        String(
          state.leadPage,
        ),

      limit:
        String(
          state.leadPageSize,
        ),
    });

  const query =
    state.leadSearch.trim();

  if (query) {
    params.set(
      'search',
      query,
    );
  }


  const response =
    await fetch(
      `/api/admin/leads?${params}`,
      {
        headers: {
          Accept:
            'application/json',
        },
      },
    );


  if (response.status === 401) {
    showLogin();
    return false;
  }


  if (!response.ok) {
    throw new Error(
      `LEADS HTTP ${response.status}`,
    );
  }


  const result =
    await response.json();


  state.leads =
    Array.isArray(
      result.leads,
    )
      ? result.leads
      : [];


  state.leadPagination =
    result.pagination || {
      page:
        1,

      limit:
        state.leadPageSize,

      total:
        state.leads.length,

      totalPages:
        1,

      hasPrevious:
        false,

      hasNext:
        false,
    };


  state.leadPage =
    state.leadPagination.page ||
    1;


  return true;
}


async function loadStatistics() {
  refreshButton.disabled = true;

  try {
    const response =
      await fetch(
        '/api/admin/statistics',
        {
          headers: {
            Accept:
              'application/json',
          },
        },
      );

    if (response.status === 401) {
      showLogin();
      return;
    }

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`,
      );
    }

    state.statistics =
      await response.json();

    const leadsLoaded =
      await loadLeads();

    if (!leadsLoaded) {
      return;
    }

    showDashboard();
    render();
  } catch (error) {
    console.error(error);

    alert(
      'Не удалось загрузить статистику.',
    );
  } finally {
    refreshButton.disabled = false;
  }
}


async function checkSession() {
  try {
    const response =
      await fetch(
        '/api/admin/session',
        {
          headers: {
            Accept:
              'application/json',
          },
        },
      );

    if (!response.ok) {
      showLogin();
      return;
    }

    await loadStatistics();
  } catch {
    showLogin();
  }
}


loginForm.addEventListener(
  'submit',
  async (event) => {
    event.preventDefault();

    loginError.hidden = true;

    const submitButton =
      loginForm.querySelector(
        'button[type="submit"]',
      );

    submitButton.disabled = true;

    try {
      const response =
        await fetch(
          '/api/admin/login',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json',
            },

            body: JSON.stringify({
              password:
                passwordInput.value,
            }),
          },
        );

      if (!response.ok) {
        loginError.textContent =
          response.status === 429
            ? 'Слишком много попыток. Попробуйте позже.'
            : 'Неверный пароль.';

        loginError.hidden = false;
        return;
      }

      passwordInput.value = '';

      await loadStatistics();

    } catch {
      loginError.textContent =
        'Не удалось выполнить вход.';

      loginError.hidden = false;

    } finally {
      submitButton.disabled = false;
    }
  },
);


logoutButton.addEventListener(
  'click',
  async () => {
    try {
      await fetch(
        '/api/admin/logout',
        {
          method: 'POST',
        },
      );
    } finally {
      state.statistics = null;
      state.leads = [];
      showLogin();
    }
  },
);


refreshButton.addEventListener(
  'click',
  () => {
    loadStatistics();
  },
);


periodTabs.addEventListener(
  'click',
  (event) => {
    const button =
      event.target.closest(
        '[data-period]',
      );

    if (!button) return;

    state.period =
      button.dataset.period;

    state.cityPage = 1;

    render();
  },
);


searchInput.addEventListener(
  'input',
  () => {
    state.search =
      searchInput.value;

    state.cityPage = 1;

    const period =
      getCurrentPeriod();

    if (period) {
      renderTable(period);
    }
  },
);


let leadSearchTimer = null;


leadSearchInput.addEventListener(
  'input',
  () => {
    clearTimeout(
      leadSearchTimer,
    );

    state.leadSearch =
      leadSearchInput.value;

    state.leadPage = 1;


    leadSearchTimer =
      setTimeout(
        async () => {
          try {
            const loaded =
              await loadLeads();

            if (loaded) {
              renderLeads();
            }
          } catch (error) {
            console.error(
              error,
            );
          }
        },
        250,
      );
  },
);


leadsPagePrev.addEventListener(
  'click',
  async () => {
    if (
      !state.leadPagination
        .hasPrevious
    ) {
      return;
    }

    state.leadPage -= 1;

    const loaded =
      await loadLeads();

    if (loaded) {
      renderLeads();
    }
  },
);


leadsPageNext.addEventListener(
  'click',
  async () => {
    if (
      !state.leadPagination
        .hasNext
    ) {
      return;
    }

    state.leadPage += 1;

    const loaded =
      await loadLeads();

    if (loaded) {
      renderLeads();
    }
  },
);


document.addEventListener(
  'click',
  (event) => {
    const button =
      event.target.closest(
        '[data-sort]',
      );

    if (!button) return;

    const key =
      button.dataset.sort;

    if (state.sort.key === key) {
      state.sort.direction =
        state.sort.direction ===
        'desc'
          ? 'asc'
          : 'desc';
    } else {
      state.sort.key = key;

      state.sort.direction =
        key === 'name'
          ? 'asc'
          : 'desc';
    }

    state.cityPage = 1;

    const period =
      getCurrentPeriod();

    if (period) {
      renderTable(period);
    }
  },
);


cityPagePrev.addEventListener(
  'click',
  () => {
    if (
      state.cityPage <= 1
    ) {
      return;
    }

    state.cityPage -= 1;

    const period =
      getCurrentPeriod();

    if (period) {
      renderTable(period);
    }
  },
);


cityPageNext.addEventListener(
  'click',
  () => {
    const period =
      getCurrentPeriod();

    if (!period) {
      return;
    }

    const rows =
      getVisibleRows(period);

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          rows.length /
          state.cityPageSize,
        ),
      );

    if (
      state.cityPage >=
      totalPages
    ) {
      return;
    }

    state.cityPage += 1;

    renderTable(period);
  },
);


/*
 * Админка централизованная.
 * Если страницу случайно открыть
 * на региональном поддомене,
 * отправляем на основной домен.
 */
if (
  window.location.hostname !==
  'pasport-bezopasnosty.ru'
) {
  window.location.replace(
    'https://pasport-bezopasnosty.ru/admin/',
  );
} else {
  checkSession();
}
