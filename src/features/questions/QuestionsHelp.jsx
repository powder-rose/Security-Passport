import Container from '../../components/ui/Container/Container.jsx';
import './QuestionsHelp.css';

const routes = [
  {
    href: '/blog/',
    title: 'Посмотреть материалы блога',
    description: 'Подробные разборы требований и документов',
  },
  {
    href: '#contact',
    title: 'Обсудить свой объект',
    description: 'Рассказать о задаче нашему специалисту',
  },
];

export default function QuestionsHelp() {
  return (
    <section className="questions-help" aria-labelledby="questions-help-title">
      <Container>
        <div className="questions-help__layout">
          <div className="questions-help__copy">
            <p className="questions-eyebrow">СЛЕДУЮЩИЙ ШАГ</p>
            <h2 id="questions-help-title">Не нашли свой вопрос?</h2>
            <p>
              Общих разъяснений не всегда достаточно. Можно изучить тему подробнее или разобрать
              задачу по вашему объекту.
            </p>
          </div>
          <div className="questions-help__links">
            {routes.map((route, index) => (
              <a key={route.href} href={route.href}>
                <span className="questions-help__index" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="questions-help__route">
                  <strong>{route.title}</strong>
                  <span>{route.description}</span>
                </span>
                <span className="questions-help__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
