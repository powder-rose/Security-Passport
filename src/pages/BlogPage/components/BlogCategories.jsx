import Container
from '../../../components/ui/Container/Container.jsx';


export default function BlogCategories({
  loading,
  error,
  articles,
  selectedCategory,
  visibleCategories,
  chooseCategory,
}) {
  return (
    <>
        {
          !loading
          &&
          !error
          &&
          articles.length > 0
          &&
          (
            <section
              className="blog-categories"
              id="blog-categories"
              aria-labelledby="blog-categories-title"
            >

              <Container>

                <div className="blog-section-heading">

                  <h2 id="blog-categories-title">
                    Категории статей
                  </h2>

                </div>


                <p className="blog-categories__description">
                  Материалы сгруппированы по практической
                  задаче: от требований законодательства
                  и категорирования до подготовки и
                  актуализации паспорта безопасности.
                </p>


                <nav
                  className="blog-category-chips"
                  aria-label="Категории статей"
                >

                  <button
                    type="button"
                    className={
                      selectedCategory === 'all'
                        ? 'blog-category-chip is-active'
                        : 'blog-category-chip'
                    }
                    aria-pressed={
                      selectedCategory === 'all'
                    }
                    onClick={
                      () =>
                        chooseCategory(
                          'all'
                        )
                    }
                  >
                    Все материалы
                  </button>


                  {
                    visibleCategories.map(
                      category => {

                        const isActive =
                          selectedCategory ===
                          category.id;


                        return (

                          <button
                            key={category.id}
                            id={
                              `blog-category-${category.id}`
                            }
                            type="button"
                            className={
                              isActive
                                ? 'blog-category-chip is-active'
                                : 'blog-category-chip'
                            }
                            aria-pressed={
                              isActive
                            }
                            aria-label={
                              `${category.label}. ${category.description}`
                            }
                            onClick={
                              () =>
                                chooseCategory(
                                  category.id
                                )
                            }
                          >
                            {category.label}
                          </button>

                        );

                      }
                    )
                  }

                </nav>


                <div className="blog-category-seo-descriptions">

                  {
                    visibleCategories.map(
                      category => (

                        <p
                          key={
                            `seo-${category.id}`
                          }
                        >
                          <strong>
                            {category.label}.
                          </strong>
                          {' '}
                          {category.description}
                        </p>

                      )
                    )
                  }

                </div>

              </Container>

            </section>
          )
        }
    </>
  );
}
