import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';


const FILE = path.resolve(
  'data/articles.json'
);


async function readArticles() {
  try {
    const data =
      await fs.readFile(
        FILE,
        'utf8'
      );

    return JSON.parse(data);

  } catch {
    return [];
  }
}


async function saveArticles(articles) {
  await fs.writeFile(
    FILE,
    JSON.stringify(
      articles,
      null,
      2
    ),
    'utf8'
  );
}


function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, '-')
    .replace(/^-|-$/g, '');
}


export async function getArticles() {

  const articles =
    await readArticles();


  return articles.sort(
    (a,b) => {

      return new Date(b.createdAt)
        -
        new Date(a.createdAt);

    }
  );

}


export async function createArticle(data) {

  const articles =
    await readArticles();

  const now =
    new Date().toISOString();


  const article = {

    id:
      crypto.randomUUID(),

    title:
      data.title || '',

    content:
      data.content || '',

    image:
      data.image || null,

      imageAlt:
        data.imageAlt || '',


    status:
      'draft',


    slug:
      createSlug(
        data.title || 'article'
      ),


    seoTitle:
      '',

    seoDescription:
      '',

    ogTitle:
      '',

    ogDescription:
      '',

    ogImage:
      null,


    createdAt:
      now,

    updatedAt:
      now,

    publishedAt:
      null,
  };


  articles.push(article);


  await saveArticles(
    articles
  );


  return article;
}


export async function updateArticle(
  id,
  data,
) {

  const articles =
    await readArticles();


  const index =
    articles.findIndex(
      (item) => item.id === id
    );


  if (index === -1) {
    return null;
  }


  const article =
    articles[index];


  articles[index] = {

    ...article,

    title:
      data.title ??
      article.title,


    content:
      data.content ??
      article.content,


    image:
      data.image ??
      article.image,


    status:
      data.status ??
      article.status,


    slug:
      data.slug ??
      (
        data.title
          ? createSlug(data.title)
          : article.slug
      ),


    seoTitle:
      data.seoTitle ??
      article.seoTitle,


    seoDescription:
      data.seoDescription ??
      article.seoDescription,


    ogTitle:
      data.ogTitle ||
      data.seoTitle ||
      article.ogTitle ||
      article.seoTitle ||
      '',


    ogDescription:
      data.ogDescription ||
      data.seoDescription ||
      article.ogDescription ||
      article.seoDescription ||
      '',


    ogImage:
      data.ogImage ||
      data.image ||
      article.ogImage ||
      article.image ||
      null,


    publishedAt:
      data.status === 'published'
        ? (
            article.publishedAt ||
            new Date().toISOString()
          )
        : article.publishedAt,



    updatedAt:
      new Date().toISOString(),

  };


  await saveArticles(
    articles
  );


  return articles[index];
}



export async function deleteArticle(
  id,
) {

  const articles =
    await readArticles();


  const filtered =
    articles.filter(
      (item) =>
        item.id !== id
    );


  await saveArticles(
    filtered
  );


  return true;
}

export async function getArticleById(id) {

  const articles =
    await readArticles();


  return articles.find(
    (item) => item.id === id
  ) || null;

}
