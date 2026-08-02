import type { FormCheckerContent } from "../types";

export const iambicHexameterForm: FormCheckerContent = {
  meterId: "iambic-hexameter",
  status: "ready",
  title: "Iambic Hexameter Checker — lyriic",
  description:
    "Check a draft in iambic hexameter: twelve syllables per line, unstressed–stressed. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Iambic hexameter checker",
  intro:
    "Shape a draft against twelve-syllable iambic lines (da-DUM × 6). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "In English prosody, iambic hexameter is six iambs per line — twelve syllables with stress on every even beat. The line is often called an alexandrine, after the French twelve-syllable measure that took its name from the medieval Roman d’Alexandre.",
    "French alexandrines are primarily syllabic, with a strong medial caesura after the sixth syllable. English practice treats the line as accentual-syllabic and does not always keep that mid-line pause. Long poems wholly in the meter are uncommon; Spenser’s closing alexandrine in each Faerie Queene stanza is the best-known English use, while Drayton’s Poly-Olbion is a rare extended example.",
    "Augustan critics sometimes mocked the line as heavy or slow — Pope’s Essay on Criticism both names and enacts that complaint — yet poets still deploy it for cadence, closure, or deliberate variation beside pentameter.",
  ],
  famousPoems: [
    {
      title: "The Faerie Queene",
      author: "Edmund Spenser",
      note: "Each Spenserian stanza ends with a ninth-line alexandrine (iambic hexameter) after eight pentameters.",
      excerpt: "Fierce warres and faithfull loues shall moralize my song.",
    },
    {
      title: "Poly-Olbion",
      author: "Michael Drayton",
      note: "A long topographical poem written throughout in English alexandrines.",
      excerpt: "Ye sacred Bards, that to your harps' melodious strings",
    },
    {
      title: "An Essay on Criticism",
      author: "Alexander Pope",
      note: "Famous parody of the alexandrine’s “slow length” in a heroic-couplet context.",
      excerpt: "That, like a wounded snake, drags its slow length along.",
    },
    {
      title: "Fifine at the Fair",
      author: "Robert Browning",
      note: "A late Victorian dramatic poem composed largely in English alexandrines.",
    },
  ],
  formNotes: [
    "lyriic checks a twelve-syllable line with an iambic (weak–strong) stress contour. First-foot inversions and feminine endings count as on-meter; caesura placement and harder speech-driven disagreements still surface as stress feedback.",
    "The French classical alexandrine is a syllabic 6+6 line with an obligatory medial caesura, not identical to this English accentual-syllabic model. lyriic does not enforce caesura position, rhyme schemes, or Spenserian stanza shape.",
  ],
  faqs: [
    {
      q: "What is iambic hexameter?",
      plain:
        "In English, a line of six iambs: twelve syllables alternating unstressed and stressed (da-DUM × 6). It is often called an alexandrine and is longer than the more common iambic pentameter line.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Iambic hexameter, lyriic targets twelve syllables and the iambic weak–strong contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "I walk alone beside the silent harbor lights",
    "The distant bells recall the years we left behind",
    "We wait until the morning sun returns again",
    "A colder wind begins to rise across the lake",
  ],
  cta: "Continue in the editor",
  footExplainerId: "iamb",
  stressExplainerId: "iamb-6",
  meterExplainer: {
    id: "iambic-hexameter",
    title: "How iambic hexameter works",
    body: [
      "English iambic hexameter is six iambs per line: twelve syllables with expected stress on positions 2, 4, 6, 8, 10, and 12 (da-DUM × 6). lyriic’s catalog uses that single-line cycle with no fixed stanza length.",
      "In English criticism the line is frequently called an alexandrine. That name also covers the French twelve-syllable heroic line, which is syllabic and traditionally splits 6+6 at a caesura — a different system from this accentual-syllabic checker.",
      "In practice, English hexameter often appears as a closing or variant line (as in Spenser’s stanza) rather than as the sole meter of a poem. Here every line targets twelve iambic syllables.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [12], stressPatterns [[0,1,0,1,0,1,0,1,0,1,0,1]], footId iamb, stanzaLines null (open). Matches English accentual-syllabic hexameter / alexandrine (6 iambs / 12 syllables). Literary scansion accepts first-foot inversion and feminine +1; intentionally omits French 6+6 caesura rules, rhyme, Spenserian stanza shape, and poulter’s-measure pairing. sampleLines use open-meter default of 4.",
  ],
};
