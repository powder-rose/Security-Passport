#!/usr/bin/env python3

import csv
import heapq
import json
import re
import zipfile

from collections import Counter, defaultdict
from pathlib import Path


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

SOURCE = (
    PROJECT /
    "data/geography-source/geonames"
)

OUTPUT = (
    PROJECT /
    "data/geography-generated"
)

MAIN_ZIP = SOURCE / "RU.zip"
ALT_ZIP = SOURCE / "RU-alternatenames.zip"

CURRENT_FILE = (
    PROJECT /
    "config/geography/locations.json"
)


# 10 000 региональных/городских поддоменов.
# Федеральный pasport-bezopasnosty.ru считается отдельно.
TARGET = 10_000

# Берём запас, потому что дальше будут:
# дубли, исключения и проверки.
HEAP_LIMIT = 25_000


# Оставляем нормальные населённые пункты.
# Не берём:
# PPLQ — abandoned
# PPLH — historical
# PPLX — section
# PPLW — destroyed
# PPLL — locality
# PPLF — farm village
# PPLR — religious populated place
ELIGIBLE_CODES = {
    "PPLC",
    "PPLA",
    "PPLA2",
    "PPLA3",
    "PPLA4",
    "PPL",
    "PPLS",
}


FEATURE_PRIORITY = {
    "PPLC": 100,
    "PPLA": 95,
    "PPLA2": 90,
    "PPLA3": 85,
    "PPLA4": 80,
    "PPL": 70,
    "PPLS": 60,
}


RESERVED_SLUGS = {
    "www",
    "admin",
    "api",
    "mail",
    "ftp",
    "smtp",
    "pop",
    "imap",
    "static",
    "assets",
    "images",
}


TRANSLIT = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "e",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "h",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "sch",
    "ъ": "",
    "ы": "y",
    "ь": "",
    "э": "e",
    "ю": "yu",
    "я": "ya",
}


def normalized_name(value):
    return (
        str(value or "")
        .strip()
        .replace("ё", "е")
        .replace("Ё", "Е")
        .casefold()
    )


def has_cyrillic(value):
    return bool(
        re.search(
            r"[А-Яа-яЁё]",
            str(value or ""),
        )
    )


def slugify(value):
    normalized_value = str(value).strip().lower()

    # "Гай" как отдельное слово транслитерируем через "gai".
    # Это работает для "Гай", "Александров Гай", "Красный Гай",
    # но не затрагивает "Батагай", "Тугай" и другие слова.
    normalized_value = re.sub(
        r"(?<![а-яё])гай(?![а-яё])",
        "gai",
        normalized_value,
    )

    result = []

    for char in normalized_value:
        if char in TRANSLIT:
            result.append(
                TRANSLIT[char]
            )
        elif "a" <= char <= "z":
            result.append(char)
        elif "0" <= char <= "9":
            result.append(char)
        else:
            result.append("-")

    slug = "".join(result)

    slug = re.sub(
        r"-+",
        "-",
        slug,
    ).strip("-")

    return slug[:63]


def unique_slug(
    name,
    subject,
    geoname_id,
    used,
):
    base = slugify(name)

    if not base:
        base = f"geo-{geoname_id}"

    if base in RESERVED_SLUGS:
        base = f"{base}-geo"

    base = base[:63].rstrip("-")

    if base not in used:
        used.add(base)
        return base

    subject_slug = slugify(subject)

    if subject_slug:
        candidate = (
            f"{base[:40]}-"
            f"{subject_slug[:20]}"
        ).strip("-")[:63]

        if candidate not in used:
            used.add(candidate)
            return candidate

    candidate = (
        f"{base[:50]}-{geoname_id}"
    )[:63].rstrip("-")

    if candidate not in used:
        used.add(candidate)
        return candidate

    counter = 2

    while True:
        suffix = f"-{counter}"

        candidate = (
            base[
                : 63 - len(suffix)
            ] +
            suffix
        )

        if candidate not in used:
            used.add(candidate)
            return candidate

        counter += 1


def parse_population(value):
    try:
        return max(
            0,
            int(value or 0),
        )
    except ValueError:
        return 0


def get_zip_member(zip_path):
    with zipfile.ZipFile(zip_path) as archive:
        candidates = [
            name
            for name in archive.namelist()
            if name.endswith(".txt")
            and not name.endswith("readme.txt")
        ]

    if not candidates:
        raise RuntimeError(
            f"TXT не найден в {zip_path}"
        )

    return candidates[0]


def read_existing():
    with CURRENT_FILE.open(
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

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

    return default, regional


if not MAIN_ZIP.exists():
    raise SystemExit(
        f"Не найден {MAIN_ZIP}"
    )

if not ALT_ZIP.exists():
    raise SystemExit(
        f"Не найден {ALT_ZIP}"
    )


OUTPUT.mkdir(
    parents=True,
    exist_ok=True,
)


print(
    "========================================"
)
print(
    "BUILD GEOGRAPHY CANDIDATES"
)
print(
    "========================================"
)
print()


default_location, current_locations = (
    read_existing()
)


current_name_keys = {
    normalized_name(
        item["name"]
    )
    for item in current_locations
}


used_slugs = {
    item["slug"]
    for item in current_locations
}


print(
    f"Текущих региональных страниц: "
    f"{len(current_locations)}"
)


admin1 = {}

heap = []

total_populated = 0
eligible_populated = 0


main_member = get_zip_member(
    MAIN_ZIP
)


print()
print(
    "[1/5] Читаем RU.zip..."
)


with zipfile.ZipFile(
    MAIN_ZIP
) as archive:

    with archive.open(
        main_member
    ) as raw:

        for binary_line in raw:
            line = binary_line.decode(
                "utf-8",
                errors="replace",
            ).rstrip("\n")

            row = line.split("\t")

            if len(row) < 19:
                continue

            geoname_id = row[0]
            name = row[1]
            ascii_name = row[2]

            latitude = row[4]
            longitude = row[5]

            feature_class = row[6]
            feature_code = row[7]

            admin1_code = row[10]

            population = parse_population(
                row[14]
            )


            if (
                feature_class == "A"
                and
                feature_code == "ADM1"
                and
                admin1_code
            ):
                admin1[admin1_code] = {
                    "geonameId":
                        geoname_id,

                    "name":
                        name,

                    "asciiName":
                        ascii_name,
                }


            if feature_class != "P":
                continue

            total_populated += 1

            if (
                feature_code
                not in ELIGIBLE_CODES
            ):
                continue

            eligible_populated += 1


            record = {
                "geonameId":
                    geoname_id,

                "name":
                    name,

                "asciiName":
                    ascii_name,

                "featureCode":
                    feature_code,

                "admin1Code":
                    admin1_code,

                "population":
                    population,

                "latitude":
                    latitude,

                "longitude":
                    longitude,
            }


            score = (
                population,
                FEATURE_PRIORITY.get(
                    feature_code,
                    0,
                ),
                int(geoname_id),
            )


            item = (
                score,
                record,
            )


            if len(heap) < HEAP_LIMIT:
                heapq.heappush(
                    heap,
                    item,
                )

            elif score > heap[0][0]:
                heapq.heapreplace(
                    heap,
                    item,
                )


print(
    f"Всего P-объектов: "
    f"{total_populated}"
)

print(
    f"После фильтра feature code: "
    f"{eligible_populated}"
)

print(
    f"ADM1 найдено: "
    f"{len(admin1)}"
)

print(
    f"В предварительном TOP: "
    f"{len(heap)}"
)


candidate_records = [
    item[1]
    for item in heap
]


wanted_ids = {
    item["geonameId"]
    for item in candidate_records
}


wanted_ids.update(
    item["geonameId"]
    for item in admin1.values()
)


print()
print(
    "[2/5] Читаем русские alternate names..."
)


ru_names = {}


alt_member = get_zip_member(
    ALT_ZIP
)


with zipfile.ZipFile(
    ALT_ZIP
) as archive:

    with archive.open(
        alt_member
    ) as raw:

        for binary_line in raw:
            line = binary_line.decode(
                "utf-8",
                errors="replace",
            ).rstrip("\n")

            row = line.split("\t")

            if len(row) < 4:
                continue

            geoname_id = row[1]

            if geoname_id not in wanted_ids:
                continue

            language = row[2]

            if language != "ru":
                continue

            alt_name = row[3].strip()

            if not alt_name:
                continue

            preferred = (
                len(row) > 4
                and
                row[4] == "1"
            )

            old = ru_names.get(
                geoname_id
            )

            if (
                old is None
                or
                (
                    preferred
                    and
                    not old["preferred"]
                )
            ):
                ru_names[geoname_id] = {
                    "name":
                        alt_name,

                    "preferred":
                        preferred,
                }


def choose_russian_name(
    geoname_id,
    main_name,
):
    main_name = (
        main_name or ""
    ).strip()

    if has_cyrillic(main_name):
        return main_name

    alternative = ru_names.get(
        geoname_id
    )

    if (
        alternative
        and
        has_cyrillic(
            alternative["name"]
        )
    ):
        return alternative["name"]

    return main_name


for code, item in admin1.items():
    item["name"] = (
        choose_russian_name(
            item["geonameId"],
            item["name"],
        )
    )


for item in candidate_records:
    item["name"] = (
        choose_russian_name(
            item["geonameId"],
            item["name"],
        )
    )


print(
    f"Русских alternate names найдено: "
    f"{len(ru_names)}"
)


print()
print(
    "[3/5] Формируем страницы регионов..."
)


region_entries = []


for admin_code, item in sorted(
    admin1.items(),
    key=lambda pair:
        normalized_name(
            pair[1]["name"]
        ),
):

    name = item["name"].strip()

    if not name:
        continue

    # Москва и Санкт-Петербург уже существуют
    # как отдельные городские страницы.
    if (
        normalized_name(name)
        in current_name_keys
    ):
        continue


    slug = unique_slug(
        name,
        "",
        item["geonameId"],
        used_slugs,
    )


    region_entries.append({
        "slug":
            slug,

        "name":
            name,

        "genitive":
            None,

        "prepositional":
            None,

        "region":
            name,

        "subject":
            name,

        "type":
            "region",

        "address":
            "",

        "active":
            False,

        "isDefault":
            False,

        "priority":
            95,

        "source":
            "geonames",

        "geonameId":
            item["geonameId"],

        "admin1Code":
            admin_code,

        "needsInflection":
            True,
    })


print(
    f"Региональных кандидатов: "
    f"{len(region_entries)}"
)


print()
print(
    "[4/5] Формируем населённые пункты..."
)


candidate_records.sort(
    key=lambda item: (
        item["population"],
        FEATURE_PRIORITY.get(
            item["featureCode"],
            0,
        ),
        int(item["geonameId"]),
    ),
    reverse=True,
)


needed_localities = (
    TARGET
    -
    len(current_locations)
    -
    len(region_entries)
)


if needed_localities <= 0:
    raise SystemExit(
        "Регионов оказалось больше TARGET"
    )


locality_entries = []

skipped_no_subject = 0
skipped_no_russian_name = 0
skipped_current = 0


for item in candidate_records:

    if (
        len(locality_entries)
        >= needed_localities
    ):
        break


    name = item["name"].strip()

    if (
        not name
        or
        not has_cyrillic(name)
    ):
        skipped_no_russian_name += 1
        continue


    if (
        normalized_name(name)
        in current_name_keys
    ):
        skipped_current += 1
        continue


    subject_info = admin1.get(
        item["admin1Code"]
    )


    if not subject_info:
        skipped_no_subject += 1
        continue


    subject = (
        subject_info["name"]
        .strip()
    )


    if not subject:
        skipped_no_subject += 1
        continue


    slug = unique_slug(
        name,
        subject,
        item["geonameId"],
        used_slugs,
    )


    population = (
        item["population"]
    )


    if population >= 1_000_000:
        priority = 100
    elif population >= 500_000:
        priority = 95
    elif population >= 100_000:
        priority = 90
    elif population >= 50_000:
        priority = 80
    elif population >= 10_000:
        priority = 70
    else:
        priority = 60


    locality_entries.append({
        "slug":
            slug,

        "name":
            name,

        "genitive":
            None,

        "prepositional":
            None,

        "region":
            subject,

        "subject":
            subject,

        "type":
            "locality",

        "address":
            "",

        "active":
            False,

        "isDefault":
            False,

        "priority":
            priority,

        "source":
            "geonames",

        "geonameId":
            item["geonameId"],

        "admin1Code":
            item["admin1Code"],

        "featureCode":
            item["featureCode"],

        "population":
            population,

        "latitude":
            item["latitude"],

        "longitude":
            item["longitude"],

        "needsInflection":
            True,
    })


if (
    len(locality_entries)
    != needed_localities
):
    raise SystemExit(
        "Не удалось набрать "
        f"{needed_localities} населённых пунктов. "
        f"Получено {len(locality_entries)}."
    )


draft_regional = (
    current_locations
    +
    region_entries
    +
    locality_entries
)


if len(draft_regional) != TARGET:
    raise SystemExit(
        "Итоговое количество не равно TARGET: "
        f"{len(draft_regional)}"
    )


draft_all = [
    default_location,
    *draft_regional,
]


print(
    f"Населённых пунктов добавлено: "
    f"{len(locality_entries)}"
)

print(
    f"Пропущено без субъекта: "
    f"{skipped_no_subject}"
)

print(
    f"Пропущено без русского имени: "
    f"{skipped_no_russian_name}"
)

print(
    f"Пропущено существующих: "
    f"{skipped_current}"
)


print()
print(
    "[5/5] Записываем черновики и QA..."
)


draft_file = (
    OUTPUT /
    "locations-draft-10000.json"
)


with draft_file.open(
    "w",
    encoding="utf-8",
) as file:
    json.dump(
        draft_all,
        file,
        ensure_ascii=False,
        indent=2,
    )

    file.write("\n")


csv_file = (
    OUTPUT /
    "locations-draft-10000.csv"
)


csv_fields = [
    "slug",
    "name",
    "type",
    "subject",
    "population",
    "featureCode",
    "geonameId",
    "latitude",
    "longitude",
    "priority",
    "active",
    "needsInflection",
]


with csv_file.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:

    writer = csv.DictWriter(
        file,
        fieldnames=csv_fields,
        delimiter=";",
        extrasaction="ignore",
    )

    writer.writeheader()

    for item in draft_regional:
        writer.writerow(item)


name_counter = Counter(
    normalized_name(
        item["name"]
    )
    for item in draft_regional
)


duplicates = {
    name
    for name, count
    in name_counter.items()
    if count > 1
}


duplicate_groups = defaultdict(
    list
)


for item in draft_regional:
    key = normalized_name(
        item["name"]
    )

    if key in duplicates:
        duplicate_groups[key].append(
            item
        )


duplicates_file = (
    OUTPUT /
    "qa-duplicate-names.csv"
)


with duplicates_file.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:

    writer = csv.writer(
        file,
        delimiter=";",
    )

    writer.writerow([
        "Название",
        "Количество",
        "Slug",
        "Субъект",
        "Население",
        "GeoNames ID",
    ])


    for key in sorted(
        duplicate_groups
    ):
        group = duplicate_groups[key]

        for item in group:
            writer.writerow([
                item["name"],
                len(group),
                item["slug"],
                item.get(
                    "subject",
                    "",
                ),
                item.get(
                    "population",
                    "",
                ),
                item.get(
                    "geonameId",
                    "",
                ),
            ])


stats = {
    "targetRegionalPages":
        TARGET,

    "federalPages":
        1,

    "totalPages":
        TARGET + 1,

    "existingRegionalPages":
        len(current_locations),

    "newRegionPages":
        len(region_entries),

    "newLocalityPages":
        len(locality_entries),

    "newInactivePages":
        sum(
            1
            for item in draft_regional
            if not item.get("active")
        ),

    "needsInflection":
        sum(
            1
            for item in draft_regional
            if item.get(
                "needsInflection"
            )
        ),

    "duplicateNameGroups":
        len(duplicate_groups),

    "minimumSelectedPopulation":
        min(
            (
                item.get(
                    "population",
                    0,
                )
                for item
                in locality_entries
            ),
            default=0,
        ),
}


stats_file = (
    OUTPUT /
    "stats-10000.json"
)


with stats_file.open(
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
print(
    "========================================"
)
print(
    "✓ ЧЕРНОВАЯ БАЗА ГОТОВА"
)
print(
    "========================================"
)

print(
    f"Региональных географий: "
    f"{len(draft_regional)}"
)

print(
    "Федеральная страница: 1"
)

print(
    f"Всего будущих страниц: "
    f"{len(draft_all)}"
)

print(
    f"Субъектов/регионов добавлено: "
    f"{len(region_entries)}"
)

print(
    f"Населённых пунктов добавлено: "
    f"{len(locality_entries)}"
)

print(
    f"Требуют склонений: "
    f"{stats['needsInflection']}"
)

print(
    f"Групп одинаковых названий: "
    f"{stats['duplicateNameGroups']}"
)

print(
    f"Минимальное население в выбранном TOP: "
    f"{stats['minimumSelectedPopulation']}"
)

print()
print(
    f"JSON: {draft_file}"
)

print(
    f"CSV:  {csv_file}"
)

print(
    f"QA:   {duplicates_file}"
)

print(
    f"STAT: {stats_file}"
)
