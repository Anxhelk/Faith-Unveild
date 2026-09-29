// The five texts, listed alphabetically so no tradition is placed first.
// `accent` colours match the hero artwork and appear in the same alphabetical order.
export const TEXTS = [
  {
    id: "gita",
    name: "Bhagavad Gita",
    tradition: "Hinduism",
    accent: "#8b5cf6",
    language: "Sanskrit",
    written: "Roughly 2nd century BCE – 2nd century CE (scholarly estimates vary)",
    shape: "700 verses in 18 chapters",
    about:
      "A conversation on a battlefield between the warrior-prince Arjuna and Krishna, who guides him through doubt about duty, action and the nature of the Self. It forms part of the great epic, the Mahabharata.",
    translation: "Swami Sivananda",
    translationNote: "20th-century translation by Swami Sivananda of the Divine Life Society.",
  },
  {
    id: "bible",
    name: "Bible",
    tradition: "Christianity",
    accent: "#3b82f6",
    language: "Hebrew, Aramaic and Greek",
    written: "Roughly 10th century BCE – 1st century CE",
    shape: "66 books (Protestant canon); Catholic and Orthodox Bibles include more",
    about:
      "The Christian scriptures: the Hebrew Bible (the Old Testament), followed by the New Testament, which centres on the life and teaching of Jesus and the early Church. The first five books are shown here under Torah, so passages are never duplicated.",
    translation: "World English Bible",
    translationNote: "A modern-English translation in the public domain.",
  },
  {
    id: "diamond",
    name: "Diamond Sutra",
    tradition: "Buddhism (Mahayana)",
    accent: "#10b981",
    language: "Sanskrit; best known through Chinese",
    written: "Roughly 2nd – 5th century CE (estimates vary); Chinese translation by Kumārajīva, 401 CE",
    shape: "32 short sections",
    about:
      "A dialogue between the Buddha and his disciple Subhūti about wisdom that sees through fixed ideas of self and appearance. A printed copy from 868 CE, found at Dunhuang, is the oldest dated printed book in the world.",
    translation: "Plain-English renderings",
    translationNote:
      "Short plain-English renderings of selected sections, based on Kumārajīva's Chinese text. These are not a full verbatim translation, so the complete text can't be searched yet.",
  },
  {
    id: "quran",
    name: "Quran",
    tradition: "Islam",
    accent: "#f43f5e",
    language: "Arabic",
    written: "610 – 632 CE",
    shape: "114 surahs (chapters), about 6,200 verses",
    about:
      "Believed by Muslims to be the word of God revealed to the Prophet Muhammad over about 23 years. It covers belief, worship, ethics, law and stories of earlier prophets.",
    translation: "Marmaduke Pickthall (1930)",
    translationNote:
      "'The Meaning of the Glorious Koran'. Pickthall stressed that the Quran cannot truly be translated, only its meaning rendered.",
  },
  {
    id: "torah",
    name: "Torah",
    tradition: "Judaism",
    accent: "#eab308",
    language: "Hebrew",
    written: "Traditionally given to Moses; scholars date its writing to roughly the 10th – 5th century BCE",
    shape: "5 books: Genesis, Exodus, Leviticus, Numbers, Deuteronomy",
    about:
      "The foundation of Jewish scripture and life: creation, the ancestors, the Exodus from Egypt, the covenant at Sinai and the commandments. These books also open the Christian Bible.",
    translation: "JPS 1917",
    translationNote: "'The Holy Scriptures', Jewish Publication Society, 1917 (public domain).",
  },
]

export const TEXT_BY_ID = Object.fromEntries(TEXTS.map((t) => [t.id, t]))
