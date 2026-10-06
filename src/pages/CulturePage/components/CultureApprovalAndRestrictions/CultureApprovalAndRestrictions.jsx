import Container from '../../../../components/ui/Container/Container';

import { cultureApprovalItems } from '../../culturePageData';

export default function CultureApprovalAndRestrictions() {
  return (
    <>
      <section className="culture-approval" id="culture-approval">
        <Container>
          <div className="culture-approval__panel">
            <div className="culture-approval__heading">
              <p className="culture-kicker">Согласование</p>

              <h2>С кем согласовывается паспорт безопасности объекта культуры</h2>

              <p>
                ПП РФ №176 устанавливает конкретный порядок согласования после составления паспорта.
              </p>
            </div>

            <div className="culture-approval__deadline">
              <span>Срок</span>

              <strong>30</strong>

              <p>дней со дня составления паспорта</p>
            </div>

            <div className="culture-approval__items">
              {cultureApprovalItems.map(item => (
                <article key={item.number}>
                  <span>{item.number}</span>

                  <div>
                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="culture-approval__distribution">
              <div>
                <span>Экз. 01</span>

                <strong>Хранится на объекте</strong>

                <p>Первый экземпляр паспорта безопасности хранится на объекте или территории.</p>
              </div>

              <div>
                <span>Экз. 02</span>

                <strong>Вышестоящая организация</strong>

                <p>Второй экземпляр направляется в вышестоящую организацию в сфере культуры.</p>
              </div>

              <div>
                <span>Копия</span>

                <strong>Предусмотренные органы</strong>

                <p>
                  Копия или электронная копия направляется в предусмотренные ПП РФ №176
                  территориальные органы.
                </p>
              </div>
            </div>

            <div className="culture-approval__action">
              <p>
                Можем подготовить документ к установленной процедуре и сопровождать работу по
                обоснованным замечаниям.
              </p>

              <a className="button button--primary" href="#contact">
                Заказать сопровождение согласования
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="culture-restricted" id="culture-restricted">
        <Container>
          <div className="culture-restricted__layout">
            <div className="culture-restricted__mark">
              <span>ДСП</span>

              <p>Для служебного пользования</p>
            </div>

            <div className="culture-restricted__content">
              <p className="culture-kicker">Ограниченное распространение</p>

              <h2>Паспорт безопасности объекта культуры — не публичный документ</h2>

              <p className="culture-restricted__lead">
                ПП РФ №176 устанавливает, что паспорт безопасности содержит служебную информацию
                ограниченного распространения и имеет пометку «Для служебного пользования», если ему
                не присваивается гриф секретности.
              </p>

              <div className="culture-restricted__warning">
                <span>Не размещаем в открытом доступе</span>

                <ul>
                  <li>заполненный паспорт действующего объекта;</li>

                  <li>схемы и конкретные сведения о системе защиты;</li>

                  <li>сведения о потенциально опасных участках и критических элементах;</li>

                  <li>
                    иные чувствительные сведения об антитеррористической защищённости объекта.
                  </li>
                </ul>
              </div>

              <p className="culture-restricted__sample">
                Поэтому в блоке с образцом на этой странице будем использовать официальную форму и
                обезличенную структуру документа, а не заполненный паспорт реального учреждения.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
