import { useEffect, useState } from 'react';
import { getDailyReportStatus } from '../../api/adminApi.js';
import { formatPublicationDate } from '../../../../shared/contracts/article-schedule.js';
import './DashboardPage.css';

export default function DashboardPage() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getDailyReportStatus()
      .then(result => {
        if (!result?.ok) throw new Error('Unavailable');
        if (active) setReport(result.report);
      })
      .catch(() => {
        if (active) setError('Не удалось загрузить статус ежедневного отчёта.');
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="admin-dashboard">
      <p className="admin-dashboard__eyebrow">БОЙКОВГРУПП · Управление сайтом</p>
      <h1>
        Рабочий стол<span>.</span>
      </h1>
      <p className="admin-dashboard__intro">Контент, заявки и ежедневная сводка в одном месте.</p>
      <div className="admin-dashboard__links">
        <a href="/admin/articles">
          Статьи <span>Редактирование материалов ↗</span>
        </a>
        <a href="/admin/publications">
          План публикаций <span>Время выхода и история ↗</span>
        </a>
        <a href="/admin/leads">
          Заявки <span>Контакты и обращения ↗</span>
        </a>
      </div>
      <section className="admin-dashboard__report" aria-labelledby="daily-report-heading">
        <div className="admin-dashboard__report-heading">
          <div>
            <p>Каждое утро</p>
            <h2 id="daily-report-heading">Статистика и заявки</h2>
          </div>
          <strong>
            09:00 <span>МСК</span>
          </strong>
        </div>
        <p>
          Посещения, конверсия и заявки за предыдущий день. Контакты и ответы анкеты — в письме и
          приложенных файлах.
        </p>
        {error ? (
          <p role="alert">{error}</p>
        ) : !report ? (
          <p role="status">Проверяем отправку…</p>
        ) : (
          <>
            <div className="admin-dashboard__report-recipient">
              Получатель <strong>{report.recipient}</strong>
            </div>
            <p className="admin-dashboard__report-status" role="status">
              {!report.configured
                ? 'Нужно подключить почтовый сервер. Письма пока не отправляются.'
                : !report.timerEnabled
                  ? 'Почта подключена. Нужно включить ежедневное расписание на сервере.'
                  : report.status === 'unavailable'
                    ? 'Не удалось прочитать статус последней отправки отчёта.'
                    : report.status === 'error'
                      ? 'Последняя отправка завершилась ошибкой. Проверьте почтовое подключение.'
                      : report.status === 'sending'
                        ? 'Отчёт отправляется.'
                        : report.status === 'sent'
                          ? `Последний отчёт отправлен ${formatPublicationDate(report.sentAt)} МСК.`
                          : 'Ежедневное расписание включено. Ожидается первая отправка.'}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
