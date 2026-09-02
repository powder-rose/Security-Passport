import { useState } from 'react';
import Container from '../../components/ui/Container/Container';
import { faq } from '../../data/faq';
import './FAQ.css';

function FAQItem({ item, index, isOpen, onToggle }) {
  const buttonId = `faq-button-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <article className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <h3 className="faq-item__heading">
        <button
          id={buttonId}
          className="faq-item__button"
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="faq-item__number" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="faq-item__question">{item.question}</span>
          <span className="faq-item__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        className="faq-item__panel"
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
      >
        <div className="faq-item__answer">
          <p>{item.answer}</p>
        </div>
      </div>
    </article>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState(faq[0]?.id ?? null);

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <Container>
        <div className="faq__heading">
          <div>
            <p className="faq__kicker">Вопрос — ответ</p>
            <h2 id="faq-title">
              Частые вопросы <em>о паспорте безопасности</em>
            </h2>
          </div>

          <div className="faq__intro">
            <p>
              Собрали ответы на вопросы, которые чаще всего возникают до категорирования,
              разработки и согласования документа.
            </p>
            <a href="#quiz">Не нашли свой вопрос? Проверить объект ↘</a>
          </div>
        </div>

        <div className="faq__list">
          {faq.map((item, index) => (
            <FAQItem
              key={item.id}
              item={item}
              index={index}
              isOpen={openId === item.id}
              onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
