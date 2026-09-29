import { TEXT_BY_ID } from "../data/texts.js"
import Highlight from "./Highlight.jsx"

export default function PassageCard({ passage, hidden = false, label, highlight, selected, onSelect }) {
  const text = TEXT_BY_ID[passage.text]
  const accent = hidden ? "#94a3b8" : text.accent
  const Tag = onSelect ? "button" : "article"

  if (passage.none) {
    return (
      <article className="rounded-2xl border border-dashed border-line p-5 flex flex-col gap-3">
        <SourceTag text={text} />
        <p className="text-muted text-sm leading-relaxed">{passage.none}</p>
      </article>
    )
  }

  return (
    <Tag
      onClick={onSelect}
      className={`group text-left rounded-2xl bg-card border p-5 flex flex-col gap-4 transition
        ${onSelect ? "hover:-translate-y-0.5 hover:border-ink/40 focus-visible:outline focus-visible:outline-2" : ""}
        ${selected ? "border-ink ring-2 ring-ink/20" : "border-line"}`}
      style={{ boxShadow: `inset 0 3px 0 ${accent}` }}
    >
      {hidden ? (
        <div className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</div>
      ) : (
        <SourceTag text={text} />
      )}
      <blockquote className="font-serif text-[1.05rem] leading-relaxed text-ink">
        {highlight ? <Highlight text={passage.quote} re={highlight} /> : passage.quote}
      </blockquote>
      {!hidden && (
        <footer className="mt-auto text-xs text-muted flex flex-col gap-0.5">
          <span className="font-semibold text-ink/80">{passage.reference}</span>
          <span>{text.translation}</span>
        </footer>
      )}
    </Tag>
  )
}

export function SourceTag({ text }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0" style={{ background: text.accent }} />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-ink">{text.name}</span>
        <span className="text-xs text-muted">{text.tradition}</span>
      </div>
    </div>
  )
}
