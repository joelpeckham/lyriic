import type { FormCheckerContent } from "../types";

export const shortMeterForm: FormCheckerContent = {
  meterId: "short-meter",
  status: "ready",
  title: "Short Meter Checker (6-6-8-6) — lyriic",
  description:
    "Check a short-meter draft against 6 · 6 · 8 · 6 iambic lines with live syllable and stress feedback. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.",
  h1: "Short meter checker",
  intro:
    "Shape a four-line draft against 6 · 6 · 8 · 6 iambic syllables. Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Short meter (S.M. or SM) is one of the standard English hymn metres, alongside common meter (8.6.8.6) and long meter (8.8.8.8). In hymnals it is written 6.6.8.6: three lines of iambic trimeter with a longer iambic-tetrameter third line.",
    "The named hymn metres grew out of English ballad and psalm-singing practice and were widely formalized in the eighteenth century—Isaac Watts especially—so that a text in short meter could be sung to any matching short-meter tune.",
    "Rhyme is usually ABCB, sometimes ABAB. When a short-meter quatrain is collapsed into couplets of twelve and fourteen syllables, the result is traditionally called poulter’s measure.",
  ],
  famousPoems: [
    {
      title: "Blest Be the Tie That Binds",
      author: "John Fawcett",
      note: "Classic short-meter (6.6.8.6) hymn; often cited as the textbook S.M. example.",
      excerpt:
        "Blest be the tie that binds / Our hearts in Christian love; / The fellowship of kindred minds / Is like to that above.",
    },
    {
      title: "Come, We That Love the Lord",
      author: "Isaac Watts",
      note: "From Hymns and Spiritual Songs (1707); meter listed as 6.6.8.6 in hymnals.",
      excerpt:
        "Come, we that love the Lord, / And let our joys be known; / Join in a song with sweet accord, / And thus surround the throne.",
    },
    {
      title: "A Charge to Keep I Have",
      author: "Charles Wesley",
      note: "Often indexed as short meter (or double short meter in longer stanza settings).",
      excerpt:
        "A charge to keep I have, / A God to glorify, / A never-dying soul to save, / And fit it for the sky.",
    },
  ],
  formNotes: [
    "lyriic checks the hymnal short-meter grid 6 · 6 · 8 · 6 and the iamb stress contour. Hymnal rhyme schemes (ABCB / ABAB) and tune pairing are not enforced.",
  ],
  faqs: [
    {
      q: "What is short meter?",
      plain:
        "In English hymnody, short meter (S.M.) is a four-line stanza counted 6.6.8.6: iambic trimeter on lines 1, 2, and 4, and iambic tetrameter on line 3. lyriic’s checker uses that same syllable cycle.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Short meter, lyriic targets 6 / 6 / 8 / 6 syllables and the iambic weak–strong contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Blest be the tie that binds",
    "Our hearts in Christian love",
    "The fellowship of kindred minds",
    "Is like to that above",
  ],
  cta: "Write in the zen editor",
  footExplainerId: "iamb",
  stressExplainerId: "iamb-6-6-8-6",
  meterExplainer: {
    id: "short-meter",
    title: "How short meter works",
    body: [
      "Hymnal short meter (S.M.) is a quatrain written 6.6.8.6: six syllables, six, eight, six, usually iambic, so that the third line has four feet and the others three. Texts in the same metre can share tunes.",
      "lyriic’s Short meter entry uses pattern [6, 6, 8, 6] with a four-line stanza, matching that teaching grid. Rhyme and tune choice stay outside the checker.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [6, 6, 8, 6], iamb stress fill, footId iamb, stanzaLines 4 — matches English short meter (S.M.) 6.6.8.6. Fixed from earlier [6, 6] cycle after content-agent verification.",
    "Intentionally omits ABCB/ABAB rhyme, tune pairing, double short meter (S.M.D.), and poulter’s measure.",
  ],
};
