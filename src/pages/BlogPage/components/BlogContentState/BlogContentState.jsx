import Container from "../../../../components/ui/Container/Container.jsx";

export default function BlogContentState({ loading, error, articles }) {
  return (
    <>
      {loading && (
        <Container>
          <div className="blog-state">Загружаем материалы…</div>
        </Container>
      )}

      {error && (
        <Container>
          <div className="blog-state">
            Не удалось загрузить статьи. Обновите страницу немного позже.
          </div>
        </Container>
      )}

      {!loading && !error && articles.length === 0 && (
        <Container>
          <div className="blog-state">Опубликованных материалов пока нет.</div>
        </Container>
      )}
    </>
  );
}
