export async function getPublicArticles() {

  const response =
    await fetch(
      '/api/articles',
      {
        headers: {
          Accept:
            'application/json',
        },
      }
    );


  if(!response.ok){

    throw new Error(
      `ARTICLES_${response.status}`
    );

  }


  const result =
    await response.json();


  return (
    Array.isArray(
      result?.articles
    )
      ? result.articles
      : []
  );

}



export async function getPublicArticle(
  slug
) {

  const response =
    await fetch(
      `/api/articles/${encodeURIComponent(slug)}`,
      {
        headers: {
          Accept:
            'application/json',
        },
      }
    );


  if(response.status === 404){
    return null;
  }


  if(!response.ok){

    throw new Error(
      `ARTICLE_${response.status}`
    );

  }


  const result =
    await response.json();


  return (
    result?.article ||
    null
  );

}
