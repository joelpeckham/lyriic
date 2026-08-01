import type { FormCheckerContent } from "../types";

export const ethereeForm: FormCheckerContent = {
  meterId: "etheree",
  status: "ready",
  title: "Etheree Checker (1–10) — lyriic",
  description:
    "Check a ten-line etheree against 1-2-3-4-5-6-7-8-9-10 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Etheree meter ruler.",
  h1: "Etheree checker",
  intro:
    "Shape a ten-line draft against 1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "The etheree is a twentieth-century American syllabic form named for Arkansas poet Etheree Taylor Armstrong (1918–1994). It is a ten-line poem in which each line’s syllable count equals its line number: one syllable on line one, two on line two, and so on through ten — fifty-five syllables in all.",
    "Teaching sources treat it as unmetered and typically unrhymed: the only fixed rule is the rising syllable ladder. Reverse etherees (10 down to 1), double etherees (1–10 then 10–1), and stacked multiples appear in workshops, but the standard single stanza remains the 1-through-10 shape.",
  ],
  famousPoems: [
    {
      title: "Canonical scarcity",
      note: "Unlike haiku or the sonnet, the etheree has no fixed literary canon of widely anthologized poems. It lives mainly in workshops, online form guides, and contemporary practice pieces.",
    },
    {
      title: "Wouldn’t Chu?",
      author: "Lawrencealot",
      note: "Often cited on poetry-form sites as a clear 1–10 teaching example (bird names expanding into flight).",
      excerpt:
        "Duck / Pigeon / Meadow lark / Ring-neck pheasant / swallow, sparrow, hawk…",
    },
    {
      title: "Pain",
      author: "Attributed (PoetrySoup / form guides)",
      note: "A frequently reprinted sample etheree in online dictionaries of the form; useful for seeing how a single opening word widens across the ladder.",
      excerpt:
        "Pain / Pain, / My friend, / You give me / Many lessons…",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary. The standard etheree is ten lines totaling fifty-five syllables (1 through 10). Reverse and double etherees are common variants; this checker models the rising 1–10 form only.",
    "lyriic does not enforce rhyme, meter beyond syllable length, or theme. Tradition usually leaves those free.",
  ],
  faqs: [
    {
      q: "What is an etheree poem?",
      plain:
        "An etheree is a ten-line syllabic poem: line one has one syllable, line two has two, and so on through ten syllables on line ten (fifty-five syllables total). It is usually unrhymed and unmetered beyond that count.",
    },
    {
      q: "Does lyriic include an etheree meter ruler?",
      plain:
        "Yes. Open the Etheree writer, or choose Etheree under Meter in Settings, for live 1–10 syllable ticks beside each line as you write.",
    },
    {
      q: "Is my etheree uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Dawn",
    "breaks slow",
    "over hills",
    "and quiet fields",
    "where the mist still hangs",
    "above the waking town",
    "while birds begin to call out",
    "and pale light spills across the street",
    "calling us gently out of our dream",
    "into the cool and open morning air",
  ],
  cta: "Write in the zen editor",
  meterExplainer: {
    id: "etheree",
    title: "How the etheree works",
    body: [
      "An etheree is ten lines with syllable counts 1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10 — one syllable on the first line, ten on the last, fifty-five in total. lyriic’s catalog uses that pattern with stanzaLines 10.",
      "The form is syllabic only: no required foot, stress contour, or rhyme scheme. Reverse etherees (10 down to 1) and double etherees (1–10 then 10–1) are related workshop variants outside this checker’s rising ladder.",
      "Use the live deltas to keep each line on its target count; imagery, theme, and end-rhyme stay entirely yours.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [1,2,3,4,5,6,7,8,9,10], stanzaLines 10, syllable-only (no stress/foot). Matches standard etheree (Etheree Taylor Armstrong): 10 lines, 55 syllables, typically unrhymed/unmetered. Intentionally omits reverse/double/stacked variants and any rhyme or theme rules.",
  ],
};
