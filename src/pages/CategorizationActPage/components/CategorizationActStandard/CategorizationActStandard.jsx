import Container from "../../../../components/ui/Container/Container";

export default function CategorizationActStandard() {
  return (
    <>
      <section className="categorization-act-standard">
        <Container>
          <div className="categorization-act-standard__grid">
            <div>
              <span className="categorization-act-standard__badge">
                ГОСТ Р 72551-2026
              </span>

              <h2>Профильный стандарт действует с 1 мая 2026 года</h2>
            </div>

            <div>
              <p>
                ГОСТ Р 72551-2026 устанавливает общие требования к услугам по
                категорированию объекта или территории и разработке паспорта
                безопасности объектов, в отношении которых установлены
                обязательные требования к антитеррористической защищённости.
              </p>

              <p>
                При этом конкретный порядок категорирования, состав комиссии,
                критерии и форма документов по-прежнему определяются
                обязательными требованиями, применимыми к соответствующему
                объекту.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
