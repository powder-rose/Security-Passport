#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT="/var/www/pasport-bezopasnosty.ru/app/passport-security-base"

cd "${PROJECT}"

mapfile -t SLUGS < <(node scripts/list-regions.mjs)

echo
echo "=========================================="
echo "ПОЛНОЕ ОБНОВЛЕНИЕ САЙТА"
echo "Федеральный сайт + регионов: ${#SLUGS[@]}"
echo "=========================================="
echo

"${PROJECT}/scripts/deploy-federal.sh"

for SLUG in "${SLUGS[@]}"; do
    echo
    echo "------------------------------------------"
    echo "Следующий регион: ${SLUG}"
    echo "------------------------------------------"

    "${PROJECT}/scripts/deploy-region.sh" "${SLUG}"
done

echo
echo "=========================================="
echo "✓ ПОЛНОЕ ОБНОВЛЕНИЕ ЗАВЕРШЕНО"
echo "Федеральный сайт: 1"
echo "Региональных сайтов: ${#SLUGS[@]}"
echo "=========================================="
