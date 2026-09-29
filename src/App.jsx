import { useRoute } from "./lib/router.js"
import Home from "./pages/Home.jsx"
import Themes from "./pages/Themes.jsx"
import Theme from "./pages/Theme.jsx"
import Blind from "./pages/Blind.jsx"
import Search from "./pages/Search.jsx"
import Texts from "./pages/Texts.jsx"

const NAV = [
  ["themes", "Themes"],
  ["blind", "Blind", " Read"],
  ["search", "Search"],
  ["texts", "Texts"],
]

export default function App() {
  const { path, query } = useRoute()
  const [page, arg] = path

  let content
  if (page === "themes") content = <Themes />
  else if (page === "theme") content = <Theme id={arg} />
  else if (page === "blind") content = <Blind />
  else if (page === "search") content = <Search query={query} />
  else if (page === "texts") content = <Texts />
  else content = <Home />

  const current = page === "theme" ? "themes" : page

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
        <nav className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-2">
          <a href="#/" className="font-display text-lg sm:text-xl font-bold tracking-tight shrink-0">
            my<span className="text-accent">faith</span>
          </a>
          <div className="flex-1 flex justify-end gap-0.5 sm:gap-1">
            {NAV.map(([id, label, extra]) => (
              <a
                key={id}
                href={`#/${id}`}
                className={`shrink-0 rounded-full px-1.5 min-[360px]:px-2 sm:px-3 py-1.5 text-[13px] sm:text-sm transition ${current === id ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
              >
                {label}
                {extra && <span className="hidden sm:inline">{extra}</span>}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">{content}</main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted flex flex-col sm:flex-row gap-2 justify-between">
          <span>My Faith: explore, compare, decide for yourself.</span>
          <span>
            Translations: WEB (Bible) · JPS 1917 (Torah) · Pickthall (Quran) · Sivananda (Gita) · plain-English renderings (Diamond Sutra)
          </span>
        </div>
      </footer>
    </div>
  )
}
