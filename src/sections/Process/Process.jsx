import Container from '../../components/ui/Container/Container';
import { DocumentFlowIllustration } from '../../components/illustrations/BlushIllustrations';
import ProcessSteps from './ProcessSteps';
import './Process.css';

const processSteps = [
  {
    number: '01',
    title: 'Собираем исходные данные',
    text: 'Запрашиваем сведения об объекте, назначении помещений, режиме работы, количестве посетителей и сотрудников, охране и уже действующих мерах защиты.',
    meta: 'Старт проекта',
  },
  {
    number: '02',
    title: 'Разрабатываем документацию',
    text: 'Готовим комплект документов и исходных материалов, необходимых для обследования, категорирования и последующего оформления паспорта безопасности.',
    meta: 'Подготовка документов',
  },
  {
    number: '03',
    title: 'Участвуем в категорировании',
    text: 'Участвуем в обследовании объекта и работе комиссии, анализируем потенциальные угрозы и уязвимые места, помогаем определить категорию объекта.',
    meta: 'Категорирование',
  },
  {
    number: '04',
    title: 'Оформляем паспорт безопасности',
    text: 'На основании результатов обследования и категорирования оформляем паспорт безопасности с характеристиками объекта и предусмотренными мерами защиты.',
    meta: 'Оформление паспорта',
  },
  {
    number: '05',
    title: 'Сопровождаем согласование',
    text: 'Помогаем пройти процедуру согласования в уполномоченных органах, отрабатываем замечания и доводим документ до утверждения в установленном порядке.',
    meta: 'До результата',
  },
];

export default function Process({ illustration = <DocumentFlowIllustration /> }) {
  return (
    <section className="process-section" id="process" aria-labelledby="process-title">
      <Container className="process-section__layout">
        <div className="process-section__intro">
          <p className="process-section__kicker">Разработка паспорта безопасности</p>
          <h2 id="process-title">Как проходит подготовка документа</h2>
          <p className="process-section__lead">
            Сначала разбираемся с объектом и{'\u00A0'}исходными сведениями, затем готовим документ и
            сопровождаем его до согласования. Каждый этап связан с предыдущим — без лишней передачи
            задачи между исполнителями.
          </p>

          <div className="process-section__illustration" aria-hidden="true">
            {illustration}
          </div>

          <div className="process-section__summary" aria-label="Кратко о процессе">
            <span className="process-section__summary-count">5</span>
            <div>
              <strong>последовательных этапов</strong>
              <span>от исходных данных до согласования</span>
            </div>
          </div>
        </div>

        <ProcessSteps steps={processSteps} />
      </Container>

      <Container>
        <div className="process-section__cta">
          <div>
            <p className="process-section__cta-kicker">Нужно подготовить паспорт безопасности?</p>
            <h3>Проверим объект и{'\u00A0'}определим состав работ до старта</h3>
          </div>
          <a className="button button--primary" href="#lead-form">
            Рассчитать стоимость
          </a>
        </div>
      </Container>
    </section>
  );
}
