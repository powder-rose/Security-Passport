#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT="/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
SITE_ROOT="/var/www/pasport-bezopasnosty.ru"

RELEASES="${SITE_ROOT}/releases"
RUNTIMES="${SITE_ROOT}/release-runtime"
CURRENT="${SITE_ROOT}/current"
BACKEND_CURRENT="${SITE_ROOT}/backend-current"
SHARED_UPLOADS="${SITE_ROOT}/shared/uploads"

PM2_CONFIG="${PROJECT}/deploy/pm2/ecosystem.config.cjs"
PM2_EXEC="${BACKEND_CURRENT}/app/server/index.mjs"
GENERATION_HELPER="${PROJECT}/scripts/lib/release-generation.sh"

BASE_DOMAIN="pasport-bezopasnosty.ru"
SERVER_IP="85.198.68.145"

source "${GENERATION_HELPER}"

exec 9>"${PROJECT}/data/.federal-deploy.lock"

if ! flock -n 9; then
    echo "ОШИБКА: сейчас выполняется deploy или другой rollback."
    exit 1
fi





validate_release() {
    local release="$1"

    if [ ! -d "${release}" ]; then
        echo "ОШИБКА: release не существует:"
        echo "${release}"
        return 1
    fi

    for file in \
        index.html \
        404.html \
        admin.html \
        robots.txt \
        sitemap.xml \
        blog/index.html
    do
        if [ ! -s "${release}/${file}" ]; then
            echo "ОШИБКА: отсутствует ${file}"
            return 1
        fi
    done

    if [ "$(
        readlink -f "${release}/uploads" 2>/dev/null || true
    )" != "${SHARED_UPLOADS}" ]; then
        echo "ОШИБКА: uploads не указывает на shared/uploads."
        return 1
    fi
}


healthcheck() {
    local failed=0

    local nginx_response
    local frontend_code
    local blog_code
    local api_response

    nginx_response="$(
        curl -fsS \
            --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
            "https://${BASE_DOMAIN}/healthz" \
            || true
    )"

    frontend_code="$(
        curl -sS \
            --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
            -o /dev/null \
            -w "%{http_code}" \
            "https://${BASE_DOMAIN}/" \
            || true
    )"

    blog_code="$(
        curl -sS \
            --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
            -o /dev/null \
            -w "%{http_code}" \
            "https://${BASE_DOMAIN}/blog/" \
            || true
    )"

    api_response="$(
        curl -fsS \
            --resolve "${BASE_DOMAIN}:443:${SERVER_IP}" \
            "https://${BASE_DOMAIN}/api/health" \
            || true
    )"

    echo "NGINX: ${nginx_response}"
    echo "HTTP:  ${frontend_code}"
    echo "BLOG:  ${blog_code}"
    echo "API:   ${api_response}"

    if [ "${nginx_response}" != "ok" ]; then
        failed=1
    fi

    if [ "${frontend_code}" != "200" ]; then
        failed=1
    fi

    if [ "${blog_code}" != "200" ]; then
        failed=1
    fi

    if [[ "${api_response}" != *'"ok":true'* ]]; then
        failed=1
    fi

    return "${failed}"
}


list_releases() {
    local current_real

    current_real="$(
        readlink -f "${CURRENT}" 2>/dev/null || true
    )"

    echo "Текущий release:"
    echo "${current_real:-не определён}"
    echo

    echo "Доступные releases:"

    while IFS= read -r release; do

        if [ "${release}" = "${current_real}" ]; then
            printf '  * %s  [CURRENT]\n' "$(basename "${release}")"
        else
            printf '    %s\n' "$(basename "${release}")"
        fi

    done < <(
        find "${RELEASES}" \
            -mindepth 1 \
            -maxdepth 1 \
            -type d \
            -name '20*' \
            -print \
            | sort -r
    )
}


if [ "${1:-}" = "--list" ]; then
    list_releases
    exit 0
fi


ORIGINAL="$(
    readlink -f "${CURRENT}" 2>/dev/null || true
)"

if [ -z "${ORIGINAL}" ] \
    || [ ! -d "${ORIGINAL}" ]
then
    echo "ОШИБКА: current не указывает на существующий release."
    exit 1
fi

ORIGINAL_RUNTIME="$(
    readlink -f "${BACKEND_CURRENT}" 2>/dev/null || true
)"

if [ -z "${ORIGINAL_RUNTIME}" ]; then
    echo "ОШИБКА: backend-current не определён."
    exit 1
fi

validate_backend_runtime \
    "${ORIGINAL_RUNTIME}"


restore_original_generation() {
    echo "Возвращаю исходную full-stack generation..."

    if ! switch_generation_links \
        "${CURRENT}" \
        "${BACKEND_CURRENT}" \
        "${ORIGINAL}" \
        "${ORIGINAL_RUNTIME}"
    then
        echo "ОШИБКА: исходные generation links восстановить не удалось."
        return 1
    fi

    if ! activate_pm2_generation \
        "${PM2_CONFIG}" \
        passport-api \
        "${PM2_EXEC}"
    then
        echo "ОШИБКА: исходный backend не перезапустился."
        return 1
    fi

    if ! wait_backend_health; then
        echo "ОШИБКА: исходный backend не стал healthy."
        return 1
    fi

    echo "current -> $(readlink -f "${CURRENT}")"
    echo "backend-current -> $(readlink -f "${BACKEND_CURRENT}")"

    return 0
}


if [ "${1:-}" = "--to" ]; then

    if [ -z "${2:-}" ]; then
        echo "Использование:"
        echo "  $0 --to YYYYMMDD-HHMMSS"
        exit 1
    fi

    TARGET="${RELEASES}/${2}"

else

    CURRENT_NAME="$(
        basename "${ORIGINAL}"
    )"

    TARGET=""

    while IFS= read -r release; do

        name="$(
            basename "${release}"
        )"

        if [[ "${name}" < "${CURRENT_NAME}" ]]; then
            TARGET="${release}"
            break
        fi

    done < <(
        find "${RELEASES}" \
            -mindepth 1 \
            -maxdepth 1 \
            -type d \
            -name '20*' \
            -print \
            | sort -r
    )

    if [ -z "${TARGET}" ]; then
        echo "ОШИБКА: более старого release не найдено."
        exit 1
    fi

fi


TARGET="$(
    readlink -f "${TARGET}" 2>/dev/null || true
)"

if [ -z "${TARGET}" ]; then
    echo "ОШИБКА: целевой release не найден."
    exit 1
fi


if [ "${TARGET}" = "${ORIGINAL}" ]; then
    echo "ОШИБКА: этот release уже активен."
    exit 1
fi

TARGET_NAME="$(
    basename "${TARGET}"
)"

TARGET_RUNTIME="${RUNTIMES}/${TARGET_NAME}"

validate_backend_runtime \
    "${TARGET_RUNTIME}"


echo
echo "=========================================="
echo "FEDERAL ROLLBACK"
echo "=========================================="
echo
echo "FROM:"
echo "${ORIGINAL}"
echo
echo "TO:"
echo "${TARGET}"
echo


echo "[1/3] Проверяем release..."

validate_release \
    "${TARGET}"

validate_backend_runtime \
    "${TARGET_RUNTIME}"

echo "Release + backend runtime OK."


echo
echo "[2/3] Переключаем full-stack generation..."

switch_generation_links \
    "${CURRENT}" \
    "${BACKEND_CURRENT}" \
    "${TARGET}" \
    "${TARGET_RUNTIME}"

echo "current -> $(readlink -f "${CURRENT}")"
echo "backend-current -> $(readlink -f "${BACKEND_CURRENT}")"

if ! activate_pm2_generation \
    "${PM2_CONFIG}" \
    passport-api \
    "${PM2_EXEC}"
then
    echo "ОШИБКА: passport-api не запустился на rollback generation."

    if ! restore_original_generation; then
        echo "КРИТИЧЕСКАЯ ОШИБКА: исходную generation восстановить не удалось."
    fi

    exit 1
fi

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
    echo "ОШИБКА: rollback backend не стал healthy."

    if ! restore_original_generation; then
        echo "КРИТИЧЕСКАЯ ОШИБКА: исходную generation восстановить не удалось."
    fi

    exit 1
fi


echo
echo "[3/3] Проверяем production..."

if healthcheck; then

    echo
    echo "=========================================="
    echo "✓ ROLLBACK УСПЕШЕН"
    echo "current -> $(readlink -f "${CURRENT}")"
echo "backend-current -> $(readlink -f "${BACKEND_CURRENT}")"
    echo "=========================================="

    exit 0
fi


echo
echo "ОШИБКА: проверка после rollback не пройдена."
echo "Возвращаю исходный release..."

if ! restore_original_generation; then
    echo "КРИТИЧЕСКАЯ ОШИБКА: исходную generation восстановить не удалось."
    exit 1
fi

echo
echo "Проверяю восстановленную версию..."

healthcheck || true

exit 1
