#!/usr/bin/env bash

create_backend_runtime_snapshot() {
    local workspace="$1"
    local runtime="$2"
    local runtime_real
    local required

    for required in \
        server \
        shared \
        node_modules \
        package.json \
        package-lock.json
    do
        if [ ! -e "${workspace}/${required}" ]; then
            echo "ОШИБКА: backend snapshot source отсутствует:"
            echo "${workspace}/${required}"
            return 1
        fi
    done

    mkdir -p "${runtime}"

    runtime_real="$(
        readlink -f "${runtime}" 2>/dev/null || true
    )"

    if [ -z "${runtime_real}" ] \
        || [ ! -d "${runtime_real}" ]
    then
        echo "ОШИБКА: runtime не удалось подготовить:"
        echo "${runtime}"
        return 1
    fi

    rm -rf \
        "${runtime_real}/app/server" \
        "${runtime_real}/app/shared" \
        "${runtime_real}/node_modules"

    mkdir -p \
        "${runtime_real}/app/server" \
        "${runtime_real}/app/shared" \
        "${runtime_real}/node_modules"

    cp -a \
        "${workspace}/server/." \
        "${runtime_real}/app/server/"

    cp -a \
        "${workspace}/shared/." \
        "${runtime_real}/app/shared/"

    cp \
        "${workspace}/package.json" \
        "${runtime_real}/app/package.json"

    cp \
        "${workspace}/package-lock.json" \
        "${runtime_real}/app/package-lock.json"

    cp -a \
        "${workspace}/node_modules/." \
        "${runtime_real}/node_modules/"

    if git \
        -C "${workspace}" \
        rev-parse HEAD \
        > "${runtime_real}/backend-revision.txt" \
        2>/dev/null
    then
        :
    else
        printf 'unknown\n' \
            > "${runtime_real}/backend-revision.txt"
    fi
}


validate_backend_runtime() {
    local runtime="$1"
    local runtime_real

    runtime_real="$(
        readlink -f "${runtime}" 2>/dev/null || true
    )"

    if [ -z "${runtime_real}" ] \
        || [ ! -d "${runtime_real}" ]
    then
        echo "ОШИБКА: backend runtime отсутствует:"
        echo "${runtime}"
        return 1
    fi

    for file in \
        app/server/index.mjs \
        app/server/shared/project-root.mjs \
        app/package.json \
        app/package-lock.json
    do
        if [ ! -s "${runtime_real}/${file}" ]; then
            echo "ОШИБКА: backend runtime не содержит ${file}"
            return 1
        fi
    done

    if [ ! -d "${runtime_real}/app/shared" ]; then
        echo "ОШИБКА: backend runtime не содержит app/shared."
        return 1
    fi

    if [ -L "${runtime_real}/node_modules" ]; then
        echo "ОШИБКА: backend runtime/node_modules не должен быть symlink."
        return 1
    fi

    if [ ! -d "${runtime_real}/node_modules" ]; then
        echo "ОШИБКА: backend runtime не содержит node_modules."
        return 1
    fi

    return 0
}


_restore_generation_link() {
    local link="$1"
    local target="$2"
    local temporary="${link}.restore.$$"

    rm -f "${temporary}"

    if [ -n "${target}" ]; then
        ln -s \
            "${target}" \
            "${temporary}"

        mv -Tf \
            "${temporary}" \
            "${link}"
    else
        rm -f "${link}"
    fi
}


switch_generation_links() {
    local current="$1"
    local backend_current="$2"
    local release="$3"
    local runtime="$4"

    local release_real
    local runtime_real

    local old_current
    local old_backend

    local current_next="${current}.next.$$"
    local backend_next="${backend_current}.next.$$"

    release_real="$(
        readlink -f "${release}" 2>/dev/null || true
    )"

    runtime_real="$(
        readlink -f "${runtime}" 2>/dev/null || true
    )"

    if [ -z "${release_real}" ] \
        || [ ! -d "${release_real}" ]
    then
        echo "ОШИБКА: frontend release отсутствует:"
        echo "${release}"
        return 1
    fi

    validate_backend_runtime \
        "${runtime}" \
        || return 1

    old_current="$(
        readlink "${current}" 2>/dev/null || true
    )"

    old_backend="$(
        readlink "${backend_current}" 2>/dev/null || true
    )"

    rm -f \
        "${current_next}" \
        "${backend_next}"

    if ! ln -s \
        "${release}" \
        "${current_next}"
    then
        rm -f \
            "${current_next}" \
            "${backend_next}"

        return 1
    fi

    if ! ln -s \
        "${runtime}" \
        "${backend_next}"
    then
        rm -f \
            "${current_next}" \
            "${backend_next}"

        return 1
    fi

    if ! mv -Tf \
        "${backend_next}" \
        "${backend_current}"
    then
        rm -f \
            "${current_next}" \
            "${backend_next}"

        return 1
    fi

    if ! mv -Tf \
        "${current_next}" \
        "${current}"
    then
        _restore_generation_link \
            "${backend_current}" \
            "${old_backend}"

        rm -f \
            "${current_next}" \
            "${backend_next}"

        return 1
    fi

    if [ "$(
        readlink -f "${current}" 2>/dev/null || true
    )" != "${release_real}" ] \
        || [ "$(
            readlink -f "${backend_current}" 2>/dev/null || true
        )" != "${runtime_real}" ]
    then
        echo "ОШИБКА: generation links переключились некорректно."

        _restore_generation_link \
            "${current}" \
            "${old_current}"

        _restore_generation_link \
            "${backend_current}" \
            "${old_backend}"

        return 1
    fi

    return 0
}

wait_backend_health() {
    local url="${1:-http://127.0.0.1:8787/api/health}"
    local attempts="${2:-20}"
    local delay="${3:-1}"
    local attempt

    for attempt in $(seq 1 "${attempts}"); do
        if curl \
            -fsS \
            --max-time 3 \
            "${url}" \
            2>/dev/null \
            | grep -q '"ok":true'
        then
            return 0
        fi

        sleep "${delay}"
    done

    return 1
}
