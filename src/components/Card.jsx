import React from 'react'
import { motion } from 'framer-motion'
import cx from 'classnames'

export default function Card({ item, onAnother, onShare }) {
  const isPromise = !!item.reference

  const share = async () => {
    const payload = isPromise ? `${item.text} — ${item.reference}` : item.text
    if (navigator.share) {
      try { await navigator.share({ text: payload }) } catch(e){ /* noop */ }
    } else {
      try { await navigator.clipboard.writeText(payload); alert('Copied to clipboard') } catch(e){}
    }
  }

  return (
    <motion.div
      className="card-size rounded-3xl bg-cream shadow-card border border-gold/40 p-6 flex flex-col justify-between"
      initial={{ y: 40, opacity: 0, rotateX: -6 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      exit={{ y: 40, opacity: 0, rotateX: 6 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      role="article"
      aria-label={isPromise ? 'Bible promise card' : 'Prayer/Declaration card'}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-gold font-serif text-xl">Faith Unveiled</div>
          <div className="w-8 h-8 rounded-full border border-gold/40 grid place-items-center text-gold" title="Christian symbol">
            ✝
          </div>
        </div>
        <div className="text-[20px] leading-8 font-serif text-navy/95">
          {item.text}
        </div>
        {isPromise && (
          <div className="text-right text-navy/60 font-sans text-sm pt-2">
            {item.reference}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={onAnother}
          className="h-12 rounded-xl bg-navy text-cream font-sans font-semibold hover:opacity-90 transition shadow-soft"
        >
          Draw Another
        </button>
        <button
          onClick={share}
          className="h-12 rounded-xl border border-gold/70 text-navy font-sans font-semibold bg-cream hover:bg-cream/80"
        >
          Share
        </button>
      </div>
    </motion.div>
  )
}