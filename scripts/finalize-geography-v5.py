#!/usr/bin/env python3

import csv
import json
import re

from collections import Counter, defaultdict
from pathlib import Path

from dbfread import DBF


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

SOURCE = (
    PROJECT /
    "data/geography-generated/locations-draft-10000-v4.json"
)

KLADR = (
    PROJECT /
    "data/geography-source/kladr/extracted/KLADR.DBF"
)

OUTPUT = (
    PROJECT /
    "data/geography-generated"
)

TARGET = 10_000


TRANSLIT = {
    "а": "a", "б": "b", "в": "v", "г": "g",
    "д": "d", "е": "e", "ё": "e", "ж": "zh",
    "з": "z", "и": "i", "й": "y", "к": "k",
    "л": "l", "м": "m", "н": "n", "о": "o",
    "п": "p", "р": "r", "с": "s", "т": "t",
    "у": "u", "ф": "f", "х": "h", "ц": "ts",
    "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "",
    "ы": "y", "ь": "", "э": "e", "ю": "yu",
    "я": "ya",
}


# Чем меньше значение — тем раньше можно удалить
# при необходимости освободить место для города.
TYPE_VALUE = {
    "д": 10,
    "д.": 10,

    "х": 12,
    "х.": 12,

    "з-ка": 14,
    "заимка": 14,

    "в-ки": 14,
    "высел": 14,

    "м": 15,
    "м-ко": 15,

    "п-к": 16,
    "починок": 16,

    "арбан": 17,

    "у": 18,
    "у.": 18,

    "сл": 20,
    "сл.": 20,

    "нп": 22,
    "нп.": 22,

    "аал": 24,
    "аул": 24,

    "с": 30,
    "с.": 30,

    "п": 35,
    "п.": 35,

    "сп": 37,
    "сп.": 37,

    "ст-ца": 40,

    "дп": 45,
    "дп.": 45,

    "кп": 46,
    "кп.": 46,

    "гп": 48,
    "гп.": 48,

    "рп": 50,
    "рп.": 50,

    "пгт": 55,
}


def norm(value):
    return (
        str(value or "")
        .strip()
        .replace("Ё", "Е")
        .replace("ё", "е")
        .casefold()
    )


def slugify(value):
    parts = []

    for char in str(value or "").lower():

        if char in TRANSLIT:
            parts.append(
                TRANSLIT[char]
            )

        elif (
            char.isascii()
            and char.isalnum()
        ):
            parts.append(char)

        else:
            parts.append("-")

    return re.sub(
        r"-+",
        "-",
        "".join(parts),
    ).strip("-")[:63]


def unique_slug(
    name,
    subject,
    code,
    used,
):
    base = (
        slugify(name)
        or f"geo-{code[:11]}"
    )

    if base not in used:
        used.add(base)
        return base

    subject_slug = slugify(
        subject
    )

    candidate = (
        f"{base[:38]}-"
        f"{subject_slug[:23]}"
    )[:63].rstrip("-")

    if candidate not in used:
        used.add(candidate)
        return candidate

    candidate = (
        f"{base[:49]}-"
        f"{code[:11]}"
    )[:63]

    if candidate not in used:
        used.add(candidate)
        return candidate

    number = 2

    while True:
        suffix = f"-{number}"

        candidate = (
            base[
                :63 - len(suffix)
            ]
            +
            suffix
        )

        if candidate not in used:
            used.add(candidate)
            return candidate

        number += 1


with SOURCE.open(
    encoding="utf-8",
) as file:
    data = json.load(file)


print("========================================")
print("FINALIZE GEOGRAPHY V5")
print("========================================")


default = next(
    item
    for item in data
    if item.get("isDefault")
)


regional = [
    item
    for item in data
    if not item.get("isDefault")
]


# ============================================================
# 1. Убираем реальные дубли name + subject
# ============================================================

print()
print("[1/6] Убираем дубли...")


groups = defaultdict(list)


for item in regional:
    key = (
        norm(item.get("name")),
        norm(item.get("subject")),
    )

    groups[key].append(item)


remove_ids = set()
merged_duplicates = []


METADATA_FIELDS = [
    "settlementType",
    "source",
    "kladrCode",
    "subjectCode",
    "population",
    "populationKnown",
    "geoMatched",
    "geoMatchMethod",
    "geonameId",
    "latitude",
    "longitude",
]


for key, items in groups.items():

    if len(items) <= 1:
        continue

    # Предпочитаем уже работающую активную страницу,
    # заполненные склонения и короткий slug.
    canonical = max(
        items,
        key=lambda item: (
            1
            if item.get("active")
            else 0,

            1
            if (
                item.get("genitive")
                and
                item.get("prepositional")
            )
            else 0,

            1
            if item.get("slug")
            in {
                "moscow",
                "spb",
                "kazan",
            }
            else 0,

            -len(
                item.get("slug", "")
            ),
        ),
    )

    removed = []

    for other in items:

        if other is canonical:
            continue

        for field in METADATA_FIELDS:

            current_value = (
                canonical.get(field)
            )

            other_value = (
                other.get(field)
            )

            if (
                current_value
                in {
                    None,
                    "",
                }
                and
                other_value
                not in {
                    None,
                    "",
                }
            ):
                canonical[field] = (
                    other_value
                )

        remove_ids.add(
            id(other)
        )

        removed.append(
            other.get("slug")
        )

    merged_duplicates.append({
        "name":
            canonical.get("name"),

        "subject":
            canonical.get("subject"),

        "keptSlug":
            canonical.get("slug"),

        "removedSlugs":
            ",".join(removed),
    })


regional = [
    item
    for item in regional
    if id(item)
    not in remove_ids
]


print(
    "Групп дублей объединено:",
    len(merged_duplicates),
)


for item in merged_duplicates:
    print(
        " ",
        item["name"],
        "| keep:",
        item["keptSlug"],
        "| remove:",
        item["removedSlugs"],
    )


# ============================================================
# 2. Карта субъектов
# ============================================================

subject_names = {}


for item in regional:

    code = str(
        item.get(
            "subjectCode"
        )
        or ""
    )

    subject = item.get(
        "subject"
    )

    if code and subject:
        subject_names.setdefault(
            code,
            subject,
        )


# Москва/СПб могут не иметь subjectCode
# в старых вручную созданных записях.
subject_names["77"] = "Москва"
subject_names["78"] = "Санкт-Петербург"


# ============================================================
# 3. Читаем все официальные города KLADR
# ============================================================

print()
print(
    "[2/6] Проверяем официальные города КЛАДР..."
)


official_cities = {}


for row in DBF(
    KLADR,
    encoding="cp866",
    load=False,
):
    code = str(
        row["CODE"]
    ).strip()

    socr = str(
        row["SOCR"]
    ).strip()

    if (
        len(code) != 13
        or
        not code.endswith("00")
        or
        socr not in {
            "г",
            "г.",
        }
    ):
        continue

    subject_code = (
        code[:2]
    )

    # Байконур не входит в текущий V4 scope.
    if subject_code == "99":
        continue

    subject = subject_names.get(
        subject_code
    )

    if not subject:
        continue

    name = str(
        row["NAME"]
    ).strip()

    identity = (
        norm(name),
        norm(subject),
    )

    official_cities[
        identity
    ] = {
        "name":
            name,

        "subject":
            subject,

        "subjectCode":
            subject_code,

        "kladrCode":
            code,

        "settlementType":
            socr,
    }


print(
    "Официальных city identities:",
    len(official_cities),
)


# ============================================================
# 4. Обогащаем уже существующие города
#    и распознаём город-субъект Севастополь
# ============================================================

print()
print(
    "[3/6] Обогащаем существующие города..."
)


for item in regional:

    identity = (
        norm(item.get("name")),
        norm(item.get("subject")),
    )

    official = (
        official_cities.get(
            identity
        )
    )

    if not official:
        continue

    if not item.get(
        "kladrCode"
    ):
        item["kladrCode"] = (
            official[
                "kladrCode"
            ]
        )

    if not item.get(
        "subjectCode"
    ):
        item["subjectCode"] = (
            official[
                "subjectCode"
            ]
        )

    if not item.get(
        "settlementType"
    ):
        item[
            "settlementType"
        ] = "г"

    # Федеральный город может одновременно
    # быть субъектом и городом.
    if (
        item.get("type")
        == "region"
        and
        norm(item.get("name"))
        ==
        norm(item.get("subject"))
    ):
        item["type"] = "city"


# ============================================================
# 5. Находим города, которых действительно нет
# ============================================================

covered = {
    (
        norm(item.get("name")),
        norm(item.get("subject")),
    )
    for item in regional
}


missing = [
    city
    for identity, city
    in official_cities.items()
    if identity not in covered
]


missing.sort(
    key=lambda item: (
        item["subjectCode"],
        item["name"],
    )
)


print(
    "Истинно отсутствующих городов:",
    len(missing),
)


for city in missing:
    print(
        " +",
        city["name"],
        "|",
        city["subject"],
        "|",
        city["kladrCode"],
    )


used_slugs = {
    item.get("slug")
    for item in regional
    if item.get("slug")
}


added_cities = []


for city in missing:

    new_item = {
        "slug":
            unique_slug(
                city["name"],
                city["subject"],
                city["kladrCode"],
                used_slugs,
            ),

        "name":
            city["name"],

        "genitive":
            None,

        "prepositional":
            None,

        "region":
            city["subject"],

        "subject":
            city["subject"],

        "type":
            "city",

        "settlementType":
            "г",

        "address":
            "",

        "active":
            False,

        "isDefault":
            False,

        "priority":
            90,

        "source":
            "kladr",

        "kladrCode":
            city["kladrCode"],

        "subjectCode":
            city["subjectCode"],

        "population":
            0,

        "populationKnown":
            False,

        "geoMatched":
            False,

        "geoMatchMethod":
            None,

        "geonameId":
            None,

        "latitude":
            None,

        "longitude":
            None,

        "needsInflection":
            True,
    }

    regional.append(
        new_item
    )

    added_cities.append(
        new_item
    )


# ============================================================
# 6. Возвращаем размер ровно к 10 000
# ============================================================

print()
print(
    "[4/6] Убираем самые слабые locality..."
)


excess = (
    len(regional)
    -
    TARGET
)


if excess < 0:
    raise RuntimeError(
        f"После добавления городов "
        f"не хватает {-excess} записей"
    )


subject_counts = Counter(
    item.get("subject")
    for item in regional
    if item.get("type")
    in {
        "city",
        "locality",
    }
)


removable = [
    item
    for item in regional
    if (
        item.get("type")
        == "locality"
        and
        not item.get("active")
    )
]


def removal_score(item):

    population = int(
        item.get("population")
        or 0
    )

    return (
        # Сначала неизвестное население
        1
        if item.get(
            "populationKnown"
        )
        else 0,

        # Затем без GeoNames
        1
        if item.get(
            "geoMatched"
        )
        else 0,

        # Сначала деревни/хутора,
        # потом более значимые типы
        TYPE_VALUE.get(
            item.get(
                "settlementType"
            ),
            25,
        ),

        population,

        # При равенстве снимаем с
        # наиболее насыщенных субъектов
        -subject_counts[
            item.get("subject")
        ],

        int(
            item.get("priority")
            or 0
        ),

        item.get("name", ""),
    )


removable.sort(
    key=removal_score
)


if len(removable) < excess:
    raise RuntimeError(
        "Недостаточно removable locality"
    )


to_remove = (
    removable[:excess]
)


remove_ids = {
    id(item)
    for item in to_remove
}


regional = [
    item
    for item in regional
    if id(item)
    not in remove_ids
]


print(
    "Удалено слабых locality:",
    len(to_remove),
)


for item in to_remove:
    print(
        " -",
        item.get("name"),
        "|",
        item.get("subject"),
        "|",
        item.get(
            "settlementType"
        ),
        "| population:",
        item.get("population"),
        "| geo:",
        item.get("geoMatched"),
    )


# ============================================================
# QA
# ============================================================

print()
print(
    "[5/6] Финальная QA..."
)


if len(regional) != TARGET:
    raise RuntimeError(
        f"Regional = {len(regional)}, "
        f"нужно {TARGET}"
    )


slugs = [
    item.get("slug")
    for item in regional
]


if len(set(slugs)) != TARGET:
    raise RuntimeError(
        "Есть повторяющиеся slug"
    )


identities = defaultdict(list)


for item in regional:

    if item.get("type") not in {
        "city",
        "locality",
    }:
        continue

    identity = (
        norm(item.get("name")),
        norm(item.get("subject")),
    )

    identities[
        identity
    ].append(item)


duplicates = {
    key: items
    for key, items
    in identities.items()
    if len(items) > 1
}


if duplicates:
    print()
    print(
        "ОШИБКА: остались duplicate name+subject"
    )

    for items in (
        duplicates.values()
    ):
        print(
            items[0].get("name"),
            "|",
            items[0].get("subject"),
            "|",
            [
                x.get("slug")
                for x in items
            ],
        )

    raise RuntimeError(
        "Duplicate identities"
    )


covered_final = {
    (
        norm(item.get("name")),
        norm(item.get("subject")),
    )
    for item in regional
}


missing_final = [
    city
    for identity, city
    in official_cities.items()
    if identity not in covered_final
]


if missing_final:
    raise RuntimeError(
        "После V5 всё ещё отсутствуют "
        f"{len(missing_final)} города"
    )


if any(
    item.get(
        "subjectCode"
    ) == "99"
    for item in regional
):
    raise RuntimeError(
        "Code 99 вернулся в V5"
    )


# ============================================================
# SAVE
# ============================================================

print()
print(
    "[6/6] Сохраняем V5..."
)


result = [
    default,
    *regional,
]


output_json = (
    OUTPUT /
    "locations-draft-10000-v5.json"
)


with output_json.open(
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        result,
        file,
        ensure_ascii=False,
        indent=2,
    )

    file.write("\n")


added_csv = (
    OUTPUT /
    "qa-added-cities-v5.csv"
)


with added_csv.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:

    writer = csv.DictWriter(
        file,
        fieldnames=[
            "name",
            "subject",
            "slug",
            "kladrCode",
        ],
        extrasaction="ignore",
        delimiter=";",
    )

    writer.writeheader()

    writer.writerows(
        added_cities
    )


removed_csv = (
    OUTPUT /
    "qa-removed-localities-v5.csv"
)


with removed_csv.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:

    writer = csv.DictWriter(
        file,
        fieldnames=[
            "name",
            "subject",
            "settlementType",
            "population",
            "populationKnown",
            "geoMatched",
            "slug",
            "kladrCode",
        ],
        extrasaction="ignore",
        delimiter=";",
    )

    writer.writeheader()

    writer.writerows(
        to_remove
    )


merged_csv = (
    OUTPUT /
    "qa-merged-duplicates-v5.csv"
)


with merged_csv.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:

    writer = csv.DictWriter(
        file,
        fieldnames=[
            "name",
            "subject",
            "keptSlug",
            "removedSlugs",
        ],
        delimiter=";",
    )

    writer.writeheader()

    writer.writerows(
        merged_duplicates
    )


subject_codes = {
    str(item.get("subjectCode"))
    for item in regional
    if item.get("subjectCode")
}


stats = {
    "totalPages":
        len(result),

    "federalPages":
        1,

    "regionalPages":
        len(regional),

    "subjectCodes":
        len(subject_codes),

    "mergedDuplicateGroups":
        len(merged_duplicates),

    "addedMissingCities":
        len(added_cities),

    "removedWeakLocalities":
        len(to_remove),

    "officialCitiesStillMissing":
        len(missing_final),

    "uniqueSlugs":
        len(set(slugs)),

    "duplicateIdentityGroups":
        len(duplicates),

    "cities":
        sum(
            item.get("type")
            == "city"
            for item in regional
        ),

    "localities":
        sum(
            item.get("type")
            == "locality"
            for item in regional
        ),

    "regions":
        sum(
            item.get("type")
            == "region"
            for item in regional
        ),

    "needsInflection":
        sum(
            bool(
                item.get(
                    "needsInflection"
                )
            )
            for item in regional
        ),
}


stats_json = (
    OUTPUT /
    "stats-10000-v5.json"
)


with stats_json.open(
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        stats,
        file,
        ensure_ascii=False,
        indent=2,
    )

    file.write("\n")


print()
print("========================================")
print("✓ V5 ГОТОВА")
print("========================================")

for key, value in stats.items():
    print(
        f"{key}: {value}"
    )

print()
print(
    "JSON:",
    output_json,
)

print(
    "ADDED:",
    added_csv,
)

print(
    "REMOVED:",
    removed_csv,
)

print(
    "MERGED:",
    merged_csv,
)

print(
    "STATS:",
    stats_json,
)
