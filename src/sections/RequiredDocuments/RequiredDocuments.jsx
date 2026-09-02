import Container from '../../components/ui/Container/Container';
import { DocumentFlowIllustration } from '../../components/illustrations/BlushIllustrations';
import './RequiredDocuments.css';

const requiredDocuments = [
  {
    number: '01',
    title: 'Учредительные документы организации',
    text: 'Копии ИНН, ОГРН, устава, выписка из ЕГРЮЛ или ЕГРИП и основные сведения о юридическом лице или ИП.',
  },
  {
    number: '02',
    title: 'Документы на объект',
    text: 'Документы, подтверждающие право собственности, аренды или иного законного использования здания, помещения или территории.',
  },
  {
    number: '03',
    title: 'Техническая документация',
    text: 'Поэтажные планы, схемы планировки, технический паспорт здания, кадастровые документы и характеристики объекта.',
  },
  {
    number: '04',
    title: 'Сведения о системе безопасности',
    text: 'Информация о видеонаблюдении, сигнализации, тревожной кнопке, физической охране и инженерно-технических средствах защиты.',
  },
  {
    number: '05',
    title: 'Сведения о персонале и режим работы',
    text: 'Данные о количестве сотрудников и посетителей, графике работы, пропускном режиме и действующих инструкциях.',
  },
  {
    number: '06',
    title: 'Опросный лист или заявка',
    text: 'Общая информация об организации и объекте, которую удобно собрать перед началом разработки паспорта безопасности.',
  },
];

function DocumentItem({ item }) {
  return (
    <article className="required-documents__item">
      <div className="required-documents__number" aria-hidden="true">{item.number}</div>
      <div className="required-documents__item-copy">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
      <span className="required-documents__check" aria-hidden="true">✓</span>
    </article>
  );
}

export default function RequiredDocuments() {
  return (
    <section className="required-documents" id="documents" aria-labelledby="required-documents-title">
      <Container className="required-documents__layout">
        <div className="required-documents__intro">
          <p className="required-documents__kicker">Исходные данные</p>
          <h2 id="required-documents-title">
            Что потребуется для разработки <em>паспорта безопасности</em>
          </h2>
          <p className="required-documents__lead">
            Для старта нужен пакет сведений об организации, самом объекте, системе защиты,
            режиме работы и персонале. По этим данным проверяем категорию, анализируем угрозы и
            формируем документ.
          </p>

          <div className="required-documents__illustration" aria-hidden="true">
            <DocumentFlowIllustration />
          </div>
        </div>

        <div className="required-documents__content">
          <div className="required-documents__list" aria-label="Перечень исходных данных">
            {requiredDocuments.map((item) => (
              <DocumentItem key={item.number} item={item} />
            ))}
          </div>

          <aside className="required-documents__notice">
            <div className="required-documents__notice-mark" aria-hidden="true">?</div>
            <div className="required-documents__notice-copy">
              <p className="required-documents__notice-kicker">Документов нет полностью?</p>
              <h3>Это не останавливает работу</h3>
              <p>
                Подскажем, какие сведения действительно обязательны, что можно восстановить и какие
                данные достаточно предоставить в виде пояснения. После заявки сформируем точный
                перечень именно для вашего объекта.
              </p>
            </div>
            <a className="button button--primary" href="#contact">
              Уточнить перечень
            </a>
          </aside>
        </div>
      </Container>
    </section>
  );
}
