import type { FormCheckerContent } from "../types";

export const anapesticTetrameterForm: FormCheckerContent = {
  meterId: "anapestic-tetrameter",
  status: "ready",
  title: "Anapestic Tetrameter Checker — lyriic",
  description:
    "Check anapestic tetrameter drafts against twelve syllables and a da-da-DUM stress contour. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.",
  h1: "Anapestic tetrameter checker",
  intro:
    "Shape a draft against twelve syllables of rising anapests (da-da-DUM × 4). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "An anapest is a three-syllable foot with two light beats then a strong one (da-da-DUM). Anapestic tetrameter stacks four of those feet in a line — twelve syllables with stresses on every third beat. The galloping pace suits comic verse, children’s narrative, and, less often, serious riding or battle scenes.",
    "English teaching examples lean on Clement Clarke Moore’s “A Visit from St. Nicholas,” Byron’s “The Destruction of Sennacherib,” and much of Dr. Seuss. Poets often drop the first light syllable (a headless or “iambic” opening) or mix in other feet, so published lines are rarely a perfect twelve-beat grid throughout.",
  ],
  famousPoems: [
    {
      title: "A Visit from St. Nicholas",
      author: "Clement Clarke Moore",
      note: "Holiday classic often taught as regular anapestic tetrameter; openings may omit a leading light beat.",
      excerpt: "'Twas the night before Christmas, when all through the house",
    },
    {
      title: "The Destruction of Sennacherib",
      author: "Lord Byron",
      note: "Serious narrative that uses the anapest’s gallop to mimic cavalry; a standard non-comic example.",
      excerpt: "The Assyrian came down like the wolf on the fold",
    },
    {
      title: "Yertle the Turtle",
      author: "Dr. Seuss",
      note: "Children’s verse with highly regular anapestic lines; Seuss often pairs a full tetrameter with a headless follow-up.",
      excerpt: "And today the Great Yertle, that marvelous he",
    },
    {
      title: "How They Brought the Good News from Ghent to Aix",
      author: "Robert Browning",
      note: "Horseback narrative frequently scanned as anapestic; lines vary with substitutions and truncations.",
      excerpt: "I sprang to the stirrup, and Joris, and he;",
    },
  ],
  formNotes: [
    "lyriic targets twelve syllables per line with an anapestic (weak–weak–strong) stress contour. Real poems often omit an opening light beat, add a feminine ending, or substitute iambs — mismatches are feedback, not a claim that every line must be perfectly regular.",
    "lyriic does not enforce rhyme schemes (couplets in Moore, Seuss rhyme, and so on).",
  ],
  faqs: [
    {
      q: "What is anapestic tetrameter?",
      plain:
        "In English teaching, it is a line of four anapests — twelve syllables with a rising da-da-DUM beat and strong stresses on positions 3, 6, 9, and 12. The galloping rhythm is common in comic and children’s verse and appears in some serious narrative poems.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. With the stress pack loaded, the checker compares dictionary stress to the expected weak–weak–strong pattern alongside the twelve-syllable target. Open the Anapestic tetrameter writer under Meter for the same rulers while you draft.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "'Twas the night before Christmas when all through the house",
    "Not a creature was stirring not even a mouse",
    "And the sheen of their spears was like stars on the sea",
    "In the light of the moon on the hill by the bay",
  ],
  cta: "Write in the zen editor",
  meterExplainer: {
    id: "anapestic-tetrameter",
    title: "Anapestic tetrameter (12)",
    body: [
      "Anapestic tetrameter is four anapests in a line: twelve syllables with a rising weak–weak–strong beat (da-da-DUM × 4). Strong beats fall on positions 3, 6, 9, and 12.",
      "In English it is familiar from comic and children’s verse — Moore’s Christmas poem, Seuss — and from galloping narrative such as Byron’s Sennacherib. lyriic’s catalog treats each line as an open cycle of twelve syllables with that anapestic contour; stanza length and rhyme are left to you.",
      "When stress-aware checking is on, lyriic marks the expected contour from dictionary stress so you can see where a draft matches or drifts from the ideal grid.",
    ],
    status: "ready",
  },
  footExplainerId: "anapest",
  stressExplainerId: "anapest-4",
  verificationNotes: [
    "Catalog: pattern [12], footId anapest, stressPatterns [[0,0,1,0,0,1,0,0,1,0,0,1]], stanzaLines null (open; checker UI uses 4 sample/line slots). Matches English accentual-syllabic anapestic tetrameter (four feet / twelve syllables). Intentionally omits rhyme schemes, headless/anacrustic openings common in Moore and Seuss, and classical Greek quantitative uses (e.g. tragic parodos).",
  ],
};
