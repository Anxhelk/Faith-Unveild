
import React, { useMemo, useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"
import Deck from "./components/Deck.jsx"
import Card from "./components/Card.jsx"
import PROMISES from "./data/promises.json"
import { parsePDFToCards } from "./utils/pdf.js"

const rand = (n) => Math.floor(Math.random() * n)

export default function App() {
  const [pdfCards, setPdfCards] = useState([])
  const [current, setCurrent] = useState(null)
  const fileRef = useRef(null)

  const deck = useMemo(() => {
    // merge & tag
    const promises = PROMISES.map(p => ({ ...p, source: "promise" }))
    return [...promises, ...pdfCards]
  }, [pdfCards])

  const draw = () => {
    if (deck.length === 0) return
    const idx = rand(deck.length)
    setCurrent(deck[idx])
  }

  const another = () => {
    setCurrent(null)
    setTimeout(draw, 250)
  }

  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const items = await parsePDFToCards(file)
    setPdfCards(items)
    setCurrent(null)
  }

  return (
    <div className="body-bg min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 w-full max-w-6xl px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-serif text-cream drop-shadow">Faith Unveiled</div>
            <div className="hidden sm:block text-cream/80">— Prayers, Declarations & Promises</div>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={onUpload}
              className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="h-11 px-4 rounded-xl bg-cream text-navy font-sans font-semibold shadow-soft hover:opacity-90"
              title="Upload a PDF of prayers/declarations to add to the deck">
              Upload PDF
            </button>
          </div>
        </header>

        <main className="grid place-items-center">
          <AnimatePresence mode="wait">
            {!current ? (
              <Deck key="deck" onDraw={draw} count={deck.length} />
            ) : (
              <Card key="card" item={current} onAnother={another} />
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-8 text-center text-cream/80 text-sm">
          <span className="font-sans">Deck includes {PROMISES.length} Bible promises + {pdfCards.length} uploaded declarations.</span>
        </footer>
      </div>
    </div>
  )
}
