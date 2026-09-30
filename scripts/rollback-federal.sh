#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT="/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
SITE_ROOT="/var/www/pasport-bezopasnosty.ru"

RELEASES="${SITE_ROOT}/releases"
CURRENT="${SITE_ROOT}/current"
SHARED_UPLOADS="${SITE_ROOT}/shared/uploads"

BASE_DOMAIN="pasport-bezopasnosty.ru"
SERVER_IP="85.198.68.145"

exec 9>"${PROJECT}/data/.federal-deploy.lock"

if ! flock -n 9; then
    echo "ОШИБКА: сейчас выполняется deploy или другой rollback."
    exit 1
fi


switch_current() {
    local target="$1"
    local temporary="${CURRENT}.next.$$"

    rm -f "${temporary}"

    ln -s \
        "${target}" \
        "${temporary}"

    mv -Tf \
        "${temporary}" \
        "${CURRENT}"
}


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

echo "Release OK."


echo
echo "[2/3] Переключаем current..."

switch_current \
    "${TARGET}"

echo "current -> $(readlink -f "${CURRENT}")"


echo
echo "[3/3] Проверяем production..."

if healthcheck; then

    echo
    echo "=========================================="
    echo "✓ ROLLBACK УСПЕШЕН"
    echo "current -> $(readlink -f "${CURRENT}")"
    echo "=========================================="

    exit 0
fi


echo
echo "ОШИБКА: проверка после rollback не пройдена."
echo "Возвращаю исходный release..."

switch_current \
    "${ORIGINAL}"

echo "current -> $(readlink -f "${CURRENT}")"

echo
echo "Проверяю восстановленную версию..."

healthcheck || true

exit 1
