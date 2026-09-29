export default function Highlight({ text, re }) {
  const global = new RegExp(re.source, "gi")
  const parts = []
  let last = 0
  for (const m of text.matchAll(global)) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(<mark key={m.index} className="bg-accent/30 text-ink rounded px-0.5">{m[0]}</mark>)
    last = m.index + m[0].length
  }
  parts.push(text.slice(last))
  return <>{parts}</>
}
