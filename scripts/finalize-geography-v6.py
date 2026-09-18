#!/usr/bin/env python3

import json
from pathlib import Path


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

SOURCE = (
    PROJECT /
    "data/geography-generated/locations-draft-10000-v5.json"
)

OUTPUT = (
    PROJECT /
    "data/geography-generated"
)


FIXES = {
    (
        "Одинцово",
        "Московская область",
    ): {
        "kladrCode":
            "5004200000000",
        "subjectCode":
            "50",
    },

    (
        "Истра",
        "Московская область",
    ): {
        "kladrCode":
            "5004600000000",
        "subjectCode":
            "50",
    },

    (
        "Клин",
        "Московская область",
    ): {
        "kladrCode":
            "5004700000000",
        "subjectCode":
            "50",
    },

    (
        "Пушкино",
        "Московская область",
    ): {
        "kladrCode":
            "5005000000000",
        "subjectCode":
            "50",
    },
}


with SOURCE.open(
    encoding="utf-8",
) as file:
    data = json.load(file)


print("========================================")
print("FINALIZE GEOGRAPHY V6")
print("========================================")


fixed = []


for item in data:

    key = (
        item.get("name"),
        item.get("subject"),
    )

    config = FIXES.get(key)

    if not config:
        continue

    before = {
        "type":
            item.get("type"),

        "settlementType":
            item.get(
                "settlementType"
            ),

        "kladrCode":
            item.get("kladrCode"),

        "slug":
            item.get("slug"),

        "population":
            item.get("population"),

        "geoMatched":
            item.get("geoMatched"),
    }

    item["type"] = "city"
    item["settlementType"] = "г"

    item["kladrCode"] = (
        config["kladrCode"]
    )

    item["subjectCode"] = (
        config["subjectCode"]
    )

    # Источник теперь точно KLADR + GeoNames,
    # если GeoNames уже был сопоставлен.
    item["source"] = (
        "kladr+geonames"
        if item.get("geoMatched")
        else "kladr"
    )

    after = {
        "type":
            item.get("type"),

        "settlementType":
            item.get(
                "settlementType"
            ),

        "kladrCode":
            item.get("kladrCode"),

        "slug":
            item.get("slug"),

        "population":
            item.get("population"),

        "geoMatched":
            item.get("geoMatched"),
    }

    fixed.append({
        "name":
            item["name"],

        "subject":
            item["subject"],

        "before":
            before,

        "after":
            after,
    })


if len(fixed) != 4:
    raise RuntimeError(
        f"Исправлено {len(fixed)} "
        "записей вместо 4"
    )


regional = [
    item
    for item in data
    if not item.get("isDefault")
]


slugs = [
    item["slug"]
    for item in regional
]


if len(data) != 10001:
    raise RuntimeError(
        f"Всего записей: {len(data)}"
    )


if len(regional) != 10000:
    raise RuntimeError(
        f"Regional: {len(regional)}"
    )


if len(set(slugs)) != 10000:
    raise RuntimeError(
        "Обнаружены duplicate slug"
    )


cities = [
    item
    for item in regional
    if item.get("type") == "city"
]


localities = [
    item
    for item in regional
    if item.get("type") == "locality"
]


regions = [
    item
    for item in regional
    if item.get("type") == "region"
]


if len(cities) != 1263:
    raise RuntimeError(
        f"Городов {len(cities)}, "
        "ожидалось 1263"
    )


output_json = (
    OUTPUT /
    "locations-draft-10000-v6.json"
)


with output_json.open(
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        data,
        file,
        ensure_ascii=False,
        indent=2,
    )

    file.write("\n")


stats = {
    "totalPages":
        len(data),

    "regionalPages":
        len(regional),

    "fixedCityTypes":
        len(fixed),

    "cities":
        len(cities),

    "localities":
        len(localities),

    "regions":
        len(regions),

    "uniqueSlugs":
        len(set(slugs)),

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


stats_path = (
    OUTPUT /
    "stats-10000-v6.json"
)


with stats_path.open(
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


qa_path = (
    OUTPUT /
    "qa-fixed-cities-v6.json"
)


with qa_path.open(
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        fixed,
        file,
        ensure_ascii=False,
        indent=2,
    )

    file.write("\n")


print()
print("Исправлено:")

for item in fixed:

    print()
    print(
        item["name"],
        "|",
        item["subject"],
    )

    print(
        "  было:",
        item["before"],
    )

    print(
        "  стало:",
        item["after"],
    )


print()
print("========================================")
print("✓ V6 ГОТОВА")
print("========================================")

for key, value in stats.items():
    print(
        f"{key}: {value}"
    )

print()
print(output_json)
print(stats_path)
print(qa_path)
