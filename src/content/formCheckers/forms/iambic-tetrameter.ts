import type { FormCheckerContent } from "../types";

export const iambicTetrameterForm: FormCheckerContent = {
  meterId: "iambic-tetrameter",
  status: "ready",
  title: "Iambic Tetrameter Checker — lyriic",
  description:
    "Check iambic tetrameter drafts against eight syllables and a da-DUM stress contour. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.",
  h1: "Iambic tetrameter checker",
  intro:
    "Shape a draft against eight syllables of rising iambs (da-DUM × 4). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "In classical Greek and Latin, “iambic tetrameter” named a longer quantitative line built from four metra. English and other accentual-syllabic traditions reused the name for a shorter unit: four iambic feet in a row — eight syllables with a light–strong beat (da-DUM da-DUM da-DUM da-DUM).",
    "That English tetrameter became a staple of ballads, hymns, and narrative lyric. It pairs with trimeter in common (ballad) meter, fills long-meter hymn stanzas as unbroken eights, and carries whole poems on its own, from Marlowe’s pastoral invitations to Frost’s snowy woods.",
  ],
  famousPoems: [
    {
      title: "The Passionate Shepherd to His Love",
      author: "Christopher Marlowe",
      note: "Opening line is a clean teaching example of four iambs.",
      excerpt: "Come live with me and be my love",
    },
    {
      title: "Stopping by Woods on a Snowy Evening",
      author: "Robert Frost",
      note: "Sustained iambic tetrameter with a tight AABA rhyme scheme lyriic does not check.",
      excerpt: "Whose woods these are I think I know.",
    },
    {
      title: "I Wandered Lonely as a Cloud",
      author: "William Wordsworth",
      note: "Daffodil lyric often cited for tetrameter; some lines admit light substitutions.",
      excerpt: "I wandered lonely as a cloud",
    },
    {
      title: "The Lady of Shalott",
      author: "Alfred, Lord Tennyson",
      note: "Narrative stanzas lean heavily on iambic tetrameter lines.",
      excerpt: "On either side the river lie",
    },
  ],
  formNotes: [
    "lyriic targets eight syllables per line with an iambic (weak–strong) stress contour. Real poems often substitute a trochee, add a feminine ending, or vary the beat — mismatches are feedback, not a claim that every line must be perfectly regular.",
    "lyriic does not enforce rhyme schemes (couplets, In Memoriam stanzas, long-meter hymn rhyme, and so on).",
  ],
  faqs: [
    {
      q: "What is iambic tetrameter?",
      plain:
        "In English teaching, it is a line of four iambs — eight syllables with a rising da-DUM beat on even positions (2, 4, 6, 8). Classical quantitative tetrameter was a different, longer meter; lyriic follows the accentual-syllabic English sense.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. With the stress pack loaded, the checker compares dictionary stress to the expected weak–strong pattern alongside the eight-syllable target. Open the Iambic tetrameter writer under Meter for the same rulers while you draft.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Whose woods these are I think I know",
    "His house is in the village though",
    "Come live with me and be my love",
    "And miles to go before I sleep",
  ],
  cta: "Write in the zen editor",
  meterExplainer: {
    id: "iambic-tetrameter",
    title: "Iambic tetrameter (8)",
    body: [
      "Iambic tetrameter is four iambs in a line: eight syllables with a rising weak–strong beat (da-DUM × 4). Strong beats fall on positions 2, 4, 6, and 8.",
      "In English it is common in ballads, hymns, and lyric narrative — alone as a continuous meter, or alternating with six-syllable trimeter in common (ballad) meter. lyriic’s catalog treats each line as an open cycle of eight syllables with that iambic contour; stanza length and rhyme are left to you.",
      "When stress-aware checking is on, lyriic marks the expected contour from dictionary stress so you can see where a draft matches or drifts from the ideal grid.",
    ],
    status: "ready",
  },
  footExplainerId: "iamb",
  stressExplainerId: "iamb-4",
  verificationNotes: [
    "Catalog: pattern [8], footId iamb, stressPatterns [[0,1,0,1,0,1,0,1]], stanzaLines null (open; checker UI uses 4 sample/line slots). Matches English accentual-syllabic iambic tetrameter (four feet / eight syllables). Intentionally omits rhyme schemes, fixed stanza forms (triolet, In Memoriam, long meter), and classical quantitative tetrameter (longer metra-based line).",
  ],
};
