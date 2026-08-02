import type { FormCheckerContent } from "../types";

export const dactylicHexameterForm: FormCheckerContent = {
  meterId: "dactylic-hexameter",
  status: "ready",
  title: "Dactylic Hexameter Checker — lyriic",
  description:
    "Check a draft in dactylic hexameter: eighteen syllables per line, stressed–unstressed–unstressed. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Dactylic hexameter checker",
  intro:
    "Shape a draft against eighteen-syllable dactylic lines (DUM-da-da × 6). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Dactylic hexameter is the traditional meter of classical epic. In Ancient Greek and Latin, a hexameter line has six feet built from long and short syllables (quantity), not from English-style stress. Homer’s Iliad and Odyssey and Virgil’s Aeneid are the best-known models; the meter also carried didactic, pastoral, and satirical verse.",
    "Classical practice rarely fills every foot with a pure dactyl. Poets freely substitute spondees (two long syllables) in the earlier feet, and the sixth foot is typically two syllables (a spondee or trochee), so the line is more flexible than six identical DUM-da-da units.",
    "English poets sometimes approximate the epic measure with accentual-syllabic dactyls. Longfellow’s Evangeline is the familiar nineteenth-century example; even there, endings and substitutions keep the line from being six pure triple feet throughout.",
  ],
  famousPoems: [
    {
      title: "Iliad",
      author: "Homer",
      note: "Foundational Greek epic in quantitative dactylic hexameter; English translations rarely preserve the original meter.",
    },
    {
      title: "Odyssey",
      author: "Homer",
      note: "Companion Homeric epic composed in the same hexameter tradition.",
    },
    {
      title: "Aeneid",
      author: "Virgil",
      note: "Latin epic hexameter; the opening arma virumque canō is a standard classroom scansion example.",
      excerpt: "Arma virumque canō, Troiae quī prīmus ab ōrīs",
    },
    {
      title: "Evangeline",
      author: "Henry Wadsworth Longfellow",
      note: "Best-known extended English poem in unrhymed dactylic hexameter; lines mix dactyls with shorter final feet.",
      excerpt: "This is the forest primeval. The murmuring pines and the hemlocks,",
    },
  ],
  formNotes: [
    "lyriic models English teaching hexameter as six pure dactyls: eighteen syllables with a strong–weak–weak contour. Classical Greek and Latin hexameter is quantitative, allows spondees, and usually ends in a two-syllable foot — so authentic epic lines will often mismatch this grid.",
    "lyriic does not enforce caesura position, spondee substitution, elegiac couplets (hexameter + pentameter), or rhyme.",
  ],
  faqs: [
    {
      q: "What is dactylic hexameter?",
      plain:
        "Classically, a six-foot line of dactyls (long–short–short) used for Greek and Latin epic, with frequent spondee substitutions. In English accentual practice, it is often taught as six DUM-da-da feet — eighteen syllables with stress on beats 1, 4, 7, 10, 13, and 16.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Dactylic hexameter, lyriic targets eighteen syllables and the dactylic strong–weak–weak contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "After the rain in the garden the flowers are opening quietly",
    "Over the hills in the distance the cattle are wandering leisurely",
    "Happily galloping over the meadow the riders are singing now",
    "Under the canopy quietly people are gathering afterward",
  ],
  cta: "Continue in the editor",
  footExplainerId: "dactyl",
  stressExplainerId: "dactyl-6",
  meterExplainer: {
    id: "dactylic-hexameter",
    title: "How dactylic hexameter works",
    body: [
      "lyriic’s catalog treats dactylic hexameter as six pure dactyls per line: eighteen syllables with expected stress on positions 1, 4, 7, 10, 13, and 16 (DUM-da-da × 6). There is no fixed stanza length — each line repeats that single-line cycle.",
      "Classical hexameter is a different system: quantity (long vs short), free dactyl/spondee mixing in the first four or five feet, and a typically disyllabic sixth foot. English “hexameter” poems such as Evangeline approximate the epic feel rather than match that quantitative scheme.",
      "Use the checker to practice a regular accentual grid; treat mismatches against Homer or Virgil as expected, not as errors in the classical tradition.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [18], stressPatterns [[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0]], footId dactyl, stanzaLines null (open; checker UI uses 4 sample/line slots). Matches English accentual-syllabic teaching model of six pure dactyls / 18 syllables. Classical tradition is quantitative, allows spondees, and usually ends with a 2-syllable foot — intentionally omitted, along with caesura rules, elegiac pairing, and rhyme.",
  ],
};
