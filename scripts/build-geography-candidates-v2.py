#!/usr/bin/env python3

import csv
import heapq
import json
import re
import zipfile

from collections import Counter, defaultdict, deque
from pathlib import Path


PROJECT = Path(
    "/var/www/pasport-bezopasnosty.ru/app/passport-security-base"
)

SOURCE = PROJECT / "data/geography-source/geonames"
OUTPUT = PROJECT / "data/geography-generated"

MAIN_ZIP = SOURCE / "RU.zip"
ALT_ZIP = SOURCE / "RU-alternatenames.zip"

CURRENT_FILE = (
    PROJECT /
    "config/geography/locations.json"
)

TARGET = 10_000


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


SUBJECT_ALIASES = {
    "Ставрополье":
        "Ставропольский край",

    "Татарстан":
        "Республика Татарстан",

    "Удмуртия":
        "Удмуртская Республика",

    "Дагестан":
        "Республика Дагестан",

    "Ингушетия":
        "Республика Ингушетия",

    "Еврейская АО":
        "Еврейская автономная область",
}


def has_cyrillic(value):
    return bool(
        re.search(
            r"[А-Яа-яЁё]",
            str(value or ""),
        )
    )


def normalized_name(value):
    return (
        str(value or "")
        .strip()
        .replace("Ё", "Е")
        .replace("ё", "е")
        .casefold()
    )


def normalize_subject(value):
    value = str(value or "").strip()

    value = SUBJECT_ALIASES.get(
        value,
        value,
    )

    value = re.sub(
        r"\bОбласть\b",
        "область",
        value,
    )

    value = re.sub(
        r"\bКрай\b",
        "край",
        value,
    )

    value = re.sub(
        r"\bАвтономная Область\b",
        "автономная область",
        value,
    )

    value = re.sub(
        r"\bАвтономный Округ\b",
        "автономный округ",
        value,
    )

    return value


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
            f"{base[:38]}-"
            f"{subject_slug[:23]}"
        )[:63].rstrip("-")

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
            ]
            +
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


def get_txt_member(zip_path):
    with zipfile.ZipFile(
        zip_path
    ) as archive:

        items = [
            name
            for name in archive.namelist()
            if name.endswith(".txt")
            and
            not name.endswith("readme.txt")
        ]

    if not items:
        raise RuntimeError(
            f"TXT не найден: {zip_path}"
        )

    return items[0]


def read_current():
    with CURRENT_FILE.open(
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

    default = next(
        x
        for x in data
        if x.get("isDefault")
    )

    regional = [
        x
        for x in data
        if not x.get("isDefault")
    ]

    return default, regional


def score(record):
    return (
        record["population"],
        FEATURE_PRIORITY.get(
            record["featureCode"],
            0,
        ),
        int(record["geonameId"]),
    )


def priority_by_population(population):
    if population >= 1_000_000:
        return 100

    if population >= 500_000:
        return 95

    if population >= 100_000:
        return 90

    if population >= 50_000:
        return 80

    if population >= 10_000:
        return 70

    if population >= 1_000:
        return 65

    if population > 0:
        return 60

    return 50


OUTPUT.mkdir(
    parents=True,
    exist_ok=True,
)


default_location, current_locations = (
    read_current()
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
    "========================================"
)

print(
    "BUILD GEOGRAPHY CANDIDATES V2"
)

print(
    "========================================"
)


admin1 = {}
places = []


main_member = get_txt_member(
    MAIN_ZIP
)


print()
print("[1/6] Читаем GeoNames RU...")


with zipfile.ZipFile(
    MAIN_ZIP
) as archive:

    with archive.open(
        main_member
    ) as raw:

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

            if len(row) < 19:
                continue

            geoname_id = row[0]
            name = row[1]

            feature_class = row[6]
            feature_code = row[7]

            admin1_code = row[10]

            population = (
                parse_population(
                    row[14]
                )
            )


            if (
                feature_class == "A"
                and
                feature_code == "ADM1"
                and
                admin1_code
            ):
                admin1[
                    admin1_code
                ] = {
                    "geonameId":
                        geoname_id,

                    "name":
                        name,
                }


            if (
                feature_class != "P"
                or
                feature_code
                not in ELIGIBLE_CODES
            ):
                continue


            places.append({
                "geonameId":
                    geoname_id,

                "name":
                    name,

                "featureCode":
                    feature_code,

                "admin1Code":
                    admin1_code,

                "population":
                    population,

                "latitude":
                    row[4],

                "longitude":
                    row[5],
            })


print(
    f"Кандидатов P: {len(places)}"
)

print(
    f"ADM1: {len(admin1)}"
)


need_ru_name = {
    item["geonameId"]
    for item in places
    if not has_cyrillic(
        item["name"]
    )
}


need_ru_name.update(
    item["geonameId"]
    for item in admin1.values()
    if not has_cyrillic(
        item["name"]
    )
)


print()
print(
    "[2/6] Ищем недостающие русские названия..."
)


ru_names = {}


alt_member = get_txt_member(
    ALT_ZIP
)


with zipfile.ZipFile(
    ALT_ZIP
) as archive:

    with archive.open(
        alt_member
    ) as raw:

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

            if geoname_id not in need_ru_name:
                continue

            if row[2] != "ru":
                continue

            name = row[3].strip()

            if (
                not name
                or
                not has_cyrillic(name)
            ):
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
                ru_names[
                    geoname_id
                ] = {
                    "name": name,
                    "preferred":
                        preferred,
                }


def resolve_name(
    geoname_id,
    name,
):
    name = str(
        name or ""
    ).strip()

    if has_cyrillic(name):
        return name

    item = ru_names.get(
        geoname_id
    )

    if item:
        return item["name"]

    return name


for code, item in admin1.items():
    item["name"] = (
        normalize_subject(
            resolve_name(
                item["geonameId"],
                item["name"],
            )
        )
    )


print()
print(
    "[3/6] Нормализуем и дедуплицируем..."
)


best_by_key = {}

skipped_no_subject = 0
skipped_no_ru_name = 0
skipped_existing = 0
skipped_region_duplicate = 0
same_subject_duplicates = 0


for item in places:
    name = resolve_name(
        item["geonameId"],
        item["name"],
    ).strip()


    if (
        not name
        or
        not has_cyrillic(name)
    ):
        skipped_no_ru_name += 1
        continue


    subject_info = admin1.get(
        item["admin1Code"]
    )


    if not subject_info:
        skipped_no_subject += 1
        continue


    subject = subject_info[
        "name"
    ].strip()


    if not subject:
        skipped_no_subject += 1
        continue


    if (
        normalized_name(name)
        in current_name_keys
    ):
        skipped_existing += 1
        continue


    # Не создаём отдельную locality,
    # если название совпадает с субъектом.
    if (
        normalized_name(name)
        ==
        normalized_name(subject)
    ):
        skipped_region_duplicate += 1
        continue


    record = {
        **item,
        "name":
            name,

        "subject":
            subject,
    }


    key = (
        normalized_name(subject),
        normalized_name(name),
    )


    old = best_by_key.get(key)


    if old is None:
        best_by_key[key] = record
        continue


    same_subject_duplicates += 1


    if score(record) > score(old):
        best_by_key[key] = record


deduped_places = list(
    best_by_key.values()
)


positive = [
    item
    for item in deduped_places
    if item["population"] > 0
]


unknown = [
    item
    for item in deduped_places
    if item["population"] == 0
]


positive.sort(
    key=score,
    reverse=True,
)


print(
    f"После дедупликации: "
    f"{len(deduped_places)}"
)

print(
    f"С известным населением: "
    f"{len(positive)}"
)

print(
    f"С неизвестным населением: "
    f"{len(unknown)}"
)

print(
    f"Дубликатов имя+субъект удалено: "
    f"{same_subject_duplicates}"
)


print()
print(
    "[4/6] Формируем страницы субъектов..."
)


region_entries = []


for admin_code, item in sorted(
    admin1.items(),
    key=lambda pair:
        normalized_name(
            pair[1]["name"]
        ),
):

    name = item["name"]


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


needed_localities = (
    TARGET
    -
    len(current_locations)
    -
    len(region_entries)
)


if needed_localities <= 0:
    raise SystemExit(
        "TARGET слишком мал"
    )


if len(positive) > needed_localities:
    positive = positive[
        :needed_localities
    ]


selected = list(positive)


remaining = (
    needed_localities
    -
    len(selected)
)


print(
    f"Нужно locality: "
    f"{needed_localities}"
)

print(
    f"Автоматически берём population>0: "
    f"{len(selected)}"
)

print(
    f"Нужно добрать population unknown: "
    f"{remaining}"
)


print()
print(
    "[5/6] Равномерно добираем неизвестное население..."
)


unknown_by_subject = defaultdict(
    list
)


for item in unknown:
    unknown_by_subject[
        item["subject"]
    ].append(item)


for subject in unknown_by_subject:
    unknown_by_subject[
        subject
    ].sort(
        key=lambda item: (
            FEATURE_PRIORITY.get(
                item["featureCode"],
                0,
            ),
            int(
                item["geonameId"]
            ),
        ),
        reverse=True,
    )


queues = {
    subject:
        deque(items)

    for subject, items
    in unknown_by_subject.items()

    if items
}


subject_counts = Counter(
    item["subject"]
    for item in selected
)


unknown_added = Counter()


balance_heap = [
    (
        subject_counts[
            subject
        ],
        subject,
    )
    for subject in queues
]


heapq.heapify(
    balance_heap
)


while (
    remaining > 0
    and
    balance_heap
):
    current_count, subject = (
        heapq.heappop(
            balance_heap
        )
    )


    queue = queues[
        subject
    ]


    if not queue:
        continue


    item = queue.popleft()

    selected.append(item)

    subject_counts[
        subject
    ] += 1

    unknown_added[
        subject
    ] += 1

    remaining -= 1


    if queue:
        heapq.heappush(
            balance_heap,
            (
                subject_counts[
                    subject
                ],
                subject,
            ),
        )


if remaining != 0:
    raise SystemExit(
        "Не удалось набрать 10 000. "
        f"Не хватает: {remaining}"
    )


# Самые значимые получают короткий slug,
# одноимённые — slug с субъектом.
selected.sort(
    key=score,
    reverse=True,
)


locality_entries = []


for item in selected:
    slug = unique_slug(
        item["name"],
        item["subject"],
        item["geonameId"],
        used_slugs,
    )


    locality_entries.append({
        "slug":
            slug,

        "name":
            item["name"],

        "genitive":
            None,

        "prepositional":
            None,

        "region":
            item["subject"],

        "subject":
            item["subject"],

        "type":
            "locality",

        "address":
            "",

        "active":
            False,

        "isDefault":
            False,

        "priority":
            priority_by_population(
                item["population"]
            ),

        "source":
            "geonames",

        "geonameId":
            item["geonameId"],

        "admin1Code":
            item["admin1Code"],

        "featureCode":
            item["featureCode"],

        "population":
            item["population"],

        "populationKnown":
            item["population"] > 0,

        "latitude":
            item["latitude"],

        "longitude":
            item["longitude"],

        "needsInflection":
            True,
    })


regional = (
    current_locations
    +
    region_entries
    +
    locality_entries
)


if len(regional) != TARGET:
    raise SystemExit(
        f"Получено {len(regional)}, "
        f"ожидалось {TARGET}"
    )


all_locations = [
    default_location,
    *regional,
]


print()
print(
    "[6/6] Записываем V2..."
)


json_path = (
    OUTPUT /
    "locations-draft-10000-v2.json"
)


with json_path.open(
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        all_locations,
        file,
        ensure_ascii=False,
        indent=2,
    )

    file.write("\n")


csv_path = (
    OUTPUT /
    "locations-draft-10000-v2.csv"
)


fields = [
    "slug",
    "name",
    "type",
    "subject",
    "population",
    "populationKnown",
    "featureCode",
    "geonameId",
    "priority",
    "active",
    "needsInflection",
]


with csv_path.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:

    writer = csv.DictWriter(
        file,
        fieldnames=fields,
        extrasaction="ignore",
        delimiter=";",
    )

    writer.writeheader()

    for item in regional:
        writer.writerow(item)


distribution = Counter(
    item.get(
        "subject",
        "",
    )
    for item in locality_entries
)


distribution_path = (
    OUTPUT /
    "qa-subject-distribution-v2.csv"
)


with distribution_path.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:

    writer = csv.writer(
        file,
        delimiter=";",
    )

    writer.writerow([
        "Субъект",
        "Всего locality",
        "Добавлено population unknown",
    ])


    for subject, count in sorted(
        distribution.items(),
        key=lambda pair:
            (
                -pair[1],
                pair[0],
            ),
    ):
        writer.writerow([
            subject,
            count,
            unknown_added[
                subject
            ],
        ])


name_subjects = defaultdict(
    set
)


for item in locality_entries:
    name_subjects[
        normalized_name(
            item["name"]
        )
    ].add(
        item["subject"]
    )


cross_subject_duplicates = {
    name:
        subjects

    for name, subjects
    in name_subjects.items()

    if len(subjects) > 1
}


known_selected = sum(
    1
    for item in locality_entries
    if item.get(
        "populationKnown"
    )
)


unknown_selected = (
    len(locality_entries)
    -
    known_selected
)


stats = {
    "targetRegionalPages":
        TARGET,

    "totalPagesIncludingFederal":
        TARGET + 1,

    "existingRegionalPages":
        len(current_locations),

    "newRegionPages":
        len(region_entries),

    "localityPages":
        len(locality_entries),

    "knownPopulationLocalities":
        known_selected,

    "unknownPopulationLocalities":
        unknown_selected,

    "unknownPopulationSharePercent":
        round(
            unknown_selected
            /
            len(locality_entries)
            *
            100,
            2,
        ),

    "sameSubjectDuplicatesRemoved":
        same_subject_duplicates,

    "crossSubjectDuplicateNameGroups":
        len(
            cross_subject_duplicates
        ),

    "subjectsWithLocalities":
        len(distribution),

    "largestSubjectPageCount":
        max(
            distribution.values(),
            default=0,
        ),

    "smallestSubjectPageCount":
        min(
            distribution.values(),
            default=0,
        ),

    "maxUnknownAddedToOneSubject":
        max(
            unknown_added.values(),
            default=0,
        ),

    "needsInflection":
        sum(
            1
            for item in regional
            if item.get(
                "needsInflection"
            )
        ),
}


stats_path = (
    OUTPUT /
    "stats-10000-v2.json"
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


print()
print(
    "========================================"
)
print(
    "✓ V2 ГОТОВА"
)
print(
    "========================================"
)

print(
    f"Региональных страниц: "
    f"{len(regional)}"
)

print(
    f"Субъектов: "
    f"{len(region_entries)} новых"
)

print(
    f"Locality: "
    f"{len(locality_entries)}"
)

print(
    f"Известное население: "
    f"{known_selected}"
)

print(
    f"Неизвестное население: "
    f"{unknown_selected}"
)

print(
    f"Доля unknown: "
    f"{stats['unknownPopulationSharePercent']}%"
)

print(
    f"Удалено дублей внутри субъекта: "
    f"{same_subject_duplicates}"
)

print(
    f"Одинаковых названий между субъектами: "
    f"{len(cross_subject_duplicates)}"
)

print(
    f"Максимум locality в одном субъекте: "
    f"{stats['largestSubjectPageCount']}"
)

print(
    f"Максимум unknown-добавлений в субъект: "
    f"{stats['maxUnknownAddedToOneSubject']}"
)

print()
print(
    f"JSON: {json_path}"
)

print(
    f"CSV:  {csv_path}"
)

print(
    f"DIST: {distribution_path}"
)

print(
    f"STAT: {stats_path}"
)
