import Container from '../../../../components/ui/Container/Container';

export default function CrowdPeopleCount() {
  return (
    <>
      <section className="crowd-count" id="counting">
        <Container>
          <div className="crowd-count__layout">
            <div className="crowd-count__heading">
              <p className="crowd-kicker">Расчёт категории</p>

              <h2>Как определяется количество людей</h2>

              <p>
                Учитывается одновременное пребывание или передвижение людей, а не только паспортная
                вместимость объекта.
              </p>
            </div>

            <div className="crowd-count__metrics">
              <article>
                <strong>3</strong>

                <div>
                  <span>дня мониторинга</span>

                  <p>
                    Наблюдение проводится в течение трёх дней, включая рабочие и выходные или
                    праздничные дни.
                  </p>
                </div>
              </article>

              <article>
                <strong>0,5</strong>

                <div>
                  <span>м² на человека</span>

                  <p>
                    Этот показатель применяется для расчёта прогнозируемого количества людей, если
                    отсутствуют иные нормативы площади.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
