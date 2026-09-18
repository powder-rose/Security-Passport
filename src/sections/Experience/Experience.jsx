import Container from '../../components/ui/Container/Container';
import './Experience.css';

const experienceItems = [
  {
    index: '01',
    label: 'Паспорта безопасности',
    title: 'Разрабатываем паспорт безопасности под конкретный объект',
    text: 'Учитываем назначение объекта, категорию, режим работы, фактические меры защиты и требования применимого постановления.',
  },
  {
    index: '02',
    label: 'Категорирование',
    title: 'Готовим акты обследования и категорирования',
    text: 'Помогаем собрать исходные сведения и подготовить материалы, необходимые для работы комиссии и дальнейшей разработки паспорта.',
  },
  {
    index: '03',
    label: 'Сопровождение',
    title: 'Гарантируем согласование',
    text: 'Сопровождаем паспорт безопасности до согласования. Если согласующий орган выдаст замечания, внесём необходимые корректировки в разработанный нами документ без дополнительной оплаты и повторно подготовим его к согласованию.',
  },
];

export default function Experience() {
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <Container>
        <header className="experience__heading">
          <div className="experience__heading-main">
            <p className="experience__kicker">Практический опыт компании</p>
            <h2 id="experience-title">
              От категорирования <em>до согласованного документа</em>
            </h2>
          </div>

          <div className="experience__heading-note">
            
            <p>
              Работаем с паспортом безопасности как с последовательным проектом: сначала проверяем
              объект и основание, затем готовим документы и сопровождаем дальнейшие этапы.
            </p>
          </div>
        </header>

        <div className="experience__grid">
          {experienceItems.map((item) => (
            <article className="experience-card" key={item.index}>
              <div className="experience-card__top">
                <span className="experience-card__index" aria-hidden="true">{item.index}</span>
                <span className="experience-card__label">{item.label}</span>
              </div>

              <div className="experience-card__content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>

              <div className="experience-card__footer" aria-hidden="true">
                <span />
                <span>↗</span>
              </div>
            </article>
          ))}
        </div>

        <div className="experience__route" aria-label="Основные этапы работы">
          <span>Проверка объекта</span>
          <i aria-hidden="true">→</i>
          <span>Разработка документации</span>
          <i aria-hidden="true">→</i>
          <span>Категорирование</span>
          <i aria-hidden="true">→</i>
          <span>Паспорт безопасности</span>
          <i aria-hidden="true">→</i>
          <span>Согласование</span>
        </div>
      </Container>
    </section>
  );
}
