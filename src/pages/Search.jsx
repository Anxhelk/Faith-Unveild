import { useEffect, useState } from "react"
import { TEXTS } from "../data/texts.js"
import { makeMatcher, search } from "../lib/search.js"
import PassageCard from "../components/PassageCard.jsx"
import { go } from "../lib/router.js"

const SUGGESTIONS = ["mercy", "light", "peace", "soul", "truth", "heart", "fear", "wisdom", "love", "patience"]

export default function Search({ query }) {
  const q = query.get("q") ?? ""
  const [input, setInput] = useState(q)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState(null)

  useEffect(() => setInput(q), [q])

  useEffect(() => {
    let live = true
    setError(null)
    if (!makeMatcher(q)) {
      setResults(null)
      return
    }
    setLoading(true)
    search(q)
      .then((r) => live && setResults(r))
      .catch(() => live && setError("Couldn't load the texts. Check your connection and try again."))
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
  }, [q])

  const submit = (e) => {
    e.preventDefault()
    setTab(null)
    go(`/search?q=${encodeURIComponent(input.trim())}`)
  }

  const re = makeMatcher(q)
  const active = tab ?? (results ? TEXTS.find((t) => results[t.id].total)?.id : null)

  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-2xl flex flex-col gap-3">
        <h1 className="font-display text-4xl sm:text-5xl font-bold">Search all five</h1>
        <p className="text-muted">Find a word or phrase in the full Bhagavad Gita, Bible, Quran and Torah, plus the Diamond Sutra passages on this site.</p>
      </header>

      <form onSubmit={submit} className="flex gap-2 max-w-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try 'mercy' or 'light'"
          className="flex-1 min-w-0 h-12 rounded-xl bg-card border border-line px-4 text-ink placeholder:text-muted focus:outline-none focus:border-ink/50"
          aria-label="Search term"
        />
        <button className="btn-primary">Search</button>
      </form>

      {!q && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <a key={s} href={`#/search?q=${s}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-ink/40">{s}</a>
          ))}
        </div>
      )}
      {q && !re && <p className="text-muted">Type at least 3 letters.</p>}
      {loading && <p className="text-muted">Loading the texts… (first search takes a moment)</p>}
      {error && <p className="text-red-400">{error}</p>}

      {results && !loading && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TEXTS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl border p-3 text-left transition ${active === t.id ? "border-ink bg-card" : "border-line hover:border-ink/40"}`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full" style={{ background: t.accent }} />
                  {t.name}
                </div>
                <div className="font-display text-2xl font-bold mt-1">{results[t.id].total}</div>
                <div className="text-xs text-muted">{results[t.id].partial ? "in selected passages" : "verses"}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">
            Counts depend on each translation's wording and each text's length, so they aren't a measure of importance.
          </p>

          {active ? (
            <div className="flex flex-col gap-3">
              {results[active].hits.map((h, i) => (
                <PassageCard key={i} passage={{ ...h, text: active }} highlight={re} />
              ))}
              {results[active].total > results[active].hits.length && (
                <p className="text-sm text-muted">Showing first {results[active].hits.length} of {results[active].total}.</p>
              )}
            </div>
          ) : (
            <p className="text-muted">No matches for “{q}”. Try a different word.</p>
          )}
        </>
      )}
    </div>
  )
}
