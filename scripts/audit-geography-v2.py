#!/usr/bin/env python3

import json
import re
import zipfile
from collections import Counter
from pathlib import Path


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

DRAFT = (
    PROJECT /
    "data/geography-generated/locations-draft-10000-v2.json"
)

ALT_ZIP = (
    PROJECT /
    "data/geography-source/geonames/RU-alternatenames.zip"
)


SUSPICIOUS = [
    r"\bурочище\b",
    r"\bкордон\b",
    r"\bлесничество\b",
    r"\bместорождение\b",
    r"\bаэродром\b",
    r"\bвоенный городок\b",
    r"\bлагерь\b",
    r"\bзимовье\b",
    r"\bпогост\b",
    r"\bразъезд\b",
    r"\bплатформа\b",
    r"\bкилометр\b",
    r"\bучасток\b",
    r"\bбывш",
    r"\bнежил",
]


with DRAFT.open(
    encoding="utf-8"
) as file:
    data = json.load(file)


unknown = [
    item
    for item in data
    if item.get("type") == "locality"
    and not item.get("populationKnown")
]


ids = {
    str(item["geonameId"])
    for item in unknown
}


stats = {
    geoname_id: {
        "alternateNames": 0,
        "ruNames": 0,
        "links": 0,
        "wikidata": 0,
    }
    for geoname_id in ids
}


with zipfile.ZipFile(
    ALT_ZIP
) as archive:

    txt = next(
        name
        for name in archive.namelist()
        if name.endswith(".txt")
        and not name.endswith("readme.txt")
    )

    with archive.open(txt) as raw:

        for binary_line in raw:
            row = (
                binary_line
                .decode(
                    "utf-8",
                    errors="replace",
                )
                .rstrip("\n")
                .split("\t")
            )

            if len(row) < 4:
                continue

            geoname_id = row[1]

            if geoname_id not in stats:
                continue

            language = row[2]

            stats[
                geoname_id
            ]["alternateNames"] += 1

            if language == "ru":
                stats[
                    geoname_id
                ]["ruNames"] += 1

            if language == "link":
                stats[
                    geoname_id
                ]["links"] += 1

            if language == "wkdt":
                stats[
                    geoname_id
                ]["wikidata"] += 1


with_alts = 0
with_ru = 0
with_links = 0
with_wikidata = 0

suspicious = []

subject_counter = Counter()


for item in unknown:
    geoname_id = str(
        item["geonameId"]
    )

    s = stats[geoname_id]

    if s["alternateNames"]:
        with_alts += 1

    if s["ruNames"]:
        with_ru += 1

    if s["links"]:
        with_links += 1

    if s["wikidata"]:
        with_wikidata += 1


    subject_counter[
        item["subject"]
    ] += 1


    name = item["name"]

    matches = [
        pattern
        for pattern in SUSPICIOUS
        if re.search(
            pattern,
            name,
            flags=re.I,
        )
    ]

    if matches:
        suspicious.append({
            "name":
                name,

            "subject":
                item["subject"],

            "slug":
                item["slug"],

            "geonameId":
                geoname_id,

            "featureCode":
                item.get(
                    "featureCode"
                ),

            "alternateNames":
                s["alternateNames"],

            "links":
                s["links"],

            "wikidata":
                s["wikidata"],

            "reason":
                ", ".join(matches),
        })


print(
    "========================================"
)
print(
    "AUDIT GEOGRAPHY V2"
)
print(
    "========================================"
)

print()
print(
    "UNKNOWN POPULATION:"
)
print(
    f"Всего: {len(unknown)}"
)
print(
    f"Есть alternate names: {with_alts}"
)
print(
    f"Есть русские alternate names: {with_ru}"
)
print(
    f"Есть внешняя link-запись: {with_links}"
)
print(
    f"Есть Wikidata: {with_wikidata}"
)

print()
print(
    "SUSPICIOUS NAME FLAGS:"
)
print(
    len(suspicious)
)

print()
print(
    "Первые 80 подозрительных:"
)

for item in suspicious[:80]:
    print(
        f"{item['name']} | "
        f"{item['subject']} | "
        f"{item['featureCode']} | "
        f"alt={item['alternateNames']} | "
        f"links={item['links']} | "
        f"wiki={item['wikidata']} | "
        f"{item['slug']}"
    )


print()
print(
    "UNKNOWN ПО СУБЪЕКТАМ:"
)

for subject, count in (
    subject_counter.most_common(30)
):
    print(
        f"{count:4}  {subject}"
    )


output = (
    PROJECT /
    "data/geography-generated/qa-suspicious-v2.json"
)

with output.open(
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        suspicious,
        file,
        ensure_ascii=False,
        indent=2,
    )

    file.write("\n")


print()
print(
    f"QA сохранён: {output}"
)
