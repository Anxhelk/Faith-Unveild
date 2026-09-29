# My Faith

Five sacred texts, side by side: the **Bhagavad Gita, Bible, Diamond Sutra, Quran and Torah**. Explore what they share, see
where they differ, and decide for yourself.

## Features
- **Themes**: 12 life questions (giving, forgiveness, ego, death…). Each shows one passage per text, plus "What they share",
  "Where they differ" and a reflection prompt.
- **Blind Read**: passages appear with their sources hidden. Pick the one that speaks to you, then see where each came from.
  Results show which texts you leaned toward. Picks are stored only in the browser.
- **Search**: find a word across the full Gita, Bible, Quran and Torah (loaded on demand from `public/texts/`).
- **The Texts**: short neutral introductions and the translation used for each.

## Fairness rules
- Texts are always listed alphabetically.
- Every theme includes the differences, not just the similarities.
- If a text has no real parallel for a theme, it's left blank and says so.

## Translations
| Text | Translation | Source |
|---|---|---|
| Bhagavad Gita | Swami Sivananda | [gita/gita](https://github.com/gita/gita) |
| Bible (Joshua–Revelation) | World English Bible (public domain) | [TehShrike/world-english-bible](https://github.com/TehShrike/world-english-bible) |
| Diamond Sutra | Plain-English renderings of selected sections (Kumārajīva's Chinese) | written in `scripts/themes.source.json` |
| Quran | Marmaduke Pickthall, 1930 | [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) |
| Torah | JPS 1917 (public domain) | [Sefaria-Export](https://github.com/Sefaria/Sefaria-Export) |

The five books of Moses appear only under Torah, so they aren't duplicated in the Bible.

## Development
```bash
npm install
npm run dev
```

### Editing themes
Themes live in `scripts/themes.source.json` as references (e.g. `["Matthew", 6, [3, 4]]`). Run

```bash
npm run texts   # python3 scripts/build-texts.py
```

to download the source texts, regenerate `public/texts/*.json` and write the exact quotes into `src/data/themes.json`.

## Tech
React + Vite + Tailwind CSS. Deployed on Netlify.
