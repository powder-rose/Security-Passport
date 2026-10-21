import Container from '../../components/ui/Container/Container';
import { faq } from '../../data/faq';
import FAQList from './FAQList';
import './FAQ.css';

export default function FAQ() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <Container>
        <div className="faq__heading">
          <div>
            <p className="faq__kicker">Вопрос — ответ</p>
            <h2 id="faq-title">
              Частые вопросы <em>о{'\u00A0'}паспорте безопасности</em>
            </h2>
          </div>

          <div className="faq__intro">
            <p>
              Собрали ответы на вопросы, которые чаще всего возникают до категорирования, разработки
              и{'\u00A0'}согласования документа.
            </p>
            <a href="#quiz">Не нашли свой вопрос? Проверить объект ↘</a>
          </div>
        </div>

        <FAQList items={faq} />
      </Container>
    </section>
  );
}
