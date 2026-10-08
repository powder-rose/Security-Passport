import FinalCTA from '../../sections/FinalCTA/FinalCTA.jsx';

import BlogSeo from './components/BlogSeo/BlogSeo';

import BlogHero from './components/BlogHero/BlogHero';

import BlogContentState from './components/BlogContentState/BlogContentState';

import BlogCategories from './components/BlogCategories/BlogCategories';

import BlogArticleResults from './components/BlogArticleResults/BlogArticleResults';

import './BlogPage.css';

import useBlogArticles from './useBlogArticles';

export default function BlogPage({ initialArticles = null }) {
  const {
    articles,
    loading,
    error,
    selectedCategory,
    visibleCategories,
    filteredArticles,
    featuredEntry,
    restEntries,
    activeCategory,
    chooseCategory,
  } = useBlogArticles({
    initialArticles,
  });

  const showCategoryLink = !loading && !error && articles.length > 0;

  return (
    <>
      <BlogSeo />

      <main className="blog-page" id="main-content">
        <BlogHero showCategoryLink={showCategoryLink} />

        <BlogContentState loading={loading} error={error} articles={articles} />

        <BlogCategories
          loading={loading}
          error={error}
          articles={articles}
          selectedCategory={selectedCategory}
          visibleCategories={visibleCategories}
          chooseCategory={chooseCategory}
        />

        <BlogArticleResults
          loading={loading}
          error={error}
          selectedCategory={selectedCategory}
          filteredArticles={filteredArticles}
          featuredEntry={featuredEntry}
          restEntries={restEntries}
          activeCategory={activeCategory}
        />

        <FinalCTA />
      </main>
    </>
  );
}
