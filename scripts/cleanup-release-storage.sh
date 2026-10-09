#!/usr/bin/env bash

set -Eeuo pipefail

SITE_ROOT="${PASSPORT_SITE_ROOT:-/var/www/pasport-bezopasnosty.ru}"
RELEASES="${PASSPORT_RELEASES_DIR:-${SITE_ROOT}/releases}"
RUNTIMES="${PASSPORT_RUNTIMES_DIR:-${SITE_ROOT}/release-runtime}"
CURRENT="${PASSPORT_CURRENT_LINK:-${SITE_ROOT}/current}"
KEEP_RELEASES="${PASSPORT_KEEP_RELEASES:-5}"

DRY_RUN=0

case "${1:-}" in
    "")
        ;;
    --dry-run)
        DRY_RUN=1
        ;;
    *)
        echo "Использование:"
        echo "  $0 [--dry-run]"
        exit 2
        ;;
esac

if ! [[ "${KEEP_RELEASES}" =~ ^[1-9][0-9]*$ ]]; then
    echo "ОШИБКА: PASSPORT_KEEP_RELEASES должен быть положительным целым числом."
    exit 1
fi

if [ ! -d "${RELEASES}" ]; then
    echo "ОШИБКА: каталог releases не найден:"
    echo "${RELEASES}"
    exit 1
fi

if [ ! -d "${RUNTIMES}" ]; then
    echo "ОШИБКА: каталог release-runtime не найден:"
    echo "${RUNTIMES}"
    exit 1
fi

CURRENT_RELEASE="$(
    readlink -f "${CURRENT}" 2>/dev/null || true
)"

if [ -z "${CURRENT_RELEASE}" ] || [ ! -d "${CURRENT_RELEASE}" ]; then
    echo "ОШИБКА: current не указывает на существующий release."
    exit 1
fi

case "${CURRENT_RELEASE}" in
    "${RELEASES}"/*)
        ;;
    *)
        echo "ОШИБКА: current указывает за пределы releases:"
        echo "${CURRENT_RELEASE}"
        exit 1
        ;;
esac

mapfile -t ALL_RELEASES < <(
    find "${RELEASES}" \
        -mindepth 1 \
        -maxdepth 1 \
        -type d \
        -name '20*' \
        -print \
        | sort -r
)

if [ "${#ALL_RELEASES[@]}" -eq 0 ]; then
    echo "Releases отсутствуют."
    exit 0
fi

declare -A KEEP_SET=()

KEEP_COUNT=0

keep_release() {
    local release="$1"

    if [ -n "${KEEP_SET["${release}"]+x}" ]; then
        return
    fi

    KEEP_SET["${release}"]=1
    KEEP_COUNT=$((KEEP_COUNT + 1))
}

keep_release "${CURRENT_RELEASE}"

for RELEASE in "${ALL_RELEASES[@]}"; do
    if [ "${KEEP_COUNT}" -ge "${KEEP_RELEASES}" ]; then
        break
    fi

    keep_release "${RELEASE}"
done

echo "=========================================="
echo "Release retention"
echo "=========================================="
echo "Current:"
echo "  $(basename "${CURRENT_RELEASE}")"
echo "Keep releases:"
echo "  ${KEEP_RELEASES}"
echo

echo "Сохраняются:"

for RELEASE in "${ALL_RELEASES[@]}"; do
    if [ -n "${KEEP_SET["${RELEASE}"]+x}" ]; then
        echo "  $(basename "${RELEASE}")"
    fi
done

RELEASES_REMOVED=0
RUNTIME_LINKS_REMOVED=0
RUNTIME_DIRS_REMOVED=0

remove_release() {
    local release="$1"

    if [ "${DRY_RUN}" -eq 1 ]; then
        echo "DRY-RUN remove release: $(basename "${release}")"
    else
        echo "Удаляем release: $(basename "${release}")"
        rm -rf -- "${release}"
    fi

    RELEASES_REMOVED=$((RELEASES_REMOVED + 1))
}

remove_runtime_link() {
    local runtime="$1"

    if [ "${DRY_RUN}" -eq 1 ]; then
        echo "DRY-RUN remove runtime link: $(basename "${runtime}")"
    else
        echo "Удаляем runtime link: $(basename "${runtime}")"
        rm -f -- "${runtime}"
    fi

    RUNTIME_LINKS_REMOVED=$((RUNTIME_LINKS_REMOVED + 1))
}

remove_runtime_directory() {
    local runtime="$1"

    if [ "${DRY_RUN}" -eq 1 ]; then
        echo "DRY-RUN remove runtime directory: $(basename "${runtime}")"
    else
        echo "Удаляем runtime directory: $(basename "${runtime}")"
        rm -rf -- "${runtime}"
    fi

    RUNTIME_DIRS_REMOVED=$((RUNTIME_DIRS_REMOVED + 1))
}

echo
echo "Очистка releases:"

for RELEASE in "${ALL_RELEASES[@]}"; do
    if [ -z "${KEEP_SET["${RELEASE}"]+x}" ]; then
        remove_release "${RELEASE}"
    fi
done

shopt -s nullglob

echo
echo "Очистка runtime symlink:"

for RUNTIME_ITEM in "${RUNTIMES}"/*; do
    [ -L "${RUNTIME_ITEM}" ] || continue

    NAME="$(
        basename "${RUNTIME_ITEM}"
    )"

    RELEASE="${RELEASES}/${NAME}"

    if [ -z "${KEEP_SET["${RELEASE}"]+x}" ]; then
        remove_runtime_link "${RUNTIME_ITEM}"
    fi
done

runtime_directory_is_referenced() {
    local directory="$1"
    local directory_real

    directory_real="$(
        readlink -f "${directory}" 2>/dev/null || true
    )"

    [ -n "${directory_real}" ] || return 1

    for runtime_link in "${RUNTIMES}"/*; do
        [ -L "${runtime_link}" ] || continue

        local link_name
        local matching_release
        local target

        link_name="$(
            basename "${runtime_link}"
        )"

        matching_release="${RELEASES}/${link_name}"

        if [ -z "${KEEP_SET["${matching_release}"]+x}" ]; then
            continue
        fi

        target="$(
            readlink -f "${runtime_link}" 2>/dev/null || true
        )"

        if [ "${target}" = "${directory_real}" ]; then
            return 0
        fi
    done

    return 1
}

echo
echo "Очистка runtime directories:"

for RUNTIME_ITEM in "${RUNTIMES}"/*; do
    [ -d "${RUNTIME_ITEM}" ] || continue
    [ -L "${RUNTIME_ITEM}" ] && continue

    NAME="$(
        basename "${RUNTIME_ITEM}"
    )"

    MATCHING_RELEASE="${RELEASES}/${NAME}"

    if [ -n "${KEEP_SET["${MATCHING_RELEASE}"]+x}" ]; then
        continue
    fi

    if runtime_directory_is_referenced "${RUNTIME_ITEM}"; then
        continue
    fi

    remove_runtime_directory "${RUNTIME_ITEM}"
done

echo
echo "=========================================="

if [ "${DRY_RUN}" -eq 1 ]; then
    echo "DRY-RUN завершён"
else
    echo "Retention cleanup завершён"
fi

echo "Releases removed: ${RELEASES_REMOVED}"
echo "Runtime links removed: ${RUNTIME_LINKS_REMOVED}"
echo "Runtime directories removed: ${RUNTIME_DIRS_REMOVED}"
echo "=========================================="
