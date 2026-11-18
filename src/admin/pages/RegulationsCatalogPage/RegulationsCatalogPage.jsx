import { useEffect, useState } from 'react';

import { adminRequest } from '../../api/adminApi.js';
import CatalogCardEditor from './CatalogCardEditor.jsx';
import CatalogContentEditor from './CatalogContentEditor.jsx';

import './RegulationsCatalogAdmin.css';

async function request(options) {
  const result = await adminRequest('/directions', options);
  if (!result?.ok) throw new Error(result?.message || 'Не удалось загрузить каталог.');
  return result;
}

export default function RegulationsCatalogPage() {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    request()
      .then(result => {
        if (active) {
          setData(result);
          setSelectedId(result.cards[0]?.id || '');
        }
      })
      .catch(error => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  function update(next) {
    setData(next);
    setMessage('Есть несохранённые изменения.');
  }
  function updateCard(card) {
    update({ ...data, cards: data.cards.map(item => (item.id === card.id ? card : item)) });
  }
  function addCard() {
    const id = crypto.randomUUID();
    update({
      ...data,
      cards: [
        ...data.cards,
        {
          id,
          title: '',
          regulation: '',
          description: '',
          url: '',
          order: Math.min(100000, Math.max(0, ...data.cards.map(card => card.order)) + 10),
          menuOrder: Math.min(100000, Math.max(0, ...data.cards.map(card => card.menuOrder)) + 10),
          showInCatalog: false,
          showInMenu: false,
        },
      ],
    });
    setSelectedId(id);
  }
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await request({
        method: 'PUT',
        body: JSON.stringify({
          revision: data.revision,
          settings: data.settings,
          cards: data.cards,
        }),
      });
      setData(result);
      setMessage(
        'Сохранено. Каталог обновлён; меню использует новые настройки при открытии страницы.',
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  const selected = data?.cards.find(card => card.id === selectedId);
  return (
    <div className="admin-catalog">
      <div className="admin-catalog-heading">
        <div>
          <h1>Каталог постановлений</h1>
          <p>Единый перечень направлений. Порядок и видимость в меню управляются отдельно.</p>
        </div>
        <a href="/postanovleniya/" target="_blank" rel="noreferrer">
          Открыть каталог ↗
        </a>
      </div>
      {error && (
        <p className="admin-catalog-error" role="alert">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {!data && !error && <p>Загрузка…</p>}
      {data && (
        <form onSubmit={save} noValidate>
          <fieldset disabled={busy}>
            <div className="admin-catalog-layout">
              <div className="admin-catalog-panel">
                <div className="admin-catalog-list-heading">
                  <h2>Направления</h2>
                  <button type="button" onClick={addCard}>
                    Добавить
                  </button>
                </div>
                <ol className="admin-catalog-cards">
                  {[...data.cards]
                    .sort((a, b) => a.order - b.order)
                    .map(card => (
                      <li key={card.id}>
                        <button
                          className={card.id === selectedId ? 'is-selected' : undefined}
                          type="button"
                          onClick={() => setSelectedId(card.id)}
                        >
                          <span>{card.order}</span>
                          <span>
                            {card.title || 'Новое направление'}
                            <small>
                              {card.showInCatalog ? 'В каталоге' : 'Скрыто'}
                              {card.showInMenu ? ' · В меню' : ''}
                            </small>
                          </span>
                        </button>
                      </li>
                    ))}
                </ol>
              </div>
              {selected && (
                <CatalogCardEditor
                  card={selected}
                  pages={data.pages}
                  onChange={updateCard}
                  onRemove={() => {
                    update({ ...data, cards: data.cards.filter(card => card.id !== selected.id) });
                    setSelectedId(data.cards.find(card => card.id !== selected.id)?.id || '');
                  }}
                />
              )}
            </div>
            <CatalogContentEditor
              settings={data.settings}
              onChange={settings => update({ ...data, settings })}
            />
            <div className="admin-catalog-save">
              <button className="admin-button" type="submit">
                {busy ? 'Сохранение…' : 'Сохранить каталог'}
              </button>
              <span>Изменения применяются после сохранения.</span>
            </div>
          </fieldset>
        </form>
      )}
    </div>
  );
}
