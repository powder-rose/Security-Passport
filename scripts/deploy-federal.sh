#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT="/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
SITE_ROOT="/var/www/pasport-bezopasnosty.ru"

BASE_DOMAIN="pasport-bezopasnosty.ru"
SITE_PROTOCOL="https"
SERVER_IP="85.198.68.145"

PUBLIC_DIR="${SITE_ROOT}/public_html"
NEW_DIR="${SITE_ROOT}/public_html.new"
OLD_DIR="${SITE_ROOT}/public_html.previous"

cd "${PROJECT}"

mapfile -t REGION_DATA < <(node scripts/get-default-region.mjs)

CITY_NAME="${REGION_DATA[0]}"
CITY_GENITIVE="${REGION_DATA[1]}"
CITY_PREPOSITIONAL="${REGION_DATA[2]}"
CITY_REGION="${REGION_DATA[3]}"
CITY_ADDRESS="${REGION_DATA[4]:-}"

echo
echo "=========================================="
echo "Федеральная версия"
echo "Домен: ${SITE_PROTOCOL}://${BASE_DOMAIN}"
echo "=========================================="
echo

echo "[1/5] Проверяем DNS..."

DNS_RESULT="$(dig @1.1.1.1 +short A "${BASE_DOMAIN}" || true)"

if ! printf '%s\n' "${DNS_RESULT}" | grep -Fxq "${SERVER_IP}"; then
    echo "ОШИБКА: ${BASE_DOMAIN} не указывает на ${SERVER_IP}"
    echo "${DNS_RESULT:-ничего}"
    exit 1
fi

echo "DNS OK: ${BASE_DOMAIN} -> ${SERVER_IP}"


echo "[2/5] Собираем федеральную версию..."

VITE_BASE_DOMAIN="${BASE_DOMAIN}" \
VITE_SITE_PROTOCOL="${SITE_PROTOCOL}" \
VITE_SITE_ORIGIN="${SITE_PROTOCOL}://${BASE_DOMAIN}" \
VITE_CITY_NAME="${CITY_NAME}" \
VITE_CITY_GENITIVE="${CITY_GENITIVE}" \
VITE_CITY_PREPOSITIONAL="${CITY_PREPOSITIONAL}" \
VITE_CITY_REGION="${CITY_REGION}" \
VITE_CITY_ADDRESS="${CITY_ADDRESS}" \
VITE_CITY_SUBDOMAIN="" \
VITE_CITY_IS_DEFAULT="true" \
npm run build


echo "[3/5] Проверяем сборку..."

TITLE="$(grep -o '<title[^>]*>[^<]*</title>' dist/client/index.html || true)"
CANONICAL="$(grep -o 'rel="canonical" href="[^"]*"' dist/client/index.html || true)"

echo "TITLE:     ${TITLE}"
echo "CANONICAL: ${CANONICAL}"

if ! grep -Fq "https://${BASE_DOMAIN}" dist/client/index.html; then
    echo "ОШИБКА: неверный canonical федеральной версии."
    exit 1
fi


echo "[4/5] Публикуем..."

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
      --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
      -o /dev/null \
      -w "%{http_code}" \
      "https://${BASE_DOMAIN}/"
)"

LIVE_HTML="$(
    curl -sS \
      --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
      "https://${BASE_DOMAIN}/"
)"

API_RESPONSE="$(
    curl -sS \
      --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
      "https://${BASE_DOMAIN}/api/health" || true
)"

echo
echo "HTTP: ${HTTP_CODE}"
echo "API:  ${API_RESPONSE}"
echo

if [ "${HTTP_CODE}" != "200" ] || [[ "${LIVE_HTML}" != *"https://${BASE_DOMAIN}"* ]]; then
    echo "ОШИБКА: production-проверка федерального сайта не пройдена."

    if [ -d "${OLD_DIR}" ]; then
        echo "Выполняю автоматический откат..."
        rm -rf "${PUBLIC_DIR}"
        mv "${OLD_DIR}" "${PUBLIC_DIR}"
        echo "Предыдущая версия восстановлена."
    fi

    exit 1
fi

echo "✓ Федеральная версия успешно опубликована."
