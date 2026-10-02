import Container
from '../../../components/ui/Container/Container';



export default function CultureCurrentRequirements() {
  return (
    <>
      <section
        className="culture-standard"
        id="culture-standard"
      >
        <Container>
          <div className="culture-standard__panel">
            <div className="culture-standard__identity">
              <p className="culture-kicker">
                Требования 2026 года
              </p>

              <span>
                ГОСТ
              </span>

              <strong>
                Р 72551-2026
              </strong>
            </div>

            <div className="culture-standard__content">
              <div className="culture-standard__date">
                <span>
                  Действует с
                </span>

                <strong>
                  01.05.2026
                </strong>
              </div>

              <h2>
                Что учитывать
                при разработке в 2026 году
              </h2>

              <p className="culture-standard__lead">
                ГОСТ Р 72551-2026 устанавливает
                общие требования к услугам
                по категорированию объектов
                и разработке паспортов безопасности.
              </p>

              <div className="culture-standard__important">
                <span>
                  Важно
                </span>

                <p>
                  ГОСТ Р 72551-2026 не заменяет
                  специальные требования
                  ПП РФ №176. Для объекта культуры
                  конкретный порядок категорирования
                  и форма паспорта определяются
                  прежде всего применимыми
                  обязательными требованиями №176.
                </p>
              </div>

              <div className="culture-standard__facts">
                <div>
                  <span>
                    ПП РФ №176
                  </span>

                  <p>
                    Действующая редакция —
                    от 08.05.2025.
                  </p>
                </div>

                <div>
                  <span>
                    Форма паспорта
                  </span>

                  <p>
                    Изменённая форма применяется
                    после изменений мая 2025 года.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
