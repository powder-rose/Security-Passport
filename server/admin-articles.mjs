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


const SLUG_TRANSLIT = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};


function createSlug(value) {

  const source =
    String(value || '')
      .trim()
      .toLowerCase();


  const transliterated =
    Array.from(source)
      .map(
        char => {

          if (
            Object.prototype.hasOwnProperty.call(
              SLUG_TRANSLIT,
              char
            )
          ) {
            return SLUG_TRANSLIT[char];
          }

          return char;

        }
      )
      .join('');


  return transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

}


function createUniqueSlug(
  articles,
  value,
  excludeId = null,
) {

  const base =
    createSlug(value) ||
    'article';


  let candidate =
    base;

  let suffix =
    2;


  const isUsed =
    slug =>
      articles.some(
        article =>
          article.id !== excludeId
          &&
          (
            article.slug === slug
            ||
            (
              Array.isArray(
                article.legacySlugs
              )
              &&
              article.legacySlugs.includes(
                slug
              )
            )
          )
      );


  while (
    isUsed(candidate)
  ) {

    candidate =
      `${base}-${suffix}`;

    suffix += 1;

  }


  return candidate;

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
      data.status === 'published'
        ? 'published'
        : 'draft',


    slug:
      createUniqueSlug(
        articles,
        data.slug ||
        data.title ||
        'article'
      ),

    legacySlugs:
      [],


    seoTitle:
      data.seoTitle || '',

    seoDescription:
      data.seoDescription || '',

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
      data.status === 'published'
        ? now
        : null,
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


  let nextSlug =
    article.slug;


  let legacySlugs =
    Array.isArray(
      article.legacySlugs
    )
      ? [...article.legacySlugs]
      : [];


  /*
   * ВАЖНО:
   *
   * Обычное изменение заголовка больше
   * не должно менять публичный URL.
   *
   * Slug меняется только если админ
   * явно отправил updateSlug: true.
   */
  if (
    data.updateSlug === true
    &&
    typeof data.slug === 'string'
  ) {

    const requestedSlug =
      createUniqueSlug(
        articles,
        data.slug,
        article.id
      );


    if (
      requestedSlug
      &&
      requestedSlug !== article.slug
    ) {

      if (
        article.slug
      ) {
        legacySlugs.push(
          article.slug
        );
      }


      legacySlugs =
        [
          ...new Set(
            legacySlugs
          ),
        ]
          .filter(
            slug =>
              slug
              &&
              slug !== requestedSlug
          );


      nextSlug =
        requestedSlug;

    }

  }


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


    imageAlt:
      data.imageAlt ??
      article.imageAlt ??
      '',


    status:
      data.status ??
      article.status,


    slug:
      nextSlug,

    legacySlugs,


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



export async function updatePublishedArticlesYear(
  year = new Date().getUTCFullYear(),
) {

  const articles =
    await readArticles();


  let updated = 0;


  const now =
    new Date();


  const todayUtc =
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );


  const nextArticles =
    articles.map(
      article => {

        if (
          article.status !== 'published' ||
          !article.publishedAt
        ) {
          return article;
        }


        const date =
          new Date(
            article.publishedAt
          );


        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return article;
        }


        /*
         * Если статья уже имеет нужный год,
         * повторно её не обновляем.
         */
        if (
          date.getUTCFullYear() === year
        ) {
          return article;
        }


        const month =
          date.getUTCMonth();

        const day =
          date.getUTCDate();


        /*
         * Проверяем день и месяц отдельно.
         * Это также защищает 29 февраля:
         * в невисокосном году дата не превратится
         * автоматически в 1 марта.
         */
        const candidateDate =
          new Date(
            Date.UTC(
              year,
              month,
              day
            )
          );


        if (
          candidateDate.getUTCFullYear() !== year ||
          candidateDate.getUTCMonth() !== month ||
          candidateDate.getUTCDate() !== day
        ) {
          return article;
        }


        /*
         * Нельзя создавать дату публикации из будущего.
         *
         * Например, 1 января статья от 15 августа
         * останется в прошлом году и обновится только
         * после наступления 15 августа.
         */
        if (
          candidateDate.getTime() >
          todayUtc
        ) {
          return article;
        }


        date.setUTCFullYear(
          year
        );


        updated += 1;


        return {
          ...article,

          publishedAt:
            date.toISOString(),

          updatedAt:
            new Date()
              .toISOString(),
        };

      }
    );


  await saveArticles(
    nextArticles
  );


  return {
    updated,
    year,
  };

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
