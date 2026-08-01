import type { FormCheckerContent } from "../types";

export const longMeterForm: FormCheckerContent = {
  meterId: "long-meter",
  status: "ready",
  title: "Long Meter Checker (8.8.8.8) — lyriic",
  description:
    "Check a long-meter (L.M.) draft against 8 · 8 · 8 · 8 with live syllable and iambic stress feedback. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.",
  h1: "Long meter checker",
  intro:
    "Shape a four-line hymn stanza against 8 · 8 · 8 · 8 iambic tetrameter. Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Long metre (L.M. or LM) is the hymn-book name for a quatrain of iambic tetrameter: four lines of eight syllables, often written 8.8.8.8. The label sits beside common metre (8.6.8.6) and short metre in metrical indexes so a text can be paired with any fitting tune.",
    "English hymnody and metrical psalms made the form familiar. William Kethe’s paraphrase of Psalm 100 (“All people that on earth do dwell”), sung to Old Hundredth, and later long-meter hymns by writers such as Isaac Watts and Thomas Ken, kept the even eight-syllable lines in active use.",
    "In teaching contexts the rhythm is four rising iambs per line (da-DUM × 4). Hymnals often expect an ABAB or similar rhyme, but the meter mark itself names syllable shape first — which is what lets many L.M. texts share one tune.",
  ],
  famousPoems: [
    {
      title: "All People That on Earth Do Dwell",
      author: "William Kethe",
      note: "Metrical Psalm 100 from the Anglo-Genevan Psalter (1561); classic L.M. text usually sung to Old Hundredth.",
      excerpt:
        "All people that on earth do dwell, / Sing to the Lord with cheerful voice.",
    },
    {
      title: "Praise God, from Whom All Blessings Flow",
      author: "Thomas Ken",
      note: "The Common Doxology (1674); a single long-meter stanza often sung to Old Hundredth.",
      excerpt: "Praise God, from whom all blessings flow",
    },
    {
      title: "When I Survey the Wondrous Cross",
      author: "Isaac Watts",
      note: "Good Friday hymn in long metre; frequently cited in hymnals as L.M. (8.8.8.8).",
      excerpt: "When I survey the wondrous cross",
    },
    {
      title: "From All That Dwell Below the Skies",
      author: "Isaac Watts",
      note: "Psalm 117 paraphrase in long metre; often closed with Ken’s doxology stanza.",
      excerpt: "From all that dwell below the skies",
    },
  ],
  formNotes: [
    "lyriic targets eight syllables per line with an iambic (weak–strong) contour, cycling 8 / 8 across a four-line stanza. Real hymns may stretch “heavenly,” drop a syllable in singing, or substitute a foot — mismatches are feedback, not a claim that every line must be perfectly regular.",
    "lyriic does not enforce hymn rhyme schemes (ABAB, AABB, and so on) or tune pairing. Doubled long metre (L.M.D., eight lines of eight) is out of scope for this checker.",
  ],
  faqs: [
    {
      q: "What is long meter (L.M.)?",
      plain:
        "Long meter is a four-line hymn stanza of eight syllables each — 8.8.8.8 — usually in iambic tetrameter (da-DUM × 4). Hymnals abbreviate it L.M. or LM so texts can share tunes like Old Hundredth.",
    },
    {
      q: "How is long meter different from common meter?",
      plain:
        "Common meter alternates eight- and six-syllable lines (8.6.8.6). Long meter keeps eight syllables on every line (8.8.8.8). Both are typically iambic; lyriic checks syllables and stress, not rhyme.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "All people that on earth do dwell",
    "Sing to the Lord with cheerful voice",
    "Him serve with fear His praise forth tell",
    "Come ye before Him and rejoice",
  ],
  cta: "Write in the zen editor",
  meterExplainer: {
    id: "long-meter",
    title: "Long meter (8 · 8 · 8 · 8)",
    body: [
      "Long meter (L.M.) is a hymn quatrain of four eight-syllable lines — 8.8.8.8 — in iambic tetrameter. Each line expects four rising feet (da-DUM × 4), with strong beats on positions 2, 4, 6, and 8.",
      "In the lyriic catalog the cycle is stored as 8 / 8 and repeats across the four stanza lines, matching hymnal L.M. Homogeneous eights distinguish it from common meter (8 / 6) and short meter.",
      "When stress-aware checking is on, lyriic compares dictionary stress to that iambic contour line by line. Rhyme and tune choice stay yours.",
    ],
    status: "ready",
  },
  footExplainerId: "iamb",
  stressExplainerId: "iamb-8-8",
  verificationNotes: [
    "Catalog: pattern [8, 8] (cycles to 8.8.8.8), footId iamb, stressPatterns [[0,1,0,1,0,1,0,1], [0,1,0,1,0,1,0,1]], stanzaLines 4. Matches English hymn long metre / L.M. (four lines of iambic tetrameter). Intentionally omits rhyme (ABAB/AABB), tune pairing, doubled L.M. (L.M.D.), and long particular metre (8.8.8.8.8.8).",
  ],
};
