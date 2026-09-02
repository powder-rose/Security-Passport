import Container from '../../components/ui/Container/Container';
import { prices } from '../../data/prices';
import './Prices.css';

function PriceRow({ item }) {
  return (
    <article className={`price-row${item.featured ? ' price-row--featured' : ''}`}>
      <div className="price-row__index" aria-hidden="true">{item.number}</div>

      <div className="price-row__service">
        <span className="price-row__label">{item.label}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>

      <div className="price-row__value">
        <div className="price-row__price-line">
          {item.pricePrefix ? <span className="price-row__prefix">{item.pricePrefix}</span> : null}
            <strong>{item.price}</strong>
        </div>
        {item.note ? <span className="price-row__note">{item.note}</span> : null}
      </div>

      <a
        className="price-row__action"
        href="#contact"
        aria-label={`Заказать: ${item.title}`}
      >
        <span>Заказать</span>
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export default function Prices() {
  return (
    <section className="prices-section" id="prices" aria-labelledby="prices-title">
      <Container>
        <div className="prices-section__heading">
          <div>
            <p className="prices-section__kicker">Стоимость</p>
            <h2 id="prices-title">
              Понятная стоимость <em>до начала работы</em>
            </h2>
          </div>

          <div className="prices-section__anchor" aria-label="Минимальная стоимость разработки паспорта безопасности">
            <span className="prices-section__anchor-label">Разработка паспорта</span>
            <div className="prices-section__anchor-price">
              
              <strong>9 500 ₽</strong>
            </div>
            <p>
              Итоговая стоимость зависит от состава работ, категории объекта и необходимости
              сопровождать процедуру согласования.
            </p>
          </div>
        </div>

        <div className="prices-section__list">
          {prices.map((item) => (
            <PriceRow key={item.id} item={item} />
          ))}
        </div>

        <div className="prices-section__footer">
          <div className="prices-section__footer-mark" aria-hidden="true">₽</div>
          <div className="prices-section__footer-copy">
            <p className="prices-section__footer-kicker">Сначала проверим объект</p>
            <h3>Чтобы не включать в смету работы, которые вам не нужны</h3>
            <p>
              Ответьте на вопросы экспресс-проверки или оставьте заявку. Уточним исходные данные,
              состав документов и только после этого зафиксируем стоимость проекта.
            </p>
          </div>
          <a className="button button--primary prices-express-button" href="#quiz">
              <span className="prices-express-button__label">Пройти экспресс-проверку</span>
              <span className="prices-express-button__arrow" aria-hidden="true">↗</span>
            </a>
        </div>
      </Container>
    </section>
  );
}
