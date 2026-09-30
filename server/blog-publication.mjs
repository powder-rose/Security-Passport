import {
  mkdir,
  rm,
} from 'node:fs/promises';

import {
  spawn,
} from 'node:child_process';

import path from 'node:path';


const PROJECT_ROOT =
  path.resolve(
    process.cwd()
  );


const DIST_CLIENT =
  path.join(
    PROJECT_ROOT,
    'dist',
    'client'
  );


const DIST_BLOG =
  path.join(
    DIST_CLIENT,
    'blog'
  );


const PUBLIC_ROOT =
  '/var/www/pasport-bezopasnosty.ru/public_html';


const PUBLIC_BLOG =
  path.join(
    PUBLIC_ROOT,
    'blog'
  );


let running =
  false;


let pending =
  false;


let lastState = {
  status:
    'idle',

  reason:
    null,

  startedAt:
    null,

  finishedAt:
    null,

  error:
    null,
};



function runCommand(
  command,
  args
) {

  return new Promise(
    (resolve, reject) => {

      const child =
        spawn(
          command,
          args,
          {
            cwd:
              PROJECT_ROOT,

            stdio:
              'inherit',

            env:
              process.env,
          }
        );


      child.once(
        'error',
        reject
      );


      child.once(
        'exit',
        code => {

          if(code === 0){

            resolve();

            return;

          }


          reject(
            new Error(
              `${command} exited with code ${code}`
            )
          );

        }
      );

    }
  );

}



async function publishOnce(
  reason
) {

  const startedAt =
    new Date()
      .toISOString();


  lastState = {
    status:
      'running',

    reason,

    startedAt,

    finishedAt:
      null,

    error:
      null,
  };


  console.log(
    `[blog-publication] started: ${reason}`
  );


  /*
   * Полностью очищаем предыдущий dist/blog.
   *
   * Это важно:
   * если статья снята с публикации,
   * удалена или получила новый slug,
   * старый HTML не должен остаться.
   */
  await rm(
    DIST_BLOG,
    {
      recursive:
        true,

      force:
        true,
    }
  );


  await runCommand(
    'npm',
    [
      'run',
      'prerender',
    ]
  );


  await mkdir(
    PUBLIC_BLOG,
    {
      recursive:
        true,
    }
  );


  /*
   * Публикуем только блог.
   *
   * Остальной сайт автоматизация
   * принципиально не трогает.
   */
  await runCommand(
    'rsync',
    [
      '-a',
      '--delete',

      `${DIST_BLOG}/`,
      `${PUBLIC_BLOG}/`,
    ]
  );


  /*
   * Обновляем sitemap после изменения
   * списка опубликованных статей.
   */
  await runCommand(
    'rsync',
    [
      '-a',

      path.join(
        DIST_CLIENT,
        'sitemap.xml'
      ),

      path.join(
        DIST_CLIENT,
        'sitemap-google.xml'
      ),

      `${PUBLIC_ROOT}/`,
    ]
  );


  lastState = {
    status:
      'success',

    reason,

    startedAt,

    finishedAt:
      new Date()
        .toISOString(),

    error:
      null,
  };


  console.log(
    '[blog-publication] completed'
  );

}



async function processQueue() {

  if(running){
    return;
  }


  running =
    true;


  try {

    while(pending){

      pending =
        false;


      const reason =
        lastState.reason ||
        'article-change';


      try {

        await publishOnce(
          reason
        );

      }
      catch(error){

        console.error(
          '[blog-publication] failed:',
          error
        );


        lastState = {
          ...lastState,

          status:
            'error',

          finishedAt:
            new Date()
              .toISOString(),

          error:
            error instanceof Error
              ? error.message
              : String(error),
        };

      }

    }

  }
  finally {

    running =
      false;

  }

}



export function queueBlogPublication(
  reason =
    'article-change'
) {

  pending =
    true;


  lastState = {
    ...lastState,
    reason,
  };


  void processQueue();


  return {
    queued:
      true,

    running,
  };

}



export function getBlogPublicationStatus() {

  return {
    ...lastState,

    running,
    pending,
  };

}
