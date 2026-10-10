#!/usr/bin/env bash

set -Eeuo pipefail

# Production files must be readable by nginx.
umask 022

PROJECT="/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
SITE_ROOT="/var/www/pasport-bezopasnosty.ru"

BASE_DOMAIN="pasport-bezopasnosty.ru"
SITE_PROTOCOL="https"
SERVER_IP="85.198.68.145"

RELEASES="${SITE_ROOT}/releases"
RUNTIMES="${SITE_ROOT}/release-runtime"
CURRENT="${SITE_ROOT}/current"
BACKEND_CURRENT="${SITE_ROOT}/backend-current"
SHARED_UPLOADS="${SITE_ROOT}/shared/uploads"

PM2_CONFIG="${PROJECT}/deploy/pm2/ecosystem.config.cjs"
PM2_EXEC="${BACKEND_CURRENT}/app/server/index.mjs"
GENERATION_HELPER="${PROJECT}/scripts/lib/release-generation.sh"

KEEP_RELEASES=5

source "${GENERATION_HELPER}"

exec 9>"${PROJECT}/data/.federal-deploy.lock"

if ! flock -n 9; then
    echo "ОШИБКА: федеральная публикация уже выполняется."
    exit 1
fi

cd "${PROJECT}"

echo
echo "=========================================="
echo "Федеральная публикация"
echo "Release-based deploy"
echo "=========================================="
echo

if [ ! -d "${SHARED_UPLOADS}" ]; then
    echo "ОШИБКА: отсутствует shared uploads:"
    echo "${SHARED_UPLOADS}"
    exit 1
fi

mkdir -p "${RELEASES}" "${RUNTIMES}"

PREVIOUS_RELEASE="$(
    readlink -f "${CURRENT}" 2>/dev/null || true
)"

PREVIOUS_RUNTIME=""

if [ -n "${PREVIOUS_RELEASE}" ]; then
    PREVIOUS_NAME="$(
        basename "${PREVIOUS_RELEASE}"
    )"

    PREVIOUS_RUNTIME="${RUNTIMES}/${PREVIOUS_NAME}"

    if [ -z "$(
        readlink -f "${PREVIOUS_RUNTIME}" 2>/dev/null || true
    )" ]; then
        echo "ОШИБКА: runtime активного release отсутствует:"
        echo "${PREVIOUS_RUNTIME}"
        exit 1
    fi

    if ! validate_backend_runtime \
        "${PREVIOUS_RUNTIME}" \
        >/dev/null 2>&1
    then
        echo "Активный runtime ещё legacy."
        echo "Создаём rollback-capable backend snapshot..."

        create_backend_runtime_snapshot \
            "${PROJECT}" \
            "${PREVIOUS_RUNTIME}"
    fi

    validate_backend_runtime \
        "${PREVIOUS_RUNTIME}"

    switch_generation_links \
        "${CURRENT}" \
        "${BACKEND_CURRENT}" \
        "${PREVIOUS_RELEASE}" \
        "${PREVIOUS_RUNTIME}"
fi


restore_previous_generation() {
    if [ -z "${PREVIOUS_RELEASE}" ] \
        || [ -z "${PREVIOUS_RUNTIME}" ]
    then
        return 1
    fi

    echo "Возвращаю предыдущую full-stack generation..."

    if ! switch_generation_links \
        "${CURRENT}" \
        "${BACKEND_CURRENT}" \
        "${PREVIOUS_RELEASE}" \
        "${PREVIOUS_RUNTIME}"
    then
        echo "ОШИБКА: ссылки предыдущей generation восстановить не удалось."
        return 1
    fi

    if ! activate_pm2_generation \
        "${PM2_CONFIG}" \
        passport-api \
        "${PM2_EXEC}"
    then
        echo "ОШИБКА: предыдущий backend не перезапустился."
        return 1
    fi

    if ! wait_backend_health; then
        echo "ОШИБКА: предыдущий backend не стал healthy."
        return 1
    fi

    echo "current -> $(readlink -f "${CURRENT}")"
    echo "backend-current -> $(readlink -f "${BACKEND_CURRENT}")"

    return 0
}


STAMP="$(date +%Y%m%d-%H%M%S)"

BUILD_RELEASE="${RELEASES}/.${STAMP}.building"
NEW_RELEASE="${RELEASES}/${STAMP}"

BUILD_RUNTIME="${RUNTIMES}/.${STAMP}.building"
NEW_RUNTIME="${RUNTIMES}/${STAMP}"


cleanup_building() {
    rm -rf \
        "${BUILD_RELEASE}" \
        "${BUILD_RUNTIME}"
}

trap cleanup_building EXIT




echo "Предыдущий release:"
echo "${PREVIOUS_RELEASE:-нет}"
echo

echo "[1/7] Проверяем DNS..."

DNS_RESULT="$(
    dig @1.1.1.1 +short A "${BASE_DOMAIN}" || true
)"

if ! printf '%s\n' "${DNS_RESULT}" \
    | grep -Fxq "${SERVER_IP}"
then
    echo "ОШИБКА: ${BASE_DOMAIN} не указывает на ${SERVER_IP}"
    echo "${DNS_RESULT:-ничего}"
    exit 1
fi

echo "DNS OK: ${BASE_DOMAIN} -> ${SERVER_IP}"


echo
echo "[2/7] Собираем федеральную версию..."

VITE_BASE_DOMAIN="${BASE_DOMAIN}" \
VITE_SITE_PROTOCOL="${SITE_PROTOCOL}" \
VITE_SITE_ORIGIN="${SITE_PROTOCOL}://${BASE_DOMAIN}" \
npm run build


echo
echo "[3/7] Проверяем сборку..."

for FILE in \
    index.html \
    404.html \
    admin.html \
    robots.txt \
    sitemap.xml \
    sitemap-google.xml \
    blog/index.html
do
    if [ ! -s "dist/client/${FILE}" ]; then
        echo "ОШИБКА: отсутствует dist/client/${FILE}"
        exit 1
    fi
done

if [ ! -s "dist/server/entry-server.js" ]; then
    echo "ОШИБКА: отсутствует dist/server/entry-server.js"
    exit 1
fi

if [ ! -s "dist/template/index.html" ]; then
    echo "ОШИБКА: отсутствует dist/template/index.html"
    exit 1
fi

if ! grep -Fq '<div id="root"></div>' dist/template/index.html; then
    echo "ОШИБКА: raw Vite template не содержит пустой #root."
    exit 1
fi


TITLE="$(
    grep -o '<title[^>]*>[^<]*</title>' \
        dist/client/index.html \
        | head -n 1 \
        || true
)"

CANONICAL="$(
    grep -o 'rel="canonical" href="[^"]*"' \
        dist/client/index.html \
        | head -n 1 \
        || true
)"

echo "TITLE:     ${TITLE}"
echo "CANONICAL: ${CANONICAL}"

if ! grep -Fq \
    "https://${BASE_DOMAIN}" \
    dist/client/index.html
then
    echo "ОШИБКА: неверный canonical федеральной версии."
    exit 1
fi


echo
echo "[4/7] Создаём release ${STAMP}..."

rm -rf \
    "${BUILD_RELEASE}" \
    "${BUILD_RUNTIME}"

mkdir -p \
    "${BUILD_RELEASE}" \
    "${BUILD_RUNTIME}/server" \
    "${BUILD_RUNTIME}/template"

rsync -a \
    --delete \
    --exclude='/uploads' \
    --exclude='/uploads.before-shared-*' \
    dist/client/ \
    "${BUILD_RELEASE}/"

ln -s \
    "${SHARED_UPLOADS}" \
    "${BUILD_RELEASE}/uploads"


rsync -a \
    --delete \
    dist/server/ \
    "${BUILD_RUNTIME}/server/"

cp \
    dist/template/index.html \
    "${BUILD_RUNTIME}/template/index.html"

create_backend_runtime_snapshot \
    "${PROJECT}" \
    "${BUILD_RUNTIME}"


for FILE in \
    index.html \
    404.html \
    admin.html \
    robots.txt \
    sitemap.xml \
    sitemap-google.xml \
    blog/index.html
do
    if [ ! -s "${BUILD_RELEASE}/${FILE}" ]; then
        echo "ОШИБКА: release не содержит ${FILE}"
        exit 1
    fi
done


if [ "$(
    readlink -f "${BUILD_RELEASE}/uploads"
)" != "${SHARED_UPLOADS}" ]; then
    echo "ОШИБКА: uploads release не указывает на shared/uploads."
    exit 1
fi


if [ ! -s "${BUILD_RUNTIME}/server/entry-server.js" ]; then
    echo "ОШИБКА: runtime не содержит entry-server.js."
    exit 1
fi


if ! grep -Fq \
    '<div id="root"></div>' \
    "${BUILD_RUNTIME}/template/index.html"
then
    echo "ОШИБКА: runtime template некорректен."
    exit 1
fi


validate_backend_runtime \
    "${BUILD_RUNTIME}"


# Ensure nginx can traverse and read the static release.
find "${BUILD_RELEASE}" \
    -type d \
    -exec chmod 755 {} +

find "${BUILD_RELEASE}" \
    -type f \
    -exec chmod a+r {} +


mv \
    "${BUILD_RELEASE}" \
    "${NEW_RELEASE}"

mv \
    "${BUILD_RUNTIME}" \
    "${NEW_RUNTIME}"

echo "Release готов:"
echo "${NEW_RELEASE}"

echo "Runtime готов:"
echo "${NEW_RUNTIME}"


echo
echo "[5/7] Переключаем frontend/backend generation..."

switch_generation_links \
    "${CURRENT}" \
    "${BACKEND_CURRENT}" \
    "${NEW_RELEASE}" \
    "${NEW_RUNTIME}"

echo "current -> $(readlink -f "${CURRENT}")"
echo "backend-current -> $(readlink -f "${BACKEND_CURRENT}")"

echo
echo "Перезапускаем passport-api на новой generation..."

if ! activate_pm2_generation \
    "${PM2_CONFIG}" \
    passport-api \
    "${PM2_EXEC}"
then
    echo "ОШИБКА: passport-api не переключился на новую generation."

    if ! restore_previous_generation; then
        echo "КРИТИЧЕСКАЯ ОШИБКА: предыдущую generation восстановить не удалось."
        exit 1
    fi

    rm -rf \
        "${NEW_RELEASE}" \
        "${NEW_RUNTIME}"

    exit 1
fi

echo
echo "Ждём готовность backend..."

BACKEND_READY=0

for ATTEMPT in $(seq 1 20); do
    if curl \
        -fsS \
        --max-time 3 \
        http://127.0.0.1:8787/api/health \
        2>/dev/null \
        | grep -q '"ok":true'
    then
        BACKEND_READY=1
        break
    fi

    sleep 1
done

if [ "${BACKEND_READY}" -ne 1 ]; then
    echo "ОШИБКА: backend новой generation не стал healthy."

    if ! restore_previous_generation; then
        echo "КРИТИЧЕСКАЯ ОШИБКА: предыдущую generation восстановить не удалось."
        exit 1
    fi

    rm -rf \
        "${NEW_RELEASE}" \
        "${NEW_RUNTIME}"

    exit 1
fi

echo "Backend ready."


echo
echo "[6/7] Проверяем production..."

HEALTH_RESPONSE="$(
    curl -fsS \
        --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
        "https://${BASE_DOMAIN}/healthz" \
        || true
)"

HTTP_CODE="$(
    curl -sS \
        --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
        -o /dev/null \
        -w "%{http_code}" \
        "https://${BASE_DOMAIN}/" \
        || true
)"

LIVE_HTML="$(
    curl -fsS \
        --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
        "https://${BASE_DOMAIN}/" \
        || true
)"

API_RESPONSE="$(
    curl -fsS \
        --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
        "https://${BASE_DOMAIN}/api/health" \
        || true
)"

BLOG_CODE="$(
    curl -sS \
        --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
        -o /dev/null \
        -w "%{http_code}" \
        "https://${BASE_DOMAIN}/blog/" \
        || true
)"

echo "NGINX:    ${HEALTH_RESPONSE}"
echo "HTTP:     ${HTTP_CODE}"
echo "BLOG:     ${BLOG_CODE}"
echo "API:      ${API_RESPONSE}"

FAILED=0

if [ "${HEALTH_RESPONSE}" != "ok" ]; then
    echo "ОШИБКА: /healthz не прошёл."
    FAILED=1
fi

if [ "${HTTP_CODE}" != "200" ]; then
    echo "ОШИБКА: главная страница вернула ${HTTP_CODE}."
    FAILED=1
fi

if [ "${BLOG_CODE}" != "200" ]; then
    echo "ОШИБКА: блог вернул ${BLOG_CODE}."
    FAILED=1
fi

if [[ "${LIVE_HTML}" != *"https://${BASE_DOMAIN}"* ]]; then
    echo "ОШИБКА: production HTML не содержит федеральный canonical."
    FAILED=1
fi

if [[ "${API_RESPONSE}" != *'"ok":true'* ]]; then
    echo "ОШИБКА: backend health-check не пройден."
    FAILED=1
fi

if [ "${FAILED}" -ne 0 ]; then
    echo
    echo "Production-проверка не пройдена."

    if restore_previous_generation; then
        echo "Full-stack rollback выполнен."
    else
        echo "КРИТИЧЕСКАЯ ОШИБКА: предыдущая generation недоступна."
        exit 1
    fi

    rm -rf \
        "${NEW_RELEASE}" \
        "${NEW_RUNTIME}"

    exit 1
fi


echo
echo "[7/7] Применяем retention releases и runtime..."

PASSPORT_KEEP_RELEASES="${KEEP_RELEASES}" \
    "${PROJECT}/scripts/cleanup-release-storage.sh"


echo
echo "=========================================="
echo "✓ Федеральная версия опубликована"
echo "current -> $(readlink -f "${CURRENT}")"
echo "backend-current -> $(readlink -f "${BACKEND_CURRENT}")"
echo "=========================================="
