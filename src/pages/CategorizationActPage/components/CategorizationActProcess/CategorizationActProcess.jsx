import Container from '../../../../components/ui/Container/Container';

import { processItems } from '../../categorizationActPageData';

export default function CategorizationActProcess() {
  return (
    <>
      <section className="categorization-act-process">
        <Container>
          <div className="categorization-act-process__heading">
            <div>
              <p className="categorization-act-kicker">Логика процедуры</p>

              <h2>От объекта до оформленного акта</h2>
            </div>

            <p>
              Категорию не «назначает специалист». Решение принимается комиссией, а мы готовим
              документацию и сопровождаем процедуру в рамках применимых требований.
            </p>
          </div>

          <div className="categorization-act-flow">
            {['Объект', 'Комиссия', 'Обследование', 'Категория', 'Акт', 'Паспорт'].map(
              (item, index) => (
                <div className="categorization-act-flow__item" key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>

                  <strong>{item}</strong>
                </div>
              ),
            )}
          </div>

          <div className="categorization-act-process__details">
            {processItems.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
