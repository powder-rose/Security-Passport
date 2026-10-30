import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';

import { questionCatalog, questionPath } from '../../shared/contracts/questions.js';
import { createQuestionStore, questionStore } from '../../server/questions/question-store.mjs';
import { questionPageData } from '../../server/questions/question-public.mjs';
import { pageModuleSources } from '../../src/config/pageRouteRegistry.js';

export async function createPrerenderQuestionStore({ projectRoot, env = process.env }) {
  let serverEnv = {};
  try {
    serverEnv = dotenv.parse(
      await readFile(path.resolve(projectRoot, env.SERVER_ENV_FILE || '.env.server')),
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return createQuestionStore({
    file: path.resolve(
      env.PASSPORT_PROJECT_ROOT || serverEnv.PASSPORT_PROJECT_ROOT || projectRoot,
      env.QUESTIONS_FILE || serverEnv.QUESTIONS_FILE || 'data/questions.json',
    ),
  });
}

export async function prerenderQuestions({
  render,
  createDocument,
  clientDir,
  canonical,
  articles,
  store = questionStore,
  state = null,
}) {
  const buildState = state ?? (await store.read());
  const directory = path.join(clientDir, 'questions');
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });

  const catalog = questionCatalog(buildState);
  const hub = render({ pathname: '/questions/', questionsData: catalog });
  await writeFile(
    path.join(directory, 'index.html'),
    createDocument(hub, catalog, pageModuleSources.questions, '__PASSPORT_QUESTIONS__'),
  );

  const sitemap = [{ loc: `${canonical}/questions/`, priority: '0.8' }];
  for (const record of buildState.records) {
    if (!record.live) continue;
    const question = record.live;
    const pathname = questionPath(question.slug);
    const data = questionPageData(buildState, question, articles);
    const result = render({ pathname, questionsData: data });
    const html = createDocument(result, data, pageModuleSources.question, '__PASSPORT_QUESTIONS__');
    const output = path.join(directory, question.slug);
    await mkdir(output, { recursive: true });
    await writeFile(path.join(output, 'index.html'), html);
    if (question.indexable && question.canonical === `${canonical}${pathname}`) {
      sitemap.push({ loc: question.canonical, lastmod: question.modifiedAt, priority: '0.7' });
    }
  }
  console.log(
    `Questions prerender: ${buildState.records.filter(record => record.live).length} published`,
  );
  return sitemap;
}
