import ArticleImage
from './ArticleImage';

import {
  formatDate,
} from '../blogPageUtils';


export default function BlogArticleCard({
  article,
  category,
}){

  const articleDate =
    article.publishedAt ||
    article.createdAt;


  return (

    <a
      className="blog-card"
      href={`/blog/${article.slug}/`}
    >

      <div className="blog-card__image">

        <ArticleImage
          article={article}
        />

      </div>


      <div className="blog-card__body">

        {
          category
          &&
          (
            <div className="blog-card__category">
              {category.label}
            </div>
          )
        }


        <time
          dateTime={
            articleDate ||
            undefined
          }
        >
          {
            formatDate(
              articleDate
            )
          }
        </time>


        <h2>
          {article.title}
        </h2>


        {
          article.seoDescription
          &&
          (
            <p>
              {article.seoDescription}
            </p>
          )
        }


        <span className="blog-card__link">

          Читать

          <span aria-hidden="true">
            →
          </span>

        </span>

      </div>

    </a>

  );

}
