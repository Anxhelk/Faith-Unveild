import React from 'react'
import { motion } from 'framer-motion'

export default function Deck({ onDraw, count }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="text-center mb-4 text-cream/90 font-sans">
        Tap the deck to draw a card
      </div>
      <div className="relative">
        {Array.from({length:4}).map((_,i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-3xl border border-gold/40"
            style={{
              transform: `translate(${i*4}px, ${-i*4}px)`,
              width: 'min(78vw, 360px)',
              height: 'min(60vh, 520px)',
              background: 'linear-gradient(145deg,#f4eee1,#efe7d6)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}
          />
        ))}
        <motion.button
          onClick={onDraw}
          className="relative z-10 rounded-3xl"
          initial={{ y: 0 }}
          animate={{ y: [0,-4,0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 'min(78vw, 360px)', height: 'min(60vh, 520px)' }}
          aria-label="Deck of cards"
        >
          <div className="w-full h-full rounded-3xl border border-gold/40"
               style={{ background: 'linear-gradient(145deg,#efe5cf,#e8dcc2)' }}>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="text-gold font-serif text-2xl">Faith Unveiled</div>
              <div className="text-navy/70 mt-2 font-sans">Tap to draw</div>
            </div>
          </div>
        </motion.button>
      </div>
      <div className="text-center mt-4 text-cream/80 text-sm">
        Deck size: {count}
      </div>
    </div>
  )
}