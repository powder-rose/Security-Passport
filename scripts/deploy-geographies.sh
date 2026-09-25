#!/usr/bin/env bash

set -Eeuo pipefail

# GEO_SERVICE_ROUTES_DEPLOY_PATCH_V1

PROJECT="/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
BASE="/var/www/pasport-bezopasnosty.ru"

RELEASES="${BASE}/geo-pages/releases"
CURRENT="${BASE}/geo-pages/current"
SHARED="${BASE}/shared"

STAMP="$(date +%Y%m%d-%H%M%S)"
NEW_RELEASE="${RELEASES}/${STAMP}"

cd "${PROJECT}"

echo
echo "=========================================="
echo "МАССОВЫЙ ДЕПЛОЙ ГЕОГРАФИЙ"
echo "=========================================="
echo


echo "[1/7] Проверяем базу географий..."

node scripts/check-geography.mjs


echo
echo "[2/7] Собираем сайт ОДИН РАЗ..."

npm run build


echo
echo "[3/7] Генерируем все географические страницы..."

node scripts/generate-geo-pages.mjs


echo
echo "[3b/7] Проверяем федеральный SSR..."

node --input-type=module <<'NODE'
import {
  pathToFileURL,
} from 'node:url';

import {
  DEFAULT_LOCATION,
} from './config/geography/index.mjs';

const serverEntry =
  pathToFileURL(
    `${process.cwd()}/dist/server/entry-server.js`,
  ).href;

const {
  render,
} = await import(serverEntry);

const checks = [
  {
    pathname:
      '/',
    canonical:
      'https://pasport-bezopasnosty.ru',
    fragment:
      null,
  },
  {
    pathname:
      '/akt-obsledovaniya-i-kategorirovaniya-obekta/',
    canonical:
      'https://pasport-bezopasnosty.ru/akt-obsledovaniya-i-kategorirovaniya-obekta/',
    fragment:
      'Акт обследования',
  },
  {
    pathname:
      '/aktualizaciya-pasporta-bezopasnosti-obekta/',
    canonical:
      'https://pasport-bezopasnosty.ru/aktualizaciya-pasporta-bezopasnosti-obekta/',
    fragment:
      'Актуализация паспорта',
  },
];

for (const check of checks) {

  const result = await render({
    city:
      DEFAULT_LOCATION,
    pathname:
      check.pathname,
  });

  const head = [
    result.helmet?.title?.toString() || '',
    result.helmet?.meta?.toString() || '',
    result.helmet?.link?.toString() || '',
  ].join('\n');

  if (
    !head.includes(
      `rel="canonical" href="${check.canonical}"`,
    )
  ) {
    throw new Error(
      `Federal canonical failed: ${check.pathname}`,
    );
  }

  if (
    check.fragment &&
    !result.html
      .toLowerCase()
      .includes(
        check.fragment.toLowerCase(),
      )
  ) {
    throw new Error(
      `Federal content failed: ${check.pathname}`,
    );
  }
}

console.log(
  '✓ Federal SSR regression passed'
);
NODE



echo
echo "[4/7] Проверяем результат генерации..."

EXPECTED="$(
  node --input-type=module <<'NODE'
import {
  getRegionalLocations,
} from './config/geography/index.mjs';

console.log(
  getRegionalLocations().length
);
NODE
)"

GENERATED="$(
  node --input-type=module <<'NODE'
import fs from 'node:fs';

const manifest =
  JSON.parse(
    fs.readFileSync(
      './dist/geo-pages/manifest.json',
      'utf8',
    ),
  );

console.log(
  manifest.locations.filter(
    (location) => location.slug,
  ).length,
);
NODE
)"

echo "Ожидается регионов: ${EXPECTED}"
echo "Сгенерировано:       ${GENERATED}"

if [ "${EXPECTED}" != "${GENERATED}" ]; then
    echo "ОШИБКА: количество страниц не совпадает."
    exit 1
fi


echo

echo
echo "Проверяем service/object routes и количество HTML..."

MANIFEST_STATS="$(
  node --input-type=module <<'NODE'
import fs from 'node:fs';

const manifest =
  JSON.parse(
    fs.readFileSync(
      './dist/geo-pages/manifest.json',
      'utf8',
    ),
  );


/*
 * Object-type pages are federal-only.
 * Regional geography releases must not contain them.
 */
const expectedObjectRoutes = [];


const values = [
  manifest.regionalCount,
  manifest.serviceRouteCount,
  manifest.servicePageCount,
  manifest.objectRouteCount,
  manifest.objectPageCount,
  manifest.regionalHtmlCount,
];


if (
  values.some(
    (value) =>
      !Number.isInteger(value),
  )
) {
  throw new Error(
    'В manifest отсутствует статистика regional routes',
  );
}


if (
  manifest.objectRouteCount !==
  expectedObjectRoutes.length
) {
  throw new Error(
    'objectRouteCount не совпадает с objectTypes',
  );
}


if (
  JSON.stringify(
    manifest.objectRoutes,
  ) !==
  JSON.stringify(
    expectedObjectRoutes,
  )
) {
  throw new Error(
    'objectRoutes не совпадают с objectTypes',
  );
}


console.log(
  values.join('|'),
);
NODE
)"


IFS='|' read -r \
  MANIFEST_REGIONS \
  SERVICE_ROUTE_COUNT \
  SERVICE_PAGE_COUNT \
  OBJECT_ROUTE_COUNT \
  OBJECT_PAGE_COUNT \
  REGIONAL_HTML_COUNT \
  <<< "${MANIFEST_STATS}"


EXPECTED_SERVICE_PAGES=$((
  EXPECTED *
  SERVICE_ROUTE_COUNT
))


EXPECTED_OBJECT_PAGES=$((
  EXPECTED *
  OBJECT_ROUTE_COUNT
))


EXPECTED_REGIONAL_HTML=$((
  EXPECTED *
  (
    1 +
    SERVICE_ROUTE_COUNT +
    OBJECT_ROUTE_COUNT
  )
))


ACTUAL_REGIONAL_HTML="$(
  find dist/geo-pages/regions \
    -type f \
    -name index.html \
    | wc -l \
    | tr -d '[:space:]'
)"


echo "Service routes:                 ${SERVICE_ROUTE_COUNT}"
echo "Object routes:                  ${OBJECT_ROUTE_COUNT}"
echo "Service HTML ожидается:         ${EXPECTED_SERVICE_PAGES}"
echo "Service HTML в manifest:        ${SERVICE_PAGE_COUNT}"
echo "Object HTML ожидается:          ${EXPECTED_OBJECT_PAGES}"
echo "Object HTML в manifest:         ${OBJECT_PAGE_COUNT}"
echo "Всего regional HTML ожидается: ${EXPECTED_REGIONAL_HTML}"
echo "Всего regional HTML manifest:  ${REGIONAL_HTML_COUNT}"
echo "Всего regional HTML на диске:  ${ACTUAL_REGIONAL_HTML}"


if [ "${MANIFEST_REGIONS}" != "${EXPECTED}" ]; then
    echo "ОШИБКА: regionalCount в manifest не совпадает."
    exit 1
fi


if [ "${SERVICE_PAGE_COUNT}" != "${EXPECTED_SERVICE_PAGES}" ]; then
    echo "ОШИБКА: количество service pages не совпадает."
    exit 1
fi


if [ "${OBJECT_PAGE_COUNT}" != "${EXPECTED_OBJECT_PAGES}" ]; then
    echo "ОШИБКА: количество object pages не совпадает."
    exit 1
fi


if [ "${REGIONAL_HTML_COUNT}" != "${EXPECTED_REGIONAL_HTML}" ]; then
    echo "ОШИБКА: regionalHtmlCount в manifest не совпадает."
    exit 1
fi


if [ "${ACTUAL_REGIONAL_HTML}" != "${EXPECTED_REGIONAL_HTML}" ]; then
    echo "ОШИБКА: фактическое количество HTML не совпадает."
    exit 1
fi



echo "[5/7] Готовим новый release..."

mkdir -p "${RELEASES}"
mkdir -p "${NEW_RELEASE}"

cp -a \
  dist/geo-pages/regions/. \
  "${NEW_RELEASE}/"

chmod -R a+rX "${NEW_RELEASE}"


echo
echo "[6/7] Обновляем общую статику..."

mkdir -p \
  "${SHARED}/assets" \
  "${SHARED}/images" \
  "${SHARED}/styles"

# Старые hashed assets специально не удаляем:
# старые HTML и браузерный кеш продолжат работать.
cp -a \
  dist/client/assets/. \
  "${SHARED}/assets/"

cp -a \
  dist/client/images/. \
  "${SHARED}/images/"

if [ ! -d dist/client/styles ]; then
    echo "ОШИБКА: dist/client/styles отсутствует после build."
    exit 1
fi

cp -a \
  dist/client/styles/. \
  "${SHARED}/styles/"


cp -a \
  dist/client/favicon.png \
  "${SHARED}/favicon.png"

cp -a \
  dist/client/favicon.svg \
  "${SHARED}/favicon.svg"

cp -a \
  dist/client/apple-touch-icon.png \
  "${SHARED}/apple-touch-icon.png"

chmod -R a+rX "${SHARED}"


echo
echo "[7/7] Атомарно переключаем production..."

ln -sfn \
  "${NEW_RELEASE}" \
  "${CURRENT}"


echo
echo "Проверяем Nginx..."

nginx -t


echo
echo "[cleanup] Удаляем временную массовую сборку..."

if [ -d "${PROJECT}/dist/geo-pages" ]; then
    rm -rf -- "${PROJECT}/dist/geo-pages"
    echo "✓ dist/geo-pages удалён"
else
    echo "✓ dist/geo-pages уже отсутствует"
fi


echo
echo "[cleanup] Оставляем current + один release для rollback..."

CURRENT_REAL="$(
  readlink -f "${CURRENT}"
)"

if [ -z "${CURRENT_REAL}" ] || [ ! -d "${CURRENT_REAL}" ]; then
    echo "ОШИБКА: не удалось определить текущий production release."
    exit 1
fi

PREVIOUS_KEEP=""

while IFS= read -r RELEASE_PATH; do
    if [ "${RELEASE_PATH}" = "${CURRENT_REAL}" ]; then
        continue
    fi

    PREVIOUS_KEEP="${RELEASE_PATH}"
    break
done < <(
    find "${RELEASES}"       -mindepth 1       -maxdepth 1       -type d       -print       | sort -r
)

echo "Current:"
echo "${CURRENT_REAL}"

if [ -n "${PREVIOUS_KEEP}" ]; then
    echo
    echo "Rollback:"
    echo "${PREVIOUS_KEEP}"
else
    echo
    echo "Rollback release пока отсутствует."
fi

while IFS= read -r RELEASE_PATH; do
    if [ "${RELEASE_PATH}" = "${CURRENT_REAL}" ]; then
        continue
    fi

    if       [ -n "${PREVIOUS_KEEP}" ] &&       [ "${RELEASE_PATH}" = "${PREVIOUS_KEEP}" ]
    then
        continue
    fi

    echo "Удаляем старый release:"
    echo "${RELEASE_PATH}"

    rm -rf -- "${RELEASE_PATH}"
done < <(
    find "${RELEASES}"       -mindepth 1       -maxdepth 1       -type d       -print       | sort -r
)


echo
echo "[cleanup] Releases после очистки:"

du -sh   "${RELEASES}"/*   2>/dev/null   | sort -h   || true


echo
echo "=========================================="
echo "✓ ДЕПЛОЙ ЗАВЕРШЁН"
echo "=========================================="
echo "Release:"
echo "${NEW_RELEASE}"
echo
echo "Current:"
readlink -f "${CURRENT}"
echo
echo "Регионов опубликовано: ${GENERATED}"
echo
