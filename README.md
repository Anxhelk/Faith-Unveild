
# Faith Unveiled — Interactive Prayer & Promise Cards

## Quick start
```bash
npm i
npm run dev
```

- **Upload PDF**: Click the button in the header to add your declarations. The parser looks for paragraphs that start with **"I DECLARE"** or are followed by **"This is my declaration."**
- **Draw**: Tap the deck to animate and reveal a card.
- **Share**: Use the Web Share API on mobile or copy to clipboard on desktop.

## Tech
- React + Vite
- Tailwind CSS
- Framer Motion
- pdfjs-dist

## Files
- `src/data/promises.json` — 120 pre-populated promises (paraphrased + references).
- `src/utils/pdf.js` — client-side PDF text parsing into card entries.
- `src/components/*` — `Deck` (stack + animation), `Card` (display + actions).

> Fonts: Playfair Display (serif), Montserrat (sans).
