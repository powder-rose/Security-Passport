#!/usr/bin/env bash

set -Eeuo pipefail
umask 077

PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="${PROJECT}/deploy/nginx/pasport-bezopasnosty.ru.conf"
ENABLED="/etc/nginx/sites-enabled/pasport-bezopasnosty.ru"
BASE_REVISION="e47af42fd3cc94b74f20879b76536de80cdf286d"
TARGET="$(readlink -f "${ENABLED}")"

if [ "${EUID}" -ne 0 ] || [ ! -f "${TARGET}" ]; then
    echo "Нужен root и существующий активный конфиг ${ENABLED}."
    exit 1
fi

nginx -t

if cmp -s "${SOURCE}" "${TARGET}"; then
    echo "QUESTIONS_NGINX=ALREADY_CONFIGURED"
    exit 0
fi

BASE_FILE="$(mktemp)"
trap 'rm -f "${BASE_FILE}"' EXIT
git -C "${PROJECT}" show "${BASE_REVISION}:deploy/nginx/pasport-bezopasnosty.ru.conf" > "${BASE_FILE}"

if ! cmp -s "${BASE_FILE}" "${TARGET}"; then
    echo "Конфиг VPS отличается от исходной версии в Git. Изменений нет."
    echo "Перенесите только два location для /questions из ${SOURCE} и выполните nginx -t."
    exit 1
fi

# The full deployment must have activated the new backend and rendered the hub first.
curl --fail --silent --show-error --max-time 10 \
    -H 'Host: pasport-bezopasnosty.ru' \
    http://127.0.0.1:8787/questions/ \
    | python3 -c 'import sys; html=sys.stdin.read(); assert "questions-catalog" in html, "New questions backend is not active"'

BACKUP="$(mktemp -d /root/passport-questions-nginx.XXXXXX)"
cp -a "${TARGET}" "${BACKUP}/site.conf"
nginx -T > "${BACKUP}/nginx-before.txt" 2>&1

restore() {
    trap - ERR
    cp -a "${BACKUP}/site.conf" "${TARGET}"
    nginx -t && systemctl reload nginx
    echo "QUESTIONS_NGINX=ROLLED_BACK"
    echo "BACKUP_ROOT=${BACKUP}"
    exit 1
}
trap restore ERR

cp "${SOURCE}" "${TARGET}"
nginx -t
systemctl reload nginx

curl --fail --silent --show-error --max-time 15 \
    --resolve 'pasport-bezopasnosty.ru:443:127.0.0.1' \
    https://pasport-bezopasnosty.ru/questions/ \
    | python3 -c 'import sys; assert "questions-catalog" in sys.stdin.read()'

STATUS="$(curl --silent --show-error --max-time 15 \
    --resolve 'pasport-bezopasnosty.ru:443:127.0.0.1' \
    -o /dev/null -w '%{http_code}' \
    https://pasport-bezopasnosty.ru/questions/private-draft-probe/)"
[ "${STATUS}" = "404" ]

trap - ERR
echo "QUESTIONS_NGINX=OK"
echo "BACKUP_ROOT=${BACKUP}"
