import type { FormCheckerContent } from "../types";

export const iambicPentameterForm: FormCheckerContent = {
  meterId: "iambic-pentameter",
  status: "ready",
  title: "Iambic Pentameter Checker — lyriic",
  description:
    "Check a draft in iambic pentameter: ten syllables per line, unstressed–stressed. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Iambic pentameter checker",
  intro:
    "Shape a draft against ten-syllable iambic lines (da-DUM × 5). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Iambic pentameter is a line of five iambs: ten syllables with stress on every even beat (da-DUM da-DUM da-DUM da-DUM da-DUM). The name comes from Greek iambos (the foot) and pentametros (five feet).",
    "Geoffrey Chaucer brought a ten-syllable iambic line into English in the fourteenth century, drawing on French and Italian models. By the sixteenth century it was the main meter of English verse—used rhymed in sonnets and heroic couplets, and unrhymed as blank verse in drama and epic.",
    "Poets rarely stay perfectly regular. First-foot inversions, feminine endings (an extra trailing weak syllable), and other substitutions are common; the five-beat iambic feel remains the baseline.",
  ],
  famousPoems: [
    {
      title: "Sonnet 18",
      author: "William Shakespeare",
      note: "Opening line is a classroom staple; the first foot is often scanned as a trochaic inversion.",
      excerpt: "Shall I compare thee to a summer’s day?",
    },
    {
      title: "Hamlet (Act 3, Scene 1)",
      author: "William Shakespeare",
      note: "Blank verse: unrhymed iambic pentameter; the famous line ends with a feminine eleventh syllable.",
      excerpt: "To be, or not to be, that is the question",
    },
    {
      title: "Paradise Lost",
      author: "John Milton",
      note: "Epic blank verse built on iambic pentameter with frequent metrical variation.",
      excerpt: "Of Man’s first disobedience, and the fruit",
    },
    {
      title: "The Prelude",
      author: "William Wordsworth",
      note: "Autobiographical blank verse in iambic pentameter.",
      excerpt: "Oh there is blessing in this gentle breeze",
    },
  ],
  formNotes: [
    "lyriic checks a ten-syllable line with an iambic (weak–strong) stress contour. First-foot inversions and feminine endings (an extra trailing weak syllable) count as on-meter; stronger speech-driven disagreements still surface as stress feedback.",
    "Blank verse, English sonnets, and heroic couplets all use this meter under different rhyme and stanza rules. lyriic’s dedicated Blank verse, Sonnet, and Heroic couplet checkers share the same ten-syllable iambic target; this page is the open, unbounded line cycle. Rhyme schemes are not enforced.",
  ],
  faqs: [
    {
      q: "What is iambic pentameter?",
      plain:
        "A line of five iambs: ten syllables alternating unstressed and stressed (da-DUM × 5). It is the default meter of English blank verse, many sonnets, and heroic couplets.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Iambic pentameter, lyriic targets ten syllables and the iambic weak–strong contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "The night is calm beneath a silver moon",
    "I hear the distant thunder of the sea",
    "She walks along the quiet garden path",
    "We wait for morning light across the hills",
  ],
  cta: "Continue in the editor",
  footExplainerId: "iamb",
  stressExplainerId: "iamb-5",
  meterExplainer: {
    id: "iambic-pentameter",
    title: "How iambic pentameter works",
    body: [
      "English iambic pentameter is five iambs per line: ten syllables with expected stress on positions 2, 4, 6, 8, and 10 (da-DUM × 5). lyriic’s catalog uses that single-line cycle with no fixed stanza length.",
      "The same ten-syllable iambic grid underlies blank verse (unrhymed), English sonnets, and heroic couplets. Those forms add rhyme or stanza constraints; this checker only targets the open line meter.",
      "Real poems often invert the first foot, add a feminine ending, or loosen stress for speech. lyriic’s teaching ticks show the ideal weak–strong grid; first-foot inversion and feminine endings are accepted as on-meter, while harder contour fights still flag as stress feedback.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [10], stressPatterns [[0,1,0,1,0,1,0,1,0,1]], footId iamb, stanzaLines null (open). Matches English accentual-syllabic pentameter (5 iambs / 10 syllables). Literary scansion accepts first-foot inversion and feminine +1; intentionally omits rhyme, sonnet/blank-verse/couplet stanza rules, and free mid-line substitution. sampleLines use open-meter default of 4.",
  ],
};
