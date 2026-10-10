#!/usr/bin/env bash

set -Eeuo pipefail

# Production files must be readable by nginx.
umask 022

PROJECT="/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
SITE_ROOT="/var/www/pasport-bezopasnosty.ru"

RELEASES="${SITE_ROOT}/releases"
RUNTIMES="${SITE_ROOT}/release-runtime"
CURRENT="${SITE_ROOT}/current"
BACKEND_CURRENT="${SITE_ROOT}/backend-current"
SHARED_UPLOADS="${SITE_ROOT}/shared/uploads"

GENERATION_HELPER="${PROJECT}/scripts/lib/release-generation.sh"

BASE_DOMAIN="pasport-bezopasnosty.ru"
SERVER_IP="85.198.68.145"

KEEP_RELEASES=5

source "${GENERATION_HELPER}"

LOCK_FILE="${PROJECT}/data/.federal-deploy.lock"
LOG_FILE="/var/log/passport-deploy.log"

REASON="${1:-article-change}"

cd "${PROJECT}"

exec 9>"${LOCK_FILE}"

echo "[blog-publication] waiting for federal lock..."

if ! flock -w 30 9; then
    echo "ОШИБКА: federal lock не получен за 30 секунд."
    exit 75
fi


ORIGINAL_RELEASE="$(
    readlink -f "${CURRENT}" 2>/dev/null || true
)"

if [ -z "${ORIGINAL_RELEASE}" ] \
    || [ ! -d "${ORIGINAL_RELEASE}" ]
then
    echo "ОШИБКА: current release не найден."
    exit 1
fi

ORIGINAL_NAME="$(
    basename "${ORIGINAL_RELEASE}"
)"

RUNTIME="${RUNTIMES}/${ORIGINAL_NAME}"

SERVER_ENTRY="${RUNTIME}/server/entry-server.js"
RAW_TEMPLATE="${RUNTIME}/template/index.html"

validate_backend_runtime \
    "${RUNTIME}"

if [ ! -s "${SERVER_ENTRY}" ]; then
    echo "ОШИБКА: отсутствует SSR runtime:"
    echo "${SERVER_ENTRY}"
    exit 1
fi

if [ ! -s "${RAW_TEMPLATE}" ]; then
    echo "ОШИБКА: отсутствует raw template:"
    echo "${RAW_TEMPLATE}"
    exit 1
fi

if ! grep -Fq \
    '<div id="root"></div>' \
    "${RAW_TEMPLATE}"
then
    echo "ОШИБКА: runtime template не содержит пустой #root."
    exit 1
fi


if [ "$(
    readlink -f "${ORIGINAL_RELEASE}/uploads" 2>/dev/null || true
)" != "${SHARED_UPLOADS}" ]; then
    echo "ОШИБКА: current/uploads повреждён."
    exit 1
fi


STAMP="$(
    date +%Y%m%d-%H%M%S
)"

NEW_RELEASE="${RELEASES}/${STAMP}-blog"

if [ -e "${NEW_RELEASE}" ]; then
    NEW_RELEASE="${RELEASES}/${STAMP}-blog-$$"
fi

NEW_NAME="$(
    basename "${NEW_RELEASE}"
)"

NEW_RUNTIME="${RUNTIMES}/${NEW_NAME}"

RUNTIME_REAL="$(
    readlink -f "${RUNTIME}" 2>/dev/null || true
)"

if [ -z "${RUNTIME_REAL}" ] \
    || [ ! -d "${RUNTIME_REAL}" ]
then
    echo "ОШИБКА: исходный runtime повреждён."
    exit 1
fi


WORKDIR="$(
    mktemp -d /tmp/passport-blog-prerender.XXXXXX
)"

TMP_CLIENT="${WORKDIR}/client"
TMP_TEMPLATE_DIR="${WORKDIR}/template"

mkdir -p \
    "${TMP_CLIENT}" \
    "${TMP_TEMPLATE_DIR}"


cleanup_workdir() {
    rm -rf "${WORKDIR}"
}

trap cleanup_workdir EXIT


log_event() {
    printf '%s TYPE=blog REASON=%q FROM=%q TO=%q PID=%s STATUS=%s\n' \
        "$(date --iso-8601=seconds)" \
        "${REASON}" \
        "${ORIGINAL_NAME}" \
        "$(basename "${NEW_RELEASE}")" \
        "$$" \
        "$1" \
        >> "${LOG_FILE}"
}





remove_new_release() {
    if [ -d "${NEW_RELEASE}" ]; then
        rm -rf "${NEW_RELEASE}"
    fi

    if [ -L "${NEW_RUNTIME}" ]; then
        rm -f "${NEW_RUNTIME}"
    fi
}


echo
echo "=========================================="
echo "ISOLATED BLOG RELEASE"
echo "=========================================="
echo "REASON:  ${REASON}"
echo "FROM:    ${ORIGINAL_RELEASE}"
echo "RUNTIME: ${RUNTIME}"
echo "TO:      ${NEW_RELEASE}"
echo

log_event "started"


echo "[1/7] Копируем active release во временную область..."

rsync -a \
    --exclude='/uploads' \
    "${ORIGINAL_RELEASE}/" \
    "${TMP_CLIENT}/"

# Runtime template является неизменяемым источником.
# Prerender работает только с его временной копией.
cp \
    "${RAW_TEMPLATE}" \
    "${TMP_CLIENT}/index.html"


echo "[2/7] Запускаем изолированный prerender..."

PRERENDER_CLIENT_DIR="${TMP_CLIENT}" \
PRERENDER_SERVER_ENTRY="${SERVER_ENTRY}" \
PRERENDER_TEMPLATE_DIR="${TMP_TEMPLATE_DIR}" \
node scripts/prerender.mjs


echo "[3/7] Проверяем результат..."

for FILE in \
    "${TMP_CLIENT}/blog/index.html" \
    "${TMP_CLIENT}/sitemap.xml" \
    "${TMP_CLIENT}/sitemap-google.xml"
do
    if [ ! -s "${FILE}" ]; then
        echo "ОШИБКА: отсутствует ${FILE}"

        log_event "failed-prerender"
        exit 1
    fi
done


echo "[4/7] Проверяем frontend assets..."

MISSING_ASSET=0

while IFS= read -r ASSET; do

    [ -z "${ASSET}" ] \
        && continue

    RELATIVE="${ASSET#/}"

    if [ ! -f "${ORIGINAL_RELEASE}/${RELATIVE}" ]; then
        echo "MISSING ASSET: ${ASSET}"
        MISSING_ASSET=1
    fi

done < <(
    grep -RhoE \
        '(src|href)="/assets/[^"]+"' \
        "${TMP_CLIENT}/blog" \
        2>/dev/null \
        | sed -E \
            's/^(src|href)="([^"]+)".*/\2/' \
        | sort -u
)

if [ "${MISSING_ASSET}" -ne 0 ]; then
    echo "ОШИБКА: blog prerender использует отсутствующие assets."

    log_event "failed-assets"
    exit 1
fi


echo "[5/7] Создаём независимый release..."

mkdir -p "${NEW_RELEASE}"

rsync -a \
    --exclude='/uploads' \
    "${ORIGINAL_RELEASE}/" \
    "${NEW_RELEASE}/"

ln -s \
    "${SHARED_UPLOADS}" \
    "${NEW_RELEASE}/uploads"


rm -rf \
    "${NEW_RELEASE}/blog"

mkdir -p \
    "${NEW_RELEASE}/blog"

rsync -a \
    --delete \
    "${TMP_CLIENT}/blog/" \
    "${NEW_RELEASE}/blog/"


cp \
    "${TMP_CLIENT}/sitemap.xml" \
    "${NEW_RELEASE}/sitemap.xml"

cp \
    "${TMP_CLIENT}/sitemap-google.xml" \
    "${NEW_RELEASE}/sitemap-google.xml"


if [ "$(
    readlink -f "${NEW_RELEASE}/uploads"
)" != "${SHARED_UPLOADS}" ]; then

    echo "ОШИБКА: новый release потерял shared/uploads."

    remove_new_release
    log_event "failed-uploads"

    exit 1
fi


if [ -e "${NEW_RUNTIME}" ] \
    || [ -L "${NEW_RUNTIME}" ]
then
    echo "ОШИБКА: runtime нового release уже существует:"
    echo "${NEW_RUNTIME}"

    remove_new_release
    log_event "failed-runtime"

    exit 1
fi

ln -s \
    "${RUNTIME_REAL}" \
    "${NEW_RUNTIME}"

echo "runtime -> $(readlink -f "${NEW_RUNTIME}")"


echo "[6/7] Переключаем generation..."

switch_generation_links \
    "${CURRENT}" \
    "${BACKEND_CURRENT}" \
    "${NEW_RELEASE}" \
    "${NEW_RUNTIME}"

echo "current -> $(readlink -f "${CURRENT}")"
echo "backend-current -> $(readlink -f "${BACKEND_CURRENT}")"


echo "[7/7] Проверяем production..."

NGINX_RESPONSE="$(
    curl -fsS \
        --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
        "https://${BASE_DOMAIN}/healthz" \
        || true
)"

FRONTEND_CODE="$(
    curl -sS \
        --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
        -o /dev/null \
        -w "%{http_code}" \
        "https://${BASE_DOMAIN}/" \
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

API_RESPONSE="$(
    curl -fsS \
        --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
        "https://${BASE_DOMAIN}/api/health" \
        || true
)"

echo "NGINX: ${NGINX_RESPONSE}"
echo "HTTP:  ${FRONTEND_CODE}"
echo "BLOG:  ${BLOG_CODE}"
echo "API:   ${API_RESPONSE}"


FAILED=0

[ "${NGINX_RESPONSE}" = "ok" ] \
    || FAILED=1

[ "${FRONTEND_CODE}" = "200" ] \
    || FAILED=1

[ "${BLOG_CODE}" = "200" ] \
    || FAILED=1

[[ "${API_RESPONSE}" == *'"ok":true'* ]] \
    || FAILED=1


if [ "${FAILED}" -ne 0 ]; then

    echo
    echo "ОШИБКА: production health-check не пройден."
    echo "Возвращаю ${ORIGINAL_NAME}..."

    switch_generation_links \
        "${CURRENT}" \
        "${BACKEND_CURRENT}" \
        "${ORIGINAL_RELEASE}" \
        "${RUNTIME}"

    remove_new_release

    log_event "rolled-back"

    echo "current -> $(readlink -f "${CURRENT}")"

    exit 1
fi


echo
echo "Применяем retention releases и runtime..."

PASSPORT_KEEP_RELEASES="${KEEP_RELEASES}" \
    "${PROJECT}/scripts/cleanup-release-storage.sh"

log_event "success"

echo
echo "=========================================="
echo "✓ БЛОГ ОПУБЛИКОВАН"
echo "current -> $(readlink -f "${CURRENT}")"
echo "backend-current -> $(readlink -f "${BACKEND_CURRENT}")"
echo "=========================================="
