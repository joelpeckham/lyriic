import type { FormCheckerContent } from "../types";

export const commonMeterForm: FormCheckerContent = {
  meterId: "common-meter",
  status: "ready",
  title: "Common Meter Checker (8-6-8-6) — lyriic",
  description:
    "Check a common-meter quatrain against 8 · 6 · 8 · 6 with live syllable and iambic stress feedback. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.",
  h1: "Common meter checker",
  intro:
    "Shape a four-line draft against 8 · 6 · 8 · 6 rising iambs. Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Common metre (or common measure, often abbreviated CM) is a four-line stanza that alternates iambic tetrameter and iambic trimeter — eight syllables, then six, repeated. The pattern grew out of English and Scottish ballad and psalm traditions and became a default stanza in Protestant hymnody from the sixteenth century onward.",
    "Because so many hymns and folk tunes share the same 8.6.8.6 grid, lyrics can often be sung interchangeably across melodies. Closely related forms include ballad metre (same line lengths, looser stress and usually ABCB rhyme) and long or short metre hymn stanzas (8.8.8.8 or 6.6.8.6).",
  ],
  famousPoems: [
    {
      title: "Amazing Grace",
      author: "John Newton",
      note: "Classic CM hymn stanza; often used as a teaching example of 8.6.8.6.",
      excerpt:
        "Amazing grace, how sweet the sound, / That saved a wretch like me!",
    },
    {
      title: "A slumber did my spirit seal",
      author: "William Wordsworth",
      note: "One of the Lucy poems; a short common-meter lyric.",
      excerpt:
        "A slumber did my spirit seal; / I had no human fears:",
    },
    {
      title: "Because I could not stop for Death",
      author: "Emily Dickinson",
      note: "Dickinson often writes near common or ballad meter; stress and rhyme can loosen.",
      excerpt:
        "Because I could not stop for Death – / He kindly stopped for me –",
    },
    {
      title: "O Little Town of Bethlehem",
      author: "Phillips Brooks",
      note: "Christmas carol frequently cited for common-metre hymn shape.",
      excerpt:
        "O little town of Bethlehem, / How still we see thee lie!",
    },
  ],
  formNotes: [
    "lyriic cycles an 8 / 6 iambic pattern across a four-line stanza: long lines target eight syllables with strong beats on 2, 4, 6, and 8; short lines target six with strong beats on 2, 4, and 6. Real hymns and ballads often admit substitutions — mismatches are feedback, not a claim that every published line is perfectly regular.",
    "This checker scores syllables and stress only. For ABAB rhyme dots while you draft, open the zen editor with Common meter. Tune matching between hymn texts stays with you.",
  ],
  faqs: [
    {
      q: "What is common meter?",
      plain:
        "Common meter (CM) is a quatrain that alternates eight- and six-syllable iambic lines — tetrameter then trimeter, usually written 8.6.8.6. It is the meter of many hymns and ballads; ballad meter shares the lengths but is often less strictly iambic and typically rhymes ABCB rather than ABAB.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. With the stress pack loaded, the checker compares dictionary stress to the expected 8 / 6 iambic contour alongside the syllable targets. Open the Common meter writer under Meter for the same rulers while you draft.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Amazing grace, how sweet the sound",
    "That saved a wretch like me",
    "I once was lost, but now am found",
    "Was blind, but now I see",
  ],
  cta: "Check rhyme in the zen editor",
  meterExplainer: {
    id: "common-meter",
    title: "Common meter (8 · 6)",
    body: [
      "Common meter alternates an eight-syllable iambic line with a six-syllable one: four da-DUM feet, then three. Across a quatrain the cycle reads 8 · 6 · 8 · 6 (often labeled CM or 86.86 in hymnals).",
      "It is the shared grid of many English hymns and ballads. Strict common measure usually aims for ABAB rhyme; ballad stanza often uses ABCB with freer stress. This checker scores the syllable and iambic stress cycle; ABAB rhyme dots are available in the zen editor.",
      "When stress-aware checking is on, lyriic marks the expected weak–strong contour from dictionary stress so you can see where a draft matches or drifts from the ideal grid.",
    ],
    status: "ready",
  },
  footExplainerId: "iamb",
  stressExplainerId: "iamb-8-6",
  verificationNotes: [
    "Catalog: pattern [8, 6] (cycles to 8.6.8.6), footId iamb, stressPatterns [[0,1,0,1,0,1,0,1], [0,1,0,1,0,1]], stanzaLines 4, rhymeSchemes common ABAB. Form checker is syllable/stress only; rhyme overlays live in the zen editor. Intentionally omits ballad-meter stress looseness, tune interchangeability, and CM double / particular variants. Related catalog entry ballad-stanza expands the same cycle as pattern [8,6,8,6].",
  ],
};
