import './RegulationsPage.polish.css';
import { useEffect, useState } from 'react';
import {
  getRegulations,
  saveRegulation,
  getRegulationPublication,
  retryRegulationPublication,
} from '../../api/adminApi';

const statuses = {
  needs_review: 'Требует проверки',
  reviewed: 'Проверено',
  outdated: 'Требует обновления',
};

function reviewReminder(item) {
  if (item.reviewStatus !== 'reviewed' || !item.reviewedAt) {
    return 'Нужна проверка';
  }

  const next = new Date(`${item.reviewedAt}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 90);
  const due = next.toISOString().slice(0, 10);
  const today = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Moscow',
  });
  const display = due.split('-').reverse().join('.');

  return today > due
    ? `Повторная проверка просрочена с ${display}`
    : `Следующая проверка до ${display}`;
}

function RegulationsPageContent() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getRegulations()
      .then(result => {
        if (!result?.ok || !Array.isArray(result.regulations)) {
          throw new Error('Не удалось загрузить постановления');
        }
        if (active) {
          setItems(result.regulations);
          if (result.regulations[0]) {
            setSelected(String(result.regulations[0].number));
            setForm(result.regulations[0]);
          }
        }
      })
      .catch(error => active && setMessage(error.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    async function checkPublication() {
      try {
        const result = await getRegulationPublication();
        if (active && result?.ok) {
          setPublication(result.publication);
        }
      } catch (error) {
        if (active) {
          setPublication({ phase: 'failed', error: error.message });
        }
      }
    }

    checkPublication();
    const timer = window.setInterval(checkPublication, 4000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  function select(item) {
    setSelected(String(item.number));
    setForm(item);
    setMessage('');
  }

  function change(field, value) {
    setForm(previous => ({ ...previous, [field]: value }));
  }

  async function retryPublication() {
    try {
      const result = await retryRegulationPublication();
      if (!result?.ok) {
        throw new Error(result?.message || 'Не удалось запустить публикацию');
      }
      setPublication(result.publication);
      setMessage('Повторная публикация запущена');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const result = await saveRegulation(selected, {
        number: String(form.number || '').trim(),
        title: form.title || '',
        documentDate: form.documentDate || null,
        edition: form.edition || '',
        officialUrl: form.officialUrl || '',
        reviewStatus: form.reviewStatus || 'needs_review',
        reviewedAt: form.reviewedAt || null,
        reviewDueDate: form.reviewDueDate || null,
        reviewNote: form.reviewNote || '',
        claims: form.claims || [],
      });

      if (!result?.ok || !result.regulation) {
        throw new Error(result?.message || 'Не удалось сохранить изменения');
      }

      const nextSelected =
        String(result.regulation.number);


      setItems(previous => previous.map(item =>
        String(item.number) === selected ? result.regulation : item
      ));

      setSelected(nextSelected);
      setForm(result.regulation);
      setPublication(result.publication || null);
      setMessage(result.publication ? 'Сохранено. Публикация запущена' : 'Изменения сохранены');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Нормативные документы</h1>
      </div>

      {loading && <p>Загрузка...</p>}
      {message && <p role="status">{message}</p>}

      {!loading && (
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(190px, 1fr) minmax(0, 2fr)' }}>
          <div>
            {items.map(item => (
              <button
                key={item.number}
                type="button"
                onClick={() => select(item)}
                aria-pressed={selected === String(item.number)}
                style={{ display: 'block', width: '100%', padding: 12, marginBottom: 8, textAlign: 'left' }}
              >
                Постановление №{item.number}
                <small style={{ display: 'block', marginTop: 4 }}>
                  {reviewReminder(item)}
                </small>
              </button>
            ))}
          </div>

          {form && (
            <form onSubmit={save} style={{ display: 'grid', gap: 14 }}>
              <h2>Постановление №{form.number}</h2>

              <label>Номер постановления
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.number || ''}
                  onChange={e =>
                    change(
                      'number',
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  required
                />
              </label>

              <label>Название
                <input value={form.title || ''} onChange={e => change('title', e.target.value)} required />
              </label>

              <label>Дата постановления
                <input
                  type="date"
                  value={form.documentDate?.slice(0, 10) || ''}
                  onChange={e => change('documentDate', e.target.value)}
                />
              </label>

              

              

              <label>Статус проверки
                <select value={form.reviewStatus || 'needs_review'} onChange={e => change('reviewStatus', e.target.value)}>
                  {Object.entries(statuses).map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label>Дата проверки постановления
                <input type="date" value={form.reviewedAt?.slice(0, 10) || ''} onChange={e => change('reviewedAt', e.target.value)} />
              </label>
              
              

              

              <label>Дата окончания срока постановления
                <input
                  type="date"
                  value={form.reviewDueDate || ''}
                  onChange={e => change('reviewDueDate', e.target.value)}
                />
              </label>

              {(form.claims || []).map(claim => (
                <label key={claim.id} style={{ display: 'grid', gap: 6 }}>
                  {claim.label || claim.id}
                  <textarea
                    rows={4}
                    maxLength={1000}
                    style={{ width: '100%', boxSizing: 'border-box', padding: 10 }}
                    value={claim.text}
                    onChange={event => change(
                      'claims',
                      form.claims.map(item =>
                        item.id === claim.id
                          ? { ...item, text: event.target.value }
                          : item
                      )
                    )}
                    required
                  />
                </label>
              ))}

              <p>Упоминаний при первоначальном аудите: {form.occurrences?.length || 0}</p>
              {publication && (
                <div role="status" style={{
                  padding: 14,
                  borderRadius: 8,
                  background: '#f2f5fa',
                }}>
                  <strong>Публикация сайта: </strong>
                  {({
                    queued: 'ожидает сборки',
                    publishing: 'выполняется',
                    published: 'завершена',
                    unpublished: 'есть неопубликованные изменения',
                    failed: 'ошибка',
                  })[publication.phase] || 'статус неизвестен'}

                  {publication.phase === 'published' && publication.publishedAt && (
                    <div>
                      Завершена: {new Date(publication.publishedAt).toLocaleString('ru-RU')}
                    </div>
                  )}
                  {publication.phase === 'failed' && (
                    <>
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {String(publication.error || 'Сборка не завершилась').slice(-600)}
                      </p>
                      <button type="button" onClick={retryPublication}>
                        Повторить публикацию сохранённых изменений
                      </button>
                    </>
                  )}
                </div>
              )}
              <button type="submit" disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default function RegulationsPage() {
  return (
    <div className="admin-page regulations-page">
      <RegulationsPageContent />
    </div>
  );
}
