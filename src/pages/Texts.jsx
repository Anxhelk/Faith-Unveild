import { TEXTS } from "../data/texts.js"

export default function Texts() {
  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl font-bold">The five texts</h1>
        <p className="text-muted mt-3">A quick, neutral intro to each one, listed alphabetically, with the translation used on this site.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {TEXTS.map((t) => (
          <article key={t.id} className="rounded-2xl border border-line bg-card p-6 flex flex-col gap-4" style={{ boxShadow: `inset 0 3px 0 ${t.accent}` }}>
            <div>
              <h2 className="font-display text-2xl font-bold">{t.name}</h2>
              <div className="text-sm text-muted">{t.tradition}</div>
            </div>
            <p className="leading-relaxed">{t.about}</p>
            <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted">Written</dt>
              <dd>{t.written}</dd>
              <dt className="text-muted">Original</dt>
              <dd>{t.language}</dd>
              <dt className="text-muted">Shape</dt>
              <dd>{t.shape}</dd>
              <dt className="text-muted">On this site</dt>
              <dd>
                <b>{t.translation}</b>. {t.translationNote}
              </dd>
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}
