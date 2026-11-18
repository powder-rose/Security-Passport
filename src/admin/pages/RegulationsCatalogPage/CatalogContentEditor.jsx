const fields = {
  seoTitle: 'SEO Title',
  seoDescription: 'SEO Description',
  title: 'Заголовок страницы · H1',
  intro: 'Вступление · абзацы через пустую строку',
  notice: 'Пояснение об области применения',
  catalogTitle: 'Заголовок перечня',
  catalogIntro: 'Текст перед перечнем',
  infoTitle: 'Заголовок информационного блока',
  infoText: 'Текст информационного блока',
  faqTitle: 'Заголовок FAQ',
  ctaButton: 'Кнопка формы обращения',
  ctaTitle: 'Заголовок формы обращения',
  ctaText: 'Текст перед формой',
};

export default function CatalogContentEditor({ settings, onChange }) {
  const changeFaq = (index, patch) =>
    onChange({
      ...settings,
      faq: settings.faq.map((item, position) =>
        position === index ? { ...item, ...patch } : item,
      ),
    });
  return (
    <details className="admin-catalog-panel">
      <summary>Тексты страницы и SEO</summary>
      <div className="admin-catalog-fields">
        {Object.entries(fields).map(([key, label]) => (
          <div className="admin-catalog-field" key={key}>
            <label htmlFor={`catalog-setting-${key}`}>{label}</label>
            <textarea
              id={`catalog-setting-${key}`}
              rows={['intro', 'infoText', 'catalogIntro'].includes(key) ? 6 : 2}
              value={settings[key]}
              onChange={event => onChange({ ...settings, [key]: event.target.value })}
              required
            />
          </div>
        ))}
        <h2>Вопросы и ответы</h2>
        {settings.faq.map((item, index) => (
          <div key={item.id} className="admin-catalog-faq-row">
            <label>
              <span>Вопрос {index + 1}</span>
              <input
                value={item.question}
                onChange={event => changeFaq(index, { question: event.target.value })}
                required
              />
            </label>
            <div className="admin-catalog-field">
              <label htmlFor={`catalog-faq-answer-${item.id}`}>Ответ {index + 1}</label>
              <textarea
                id={`catalog-faq-answer-${item.id}`}
                rows="3"
                value={item.answer}
                onChange={event => changeFaq(index, { answer: event.target.value })}
                required
              />
            </div>
            <button
              type="button"
              disabled={settings.faq.length <= 1}
              onClick={() =>
                onChange({
                  ...settings,
                  faq: settings.faq.filter((_, position) => position !== index),
                })
              }
            >
              Удалить вопрос
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={settings.faq.length >= 30}
          onClick={() =>
            onChange({
              ...settings,
              faq: [...settings.faq, { id: crypto.randomUUID(), question: '', answer: '' }],
            })
          }
        >
          Добавить вопрос
        </button>
      </div>
    </details>
  );
}
