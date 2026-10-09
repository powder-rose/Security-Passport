import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import formidable from 'formidable';
import sharp from 'sharp';

import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  updatePublishedArticlesYear,
} from '../articles/admin-articles.mjs';

import { queueBlogPublication, getBlogPublicationStatus } from '../articles/blog-publication.mjs';

import { asyncRoute } from './async-route.mjs';

export function registerArticleRoutes({ app, adminAuth, clientDir }) {
  app.get(
    ['/blog/:slug', '/blog/:slug/'],
    asyncRoute(async (req, res) => {
      try {
        const articles = await getArticles();

        const requestedSlug = req.params.slug;

        const articleStaticRoot = path.resolve(clientDir, 'blog');

        const articleStaticPath = path.resolve(articleStaticRoot, requestedSlug, 'index.html');

        const insideArticleStaticRoot = articleStaticPath.startsWith(
          `${articleStaticRoot}${path.sep}`,
        );

        if (insideArticleStaticRoot) {
          try {
            const articleHtml = await fs.readFile(articleStaticPath, 'utf8');

            return res.status(200).type('html').send(articleHtml);
          } catch (error) {
            if (error?.code !== 'ENOENT') {
              throw error;
            }
          }
        }

        const target = articles.find(
          article =>
            article.status === 'published' &&
            Array.isArray(article.legacySlugs) &&
            article.legacySlugs.includes(requestedSlug),
        );

        if (target) {
          return res.redirect(301, `/blog/${encodeURIComponent(target.slug)}/`);
        }

        const current = articles.find(
          article => article.status === 'published' && article.slug === requestedSlug,
        );

        if (current) {
          return res.status(503).type('text/plain').send('Article page is being published.');
        }

        return res.status(404).type('text/plain').send('Article not found');
      } catch (error) {
        console.error('[articles] legacy redirect failed:', error);

        return res.status(500).type('text/plain').send('Article redirect failed');
      }
    }),
  );

  app.get(
    '/api/articles',
    asyncRoute(async (_req, res) => {
      try {
        const articles = await getArticles();

        const published = articles
          .filter(article => article.status === 'published')
          .sort(
            (a, b) =>
              new Date(b.publishedAt || b.createdAt || 0) -
              new Date(a.publishedAt || a.createdAt || 0),
          )
          .map(article => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            image: article.image || '',
            imageAlt: article.imageAlt || '',
            seoDescription: article.seoDescription || '',
            category: article.category || '',
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            publishedAt: article.publishedAt,
          }));

        return res.json({
          ok: true,
          articles: published,
        });
      } catch (error) {
        console.error('[articles] public list failed:', error);

        return res.status(500).json({
          ok: false,
          error: 'ARTICLES_READ_FAILED',
        });
      }
    }),
  );

  app.get(
    '/api/articles/:slug',
    asyncRoute(async (req, res) => {
      try {
        const articles = await getArticles();

        const article = articles.find(
          item => item.status === 'published' && item.slug === req.params.slug,
        );

        if (!article) {
          return res.status(404).json({
            ok: false,
            error: 'ARTICLE_NOT_FOUND',
          });
        }

        return res.json({
          ok: true,
          article,
        });
      } catch (error) {
        console.error('[articles] public article failed:', error);

        return res.status(500).json({
          ok: false,
          error: 'ARTICLE_READ_FAILED',
        });
      }
    }),
  );

  app.get('/api/admin/blog-publication', adminAuth.requireAdmin, (_req, res) => {
    return res.json({
      ok: true,
      publication: getBlogPublicationStatus(),
    });
  });

  app.post(
    '/api/admin/articles/update-year',
    adminAuth.requireAdmin,
    asyncRoute(async (_req, res) => {
      try {
        const currentYear = new Date().getUTCFullYear();

        const result = await updatePublishedArticlesYear(currentYear);

        queueBlogPublication('articles-year-updated');

        return res.json({
          ok: true,
          ...result,
          publication: {
            queued: true,
          },
        });
      } catch (error) {
        console.error('[admin] articles year update failed:', error);

        return res.status(500).json({
          ok: false,
          error: 'ARTICLE_YEAR_UPDATE_FAILED',
        });
      }
    }),
  );

  app.get(
    '/api/admin/articles',
    adminAuth.requireAdmin,
    asyncRoute(async (_req, res) => {
      const articles = await getArticles();

      return res.json({
        ok: true,
        articles,
      });
    }),
  );

  app.post(
    '/api/admin/articles',
    adminAuth.requireAdmin,
    asyncRoute(async (req, res) => {
      try {
        const article = await createArticle(req.body);

        queueBlogPublication('article-created');

        return res.json({
          ok: true,
          article,
          publication: {
            queued: true,
          },
        });
      } catch (error) {
        if (error?.code === 'ARTICLE_SEO_REQUIRED') {
          return res.status(400).json({
            ok: false,
            error: 'ARTICLE_SEO_REQUIRED',
          });
        }

        throw error;
      }
    }),
  );

  app.get(
    '/api/admin/articles/:id',
    adminAuth.requireAdmin,
    asyncRoute(async (req, res) => {
      const article = await getArticleById(req.params.id);

      if (!article) {
        return res.status(404).json({
          ok: false,
          error: 'ARTICLE_NOT_FOUND',
        });
      }

      return res.json({
        ok: true,
        article,
      });
    }),
  );

  app.put(
    '/api/admin/articles/:id',
    adminAuth.requireAdmin,
    asyncRoute(async (req, res) => {
      try {
        const article = await updateArticle(req.params.id, req.body);

        if (!article) {
          return res.status(404).json({
            ok: false,
            error: 'ARTICLE_NOT_FOUND',
          });
        }

        queueBlogPublication('article-updated');

        return res.json({
          ok: true,
          article,
          publication: {
            queued: true,
          },
        });
      } catch (error) {
        if (error?.code === 'ARTICLE_SEO_REQUIRED') {
          return res.status(400).json({
            ok: false,
            error: 'ARTICLE_SEO_REQUIRED',
          });
        }

        throw error;
      }
    }),
  );

  app.delete(
    '/api/admin/articles/:id',
    adminAuth.requireAdmin,
    asyncRoute(async (req, res) => {
      await deleteArticle(req.params.id);

      queueBlogPublication('article-deleted');

      return res.json({
        ok: true,
        publication: {
          queued: true,
        },
      });
    }),
  );

  app.post(
    '/api/admin/upload/article-image',
    adminAuth.requireAdmin,
    asyncRoute(async (req, res) => {
      const uploadDir = path.resolve('public/uploads/articles');

      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFiles: 1,
        maxFileSize: 20 * 1024 * 1024,
      });

      let files;

      try {
        [, files] = await form.parse(req);
      } catch (error) {
        console.error('[article-image] upload failed:', error?.message || error);

        return res.status(400).json({
          ok: false,
          error: 'UPLOAD_ERROR',
        });
      }

      const file = files.image?.[0];

      if (!file) {
        return res.status(400).json({
          ok: false,
          error: 'FILE_REQUIRED',
        });
      }

      const sourcePath = file.filepath;

      const optimizedName = `${crypto.randomUUID()}.webp`;

      const optimizedPath = path.join(uploadDir, optimizedName);

      try {
        const metadata = await sharp(sourcePath).metadata();

        if (!metadata.width || !metadata.height) {
          throw new Error('INVALID_IMAGE');
        }

        const sourceStat = await fs.stat(sourcePath);

        const result = await sharp(sourcePath)
          .rotate()
          .resize({
            width: 1920,
            height: 1920,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({
            quality: 82,
            effort: 4,
            smartSubsample: true,
          })
          .toFile(optimizedPath);

        await fs.rm(sourcePath, {
          force: true,
        });

        console.info('[article-image] optimized', {
          beforeBytes: sourceStat.size,
          afterBytes: result.size,
          width: result.width,
          height: result.height,
        });

        return res.json({
          ok: true,
          url: `/uploads/articles/${optimizedName}`,
          width: result.width,
          height: result.height,
        });
      } catch (error) {
        await fs.rm(sourcePath, {
          force: true,
        });

        await fs.rm(optimizedPath, {
          force: true,
        });

        console.error('[article-image] optimization failed:', error?.message || error);

        return res.status(400).json({
          ok: false,
          error: 'INVALID_IMAGE',
        });
      }
    }),
  );
}
