import Container from '../../components/ui/Container/Container.jsx';
import './QuestionsHero.css';

export default function QuestionsHero({ settings }) {
  return (
    <section className="questions-hero">
      <Container>
        <nav className="questions-breadcrumbs" aria-label="Хлебные крошки">
          <a href="/">Главная</a>
          <span aria-hidden="true">/</span>
          <span>Вопрос — ответ</span>
        </nav>
        <div className="questions-hero__grid">
          <div className="questions-hero__copy">
            <p className="questions-eyebrow">
              <span className="questions-dot" /> ВОПРОС — ОТВЕТ
            </p>
            <h1>{settings.title}</h1>
            <p className="questions-hero__description">{settings.description}</p>
            <a className="questions-hero__anchor" href="#questions-catalog">
              Найти свой вопрос <span aria-hidden="true">↓</span>
            </a>
          </div>
          <aside className="questions-hero__note" aria-label="Как устроены ответы">
            <div className="questions-hero__note-head">
              <span>ОТ ВОПРОСА К РЕШЕНИЮ</span>
              <span className="questions-hero__symbol" aria-hidden="true">
                ?
              </span>
            </div>
            <p>
              Сначала — суть.
              <br />
              Затем — детали.
            </p>
            <ol className="questions-hero__steps">
              <li>
                <span>01</span>
                <div>
                  Краткий ответ<small>Главное по вашей ситуации</small>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  Разбор вопроса<small>Что учесть и как действовать</small>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  Материалы по теме<small>Документы и подробные разъяснения</small>
                </div>
              </li>
            </ol>
          </aside>
        </div>
      </Container>
    </section>
  );
}
