import Container from '../../components/ui/Container/Container';
import './Advantages.css';

const advantages = [
  {
    number: '01',
    eyebrow: 'Соответствие требованиям',
    title: 'Снижаем риск штрафов и претензий',
    text: 'Паспорт безопасности готовится по действующим требованиям законодательства и с учётом особенностей конкретного объекта.',
    badge: 'Отсутствие штрафов',
    variant: 'wide',
  },
  {
    number: '02',
    eyebrow: 'Экспертиза',
    title: 'Учитываем практику согласования',
    text: 'Специалисты регулярно разрабатывают паспорта безопасности и учитывают требования ведомств и нюансы прохождения согласования.',
    badge: 'Практический опыт',
  },
  {
    number: '03',
    eyebrow: 'Ответственность',
    title: 'Фиксируем обязательства в договоре',
    text: 'Состав работ, требования к результату и обязательства по разработке документа закрепляются договором до начала проекта.',
    badge: 'Гарантии в договоре',
    variant: 'dark',
  },
  {
    number: '04',
    eyebrow: 'Проверки',
    title: 'Документ подтверждает соблюдение требований',
    text: 'Корректно оформленный паспорт безопасности помогает подтвердить выполнение установленных требований при проверках.',
    badge: 'Юридическая защита',
    variant: 'wide-end',
  },
];

function AdvantageCard({ item }) {
  const className = [
    'advantage-card',
    item.variant ? `advantage-card--${item.variant}` : '',
  ].filter(Boolean).join(' ');

  return (
    <article className={className}>
      <div className="advantage-card__top">
        <span className="advantage-card__number" aria-hidden="true">{item.number}</span>
        <span className="advantage-card__eyebrow">{item.eyebrow}</span>
      </div>

      <div className="advantage-card__body">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>

      <div className="advantage-card__footer">
        <span className="advantage-card__badge">{item.badge}</span>
        <span className="advantage-card__mark" aria-hidden="true">↗</span>
      </div>
    </article>
  );
}

export default function Advantages() {
  return (
    <section className="advantages" id="advantages" aria-labelledby="advantages-title">
      <Container>
        <div className="advantages__heading">
          <div>
            <p className="advantages__kicker">Почему выбирают нас</p>
            <h2 id="advantages-title">
              Не просто готовим документ — <em>доводим его до результата</em>
            </h2>
          </div>

          <div className="advantages__lead">
            <span className="advantages__lead-line" aria-hidden="true" />
            <p>
              Важен не сам файл, а документ, который соответствует требованиям, учитывает специфику
              объекта и не создаёт лишних вопросов при согласовании и проверках.
            </p>
          </div>
        </div>

        <div className="advantages__grid">
          {advantages.map((item) => (
            <AdvantageCard key={item.number} item={item} />
          ))}
        </div>

        <div className="advantages__cta">
          <div>
            <p className="advantages__cta-label">Нужен понятный состав работ?</p>
            <h3>Проверим объект и зафиксируем результат до старта проекта</h3>
          </div>
          <a className="button button--primary advantages-discuss-button" href="#contact">
              <span className="advantages-discuss-button__label">Обсудить объект</span>
              <span className="advantages-discuss-button__arrow" aria-hidden="true">↗</span>
            </a>
        </div>
      </Container>
    </section>
  );
}
