#!/usr/bin/env python3

import csv
import json

from collections import Counter
from pathlib import Path


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

SOURCE = (
    PROJECT /
    "data/geography-generated/locations-draft-10000-v6.json"
)

TRUSTED = (
    PROJECT /
    "data/geography-generated/qa-inflection-trusted-v11.csv"
)

NEUTRAL = (
    PROJECT /
    "data/geography-generated/qa-inflection-neutral-v11.csv"
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


with SOURCE.open(
    encoding="utf-8",
) as file:
    data = json.load(file)


trusted_rows = read_csv(TRUSTED)
neutral_rows = read_csv(NEUTRAL)


trusted = {
    row["slug"]: row
    for row in trusted_rows
}

neutral = {
    row["slug"]: row
    for row in neutral_rows
}


if len(trusted) != len(trusted_rows):
    raise RuntimeError(
        "Duplicate slug in trusted CSV"
    )

if len(neutral) != len(neutral_rows):
    raise RuntimeError(
        "Duplicate slug in neutral CSV"
    )

overlap = (
    set(trusted)
    &
    set(neutral)
)

if overlap:
    raise RuntimeError(
        f"Trusted/neutral overlap: {len(overlap)}"
    )

if (
    len(trusted)
    +
    len(neutral)
    != 9997
):
    raise RuntimeError(
        "Classification must contain 9997 records"
    )


generated_trusted = 0
generated_neutral = 0
manual_trusted = 0
unresolved = []


for item in data:

    slug = item.get("slug", "")

    if item.get(
        "needsInflection"
    ):

        if slug in trusted:
            row = trusted[slug]

            genitive = (
                row[
                    "genitiveCandidate"
                ].strip()
            )

            prepositional = (
                row[
                    "prepositionalCandidate"
                ].strip()
            )

            if (
                not genitive
                or
                not prepositional
            ):
                raise RuntimeError(
                    f"Trusted without forms: {slug}"
                )

            item["genitive"] = (
                genitive
            )

            item["prepositional"] = (
                prepositional
            )

            item["inflectionMode"] = (
                "trusted"
            )

            item["inflectionSource"] = (
                row["finalRule"]
            )

            item[
                "needsInflection"
            ] = False

            generated_trusted += 1

        elif slug in neutral:
            row = neutral[slug]

            item["genitive"] = ""
            item["prepositional"] = ""

            item["inflectionMode"] = (
                "neutral"
            )

            item["inflectionSource"] = (
                row["finalRule"]
            )

            item[
                "needsInflection"
            ] = False

            generated_neutral += 1

        else:
            unresolved.append(
                slug
            )

    else:
        # Россия + Москва + СПб + Казань.
        if (
            item.get("genitive")
            and
            item.get("prepositional")
        ):
            item[
                "inflectionMode"
            ] = "trusted"

            item.setdefault(
                "inflectionSource",
                "manual",
            )

            manual_trusted += 1

        else:
            raise RuntimeError(
                "Existing resolved geography "
                f"has no forms: {slug}"
            )


if unresolved:
    raise RuntimeError(
        "Unresolved records: "
        f"{len(unresolved)}"
    )


regional = [
    item
    for item in data
    if not item.get("isDefault")
]


trusted_total = [
    item
    for item in data
    if (
        item.get("inflectionMode")
        ==
        "trusted"
    )
]


neutral_total = [
    item
    for item in data
    if (
        item.get("inflectionMode")
        ==
        "neutral"
    )
]


bad_trusted = [
    item
    for item in trusted_total
    if (
        not item.get("genitive")
        or
        not item.get(
            "prepositional"
        )
    )
]


bad_neutral = [
    item
    for item in neutral_total
    if (
        item.get("genitive")
        or
        item.get(
            "prepositional"
        )
    )
]


if bad_trusted:
    raise RuntimeError(
        f"Bad trusted: {len(bad_trusted)}"
    )

if bad_neutral:
    raise RuntimeError(
        f"Neutral contains forms: {len(bad_neutral)}"
    )

if len(data) != 10001:
    raise RuntimeError(
        f"Total pages: {len(data)}"
    )

if len(regional) != 10000:
    raise RuntimeError(
        f"Regional pages: {len(regional)}"
    )


slugs = [
    item.get("slug")
    for item in regional
]


if len(set(slugs)) != 10000:
    raise RuntimeError(
        "Duplicate regional slug"
    )


stats = {
    "totalPages":
        len(data),

    "regionalPages":
        len(regional),

    "generatedTrusted":
        generated_trusted,

    "generatedNeutral":
        generated_neutral,

    "manualTrusted":
        manual_trusted,

    "trustedTotal":
        len(trusted_total),

    "neutralTotal":
        len(neutral_total),

    "trustedRegional":
        sum(
            item.get(
                "inflectionMode"
            ) == "trusted"
            for item in regional
        ),

    "neutralRegional":
        sum(
            item.get(
                "inflectionMode"
            ) == "neutral"
            for item in regional
        ),

    "activeRegional":
        sum(
            item.get("active")
            is not False
            for item in regional
        ),

    "inactiveRegional":
        sum(
            item.get("active")
            is False
            for item in regional
        ),

    "needsInflection":
        sum(
            bool(
                item.get(
                    "needsInflection"
                )
            )
            for item in data
        ),

    "uniqueRegionalSlugs":
        len(set(slugs)),

    "inflectionSources":
        dict(
            Counter(
                item.get(
                    "inflectionSource",
                    "unknown",
                )
                for item in data
            ).most_common()
        ),
}


output_path = (
    OUTPUT /
    "locations-draft-10000-v12.json"
)


with output_path.open(
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


stats_path = (
    OUTPUT /
    "stats-10000-v12.json"
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
print("✓ V12 ГОТОВА")
print("========================================")

for key, value in stats.items():
    print(
        f"{key}: {value}"
    )

print()
print(output_path)
print(stats_path)
