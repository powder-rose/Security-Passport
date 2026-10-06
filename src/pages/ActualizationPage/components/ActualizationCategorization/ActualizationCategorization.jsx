import Container from '../../../../components/ui/Container/Container';

export default function ActualizationCategorization() {
  return (
    <>
      <section className="actualization-category">
        <Container>
          <div className="actualization-category__panel">
            <div>
              <p className="actualization-kicker">Важный вопрос</p>

              <h2>Всегда ли нужно заново проводить категорирование?</h2>
            </div>

            <div className="actualization-category__answer">
              <strong>Нет, не всегда.</strong>

              <p>
                Это зависит от основания актуализации и требований для конкретного объекта. При
                одних изменениях может потребоваться подтверждение или изменение категории, при
                других — изменения могут оформляться без полной процедуры повторного
                категорирования.
              </p>

              <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
                Подробнее об обследовании и категорировании
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
