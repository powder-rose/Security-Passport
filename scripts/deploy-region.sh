#!/usr/bin/env bash

set -Eeuo pipefail

if [ "$#" -ne 1 ]; then
    echo "Использование:"
    echo "  deploy-region slug"
    echo
    echo "Пример:"
    echo "  deploy-region kazan"
    exit 1
fi

SLUG="$1"

PROJECT="/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
BASE_DOMAIN="pasport-bezopasnosty.ru"
SITE_PROTOCOL="https"
SERVER_IP="85.198.68.145"

cd "${PROJECT}"

mapfile -t REGION_DATA < <(node scripts/get-region.mjs "${SLUG}")

if [ "${#REGION_DATA[@]}" -lt 5 ]; then
    echo "ОШИБКА: не удалось прочитать данные региона '${SLUG}'."
    exit 1
fi

CITY_SLUG="${REGION_DATA[0]}"
CITY_NAME="${REGION_DATA[1]}"
CITY_GENITIVE="${REGION_DATA[2]}"
CITY_PREPOSITIONAL="${REGION_DATA[3]}"
CITY_REGION="${REGION_DATA[4]}"

DOMAIN="${CITY_SLUG}.${BASE_DOMAIN}"

REGION_ROOT="/var/www/pasport-bezopasnosty.ru/regions/${CITY_SLUG}"
PUBLIC_DIR="${REGION_ROOT}/public_html"
NEW_DIR="${REGION_ROOT}/public_html.new"
OLD_DIR="${REGION_ROOT}/public_html.previous"

echo
echo "=========================================="
echo "Регион: ${CITY_NAME}"
echo "Домен:  ${SITE_PROTOCOL}://${DOMAIN}"
echo "=========================================="
echo

echo "[1/5] Проверяем DNS..."

DNS_RESULT="$(dig @1.1.1.1 +short A "${DOMAIN}" || true)"

if ! printf '%s\n' "${DNS_RESULT}" | grep -Fxq "${SERVER_IP}"; then
    echo "ОШИБКА: ${DOMAIN} не указывает на ${SERVER_IP}"
    echo "DNS вернул:"
    echo "${DNS_RESULT:-ничего}"
    exit 1
fi

echo "DNS OK: ${DOMAIN} -> ${SERVER_IP}"


echo "[2/5] Собираем сайт..."

VITE_BASE_DOMAIN="${BASE_DOMAIN}" \
VITE_SITE_PROTOCOL="${SITE_PROTOCOL}" \
VITE_CITY_NAME="${CITY_NAME}" \
VITE_CITY_GENITIVE="${CITY_GENITIVE}" \
VITE_CITY_PREPOSITIONAL="${CITY_PREPOSITIONAL}" \
VITE_CITY_REGION="${CITY_REGION}" \
VITE_CITY_SUBDOMAIN="${CITY_SLUG}" \
VITE_CITY_IS_DEFAULT="false" \
npm run build


echo "[3/5] Проверяем сборку..."

TITLE="$(grep -o '<title[^>]*>[^<]*</title>' dist/client/index.html || true)"
CANONICAL="$(grep -o 'rel="canonical" href="[^"]*"' dist/client/index.html || true)"

echo "TITLE:     ${TITLE}"
echo "CANONICAL: ${CANONICAL}"

if ! grep -Fq "https://${DOMAIN}" dist/client/index.html; then
    echo "ОШИБКА: неверный canonical."
    exit 1
fi

if ! grep -Fq "${CITY_PREPOSITIONAL}" dist/client/index.html; then
    echo "ОШИБКА: форма города '${CITY_PREPOSITIONAL}' не найдена в HTML."
    exit 1
fi


echo "[4/5] Публикуем..."

mkdir -p "${REGION_ROOT}"

rm -rf "${NEW_DIR}"
mkdir -p "${NEW_DIR}"

cp -a dist/client/. "${NEW_DIR}/"

rm -rf "${OLD_DIR}"

if [ -d "${PUBLIC_DIR}" ]; then
    mv "${PUBLIC_DIR}" "${OLD_DIR}"
fi

mv "${NEW_DIR}" "${PUBLIC_DIR}"


echo "[5/5] Проверяем production..."

HTTP_CODE="$(
    curl -sS \
      --resolve "${DOMAIN}:443:${SERVER_IP}" \
      -o /dev/null \
      -w "%{http_code}" \
      "https://${DOMAIN}/"
)"

LIVE_HTML="$(
    curl -sS \
      --resolve "${DOMAIN}:443:${SERVER_IP}" \
      "https://${DOMAIN}/"
)"

LIVE_TITLE="$(
    printf '%s' "${LIVE_HTML}" |
    grep -o '<title[^>]*>[^<]*</title>' || true
)"

API_RESPONSE="$(
    curl -sS \
      --resolve "${DOMAIN}:443:${SERVER_IP}" \
      "https://${DOMAIN}/api/health" || true
)"

echo
echo "HTTP:  ${HTTP_CODE}"
echo "TITLE: ${LIVE_TITLE}"
echo "API:   ${API_RESPONSE}"
echo

if [ "${HTTP_CODE}" != "200" ] || [[ "${LIVE_HTML}" != *"https://${DOMAIN}"* ]]; then
    echo "ОШИБКА: production-проверка сайта не пройдена."

    if [ -d "${OLD_DIR}" ]; then
        echo "Выполняю автоматический откат..."
        rm -rf "${PUBLIC_DIR}"
        mv "${OLD_DIR}" "${PUBLIC_DIR}"
        echo "Предыдущая версия восстановлена."
    fi

    exit 1
fi

echo "✓ ${CITY_NAME} успешно опубликован."
