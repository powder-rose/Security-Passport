import {
  useEffect,
  useState,
} from 'react';

import {
  getPublicArticle,
  getPublicArticles,
} from '../../lib/articles.js';


export default function useArticlePageData({
  slug,
  initialArticle = null,
  initialArticles = null,
}) {

  const [
    article,
    setArticle,
  ] = useState(
    initialArticle
  );


  const [
    relatedArticles,
    setRelatedArticles,
  ] = useState(
    () => {

      if(
        !Array.isArray(initialArticles) ||
        !initialArticle
      ){
        return [];
      }


      return initialArticles.filter(
        item =>
          item?.id !==
            initialArticle.id &&
          item?.slug !==
            initialArticle.slug
      );

    }
  );


  const [
    loading,
    setLoading,
  ] = useState(
    !initialArticle
  );


  const [
    notFound,
    setNotFound,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState(false);


  useEffect(() => {

    if(
      initialArticle &&
      initialArticle.slug === slug
    ){
      return undefined;
    }


    let cancelled =
      false;


    async function load() {

      setLoading(true);
      setError(false);
      setNotFound(false);


      try {

        const [
          currentArticle,
          articles,
        ] =
          await Promise.all([
            getPublicArticle(slug),
            getPublicArticles(),
          ]);


        if (cancelled) {
          return;
        }


        if (!currentArticle) {

          setArticle(null);
          setNotFound(true);

          return;

        }


        setArticle(
          currentArticle
        );


        setRelatedArticles(
          articles.filter(
            item =>
              item.id !==
                currentArticle.id &&
              item.slug !==
                currentArticle.slug
          )
        );

      }
      catch (loadError) {

        if (!cancelled) {

          console.error(
            '[article] load failed:',
            loadError
          );

          setError(true);

        }

      }
      finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    }


    load();


    return () => {
      cancelled = true;
    };

  }, [
    slug,
    initialArticle,
  ]);


  return {
    article,
    relatedArticles,
    loading,
    notFound,
    error,
  };

}
