const API = '/api/admin';


async function request(
  url,
  options = {},
) {
  const response = await fetch(
    API + url,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    },
  );

  return response.json();
}


export function login(password) {
  return request(
    '/login',
    {
      method: 'POST',
      body: JSON.stringify({
        password,
      }),
    },
  );
}


export function logout() {
  return request(
    '/logout',
    {
      method: 'POST',
    },
  );
}


export function getSession() {
  return request(
    '/session',
  );
}


export function getArticles() {
  return request(
    '/articles'
  );
}


export function createArticle(data) {
  return request(
    '/articles',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}


export function getArticle(id){

  return request(
    `/articles/${id}`
  );

}


export function deleteArticle(id){

  return request(
    `/articles/${id}`,
    {
      method:'DELETE',
    }
  );

}


export function updateArticle(
  id,
  data
){

  return request(
    `/articles/${id}`,
    {
      method:'PUT',
      body:
        JSON.stringify(data),
    }
  );

}




export async function uploadArticleImage(file){

  const formData =
    new FormData();


  formData.append(
    'image',
    file
  );


  const response =
    await fetch(
      '/api/admin/upload/article-image',
      {
        method:'POST',
        credentials:'include',
        body:formData,
      }
    );


  return response.json();

}



export function getStatistics() {
  return request(
    '/statistics'
  );
}
