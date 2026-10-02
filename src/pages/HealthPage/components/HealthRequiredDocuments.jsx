import Container
from '../../../components/ui/Container/Container';


export default function HealthRequiredDocuments() {
  return (
    <>
<section
        className="health-documents"
        id="documents"
      >
        <Container>
          <div className="health-documents__layout">
            <div className="health-documents__heading">
              <p className="health-kicker">
                Исходные данные
              </p>

              <h2>
                Какие данные нужны
                для подготовки документов
              </h2>

              <p>
                На старте собираются
                основные сведения
                об организации, объекте,
                людях, защите
                и имеющейся документации.
              </p>
            </div>


            <div className="health-documents__register">
              <article>
                <span>
                  01
                </span>

                <strong>
                  Организация
                </strong>

                <p>
                  реквизиты, правообладатель
                </p>
              </article>

              <article>
                <span>
                  02
                </span>

                <strong>
                  Объект
                </strong>

                <p>
                  наименование, адрес, назначение
                </p>
              </article>

              <article>
                <span>
                  03
                </span>

                <strong>
                  Характеристики
                </strong>

                <p>
                  площадь, этажность, периметр
                </p>
              </article>

              <article>
                <span>
                  04
                </span>

                <strong>
                  Люди
                </strong>

                <p>
                  работники, посетители, пациенты
                </p>
              </article>

              <article>
                <span>
                  05
                </span>

                <strong>
                  Планы
                </strong>

                <p>
                  планы помещений и территории
                </p>
              </article>

              <article>
                <span>
                  06
                </span>

                <strong>
                  Опасные участки
                </strong>

                <p>
                  при наличии
                </p>
              </article>

              <article>
                <span>
                  07
                </span>

                <strong>
                  Критические элементы
                </strong>

                <p>
                  при наличии
                </p>
              </article>

              <article>
                <span>
                  08
                </span>

                <strong>
                  Охрана
                </strong>

                <p>
                  силы и организация охраны
                </p>
              </article>

              <article>
                <span>
                  09
                </span>

                <strong>
                  Техническая защита
                </strong>

                <p>
                  сигнализация,
                  видеонаблюдение и др.
                </p>
              </article>

              <article>
                <span>
                  10
                </span>

                <strong>
                  Документы
                </strong>

                <p>
                  предыдущий акт и паспорт
                </p>
              </article>
            </div>
          </div>


          <aside className="health-documents__note">
            <span>
              Состав уточняется
            </span>

            <p>
              Окончательный состав
              исходных данных определяется
              после проверки объекта
              и применимых требований.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
