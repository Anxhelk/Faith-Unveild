import THEMES from "../data/themes.json"

export default function Themes() {
  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl font-bold">Themes</h1>
        <p className="text-muted mt-3">Twelve questions people have always asked. Pick one to see how each text answers it.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((t, i) => (
          <a key={t.id} href={`#/theme/${t.id}`} className="rounded-2xl border border-line bg-card p-6 flex flex-col gap-2 hover:border-ink/40 hover:-translate-y-0.5 transition">
            <span className="text-xs font-mono text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-xl font-bold">{t.title}</span>
            <span className="text-sm text-muted">{t.hook}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
