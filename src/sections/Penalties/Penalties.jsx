import Container from '../../components/ui/Container/Container';
import './Penalties.css';

const penaltyItems = [
  {
    number: '01',
    audience: 'Для граждан',
    min: '3 000 ₽',
    max: '5 000 ₽',
    note: 'Административный штраф при нарушении требований к антитеррористической защищённости.',
  },
  {
    number: '02',
    audience: 'Для должностных лиц',
    min: '30 000 ₽',
    max: '50 000 ₽',
    note: 'Также возможно административное наказание в виде дисквалификации на срок от 6 месяцев до 3 лет.',
  },
  {
    number: '03',
    audience: 'Для юридических лиц',
    min: '100 000 ₽',
    max: '500 000 ₽',
    note: 'Наибольший диапазон штрафа предусмотрен для организаций.',
    featured: true,
  },
];

function PenaltyCard({ item }) {
  return (
    <article className={`penalty-card${item.featured ? ' penalty-card--featured' : ''}`}>
      <div className="penalty-card__top">
        <span className="penalty-card__number" aria-hidden="true">{item.number}</span>
        <span className="penalty-card__label">Штраф</span>
      </div>

      <div className="penalty-card__amount" aria-label={`Штраф от ${item.min} до ${item.max} рублей`}>
        <div className="penalty-card__amount-line">
          <span className="penalty-card__prefix">от</span>
          <strong>
            {item.min.replace(' ₽', '')}<span className="penalty-card__ruble">₽</span>
          </strong>
        </div>

        <div className="penalty-card__amount-line">
          <span className="penalty-card__prefix">до</span>
          <strong>
            {item.max.replace(' ₽', '')}<span className="penalty-card__ruble">₽</span>
          </strong>
        </div>
      </div>

      <div className="penalty-card__copy">
        <h3>{item.audience}</h3>
        <p>{item.note}</p>
      </div>
    </article>
  );
}

export default function Penalties() {
  return (
    <section className="penalties" id="penalties" aria-labelledby="penalties-title">
      <Container>
        <div className="penalties__heading">
          <div>
            <p className="penalties__kicker">Ответственность</p>
            <h2 id="penalties-title">
              Штрафы за нарушение требований могут быть <em>дороже разработки документа</em>
            </h2>
          </div>

          <aside className="penalties__law" aria-label="Правовое основание">
            <span className="penalties__law-index" aria-hidden="true">20.35</span>
            <div>
              <p className="penalties__law-label">Часть 1 статьи 20.35 КоАП РФ</p>
              <p>
                За нарушение требований к антитеррористической защищённости объектов предусмотрена
                административная ответственность. Размер зависит от статуса лица, привлекаемого к ответственности.
              </p>
            </div>
          </aside>
        </div>

        <div className="penalties__grid" aria-label="Размеры административных штрафов">
          {penaltyItems.map((item) => (
            <PenaltyCard key={item.number} item={item} />
          ))}
        </div>

        <div className="penalties__footer">
          <div className="penalties__footer-mark" aria-hidden="true">!</div>
          <div className="penalties__footer-copy">
            <p className="penalties__footer-kicker">Важно проверить основание</p>
            <h3>Сначала определяем, распространяются ли требования именно на ваш объект</h3>
            <p>
              Само по себе отсутствие паспорта не означает автоматического штрафа для любого здания.
              Ответственность возникает за нарушение обязательных требований, применимых к конкретному объекту.
            </p>
          </div>
          <a className="penalties__action" href="#quiz">
            <span>Проверить объект</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
