import { useEffect, useMemo, useState } from "react"
import THEMES from "../data/themes.json"
import { TEXTS, TEXT_BY_ID } from "../data/texts.js"
import PassageCard from "../components/PassageCard.jsx"

const KEY = "myfaith.blind.v1"
const LETTERS = "ABCDE"

function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function freshState() {
  return {
    order: shuffle(THEMES.map((t) => t.id)),
    round: 0,
    picks: {}, // themeId -> textId
    shuffles: {}, // themeId -> [textId...]
  }
}

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && Array.isArray(s.order) && s.order.length === THEMES.length) return s
  } catch {}
  return null
}

export default function Blind() {
  const [state, setState] = useState(() => loadState())
  const [started, setStarted] = useState(() => !!loadState())

  useEffect(() => {
    try {
      if (state) localStorage.setItem(KEY, JSON.stringify(state))
      else localStorage.removeItem(KEY)
    } catch {}
  }, [state])

  const restart = () => {
    setState(freshState())
    setStarted(true)
  }

  useEffect(() => window.scrollTo(0, 0), [state?.round])

  if (!started || !state) return <Intro onStart={restart} />
  if (state.round >= THEMES.length) return <Results state={state} onRestart={restart} />
  return <Round state={state} setState={setState} />
}

function Intro({ onStart }) {
  return (
    <div className="max-w-2xl flex flex-col gap-6 pt-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-accent">Blind Read</div>
      <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight">Read first. Find out the source after.</h1>
      <p className="text-lg text-muted">
        You'll get 12 big questions. For each one, you'll see a passage from each text with the names hidden. Tap the one that speaks
        to you most, and then we'll show you where every passage came from.
      </p>
      <p className="text-muted">
        There are no right answers and no scores. At the end you'll see which texts you were drawn to. It's a mirror, not a verdict.
        Your picks stay on this device.
      </p>
      <button onClick={onStart} className="btn-primary self-start">Start</button>
    </div>
  )
}

function Round({ state, setState }) {
  const themeId = state.order[state.round]
  const theme = THEMES.find((t) => t.id === themeId)
  const picked = state.picks[themeId]

  const options = useMemo(() => {
    const available = theme.passages.filter((p) => !p.none)
    const saved = state.shuffles[themeId]
    const order = saved ?? shuffle(available.map((p) => p.text))
    return order.map((id) => available.find((p) => p.text === id))
  }, [themeId])

  useEffect(() => {
    if (!state.shuffles[themeId]) {
      setState((s) => ({ ...s, shuffles: { ...s.shuffles, [themeId]: options.map((p) => p.text) } }))
    }
  }, [themeId])

  const pick = (textId) => {
    if (picked) return
    setState((s) => ({ ...s, picks: { ...s.picks, [themeId]: textId } }))
  }
  const next = () => setState((s) => ({ ...s, round: s.round + 1 }))
  const answered = Object.keys(state.picks).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted font-mono">{state.round + 1} / {THEMES.length}</div>
        <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${(state.round / THEMES.length) * 100}%` }} />
        </div>
        {answered >= 3 && (
          <button className="text-sm text-muted hover:text-ink underline" onClick={() => setState((s) => ({ ...s, round: THEMES.length }))}>
            See results
          </button>
        )}
      </div>

      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted">{theme.title}</div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold">{theme.hook}</h1>
        <p className="text-muted">{picked ? "Here's where each passage comes from." : "Which of these speaks to you most?"}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {options.map((p, i) => (
          <PassageCard
            key={p.text}
            passage={p}
            hidden={!picked}
            label={`Passage ${LETTERS[i]}`}
            selected={picked === p.text}
            onSelect={picked ? undefined : () => pick(p.text)}
          />
        ))}
      </div>

      {picked && (
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between rounded-2xl border border-line p-5">
          <p className="text-muted">
            You picked the <b className="text-ink">{TEXT_BY_ID[picked].name}</b>.{" "}
            <a className="underline hover:text-ink" href={`#/theme/${theme.id}`}>See what they share and how they differ</a>
          </p>
          <button onClick={next} className="btn-primary shrink-0">
            {state.round + 1 < THEMES.length ? "Next question →" : "See my results"}
          </button>
        </div>
      )}
    </div>
  )
}

function Results({ state, onRestart }) {
  const [copied, setCopied] = useState(false)
  const rows = TEXTS.map((t) => {
    const seen = Object.keys(state.picks).filter((id) => THEMES.find((th) => th.id === id).passages.some((p) => p.text === t.id && !p.none)).length
    const picks = Object.values(state.picks).filter((x) => x === t.id).length
    return { ...t, seen, picks, share: seen ? picks / seen : 0 }
  })
  const total = Object.keys(state.picks).length
  const top = [...rows].sort((a, b) => b.share - a.share)[0]

  const summary = `My Faith Blind Read: I read ${total} questions without knowing the source. ${rows
    .filter((r) => r.picks)
    .map((r) => `${r.name} ${r.picks}`)
    .join(" · ")}`

  const share = async () => {
    const text = `${summary}\n${window.location.origin}`
    try {
      if (navigator.share) await navigator.share({ text })
      else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
      }
    } catch {}
  }

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">Your Blind Read</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold">What you were drawn to</h1>
        <p className="text-muted">
          Across {total} question{total === 1 ? "" : "s"}, you picked passages without knowing where they came from.
          {top?.picks ? <> You leaned most toward the <b className="text-ink">{top.name}</b>.</> : null}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.id} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{r.name} <span className="text-muted font-normal">· {r.tradition}</span></span>
              <span className="text-muted">{r.picks} of {r.seen}</span>
            </div>
            <div className="h-3 rounded-full bg-line overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${r.share * 100}%`, background: r.accent }} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted rounded-2xl border border-line p-5">
        This isn't a personality test or a recommendation. It shows which words landed with you today, in these translations. Try it again
        another day, then explore the full texts that surprised you.
      </p>

      <div className="flex flex-wrap gap-3">
        <button onClick={share} className="btn-primary">{copied ? "Copied!" : "Share my results"}</button>
        <button onClick={onRestart} className="btn-ghost">Start over</button>
        <a href="#/texts" className="btn-ghost">Learn about the texts</a>
      </div>
    </div>
  )
}
