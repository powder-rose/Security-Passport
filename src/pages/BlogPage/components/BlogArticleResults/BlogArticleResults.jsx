import Container from "../../../../components/ui/Container/Container.jsx";

import ArticleImage from "../ArticleImage/ArticleImage";

import BlogArticleCard from "../BlogArticleCard/BlogArticleCard";

import { formatDate } from "../../blogPageUtils";

export default function BlogArticleResults({
  loading,
  error,
  selectedCategory,
  filteredArticles,
  featuredEntry,
  restEntries,
  activeCategory,
}) {
  return (
    <>
      {!loading && !error && featuredEntry && (
        <div
          key={selectedCategory}
          id="blog-category-results"
          className="blog-category-results"
        >
          <section className="blog-featured">
            <Container>
              <div className="blog-section-heading">
                <span>
                  {activeCategory ? "ПОСЛЕДНЕЕ В РАЗДЕЛЕ" : "НОВЫЙ МАТЕРИАЛ"}
                </span>

                <span>01</span>
              </div>

              {activeCategory && (
                <div className="blog-results-context">
                  <strong>{activeCategory.label}</strong>

                  <p>{activeCategory.description}</p>
                </div>
              )}

              <a
                className="blog-featured-card"
                href={`/blog/${featuredEntry.article.slug}/`}
              >
                <div className="blog-featured-card__image">
                  <ArticleImage article={featuredEntry.article} />
                </div>

                <div className="blog-featured-card__body">
                  <div className="blog-featured-card__category">
                    {featuredEntry.category?.label}
                  </div>

                  <time
                    dateTime={
                      featuredEntry.article.publishedAt ||
                      featuredEntry.article.createdAt ||
                      undefined
                    }
                  >
                    {formatDate(
                      featuredEntry.article.publishedAt ||
                        featuredEntry.article.createdAt,
                    )}
                  </time>

                  <h2>{featuredEntry.article.title}</h2>

                  {featuredEntry.article.seoDescription && (
                    <p>{featuredEntry.article.seoDescription}</p>
                  )}

                  <span>Читать статью →</span>
                </div>
              </a>
            </Container>
          </section>

          {restEntries.length > 0 && (
            <section className="blog-list" id="blog-materials">
              <Container>
                <div className="blog-section-heading">
                  <span>
                    {activeCategory ? activeCategory.label : "ВСЕ МАТЕРИАЛЫ"}
                  </span>

                  <span>
                    {String(filteredArticles.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="blog-grid">
                  {restEntries.map((item) => (
                    <BlogArticleCard
                      key={`${selectedCategory}-${item.article.id}`}
                      article={item.article}
                      category={item.category}
                    />
                  ))}
                </div>
              </Container>
            </section>
          )}
        </div>
      )}
    </>
  );
}
