#!/usr/bin/env python3
"""Download the public source texts and write compact JSON for the site.

Outputs:
  public/texts/<id>.json   full text of each book, loaded on demand for search
  src/data/themes.json     theme passages resolved from scripts/themes.source.json

Run: python3 scripts/build-texts.py
"""
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = "https://raw.githubusercontent.com"

WEB_REPO = f"{RAW}/TehShrike/world-english-bible/master/json"
SEFARIA = f"{RAW}/Sefaria/Sefaria-Export/232b476c2ea3c0050b742ae7c0f6f8fd9ea43dbc/json/Tanakh/Torah"
QURAN = f"{RAW}/fawazahmed0/quran-api/1"
GITA = f"{RAW}/gita/gita/main/data"
GITA_AUTHOR_ID = 16  # Swami Sivananda

TORAH_BOOKS = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"]

# Bible books after the five books of Moses (those are shown under Torah).
BIBLE_BOOKS = [
    ("joshua", "Joshua"), ("judges", "Judges"), ("ruth", "Ruth"),
    ("1samuel", "1 Samuel"), ("2samuel", "2 Samuel"), ("1kings", "1 Kings"),
    ("2kings", "2 Kings"), ("1chronicles", "1 Chronicles"), ("2chronicles", "2 Chronicles"),
    ("ezra", "Ezra"), ("nehemiah", "Nehemiah"), ("esther", "Esther"), ("job", "Job"),
    ("psalms", "Psalms"), ("proverbs", "Proverbs"), ("ecclesiastes", "Ecclesiastes"),
    ("songofsolomon", "Song of Solomon"), ("isaiah", "Isaiah"), ("jeremiah", "Jeremiah"),
    ("lamentations", "Lamentations"), ("ezekiel", "Ezekiel"), ("daniel", "Daniel"),
    ("hosea", "Hosea"), ("joel", "Joel"), ("amos", "Amos"), ("obadiah", "Obadiah"),
    ("jonah", "Jonah"), ("micah", "Micah"), ("nahum", "Nahum"), ("habakkuk", "Habakkuk"),
    ("zephaniah", "Zephaniah"), ("haggai", "Haggai"), ("zechariah", "Zechariah"),
    ("malachi", "Malachi"), ("matthew", "Matthew"), ("mark", "Mark"), ("luke", "Luke"),
    ("john", "John"), ("acts", "Acts"), ("romans", "Romans"),
    ("1corinthians", "1 Corinthians"), ("2corinthians", "2 Corinthians"),
    ("galatians", "Galatians"), ("ephesians", "Ephesians"), ("philippians", "Philippians"),
    ("colossians", "Colossians"), ("1thessalonians", "1 Thessalonians"),
    ("2thessalonians", "2 Thessalonians"), ("1timothy", "1 Timothy"),
    ("2timothy", "2 Timothy"), ("titus", "Titus"), ("philemon", "Philemon"),
    ("hebrews", "Hebrews"), ("james", "James"), ("1peter", "1 Peter"),
    ("2peter", "2 Peter"), ("1john", "1 John"), ("2john", "2 John"), ("3john", "3 John"),
    ("jude", "Jude"), ("revelation", "Revelation"),
]


def fetch_json(url):
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)


def clean(s):
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", s).strip()


def chapters_from_lists(lists):
    """[[verse text, ...], ...] -> [{n, verses: [[v, text], ...]}]"""
    out = []
    for ci, verses in enumerate(lists, start=1):
        out.append({"n": ci, "verses": [[vi, clean(t)] for vi, t in enumerate(verses, start=1) if clean(t)]})
    return out


def build_bible():
    books = []
    for slug, name in BIBLE_BOOKS:
        verses = {}
        for item in fetch_json(f"{WEB_REPO}/{slug}.json"):
            if "value" in item and "verseNumber" in item:
                key = (item["chapterNumber"], item["verseNumber"])
                verses[key] = verses.get(key, "") + item["value"] + " "
        chapters = {}
        for (c, v), t in sorted(verses.items()):
            chapters.setdefault(c, []).append([v, clean(t)])
        books.append({"name": name, "chapters": [{"n": c, "verses": vs} for c, vs in sorted(chapters.items())]})
        print("  bible", name)
    return books


def build_torah():
    books = []
    for name in TORAH_BOOKS:
        d = fetch_json(f"{SEFARIA}/{name}/English/merged.json")
        books.append({"name": name, "chapters": chapters_from_lists(d["text"])})
        print("  torah", name)
    return books


def build_quran():
    info = fetch_json(f"{QURAN}/info.json")
    names = {c["chapter"]: f"{c['name']} ({c['englishname']})" for c in info["chapters"]}
    chapters = {}
    for v in fetch_json(f"{QURAN}/editions/eng-mohammedmarmadu.json")["quran"]:
        chapters.setdefault(v["chapter"], []).append([v["verse"], clean(v["text"])])
    return [{"name": "Quran", "chapters": [
        {"n": c, "title": names[c], "verses": vs} for c, vs in sorted(chapters.items())
    ]}]


def build_gita():
    verse_meta = {v["id"]: (v["chapter_number"], v["verse_number"]) for v in fetch_json(f"{GITA}/verse.json")}
    chapters = {}
    for t in fetch_json(f"{GITA}/translation.json"):
        if t["author_id"] != GITA_AUTHOR_ID:
            continue
        c, v = verse_meta[t["verse_id"]]
        chapters.setdefault(c, []).append([v, clean(t["description"])])
    return [{"name": "Bhagavad Gita", "chapters": [
        {"n": c, "verses": sorted(vs)} for c, vs in sorted(chapters.items())
    ]}]


def lookup(books, book, chapter, verses):
    b = next(b for b in books if b["name"] == book)
    ch = next(c for c in b["chapters"] if c["n"] == chapter)
    wanted = set(range(verses[0], verses[-1] + 1))
    parts = [t for v, t in ch["verses"] if v in wanted]
    if len(parts) != len(wanted):
        raise SystemExit(f"missing verse in {book} {chapter}:{verses}")
    return " ".join(parts)


def ref_label(book, chapter, verses):
    v = str(verses[0]) if len(verses) == 1 else f"{verses[0]}–{verses[-1]}"
    return f"{book} {chapter}:{v}"


def main():
    print("Downloading texts…")
    texts = {
        "bible": build_bible(),
        "torah": build_torah(),
        "quran": build_quran(),
        "gita": build_gita(),
    }
    out_dir = ROOT / "public" / "texts"
    out_dir.mkdir(parents=True, exist_ok=True)
    for tid, books in texts.items():
        with open(out_dir / f"{tid}.json", "w", encoding="utf-8") as f:
            json.dump({"id": tid, "books": books}, f, ensure_ascii=False, separators=(",", ":"))

    source = json.loads((ROOT / "scripts" / "themes.source.json").read_text(encoding="utf-8"))
    for theme in source:
        for p in theme["passages"]:
            if "ref" not in p:
                continue  # hand-written entries (Diamond Sutra) carry their own text
            book, chapter, verses = p.pop("ref")
            display = "Quran" if p["text"] == "quran" else "Bhagavad Gita" if p["text"] == "gita" else book
            p["reference"] = ref_label(display, chapter, verses)
            p["quote"] = lookup(texts[p["text"]], book, chapter, verses)
    with open(ROOT / "src" / "data" / "themes.json", "w", encoding="utf-8") as f:
        json.dump(source, f, ensure_ascii=False, indent=2)
    print("Done.")


if __name__ == "__main__":
    main()
