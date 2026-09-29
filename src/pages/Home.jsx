import THEMES from "../data/themes.json"
import { TEXTS } from "../data/texts.js"

export default function Home() {
  const daily = THEMES[Math.floor(Date.now() / 86400000) % THEMES.length]
  return (
    <div className="flex flex-col gap-16">
      <section className="pt-8 sm:pt-16 grid gap-10 lg:grid-cols-2 items-center">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {TEXTS.map((t) => (
              <span key={t.id} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: t.accent }} />
                {t.name}
              </span>
            ))}
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tight">
            Five sacred texts.<br />
            <span className="text-accent">Side by side.</span><br />
            You decide.
          </h1>
          <p className="text-lg text-muted max-w-xl">
            Read the Bhagavad Gita, Bible, Diamond Sutra, Quran and Torah next to each other. Explore what they share, notice where they
            differ, and figure out what speaks to you. No agenda, no ranking.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#/blind" className="btn-primary">Try a Blind Read</a>
            <a href="#/themes" className="btn-ghost">Browse themes</a>
          </div>
        </div>
        <img
          src="/hero-books.webp"
          width="1672"
          height="941"
          alt="Five glowing books side by side in purple, blue, green, red and gold, marked with a lotus, cross, lotus, crescent and star"
          className="w-full h-auto"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Feature
          href="#/blind"
          kicker="Blind Read"
          title="Pick without knowing the source"
          body="See five passages with the labels hidden. Choose the one that hits, then find out where it's from. It's the most honest way to notice your own leanings."
        />
        <Feature
          href="#/themes"
          kicker="Compare"
          title="12 big life questions"
          body="Giving, forgiveness, ego, death and more. Every theme shows what the texts share and where they genuinely differ."
        />
        <Feature
          href="#/search"
          kicker="Search"
          title="Look up any word across all five"
          body="Type 'mercy', 'light' or 'soul' and see how often each text uses it, and how."
        />
      </section>

      <section className="rounded-3xl border border-line bg-card p-6 sm:p-10 flex flex-col gap-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted">Today's question</div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold">{daily.hook}</h2>
        <p className="text-muted max-w-2xl">{daily.common}</p>
        <a href={`#/theme/${daily.id}`} className="btn-primary self-start">See all five answers →</a>
      </section>

      <section className="grid gap-6 md:grid-cols-2 items-start">
        <div>
          <h2 className="font-display text-2xl font-bold mb-3">How we keep it fair</h2>
          <ul className="flex flex-col gap-3 text-muted">
            <li><b className="text-ink">Alphabetical, always.</b> No text is placed first or treated as the default.</li>
            <li><b className="text-ink">Real passages.</b> Quotes come from established translations, with the source shown on every card.</li>
            <li><b className="text-ink">Differences included.</b> Every theme says where the texts disagree, so similarities aren't overstated.</li>
            <li><b className="text-ink">Blanks stay blank.</b> If a text has no real parallel, we say so instead of forcing one.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-line p-6 text-sm text-muted">
          <p className="mb-2 text-ink font-semibold">A note</p>
          <p>
            Each of these texts is sacred to millions of people and has centuries of interpretation behind it. A short passage is a
            starting point, not the whole story. If something here moves you, go deeper with the full text and the community that
            reads it.
          </p>
        </div>
      </section>
    </div>
  )
}

function Feature({ href, kicker, title, body }) {
  return (
    <a href={href} className="rounded-2xl border border-line bg-card p-6 flex flex-col gap-2 hover:border-ink/40 transition">
      <div className="text-xs font-semibold uppercase tracking-widest text-accent">{kicker}</div>
      <div className="font-display text-xl font-bold">{title}</div>
      <p className="text-sm text-muted">{body}</p>
    </a>
  )
}
