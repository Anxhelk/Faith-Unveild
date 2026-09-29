import THEMES from "../data/themes.json"

const SEARCHABLE = ["gita", "bible", "quran", "torah"]
const cache = {}

function load(id) {
  cache[id] ??= fetch(`/texts/${id}.json`).then((r) => {
    if (!r.ok) throw new Error(`Could not load ${id}`)
    return r.json()
  })
  return cache[id]
}

export function loadAll() {
  return Promise.all(SEARCHABLE.map(load))
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function makeMatcher(query) {
  const q = query.trim()
  if (q.length < 3) return null
  return new RegExp(`\\b${escapeRegExp(q)}`, "i")
}

const LIMIT = 60

// Returns { [textId]: { total, hits: [{ reference, quote }] } }
export async function search(query) {
  const re = makeMatcher(query)
  if (!re) return null
  const texts = await loadAll()
  const results = {}
  for (const text of texts) {
    const hits = []
    let total = 0
    for (const book of text.books) {
      const label = book.name
      for (const ch of book.chapters) {
        for (const [v, t] of ch.verses) {
          if (re.test(t)) {
            total++
            if (hits.length < LIMIT) hits.push({ reference: `${label} ${ch.n}:${v}`, quote: t })
          }
        }
      }
    }
    results[text.id] = { total, hits }
  }
  const diamond = []
  for (const theme of THEMES) {
    for (const p of theme.passages) {
      if (p.text === "diamond" && p.quote && re.test(p.quote) && !diamond.some((d) => d.reference === p.reference && d.quote === p.quote)) {
        diamond.push({ reference: p.reference, quote: p.quote })
      }
    }
  }
  results.diamond = { total: diamond.length, hits: diamond, partial: true }
  return results
}
