import Container from '../../../../components/ui/Container/Container';

export default function TradeWorkApproach() {
  return (
    <>
      <section className="trade-why" id="expert">
        <Container>
          <div className="trade-why__heading">
            <div>
              <p className="trade-kicker">Подход к работе</p>

              <h2>Почему БОЙКОВГРУПП</h2>
            </div>

            <p>
              Начинаем не с шаблона, а с определения нормативного статуса конкретного торгового
              объекта и необходимого состава работ.
            </p>
          </div>

          <div className="trade-why__grid">
            <article>
              <span>01</span>

              <h3>Проверяем применимость ПП РФ №1273</h3>

              <p>
                До подготовки документов определяем статус объекта и проверяем применимый порядок.
              </p>
            </article>

            <article>
              <span>02</span>

              <h3>Используем актуальную редакцию 2026 года</h3>

              <p>
                Учитываем изменения ПП РФ №229, включая обновлённую форму паспорта безопасности.
              </p>
            </article>

            <article>
              <span>03</span>

              <h3>Разделяем этапы и стоимость</h3>

              <p>
                Категорирование, акт, паспорт и сопровождение согласования не объединяем в одну
                услугу автоматически.
              </p>
            </article>

            <article>
              <span>04</span>

              <h3>Учитываем уже имеющиеся документы</h3>

              <p>
                Если объект категорирован и имеется актуальный акт, можно отдельно заказать
                разработку паспорта.
              </p>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
