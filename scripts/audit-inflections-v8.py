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


def direct_ovo_ino(name):
    lower = name.lower()

    endings = (
        "ово",
        "ёво",
        "ево",
        "ино",
        "ыно",
    )

    if not lower.endswith(endings):
        return None

    # Кемерово -> Кемерова / Кемерове
    # Одинцово -> Одинцова / Одинцове
    # Пушкино  -> Пушкина  / Пушкине
    return (
        name[:-1] + "а",
        name[:-1] + "е",
    )


def get_morph_candidates(name):
    candidates = []

    for parse in morph.parse(name):
        pos = parse.tag.POS
        gram = set(
            parse.tag.grammemes
        )

        if pos not in {
            "NOUN",
            "ADJF",
        }:
            continue

        # Множественные топонимы пока отдельно.
        if "plur" in gram:
            continue

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
            continue

        genitive = restore_case(
            name,
            gent.word,
        )

        prepositional = restore_case(
            name,
            loct.word,
        )

        candidates.append({
            "genitive":
                genitive,

            "prepositional":
                prepositional,

            "parse":
                str(parse.tag),

            "score":
                float(parse.score),

            "geox":
                "Geox" in gram,
        })

    return candidates


def analyse(item):
    name = str(
        item.get("name") or ""
    ).strip()

    base = {
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
            "",

        "parse":
            "",
    }

    # --------------------------------------
    # Сложные структуры пока отдельно
    # --------------------------------------

    if item.get("type") == "region":
        base["reason"] = "region"
        base["confidence"] = "review"
        return base

    if re.search(
        r"\d",
        name,
    ):
        base["reason"] = "contains_digit"
        base["confidence"] = "review"
        return base

    if (
        "(" in name
        or ")" in name
    ):
        base["reason"] = "parentheses"
        base["confidence"] = "review"
        return base

    if (
        "—" in name
        or "–" in name
    ):
        base["reason"] = "dash_phrase"
        base["confidence"] = "review"
        return base

    if "-" in name:
        base["reason"] = "hyphenated"
        base["confidence"] = "review"
        return base

    if " " in name:
        base["reason"] = "multiword"
        base["confidence"] = "review"
        return base

    if not re.fullmatch(
        r"[А-Яа-яЁё]+",
        name,
    ):
        base["reason"] = "special_chars"
        base["confidence"] = "review"
        return base

    # --------------------------------------
    # Сначала проверяем явно множественное
    # число
    # --------------------------------------

    parses = morph.parse(name)

    plural_parses = [
        parse
        for parse in parses
        if (
            parse.tag.POS
            in {
                "NOUN",
                "ADJF",
            }
            and
            "plur"
            in set(
                parse.tag.grammemes
            )
        )
    ]

    singular_parses = [
        parse
        for parse in parses
        if (
            parse.tag.POS
            in {
                "NOUN",
                "ADJF",
            }
            and
            "sing"
            in set(
                parse.tag.grammemes
            )
        )
    ]

    if (
        plural_parses
        and
        not singular_parses
    ):
        base["reason"] = "plural"
        base["confidence"] = "review"
        base["parse"] = str(
            plural_parses[0].tag
        )
        return base

    # --------------------------------------
    # -ово / -ево / -ино / -ыно
    # --------------------------------------

    direct = direct_ovo_ino(
        name
    )

    if direct:
        base[
            "genitiveCandidate"
        ] = direct[0]

        base[
            "prepositionalCandidate"
        ] = direct[1]

        base["reason"] = (
            "ovo_ino_rule"
        )

        base["confidence"] = "high"

        return base

    # --------------------------------------
    # Морфология
    # --------------------------------------

    candidates = (
        get_morph_candidates(
            name
        )
    )

    if not candidates:
        base["reason"] = (
            "no_inflection_parse"
        )
        base["confidence"] = "review"
        return base

    # Если есть географический разбор,
    # используем только его.
    geox = [
        candidate
        for candidate in candidates
        if candidate["geox"]
    ]

    pool = (
        geox
        if geox
        else candidates
    )

    pairs = {}

    for candidate in pool:
        key = (
            candidate["genitive"],
            candidate["prepositional"],
        )

        pairs.setdefault(
            key,
            [],
        ).append(candidate)

    # Все подходящие разборы дали
    # одинаковое склонение.
    if len(pairs) == 1:
        (
            genitive,
            prepositional,
        ) = next(
            iter(pairs)
        )

        if (
            genitive.casefold()
            ==
            name.casefold()
            and
            prepositional.casefold()
            ==
            name.casefold()
        ):
            base["reason"] = "unchanged"
            base["confidence"] = "review"
            base["parse"] = (
                pool[0]["parse"]
            )
            return base

        base[
            "genitiveCandidate"
        ] = genitive

        base[
            "prepositionalCandidate"
        ] = prepositional

        base["reason"] = (
            "geox"
            if geox
            else
            "morph_agreement"
        )

        base["confidence"] = "high"

        base["parse"] = (
            pool[0]["parse"]
        )

        return base

    # --------------------------------------
    # Несколько разных морфологических
    # вариантов — автоматически не берём
    # --------------------------------------

    best = max(
        pool,
        key=lambda x: x["score"],
    )

    base[
        "genitiveCandidate"
    ] = best["genitive"]

    base[
        "prepositionalCandidate"
    ] = best["prepositional"]

    base["reason"] = (
        "ambiguous_morph"
    )

    base["confidence"] = "review"

    base["parse"] = best["parse"]

    return base


with SOURCE.open(
    encoding="utf-8",
) as file:
    data = json.load(file)


rows = []


for item in data:
    if not item.get(
        "needsInflection"
    ):
        continue

    rows.append(
        analyse(item)
    )


high = [
    row
    for row in rows
    if row["confidence"] == "high"
]


review = [
    row
    for row in rows
    if row["confidence"] == "review"
]


fields = [
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


for filename, items in [
    (
        "qa-inflection-high-v8.csv",
        high,
    ),
    (
        "qa-inflection-review-v8.csv",
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
            fieldnames=fields,
            delimiter=";",
        )

        writer.writeheader()
        writer.writerows(items)


high_reasons = Counter(
    row["reason"]
    for row in high
)


review_reasons = Counter(
    row["reason"]
    for row in review
)


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
            high_reasons.most_common()
        ),

    "reviewReasons":
        dict(
            review_reasons.most_common()
        ),
}


stats_path = (
    OUTPUT /
    "stats-inflection-v8.json"
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
print("INFLECTION AUDIT V8")
print("========================================")

for key, value in stats.items():
    print(
        f"{key}: {value}"
    )

print()
print(
    OUTPUT /
    "qa-inflection-high-v8.csv"
)

print(
    OUTPUT /
    "qa-inflection-review-v8.csv"
)

print(stats_path)
