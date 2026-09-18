#!/usr/bin/env python3

import csv
import json
import re

from collections import Counter
from pathlib import Path

import pymorphy3


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

SOURCE = (
    PROJECT /
    "data/geography-generated/locations-draft-10000-v6.json"
)

OUTPUT = (
    PROJECT /
    "data/geography-generated"
)

morph = pymorphy3.MorphAnalyzer()


def restore_case(original, value):
    if not value:
        return value

    if original.isupper():
        return value.upper()

    if original[0].isupper():
        return (
            value[0].upper()
            +
            value[1:]
        )

    return value


def ovo_ino(name):
    lower = name.lower()

    if not lower.endswith(
        (
            "ово",
            "ёво",
            "ево",
            "ино",
            "ыно",
        )
    ):
        return None

    return (
        name[:-1] + "а",
        name[:-1] + "е",
    )


def candidate_from_parse(
    name,
    parse,
):
    gent = parse.inflect(
        {"gent"}
    )

    loct = parse.inflect(
        {"loct"}
    )

    if (
        gent is None
        or
        loct is None
    ):
        return None

    return {
        "genitive":
            restore_case(
                name,
                gent.word,
            ),

        "prepositional":
            restore_case(
                name,
                loct.word,
            ),

        "parse":
            str(parse.tag),

        "score":
            float(parse.score),

        "geox":
            (
                "Geox"
                in parse.tag.grammemes
            ),

        "plural":
            (
                "plur"
                in parse.tag.grammemes
            ),
    }


def analyse(item):
    name = str(
        item.get("name") or ""
    ).strip()

    result = {
        "name":
            name,

        "subject":
            item.get("subject", ""),

        "type":
            item.get("type", ""),

        "settlementType":
            item.get(
                "settlementType",
                "",
            ),

        "slug":
            item.get("slug", ""),

        "genitiveCandidate":
            "",

        "prepositionalCandidate":
            "",

        "reason":
            "",

        "confidence":
            "review",

        "parse":
            "",
    }

    # ----------------------------------------
    # Отдельные сложные классы
    # ----------------------------------------

    if item.get("type") == "region":
        result["reason"] = "region"
        return result

    if re.search(
        r"\d",
        name,
    ):
        result["reason"] = (
            "contains_digit"
        )
        return result

    if (
        "(" in name
        or ")" in name
    ):
        result["reason"] = (
            "parentheses"
        )
        return result

    if (
        "—" in name
        or "–" in name
    ):
        result["reason"] = (
            "dash_phrase"
        )
        return result

    if "-" in name:
        result["reason"] = (
            "hyphenated"
        )
        return result

    if " " in name:
        result["reason"] = (
            "multiword"
        )
        return result

    if not re.fullmatch(
        r"[А-Яа-яЁё]+",
        name,
    ):
        result["reason"] = (
            "special_chars"
        )
        return result

    # ----------------------------------------
    # -ово / -ево / -ино / -ыно
    # ----------------------------------------

    direct = ovo_ino(name)

    if direct:
        result[
            "genitiveCandidate"
        ] = direct[0]

        result[
            "prepositionalCandidate"
        ] = direct[1]

        result["reason"] = (
            "ovo_ino_rule"
        )

        result["confidence"] = (
            "high"
        )

        return result

    # ----------------------------------------
    # КРИТИЧНО:
    # рассматриваем только разборы,
    # где исходное слово = именительный падеж
    # ----------------------------------------

    parses = []

    for parse in morph.parse(name):
        gram = set(
            parse.tag.grammemes
        )

        if parse.tag.POS not in {
            "NOUN",
            "ADJF",
        }:
            continue

        if "nomn" not in gram:
            continue

        candidate = (
            candidate_from_parse(
                name,
                parse,
            )
        )

        if candidate:
            parses.append(
                candidate
            )

    if not parses:
        result["reason"] = (
            "no_nominative_parse"
        )
        return result

    # ----------------------------------------
    # Если есть Geox — предпочитаем его
    # ----------------------------------------

    geox = [
        item
        for item in parses
        if item["geox"]
    ]

    pool = (
        geox
        if geox
        else parses
    )

    # ----------------------------------------
    # Группируем по полученным формам
    # ----------------------------------------

    variants = {}

    for candidate in pool:
        key = (
            candidate["genitive"],
            candidate[
                "prepositional"
            ],
        )

        variants.setdefault(
            key,
            [],
        ).append(candidate)

    if len(variants) != 1:
        best = max(
            pool,
            key=lambda x: x["score"],
        )

        result[
            "genitiveCandidate"
        ] = best["genitive"]

        result[
            "prepositionalCandidate"
        ] = best[
            "prepositional"
        ]

        result["parse"] = (
            best["parse"]
        )

        result["reason"] = (
            "ambiguous_nominative"
        )

        return result

    (
        genitive,
        prepositional,
    ) = next(
        iter(variants)
    )

    best = max(
        pool,
        key=lambda x: x["score"],
    )

    result[
        "genitiveCandidate"
    ] = genitive

    result[
        "prepositionalCandidate"
    ] = prepositional

    result["parse"] = (
        best["parse"]
    )

    # ----------------------------------------
    # Неизменяемые
    # ----------------------------------------

    if (
        genitive.casefold()
        ==
        name.casefold()
        and
        prepositional.casefold()
        ==
        name.casefold()
    ):
        result["reason"] = (
            "unchanged"
        )

        return result

    # ----------------------------------------
    # Множественное число:
    # теперь оно допустимо, если nominative
    # разборы согласны между собой.
    # ----------------------------------------

    plural = any(
        candidate["plural"]
        for candidate in pool
    )

    if plural:
        result["reason"] = (
            "plural_nominative"
        )

        result["confidence"] = (
            "high"
        )

        return result

    # ----------------------------------------
    # Обычный nominative
    # ----------------------------------------

    result["reason"] = (
        "geox_nominative"
        if geox
        else
        "nominative_agreement"
    )

    result["confidence"] = "high"

    return result


with SOURCE.open(
    encoding="utf-8",
) as file:
    data = json.load(file)


rows = [
    analyse(item)
    for item in data
    if item.get(
        "needsInflection"
    )
]


high = [
    row
    for row in rows
    if row["confidence"] == "high"
]


review = [
    row
    for row in rows
    if row["confidence"] != "high"
]


FIELDS = [
    "name",
    "subject",
    "type",
    "settlementType",
    "slug",
    "genitiveCandidate",
    "prepositionalCandidate",
    "reason",
    "confidence",
    "parse",
]


for filename, subset in [
    (
        "qa-inflection-high-v9.csv",
        high,
    ),
    (
        "qa-inflection-review-v9.csv",
        review,
    ),
]:
    path = OUTPUT / filename

    with path.open(
        "w",
        encoding="utf-8-sig",
        newline="",
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=FIELDS,
            delimiter=";",
        )

        writer.writeheader()
        writer.writerows(subset)


stats = {
    "needsInflection":
        len(rows),

    "highConfidence":
        len(high),

    "needsReview":
        len(review),

    "highConfidencePercent":
        round(
            len(high)
            /
            len(rows)
            *
            100,
            2,
        ),

    "highReasons":
        dict(
            Counter(
                row["reason"]
                for row in high
            ).most_common()
        ),

    "reviewReasons":
        dict(
            Counter(
                row["reason"]
                for row in review
            ).most_common()
        ),
}


stats_path = (
    OUTPUT /
    "stats-inflection-v9.json"
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


print("========================================")
print("INFLECTION AUDIT V9")
print("========================================")

for key, value in stats.items():
    print(
        f"{key}: {value}"
    )

print()
print(
    OUTPUT /
    "qa-inflection-high-v9.csv"
)

print(
    OUTPUT /
    "qa-inflection-review-v9.csv"
)

print(stats_path)
