import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

function clean(text) {
  return text
    .replace(/\s+/g,' ')
    .replace(/\u00ad/g,'')
    .trim()
}

export async function parsePDFToCards(file) {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  let full = ''
  for (let i=1;i<=pdf.numPages;i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map(it => it.str).join(' ')
    full += strings + '\n\n'
  }
  full = clean(full)

  // Strategy 1: split by the known refrain
  let parts = full.split(/This is my declaration\.?/gi)
    .map(s => clean(s))
    .filter(Boolean)
    .map(s => {
      const text = s.replace(/^I\s+DECLARE\s*/i,'I DECLARE ').trim()
      return { text: text + '. This is my declaration.', source: 'pdf' }
    })

  // Fallback: paragraphs starting with I DECLARE
  if (parts.length < 3) {
    parts = full.split(/\n{2,}/g)
      .map(p => clean(p))
      .filter(p => /\bI\s+DECLARE\b/i.test(p))
      .map(p => ({ text: p, source: 'pdf' }))
  }

  // Final cleaning: ensure reasonable size
  parts = parts.filter(p => p.text.length > 30 && p.text.length < 600)
  return parts
}