#!/usr/bin/env python3

import csv
import json

from collections import Counter
from pathlib import Path


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

HIGH = (
    PROJECT /
    "data/geography-generated/qa-inflection-high-v9.csv"
)

REVIEW = (
    PROJECT /
    "data/geography-generated/qa-inflection-review-v9.csv"
)

OUTPUT = (
    PROJECT /
    "data/geography-generated"
)


def read_csv(path):
    with path.open(
        encoding="utf-8-sig",
    ) as file:

        return list(
            csv.DictReader(
                file,
                delimiter=";",
            )
        )


high = read_csv(HIGH)
review = read_csv(REVIEW)


trusted = []
neutral = []


def accept(row, rule):
    item = dict(row)
    item["finalRule"] = rule
    item["finalMode"] = "trusted"
    trusted.append(item)


def reject(row, rule):
    item = dict(row)
    item["finalRule"] = rule
    item["finalMode"] = "neutral"
    neutral.append(item)


# ============================================================
# HIGH V9
# ============================================================

for row in high:

    reason = row["reason"]
    parse = row["parse"]


    # --------------------------------------------------------
    # 1. Явный географический nominative
    # --------------------------------------------------------

    if reason == "geox_nominative":

        accept(
            row,
            "geox_nominative",
        )

        continue


    # --------------------------------------------------------
    # 2. Наше детерминированное -ово/-ино
    # --------------------------------------------------------

    if reason == "ovo_ino_rule":

        accept(
            row,
            "ovo_ino_rule",
        )

        continue


    # --------------------------------------------------------
    # 3. Множественный топоним принимаем
    # ТОЛЬКО если сам parse = Geox
    # --------------------------------------------------------

    if reason == "plural_nominative":

        if "Geox" in parse:

            accept(
                row,
                "plural_geox",
            )

        else:

            reject(
                row,
                "plural_without_geox",
            )

        continue


    # --------------------------------------------------------
    # 4. Прилагательные:
    # Октябрьский -> Октябрьского / Октябрьском
    # Узловая -> Узловой / Узловой
    # --------------------------------------------------------

    if reason == "nominative_agreement":

        if parse.startswith("ADJF"):

            accept(
                row,
                "adjective_nominative",
            )

        else:

            reject(
                row,
                "noun_without_geox",
            )

        continue


    reject(
        row,
        f"unhandled_high:{reason}",
    )


# ============================================================
# REVIEW V9
# ============================================================

for row in review:

    reason = row["reason"]


    # Пока даже Fixd+Geox не принимаем автоматически.
    # Сочи/Тольятти можно будет добавить override-словарём.
    # Это защищает нас от ошибок вроде Лиски.
    reject(
        row,
        f"review:{reason}",
    )


# ============================================================
# QA
# ============================================================

total = (
    len(trusted)
    +
    len(neutral)
)


if total != 9997:
    raise RuntimeError(
        f"Получено {total}, ожидалось 9997"
    )


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
    "finalRule",
    "finalMode",
]


for filename, rows in [
    (
        "qa-inflection-trusted-v10.csv",
        trusted,
    ),
    (
        "qa-inflection-neutral-v10.csv",
        neutral,
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
            extrasaction="ignore",
            delimiter=";",
        )

        writer.writeheader()
        writer.writerows(rows)


stats = {
    "total":
        total,

    "trusted":
        len(trusted),

    "neutral":
        len(neutral),

    "trustedPercent":
        round(
            len(trusted)
            / total
            * 100,
            2,
        ),

    "trustedRules":
        dict(
            Counter(
                row["finalRule"]
                for row in trusted
            ).most_common()
        ),

    "neutralRules":
        dict(
            Counter(
                row["finalRule"]
                for row in neutral
            ).most_common()
        ),
}


stats_path = (
    OUTPUT /
    "stats-inflection-v10.json"
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
print("INFLECTION CLASSIFICATION V10")
print("========================================")

for key, value in stats.items():
    print(
        f"{key}: {value}"
    )

print()
print(
    OUTPUT /
    "qa-inflection-trusted-v10.csv"
)

print(
    OUTPUT /
    "qa-inflection-neutral-v10.csv"
)

print(stats_path)
