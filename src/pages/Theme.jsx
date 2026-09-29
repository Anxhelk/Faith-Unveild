import THEMES from "../data/themes.json"
import PassageCard from "../components/PassageCard.jsx"

export default function Theme({ id }) {
  const index = THEMES.findIndex((t) => t.id === id)
  const theme = THEMES[index]
  if (!theme) return <p className="text-muted">Theme not found. <a className="underline" href="#/themes">See all themes</a></p>
  const next = THEMES[(index + 1) % THEMES.length]

  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-3xl flex flex-col gap-3">
        <a href="#/themes" className="text-sm text-muted hover:text-ink">← All themes</a>
        <h1 className="font-display text-4xl sm:text-5xl font-bold">{theme.title}</h1>
        <p className="text-xl text-muted">{theme.hook}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {theme.passages.map((p) => (
          <PassageCard key={p.text} passage={p} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Note title="What they share" body={theme.common} />
        <Note title="Where they differ" body={theme.differ} />
      </div>

      <div className="rounded-2xl bg-accent/10 border border-accent/30 p-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Reflect</div>
        <p className="font-display text-2xl">{theme.reflect}</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-between">
        <a href="#/blind" className="btn-ghost">Try this blind</a>
        <a href={`#/theme/${next.id}`} className="btn-primary">Next: {next.title} →</a>
      </div>
    </div>
  )
}

function Note({ title, body }) {
  return (
    <section className="rounded-2xl border border-line p-6">
      <h2 className="font-semibold mb-2">{title}</h2>
      <p className="text-muted leading-relaxed">{body}</p>
    </section>
  )
}
