import Container from '../../../../components/ui/Container/Container';

export default function CrowdCategories() {
  return (
    <>
      <section className="crowd-categories" id="categories">
        <Container>
          <div className="crowd-categories__heading">
            <div>
              <p className="crowd-kicker">Категорирование</p>

              <h2>3 категории ММПЛ</h2>
            </div>

            <p>Базовый критерий — максимальное одновременное количество людей.</p>
          </div>

          <div className="crowd-categories__table">
            <article className="crowd-category">
              <span className="crowd-category__number">01</span>

              <h3>1 категория</h3>

              <div className="crowd-category__metric">
                <strong>&gt; 1 000</strong>

                <span>человек</span>
              </div>
            </article>

            <article className="crowd-category">
              <span className="crowd-category__number">02</span>

              <h3>2 категория</h3>

              <div className="crowd-category__metric">
                <strong>200–1 000</strong>

                <span>человек</span>
              </div>
            </article>

            <article className="crowd-category">
              <span className="crowd-category__number">03</span>

              <h3>3 категория</h3>

              <div className="crowd-category__metric">
                <strong>50–200</strong>

                <span>человек</span>
              </div>
            </article>
          </div>

          <aside className="crowd-categories__note">
            <span>Решение комиссии</span>

            <p>
              При предусмотренных обстоятельствах комиссия вправе присвоить категорию выше или ниже
              исходной с учётом оперативной обстановки и угроз.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
