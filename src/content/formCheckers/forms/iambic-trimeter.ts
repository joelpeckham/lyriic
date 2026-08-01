import type { FormCheckerContent } from "../types";

export const iambicTrimeterForm: FormCheckerContent = {
  meterId: "iambic-trimeter",
  status: "ready",
  title: "Iambic Trimeter Checker — lyriic",
  description:
    "Check a draft in iambic trimeter: six syllables per line, unstressed–stressed. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Iambic trimeter checker",
  intro:
    "Shape a draft against six-syllable iambic lines (da-DUM × 3). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "In classical Greek and Latin, “iambic trimeter” names a quantitative dialogue meter built from three iambic metra — longer, more flexible lines used in tragedy, comedy, and satyr plays, and later in Latin comedy (often called the iambic senarius).",
    "In English accentual-syllabic verse, the same name means three iambic feet per line: six syllables with stress on every even beat (da-DUM da-DUM da-DUM). Few poems stay in pure trimeter for long; the short line more often appears as the shorter half of common meter, alternating with iambic tetrameter in hymns and ballads.",
  ],
  famousPoems: [
    {
      title: "My Papa's Waltz",
      author: "Theodore Roethke",
      note: "Often taught as a clear English iambic-trimeter lyric; some lines bend for speech.",
      excerpt: "We romped until the pans / Slid from the kitchen shelf;",
    },
    {
      title: "The Only News I Know",
      author: "Emily Dickinson",
      note: "Dickinson often works in hymn-meter shapes; many short lines scan as trimeter.",
      excerpt: "The only news I know / Is bulletins all day",
    },
    {
      title: "Song ('I love the jocund dance')",
      author: "William Blake",
      note: "Loose trimeter with occasional extra weak syllables.",
      excerpt: "I love the jocund dance, / The softly breathing song,",
    },
    {
      title: "Our God, Our Help in Ages Past",
      author: "Isaac Watts",
      note: "Common-meter hymn: tetrameter lines alternate with trimeter.",
      excerpt: "Our hope for years to come, / … And our eternal home.",
    },
  ],
  formNotes: [
    "lyriic checks a six-syllable line with an iambic (weak–strong) stress contour. English poets commonly substitute feet, add a trailing weak syllable, or loosen stress for speech — those will show as mismatches against the ideal grid.",
    "Classical Greek and Latin iambic trimeter is a different quantitative meter, not this six-syllable English teaching form. lyriic does not enforce rhyme schemes or hymn/ballad stanza shapes.",
  ],
  faqs: [
    {
      q: "What is iambic trimeter?",
      plain:
        "In English, a line of three iambs: six syllables alternating unstressed and stressed (da-DUM × 3). It is shorter than tetrameter or pentameter and often appears as the short line in common meter.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Iambic trimeter, lyriic targets six syllables and the iambic weak–strong contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "She walks along the shore",
    "The night is cold and clear",
    "I hear the distant drums",
    "We wait beside the fire",
  ],
  cta: "Write in the zen editor",
  footExplainerId: "iamb",
  stressExplainerId: "iamb-3",
  meterExplainer: {
    id: "iambic-trimeter",
    title: "How iambic trimeter works",
    body: [
      "English iambic trimeter is three iambs per line: six syllables with expected stress on positions 2, 4, and 6 (da-DUM da-DUM da-DUM). lyriic’s catalog uses that single-line cycle with no fixed stanza length.",
      "You will also meet the name in classical prosody, where Greek and Latin “iambic trimeter” is a longer quantitative dialogue line. This checker models the English accentual-syllabic teaching form only.",
      "In practice, trimeter often pairs with tetrameter in common meter and ballad stanzas. Those alternating cycles are separate meters in lyriic; here every line targets six iambic syllables.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [6], stressPatterns [[0,1,0,1,0,1]], footId iamb, stanzaLines null (open). Matches English accentual-syllabic trimeter (3 iambs / 6 syllables). Intentionally omits rhyme, common-meter pairing, feminine endings, and classical quantitative trimeter/senarius rules. sampleLines use open-meter default of 4.",
  ],
};
