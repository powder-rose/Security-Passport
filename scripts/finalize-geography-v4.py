#!/usr/bin/env python3

import csv
import json
import re

from collections import Counter
from pathlib import Path
from dbfread import DBF


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

SOURCE = (
    PROJECT /
    "data/geography-generated/locations-draft-10000-v3.json"
)

KLADR = (
    PROJECT /
    "data/geography-source/kladr/extracted/KLADR.DBF"
)

OUTPUT = (
    PROJECT /
    "data/geography-generated"
)


SUBJECT_FIXES = {
    "21":
        "Чувашская Республика — Чувашия",

    "42":
        "Кемеровская область — Кузбасс",

    "86":
        "Ханты-Мансийский автономный округ — Югра",

    "93":
        "Донецкая Народная Республика",

    "94":
        "Луганская Народная Республика",
}


TYPE_PRIORITY = {
    "г": 100,
    "г.": 100,
    "пгт": 96,
    "рп": 95,
    "рп.": 95,
    "гп": 93,
    "гп.": 93,
    "дп": 90,
    "дп.": 90,
    "кп": 90,
    "кп.": 90,
    "с": 88,
    "с.": 88,
    "ст-ца": 87,
    "аул": 86,
    "аал": 86,
    "п": 84,
    "п.": 84,
    "сп": 82,
    "сп.": 82,
    "сл": 80,
    "сл.": 80,
    "нп": 78,
    "нп.": 78,
    "д": 76,
    "д.": 76,
    "х": 74,
    "х.": 74,
    "у": 72,
    "у.": 72,
    "арбан": 72,
    "м": 68,
    "м-ко": 68,
    "п-к": 66,
    "починок": 66,
    "з-ка": 62,
    "заимка": 62,
    "в-ки": 60,
    "высел": 60,
    "киш.": 60,
}


SUSPICIOUS = [
    r"\bурочище\b",
    r"\bкилометр\b",
    r"\bразъезд\b",
    r"\bкордон\b",
    r"\bлесничество\b",
    r"\bостановочн\w*\s+пункт\b",
    r"\bжелезнодорож",
    r"\bж/д\b",
    r"\bплатформ",
    r"\bказарм",
    r"\bавтодорог",
    r"\bпромзон",
    r"\bмикрорайон\b",
    r"\bснт\b",
]


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


def norm(value):
    value = str(value or "").strip()

    value = (
        value
        .replace("Ё", "Е")
        .replace("ё", "е")
        .replace("—", "-")
        .replace("–", "-")
    )

    value = re.sub(
        r"[^0-9A-Za-zА-Яа-я -]+",
        " ",
        value,
    )

    value = re.sub(
        r"[-\s]+",
        " ",
        value,
    )

    return value.casefold().strip()


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


def make_slug(
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

    i = 2

    while True:
        suffix = f"-{i}"

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

        i += 1


def is_suspicious(name):
    return any(
        re.search(
            pattern,
            name,
            flags=re.I,
        )
        for pattern in SUSPICIOUS
    )


with SOURCE.open(
    encoding="utf-8"
) as file:
    data = json.load(file)


print("========================================")
print("FINALIZE GEOGRAPHY V4")
print("========================================")


# ------------------------------------------------------------
# 1. Удаляем code 99
# ------------------------------------------------------------

removed_99 = [
    item
    for item in data
    if item.get(
        "subjectCode"
    ) == "99"
]

data = [
    item
    for item in data
    if item.get(
        "subjectCode"
    ) != "99"
]


print(
    "Удалено code 99:",
    len(removed_99),
)

for item in removed_99:
    print(
        "  -",
        item.get("name"),
        item.get("type"),
    )


# ------------------------------------------------------------
# 2. Нормализуем субъект
# ------------------------------------------------------------

for item in data:
    code = item.get(
        "subjectCode"
    )

    fixed = (
        SUBJECT_FIXES.get(code)
    )

    if not fixed:
        continue

    item["subject"] = fixed
    item["region"] = fixed

    if item.get("type") == "region":
        item["name"] = fixed


# ------------------------------------------------------------
# 3. Готовим существующие identity
# ------------------------------------------------------------

used_slugs = {
    item.get("slug")
    for item in data
    if item.get("slug")
}


selected_codes = {
    item.get("kladrCode")
    for item in data
    if item.get("kladrCode")
}


selected_identity = {
    (
        norm(
            item.get("name")
        ),
        str(
            item.get(
                "subjectCode",
                ""
            )
        ),
    )
    for item in data
    if item.get("type")
    in {
        "city",
        "locality",
    }
}


subject_names = {}


for item in data:
    code = str(
        item.get(
            "subjectCode",
            ""
        )
    )

    if (
        code
        and
        code != "99"
        and
        item.get("subject")
    ):
        subject_names.setdefault(
            code,
            item["subject"],
        )


# ------------------------------------------------------------
# 4. Ищем лучший дополнительный KLADR-кандидат
# ------------------------------------------------------------

candidates = []


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
        socr not in TYPE_PRIORITY
    ):
        continue

    subject_code = code[:2]

    if subject_code == "99":
        continue

    subject = (
        subject_names.get(
            subject_code
        )
    )

    if not subject:
        continue

    district = code[2:5]
    city = code[5:8]
    locality = code[8:11]

    # SUBJECT
    if (
        district == "000"
        and
        city == "000"
        and
        locality == "000"
    ):
        continue

    # DISTRICT
    if (
        city == "000"
        and
        locality == "000"
    ):
        continue

    if code in selected_codes:
        continue

    name = str(
        row["NAME"]
    ).strip()

    if not name:
        continue

    identity = (
        norm(name),
        subject_code,
    )

    if identity in selected_identity:
        continue

    if (
        norm(name)
        ==
        norm(subject)
    ):
        continue

    if is_suspicious(name):
        continue

    level_city = (
        locality == "000"
    )

    score = (
        TYPE_PRIORITY[socr],
        1 if level_city else 0,
        1
        if str(
            row["INDEX"]
        ).strip()
        else 0,
        code,
    )

    candidates.append(
        (
            score,
            {
                "name":
                    name,

                "subject":
                    subject,

                "subjectCode":
                    subject_code,

                "socr":
                    socr,

                "code":
                    code,

                "levelCity":
                    level_city,
            },
        )
    )


if not candidates:
    raise RuntimeError(
        "Нет кандидата для замены code 99"
    )


candidates.sort(
    key=lambda x: x[0],
    reverse=True,
)


extra = candidates[0][1]


extra_slug = make_slug(
    extra["name"],
    extra["subject"],
    extra["code"],
    used_slugs,
)


extra_item = {
    "slug":
        extra_slug,

    "name":
        extra["name"],

    "genitive":
        None,

    "prepositional":
        None,

    "region":
        extra["subject"],

    "subject":
        extra["subject"],

    "type":
        (
            "city"
            if extra["socr"]
            in {
                "г",
                "г.",
            }
            else
            "locality"
        ),

    "settlementType":
        extra["socr"],

    "address":
        "",

    "active":
        False,

    "isDefault":
        False,

    "priority":
        55,

    "source":
        "kladr",

    "kladrCode":
        extra["code"],

    "subjectCode":
        extra["subjectCode"],

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


data.append(
    extra_item
)


print(
    "Добавлена замена:",
    extra_item["name"],
    "|",
    extra_item["subject"],
    "|",
    extra_item["settlementType"],
    "|",
    extra_item["slug"],
)


# ------------------------------------------------------------
# 5. Финальная проверка
# ------------------------------------------------------------

federal = [
    item
    for item in data
    if item.get(
        "isDefault"
    )
]

regional = [
    item
    for item in data
    if not item.get(
        "isDefault"
    )
]

slugs = [
    item.get("slug")
    for item in regional
]


if len(data) != 10001:
    raise RuntimeError(
        f"Всего {len(data)}, "
        "ожидалось 10001"
    )


if len(regional) != 10000:
    raise RuntimeError(
        f"Regional {len(regional)}, "
        "ожидалось 10000"
    )


if len(set(slugs)) != 10000:
    raise RuntimeError(
        "Есть повторяющиеся slug"
    )


if any(
    item.get(
        "subjectCode"
    ) == "99"
    for item in data
):
    raise RuntimeError(
        "Code 99 всё ещё присутствует"
    )


# ------------------------------------------------------------
# 6. Сохраняем V4
# ------------------------------------------------------------

output_json = (
    OUTPUT /
    "locations-draft-10000-v4.json"
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


subjects = {}


for item in regional:
    code = item.get(
        "subjectCode"
    )

    if (
        code
        and
        item.get("subject")
    ):
        subjects[
            code
        ] = item["subject"]


subjects_csv = (
    OUTPUT /
    "qa-subjects-v4.csv"
)


with subjects_csv.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:

    writer = csv.writer(
        file,
        delimiter=";",
    )

    writer.writerow([
        "Код",
        "Субъект",
    ])

    for code in sorted(
        subjects
    ):
        writer.writerow([
            code,
            subjects[code],
        ])


type_counter = Counter(
    item.get(
        "settlementType"
    )
    for item in regional
    if item.get(
        "settlementType"
    )
)


stats = {
    "totalPages":
        len(data),

    "federalPages":
        len(federal),

    "regionalPages":
        len(regional),

    "subjectCodes":
        len(subjects),

    "removedCode99":
        len(removed_99),

    "replacementName":
        extra_item["name"],

    "replacementSubject":
        extra_item["subject"],

    "uniqueSlugs":
        len(set(slugs)),

    "duplicateSlugs":
        len(slugs)
        -
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

    "selectedTypes":
        dict(
            type_counter
        ),
}


stats_json = (
    OUTPUT /
    "stats-10000-v4.json"
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
print("✓ V4 ГОТОВА")
print("========================================")

for key, value in stats.items():
    if key == "selectedTypes":
        continue

    print(
        f"{key}: {value}"
    )

print()
print(output_json)
print(subjects_csv)
print(stats_json)
