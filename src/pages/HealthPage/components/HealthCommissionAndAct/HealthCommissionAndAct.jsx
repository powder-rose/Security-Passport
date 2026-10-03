import Container from "../../../../components/ui/Container/Container";

export default function HealthCommissionAndAct() {
  return (
    <>
      <section className="health-commission">
        <Container>
          <div className="health-commission__layout">
            <div className="health-commission__heading">
              <p className="health-kicker">Кто определяет категорию</p>

              <h2>Комиссия по обследованию и категорированию</h2>

              <p>
                Для проведения категорирования решением руководителя органа или
                организации, являющегося правообладателем объекта, назначается
                комиссия.
              </p>
            </div>

            <div className="health-commission__content">
              <aside className="health-commission__term">
                <span>Срок работы комиссии</span>

                <strong>60</strong>

                <p>рабочих дней</p>

                <small>
                  не более — конкретный срок определяется с учётом сложности
                  объекта
                </small>
              </aside>

              <div className="health-commission__members">
                <p className="health-commission__members-label">
                  В состав комиссии входят
                </p>

                <div className="health-commission__member">
                  <span>01</span>

                  <div>
                    <strong>Представители правообладателя</strong>

                    <p>
                      Представители органа или организации, являющегося
                      правообладателем объекта.
                    </p>
                  </div>
                </div>

                <div className="health-commission__member">
                  <span>02</span>

                  <div>
                    <strong>Работники объекта</strong>

                    <p>Представители непосредственно объекта или территории.</p>
                  </div>
                </div>

                <div className="health-commission__member">
                  <span>03</span>

                  <div>
                    <strong>Территориальный орган безопасности</strong>

                    <p>
                      Представитель включается в состав комиссии по
                      согласованию.
                    </p>
                  </div>
                </div>

                <div className="health-commission__member">
                  <span>04</span>

                  <div>
                    <strong>Росгвардия</strong>

                    <p>
                      Представитель территориального органа Росгвардии либо
                      подразделения вневедомственной охраны — по согласованию.
                    </p>
                  </div>
                </div>

                <div className="health-commission__member">
                  <span>05</span>

                  <div>
                    <strong>Территориальный орган МЧС</strong>

                    <p>
                      Представитель по месту нахождения объекта — по
                      согласованию.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="health-commission__expert">
              <span>Дополнительно</span>

              <p>
                К работе комиссии могут привлекаться эксперты специализированных
                организаций.
              </p>
            </div>

            <aside className="health-commission__role">
              <div>
                <span>Наша роль</span>

                <strong>
                  Сопровождаем процедуру, а не присваиваем категорию
                </strong>
              </div>

              <p>
                Мы сопровождаем категорирование и готовим документацию для
                работы комиссии. Категория определяется комиссией, а не
                подрядчиком единолично.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      <section className="health-act">
        <Container>
          <div className="health-act__layout">
            <div className="health-act__intro">
              <p className="health-kicker">Результат категорирования</p>

              <h2>Акт обследования и категорирования медицинского объекта</h2>

              <p className="health-act__lead">
                Результаты работы комиссии оформляются актом обследования и
                категорирования объекта.
              </p>

              <a
                className="health-act__link"
                href="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
              >
                Подробнее об акте обследования и категорирования объекта
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="health-act__content">
              <div className="health-act__quantity">
                <span>Акт составляется</span>

                <div>
                  <strong>2</strong>

                  <p>экземпляра</p>
                </div>

                <small>По Постановление Правительства РФ №8</small>
              </div>

              <div className="health-act__rules">
                <article>
                  <span>01</span>

                  <div>
                    <strong>Подписывается комиссией</strong>

                    <p>Акт подписывают все члены комиссии.</p>
                  </div>
                </article>

                <article>
                  <span>02</span>

                  <div>
                    <strong>Утверждается председателем</strong>

                    <p>
                      После подписания акт утверждается председателем комиссии.
                    </p>
                  </div>
                </article>

                <article>
                  <span>03</span>

                  <div>
                    <strong>Два экземпляра</strong>

                    <p>
                      Акт обследования и категорирования оформляется в двух
                      экземплярах.
                    </p>
                  </div>
                </article>

                <article>
                  <span>04</span>

                  <div>
                    <strong>Часть паспорта</strong>

                    <p>
                      Акт является неотъемлемой частью паспорта безопасности
                      объекта.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
