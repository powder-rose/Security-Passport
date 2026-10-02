export default function ArticleImage({
  article,
}){

  if(
    article.image
  ){

    return (

      <img
        src={article.image}
        alt={
          article.imageAlt ||
          article.title ||
          ''
        }
        width="1200"
        height="675"
        loading="lazy"
      />

    );

  }


  return (

    <div className="blog-card__placeholder">

      <span>
        БОЙКОВГРУПП
      </span>

    </div>

  );

}
