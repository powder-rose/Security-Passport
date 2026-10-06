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
SHARED_UPLOADS="${SITE_ROOT}/shared/uploads"

KEEP_RELEASES=5

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


switch_current() {
    local target="$1"
    local temporary="${CURRENT}.next.$$"

    rm -f "${temporary}"

    ln -s "${target}" "${temporary}"

    mv -Tf \
        "${temporary}" \
        "${CURRENT}"
}

echo "Предыдущий release:"
echo "${PREVIOUS_RELEASE:-нет}"
echo

CITY_NAME="Россия"
CITY_GENITIVE="России"
CITY_PREPOSITIONAL="России"
CITY_REGION="Россия"
CITY_ADDRESS="Проспект Мира 101 ст.1"

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
VITE_CITY_NAME="${CITY_NAME}" \
VITE_CITY_GENITIVE="${CITY_GENITIVE}" \
VITE_CITY_PREPOSITIONAL="${CITY_PREPOSITIONAL}" \
VITE_CITY_REGION="${CITY_REGION}" \
VITE_CITY_ADDRESS="${CITY_ADDRESS}" \
VITE_CITY_SUBDOMAIN="" \
VITE_CITY_IS_DEFAULT="true" \
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

ln -s \
    "${PROJECT}/node_modules" \
    "${BUILD_RUNTIME}/node_modules"


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


if [ "$(
    readlink -f "${BUILD_RUNTIME}/node_modules"
)" != "$(
    readlink -f "${PROJECT}/node_modules"
)" ]; then
    echo "ОШИБКА: runtime/node_modules указывает не туда."
    exit 1
fi


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
echo "[5/7] Переключаем current..."

switch_current \
    "${NEW_RELEASE}"

echo "current -> $(readlink -f "${CURRENT}")"


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

    if [ -n "${PREVIOUS_RELEASE}" ] \
        && [ -d "${PREVIOUS_RELEASE}" ]
    then
        echo "Выполняю автоматический rollback..."

        switch_current \
            "${PREVIOUS_RELEASE}"

        echo "current -> $(readlink -f "${CURRENT}")"
    else
        echo "Предыдущий release отсутствует — автоматический rollback невозможен."
    fi

    rm -rf \
        "${NEW_RELEASE}" \
        "${NEW_RUNTIME}"

    exit 1
fi


echo
echo "[7/7] Очищаем старые releases..."

mapfile -t ALL_RELEASES < <(
    find "${RELEASES}" \
        -mindepth 1 \
        -maxdepth 1 \
        -type d \
        -name '20*' \
        -print \
        | sort -r
)

if [ "${#ALL_RELEASES[@]}" -gt "${KEEP_RELEASES}" ]; then

    for OLD_RELEASE in \
        "${ALL_RELEASES[@]:${KEEP_RELEASES}}"
    do
        if [ "$(
            readlink -f "${CURRENT}"
        )" = "${OLD_RELEASE}" ]; then
            continue
        fi

        echo "Удаляем старый release:"
        echo "${OLD_RELEASE}"

        rm -rf "${OLD_RELEASE}"
    done
fi

echo
echo "=========================================="
echo
echo "Очищаем устаревшие runtime symlink..."

for RUNTIME_ITEM in "${RUNTIMES}"/*; do
    [ -L "${RUNTIME_ITEM}" ] || continue

    RUNTIME_NAME="$(
        basename "${RUNTIME_ITEM}"
    )"

    if [ ! -d "${RELEASES}/${RUNTIME_NAME}" ]; then
        echo "Удаляем stale runtime link:"
        echo "${RUNTIME_ITEM}"

        rm -- "${RUNTIME_ITEM}"
    fi
done


echo "✓ Федеральная версия опубликована"
echo "current -> $(readlink -f "${CURRENT}")"
echo "=========================================="
