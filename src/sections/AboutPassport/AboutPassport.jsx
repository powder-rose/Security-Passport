import Container from '../../components/ui/Container/Container';
import './AboutPassport.css';

const passportLayers = [
  {
    number: '01',
    title: 'Сведения об объекте',
    text: 'Назначение, характеристики здания или территории, режим работы, посещаемость и ключевые организационные данные.',
  },
  {
    number: '02',
    title: 'Возможные угрозы',
    text: 'Факторы риска, уязвимые места и сценарии, которые учитываются при оценке антитеррористической защищённости.',
  },
  {
    number: '03',
    title: 'Меры защиты',
    text: 'Организационные, режимные и инженерно-технические решения, фактически действующие на объекте.',
  },
  {
    number: '04',
    title: 'Порядок реагирования',
    text: 'Сведения, необходимые для взаимодействия ответственных лиц, охраны и уполномоченных органов при возникновении угрозы.',
  },
];

export default function AboutPassport() {
  return (
    <section className="about-passport" id="about-passport" aria-labelledby="about-passport-title">
      <Container className="about-passport__layout">
        <div className="about-passport__copy">
          <p className="about-passport__kicker">Паспорт безопасности объекта</p>

          <h2 id="about-passport-title">
            Документ описывает не только объект, <em>но и систему его защиты</em>
          </h2>

          <p className="about-passport__lead">
            Паспорт безопасности фиксирует состояние антитеррористической защищённости объекта:
            его характеристики, возможные угрозы, действующие меры защиты и порядок реагирования.
            Документ оформляется с учётом результатов категорирования и требований постановления,
            применимого к конкретному типу объекта.
          </p>

          <div className="about-passport__note">
            <span className="about-passport__note-mark" aria-hidden="true">!</span>
            <p>
              Единый шаблон подходит не всем, у каждого объекта своя форма паспорта и акта.
            </p>
          </div>

          <a className="about-passport__action" href="#quiz">
            <span>Проверить требования для объекта</span>
            <span className="about-passport__action-arrow" aria-hidden="true">↘</span>
          </a>
        </div>

        <div className="about-passport__anatomy" aria-label="Основные сведения, которые отражает паспорт безопасности">
          <div className="about-passport__anatomy-head">
            <div>
              <p className="about-passport__anatomy-kicker">Анатомия документа</p>
              <h3>Что отражает паспорт</h3>
            </div>
          </div>

          <ol className="about-passport__layers">
            {passportLayers.map((item) => (
              <li key={item.number}>
                <span className="about-passport__layer-number" aria-hidden="true">{item.number}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
