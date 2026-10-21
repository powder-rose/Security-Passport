import Container from '../../components/ui/Container/Container';
import { prices } from '../../data/prices';
import PriceRow from './PriceRow';
import './Prices.css';

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

          <div
            className="prices-section__anchor"
            aria-label="Минимальная стоимость разработки паспорта безопасности"
          >
            <span className="prices-section__anchor-label">Разработка паспорта</span>
            <div className="prices-section__anchor-price">
              <strong>9 500 ₽</strong>
            </div>
            <p>
              Итоговая стоимость зависит от состава работ, категории объекта и{'\u00A0'}
              необходимости сопровождать процедуру согласования.
            </p>
          </div>
        </div>

        <div className="prices-section__list">
          {prices.map(item => (
            <PriceRow key={item.id} item={item} />
          ))}
        </div>

        <div className="prices-section__footer">
          <div className="prices-section__footer-mark" aria-hidden="true">
            ₽
          </div>
          <div className="prices-section__footer-copy">
            <p className="prices-section__footer-kicker">Сначала проверим объект</p>
            <h3>
              Чтобы не{'\u00A0'}включать в{'\u00A0'}смету работы, которые вам не{'\u00A0'}нужны
            </h3>
            <p>
              Ответьте на вопросы экспресс-проверки или оставьте заявку. Уточним исходные данные,
              состав документов и{'\u00A0'}только после этого зафиксируем стоимость проекта.
            </p>
          </div>
          <a className="button button--primary prices-express-button" href="#quiz">
            <span className="prices-express-button__label">Пройти экспресс-проверку</span>
            <span className="prices-express-button__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
