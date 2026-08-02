import type { FormCheckerContent } from "../types";

export const trochaicOctameterForm: FormCheckerContent = {
  meterId: "trochaic-octameter",
  status: "ready",
  title: "Trochaic Octameter Checker — lyriic",
  description:
    "Check trochaic octameter drafts against sixteen syllables and a DUM-da stress contour. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.",
  h1: "Trochaic octameter checker",
  intro:
    "Shape a draft against sixteen syllables of falling trochees (DUM-da × 8). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Trochaic octameter is a line of eight trochees: sixteen syllables with stress on the odd beats (DUM-da × 8). The falling duple rhythm is uncommon in English at this length — long enough to risk sounding like prose unless internal rhyme, caesura, or refrain keep the music audible.",
    "Edgar Allan Poe’s “The Raven” (1845) is the best-known English example. Poe described the poem as mixing full (acatalectic) octameter with shorter catalectic lines that drop a final weak syllable, so not every line is a pure sixteen-slot grid. Later narrative and ballad poets — Tennyson, Browning, Kipling, Paterson — also used long trochaic lines, often catalectic.",
    "Outside English, trochaic octameter is more at home in Polish and Czech verse, where word stress naturally favors trochaic feet. In English classrooms it is usually taught as the long falling line behind “The Raven,” with catalexis noted as a common variation.",
  ],
  famousPoems: [
    {
      title: "The Raven",
      author: "Edgar Allan Poe",
      note: "Classroom staple for trochaic octameter; stanzas mix full sixteen-syllable lines with shorter catalectic refrain lines.",
      excerpt:
        "Once upon a midnight dreary, while I pondered, weak and weary,",
    },
    {
      title: "Locksley Hall",
      author: "Alfred, Lord Tennyson",
      note: "Long trochaic narrative lines, typically catalectic (ending on a strong beat).",
      excerpt:
        "Comrades, leave me here a little, while as yet ’tis early morn:",
    },
    {
      title: "Mandalay",
      author: "Rudyard Kipling",
      note: "Ballad-like long trochaic lines with a refrain; often scanned with catalectic endings.",
      excerpt:
        "By the old Moulmein Pagoda, lookin’ eastward to the sea,",
    },
    {
      title: "Clancy of the Overflow",
      author: "Banjo Paterson",
      note: "Australian bush ballad built on four long trochaic octameter lines per stanza.",
      excerpt:
        "I had written him a letter which I had, for want of better",
    },
  ],
  formNotes: [
    "lyriic targets sixteen syllables per line with a trochaic (strong–weak) stress contour. Catalexis (dropping the final weak syllable) counts as on-meter; shorter refrain or half-lines still read short against the full eight-foot grid.",
    "lyriic does not enforce internal rhyme, refrain structure, or stanza schemes (as in “The Raven” or bush-ballad quatrains).",
  ],
  faqs: [
    {
      q: "What is trochaic octameter?",
      plain:
        "A line of eight trochees: sixteen syllables alternating stressed and unstressed, beginning on a strong beat (DUM-da × 8). It is rare in English; Poe’s “The Raven” is the usual teaching example.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. With the stress pack loaded, the checker compares dictionary stress to the expected strong–weak pattern alongside the sixteen-syllable target. Open the Trochaic octameter writer under Meter for the same rulers while you draft.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Once upon a midnight dreary while I pondered weak and weary",
    "Coming down the winding river with the lanterns softly glowing",
    "Never more shall sorrow linger in the hollow of the midnight",
    "Hear the pounding of the hammers on the iron in the evening",
  ],
  cta: "Continue in the editor",
  meterExplainer: {
    id: "trochaic-octameter",
    title: "Trochaic octameter (16)",
    body: [
      "Trochaic octameter is eight trochees in a line: sixteen syllables with a falling strong–weak beat (DUM-da × 8). Strong beats fall on the odd positions (1, 3, 5, …, 15).",
      "In English the meter is uncommon at full length. Poe’s “The Raven” made it famous, mixing complete octameter with catalectic shorter lines. lyriic’s catalog treats each line as an open cycle of sixteen syllables with that trochaic contour; stanza length and rhyme are left to you.",
      "When stress-aware checking is on, lyriic marks the expected contour from dictionary stress. Catalexis (fifteen syllables ending strong) counts as on-meter; harder drifts from the teaching grid still flag as stress feedback.",
    ],
    status: "ready",
  },
  footExplainerId: "trochee",
  stressExplainerId: "trochee-8",
  verificationNotes: [
    "Catalog: pattern [16], footId trochee, stressPatterns [[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]], stanzaLines null (open; checker UI uses 4 sample/line slots). Matches English accentual-syllabic trochaic octameter (eight feet / sixteen syllables). Literary scansion accepts catalexis (−1 ending strong) and first-foot inversion; intentionally omits refrain/half-lines, internal rhyme, and fixed stanza schemes. Hiawatha is trochaic tetrameter, not octameter — not cited as an octameter exemplar.",
  ],
};
