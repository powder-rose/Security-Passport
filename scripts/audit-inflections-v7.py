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

    if (
        original
        and
        original[0].isupper()
    ):
        return (
            value[0].upper()
            +
            value[1:]
        )

    return value


def choose_parse(word):
    parses = morph.parse(word)

    def score(parse):
        gram = set(
            parse.tag.grammemes
        )

        return (
            1 if "Geox" in gram else 0,
            1
            if parse.tag.POS == "NOUN"
            else 0,
            1 if "Name" in gram else 0,
            parse.score,
        )

    return max(
        parses,
        key=score,
    )


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

        "parse":
            "",
    }

    # ------------------------------------
    # Сложные конструкции сразу в review
    # ------------------------------------

    if item.get("type") == "region":
        result["reason"] = (
            "region"
        )
        return False, result

    if re.search(
        r"\d",
        name,
    ):
        result["reason"] = (
            "contains_digit"
        )
        return False, result

    if (
        "(" in name
        or ")" in name
    ):
        result["reason"] = (
            "parentheses"
        )
        return False, result

    if (
        "—" in name
        or "–" in name
    ):
        result["reason"] = (
            "dash_phrase"
        )
        return False, result

    if "-" in name:
        result["reason"] = (
            "hyphenated"
        )
        return False, result

    if " " in name:
        result["reason"] = (
            "multiword"
        )
        return False, result

    if not re.fullmatch(
        r"[А-Яа-яЁё]+",
        name,
    ):
        result["reason"] = (
            "special_chars"
        )
        return False, result

    # ------------------------------------
    # Однословный топоним
    # ------------------------------------

    parse = choose_parse(name)

    gram = set(
        parse.tag.grammemes
    )

    result["parse"] = str(
        parse.tag
    )

    if "Geox" not in gram:
        result["reason"] = (
            "no_geox"
        )
        return False, result

    if parse.tag.POS != "NOUN":
        result["reason"] = (
            "not_noun"
        )
        return False, result

    # Множественные топонимы:
    # Мытищи, Химки, Шахты и т.д.
    # Проверяем отдельно.
    if "plur" in gram:
        result["reason"] = (
            "plural"
        )
        return False, result

    lower = name.lower()

    # Названия на -ово/-ево/-ино/-ыно
    # имеют отдельную норму употребления.
    if lower.endswith(
        (
            "ово",
            "ёво",
            "ево",
            "ино",
            "ыно",
        )
    ):
        result["reason"] = (
            "ovo_ino"
        )
        return False, result

    gent = parse.inflect(
        {"gent"}
    )

    loct = parse.inflect(
        {"loct"}
    )

    if (
        gent is None
        or loct is None
    ):
        result["reason"] = (
            "cannot_inflect"
        )
        return False, result

    genitive = restore_case(
        name,
        gent.word,
    )

    prepositional = restore_case(
        name,
        loct.word,
    )

    result[
        "genitiveCandidate"
    ] = genitive

    result[
        "prepositionalCandidate"
    ] = prepositional

    # Неизменяемые формы вроде Сочи
    # не принимаем автоматически.
    if (
        genitive.casefold()
        == name.casefold()
        and
        prepositional.casefold()
        == name.casefold()
    ):
        result["reason"] = (
            "unchanged"
        )
        return False, result

    # Защита от подозрительного результата.
    if (
        not genitive
        or not prepositional
    ):
        result["reason"] = (
            "empty_result"
        )
        return False, result

    result["reason"] = "safe"

    return True, result


with SOURCE.open(
    encoding="utf-8",
) as file:
    data = json.load(file)


safe = []
review = []


for item in data:

    if not item.get(
        "needsInflection"
    ):
        continue

    is_safe, result = (
        analyse(item)
    )

    if is_safe:
        safe.append(result)
    else:
        review.append(result)


# ----------------------------------------
# CSV
# ----------------------------------------

fields = [
    "name",
    "subject",
    "type",
    "settlementType",
    "slug",
    "genitiveCandidate",
    "prepositionalCandidate",
    "reason",
    "parse",
]


safe_path = (
    OUTPUT /
    "qa-inflection-safe-v7.csv"
)

review_path = (
    OUTPUT /
    "qa-inflection-review-v7.csv"
)


for path, rows in [
    (safe_path, safe),
    (review_path, review),
]:
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
        writer.writerows(rows)


reasons = Counter(
    item["reason"]
    for item in review
)


stats = {
    "needsInflection":
        len(safe) + len(review),

    "safeAutomatic":
        len(safe),

    "needsReview":
        len(review),

    "safePercent":
        round(
            (
                len(safe)
                /
                (
                    len(safe)
                    +
                    len(review)
                )
                *
                100
            ),
            2,
        ),

    "reviewReasons":
        dict(
            reasons.most_common()
        ),
}


stats_path = (
    OUTPUT /
    "stats-inflection-v7.json"
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
print("INFLECTION AUDIT V7")
print("========================================")

for key, value in stats.items():
    print(
        f"{key}: {value}"
    )

print()
print("SAFE:")
print(safe_path)

print()
print("REVIEW:")
print(review_path)

print()
print("STATS:")
print(stats_path)
