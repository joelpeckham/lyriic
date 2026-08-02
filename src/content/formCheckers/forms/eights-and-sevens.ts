import type { FormCheckerContent } from "../types";

export const eightsAndSevensForm: FormCheckerContent = {
  meterId: "eights-and-sevens",
  status: "ready",
  title: "8s & 7s Checker (Trochaic Hymn Meter) — lyriic",
  description:
    "Check an 8s & 7s draft against 8 · 7 trochaic hymn meter with live syllable and stress feedback. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.",
  h1: "8s & 7s checker",
  intro:
    "Shape a four-line draft against 8 · 7 · 8 · 7 trochaic hymn meter. Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "In English hymnals, meter is written as syllable counts per line — 8.7.8.7 (or “8s & 7s”) means a quatrain of eight, seven, eight, and seven syllables. The same numbers appear as 8.7.8.7.D when the pattern doubles to eight lines, a common shape for longer hymn texts.",
    "Most classic 8s & 7s hymns are trochaic: a falling DUM-da beat, with the seven-syllable lines catalectic (they drop the final weak syllable and end on a stress). Hymnal indexes also list a rarer iambic 8.7.8.7; those texts do not share tunes with the trochaic set, because the stress contour has to match the music.",
    "The form became a staple of eighteenth- and nineteenth-century English hymnody precisely because tune and text could be swapped whenever syllable count and poetic foot agreed — the metrical index is the practical tool for that interchange.",
  ],
  famousPoems: [
    {
      title: "Come, Thou Fount of Every Blessing",
      author: "Robert Robinson",
      note: "Often indexed as 8.7.8.7.D; the opening quatrain is a clean trochaic 8 · 7 · 8 · 7 teaching sample.",
      excerpt:
        "Come, thou Fount of every blessing, / tune my heart to sing thy grace; / streams of mercy, never ceasing, / call for songs of loudest praise.",
    },
    {
      title: "What a Friend We Have in Jesus",
      author: "Joseph Medlicott Scriven",
      note: "Standard 8.7.8.7.D text, usually sung to CONVERSE; opening lines show the falling trochaic pulse.",
      excerpt:
        "What a friend we have in Jesus, / all our sins and griefs to bear!",
    },
    {
      title: "Love Divine, All Loves Excelling",
      author: "Charles Wesley",
      note: "Widely printed as 8.7.8.7.D; another staple of the trochaic eights-and-sevens family.",
      excerpt: "Love divine, all loves excelling, / joy of heaven, to earth come down;",
    },
    {
      title: "All for Jesus",
      author: "Mary Dagworthy James",
      note: "Cited in hymnal pedagogy as a clear 8.7.8.7 trochaic example (odd-syllable stresses).",
      excerpt: "All for Jesus! All for Jesus! / All my being’s ransomed powers;",
    },
  ],
  formNotes: [
    "lyriic models classic trochaic 8s & 7s: eight-syllable lines with strong beats on odd positions, alternating with seven-syllable catalectic lines that end on a stress. Hymnals also index a rarer iambic 8.7.8.7 — that contour is a different meter and is not what this checker targets.",
    "This checker scores syllables and trochaic stress. For ABAB rhyme dots while you draft, open the zen editor with 8s & 7s. Doubled (D) eight-line stanzas and hymnal tune interchange stay out of scope here.",
  ],
  faqs: [
    {
      q: "What is 8s & 7s hymn meter?",
      plain:
        "In hymnal notation, 8.7.8.7 (8s & 7s) is a four-line stanza with eight, seven, eight, and seven syllables. The classic English form is trochaic — a falling DUM-da beat — with the short lines ending on a strong syllable. A trailing D means the pattern doubles to eight lines.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For 8s & 7s, lyriic targets the 8 / 7 syllable cycle and the trochaic stress contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Come, thou Fount of every blessing",
    "tune my heart to sing thy grace",
    "streams of mercy, never ceasing",
    "call for songs of loudest praise",
  ],
  cta: "Continue in the editor",
  footExplainerId: "trochee",
  stressExplainerId: "trochee-8-7",
  meterExplainer: {
    id: "eights-and-sevens",
    title: "How 8s & 7s works",
    body: [
      "8s & 7s (hymnal 8.7.8.7) cycles eight- and seven-syllable lines. In the classic trochaic form lyriic models, long lines are four full trochees (DUM-da × 4); short lines are catalectic — they truncate after a final strong beat so the line ends on stress.",
      "A four-line stanza therefore reads 8 · 7 · 8 · 7. Hymnals mark 8.7.8.7.D when that quatrain doubles to eight lines; the syllable-and-stress cycle is the same, only longer. ABAB rhyme dots are available in the zen editor; tune choice stays outside this checker.",
      "When stress-aware checking is on, lyriic compares dictionary stress to the expected falling contour on each line length. Iambic 8.7.8.7 texts exist in some indexes but use a different beat and are not this meter’s target.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [8,7], stressPatterns from stressPatternsForCycle(trochee, [8,7]), footId trochee, stanzaLines 4, rhymeSchemes eights-and-sevens ABAB. Form checker is syllable/stress only; rhyme overlays live in the zen editor. Intentionally omits iambic 8.7.8.7 variants, doubled (D) eight-line enforcement, and hymnal tune-interchange rules. sampleLines adapted from Robinson’s Come, Thou Fount (opening quatrain).",
  ],
};
