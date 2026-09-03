#!/usr/bin/env bash

set -Eeuo pipefail

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
  "${SHARED}/images"

# Старые hashed assets специально не удаляем:
# старые HTML и браузерный кеш продолжат работать.
cp -a \
  dist/client/assets/. \
  "${SHARED}/assets/"

cp -a \
  dist/client/images/. \
  "${SHARED}/images/"

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
